
import { GoogleGenAI } from "@google/genai";
import { SmartDevice, DeviceType, AIProvider } from "../types";

const apiKey = process.env.API_KEY;
let geminiClient: GoogleGenAI | null = null;

if (apiKey) {
  geminiClient = new GoogleGenAI({ apiKey });
}

// Local Rule Engine (Offline/Fallback)
const localRuleEngine = (devices: SmartDevice[], query: string, lang: 'en' | 'zh' = 'en', aiName: string = 'Assistant'): string => {
  const lowerQuery = query.toLowerCase();
  const lowerName = aiName.toLowerCase();

  // Wake Word / Persona Check
  if (lowerQuery.includes(lowerName)) {
      return lang === 'zh' 
        ? `${aiName} 在此。随时为您服务。` 
        : `${aiName} is here. Ready for commands.`;
  }
  
  // Chinese Logic
  if (lang === 'zh' || /[\u4e00-\u9fa5]/.test(query)) {
     if (lowerQuery.includes('状态') || lowerQuery.includes('在线')) {
        const onlineCount = devices.filter(d => d.status === 'ONLINE').length;
        return `系统状态: ${onlineCount} / ${devices.length} 个设备在线。`;
     }
     if (lowerQuery.includes('温度') || lowerQuery.includes('多少度')) {
        const thermo = devices.find(d => d.type === DeviceType.THERMOSTAT);
        if (thermo && thermo.value) {
            return `当前室温为 ${thermo.value}${thermo.unit}。设备功耗 ${thermo.energyUsageWatts}W。`;
        }
        return "暂时无法获取温度传感器数据。";
     }
     if (lowerQuery.includes('打开') || lowerQuery.includes('关闭') || lowerQuery.includes('开灯')) {
         return "指令已确认。正在通过边缘节点下发控制命令...";
     }
     return `我现在处于本地离线模式。您可以叫我 "${aiName}"。请检查网络连接以使用高级AI功能。`;
  }

  // English Logic
  if (lowerQuery.includes('status') || lowerQuery.includes('online')) {
    const onlineCount = devices.filter(d => d.status === 'ONLINE').length;
    return `System Status: ${onlineCount} of ${devices.length} nodes are currently online and synced.`;
  }

  if (lowerQuery.includes('temperature') || lowerQuery.includes('hot') || lowerQuery.includes('cold')) {
    const thermo = devices.find(d => d.type === DeviceType.THERMOSTAT);
    if (thermo && thermo.value) {
      return `The current reading is ${thermo.value}${thermo.unit}. Usage is ${thermo.energyUsageWatts}W.`;
    }
    return "I cannot read the temperature sensors at the moment.";
  }

  if (lowerQuery.includes('light') || lowerQuery.includes('turn on') || lowerQuery.includes('off')) {
    return "Acknowledged. Local command dispatched to Edge Core via MQTT. State updating...";
  }

  return `I am currently in Local Mode. You can address me as "${aiName}". Ensure internet connectivity for advanced analysis.`;
};

// Main Handler
export const getSmartHomeResponse = async (
  provider: AIProvider,
  devices: SmartDevice[],
  userQuery: string,
  aiName: string = 'Assistant'
): Promise<string> => {
  
  // Detect Language
  const isChinese = /[\u4e00-\u9fa5]/.test(userQuery);

  // 1. Handle Gemini
  if (provider === 'GEMINI') {
      if (!geminiClient) return localRuleEngine(devices, userQuery, isChinese ? 'zh' : 'en', aiName);
      try {
        const deviceContext = JSON.stringify(devices.map(d => ({
            name: d.name, type: d.type, status: d.isOn ? 'ON' : 'OFF', value: d.value
        })));
        
        const systemPrompt = isChinese 
            ? `你是智能家居助手，你的名字是"${aiName}"。如果用户叫你的名字，请热情回应。保持回答简短。` 
            : `You are a smart home assistant named "${aiName}". If the user calls your name, respond enthusiastically. Keep answers brief.`;

        const response = await geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context: Smart Home IoT. Devices: ${deviceContext}. User Query: ${userQuery}`,
            config: { systemInstruction: systemPrompt }
        });
        return response.text || (isChinese ? "无法连接云端。" : "Cloud connection failed.");
      } catch (e) {
          return localRuleEngine(devices, userQuery, isChinese ? 'zh' : 'en', aiName);
      }
  }

  // 2. Handle Domestic AIs (DeepSeek, Qwen, Doubao) Simulation
  return new Promise((resolve) => {
    setTimeout(() => {
        const lowerQuery = userQuery.toLowerCase();
        const lowerName = aiName.toLowerCase();

        // Check for Name Call (Local Simulation for API providers)
        if (lowerQuery.includes(lowerName)) {
            resolve(isChinese 
               ? `[${provider}] ${aiName} 随时为您效劳！` 
               : `[${provider}] ${aiName} at your service!`);
            return;
        }

        if (lowerQuery.includes('打开') || lowerQuery.includes('turn on')) {
            resolve(isChinese 
                ? `[${provider}] 指令已接收。正在调用 Edge API 开启设备...` 
                : `[${provider}] Command received. Invoking Edge API to turn on device...`);
            return;
        }

        if (lowerQuery.includes('推荐') || lowerQuery.includes('建议') || lowerQuery.includes('suggest')) {
             if (provider === 'DEEPSEEK') {
                 resolve(isChinese 
                    ? `DeepSeek V3: ${aiName} 建议您：根据您的使用习惯，在晚间开启“夜间模式”可省电 15%。` 
                    : `DeepSeek V3: ${aiName} suggests enabling 'Night Mode' to save 15% energy.`);
             } else if (provider === 'QWEN') {
                 resolve(isChinese
                    ? `通义千问: ${aiName} 已分析数据，建议检查客厅空调温控设置。`
                    : `Qwen: ${aiName} analyzed data. Please check living room thermostat.`);
             } else {
                 resolve(isChinese
                    ? `豆包: ${aiName} 为您推荐‘回家模式’。`
                    : `Doubao: ${aiName} recommends 'Welcome Home' scene.`);
             }
             return;
        }

        // Fallback to local logic but wrapped in provider signature
        const localResp = localRuleEngine(devices, userQuery, isChinese ? 'zh' : 'en', aiName);
        resolve(`[${provider} Proxy] ${localResp}`);

    }, 800); // Simulate network latency
  });
};
