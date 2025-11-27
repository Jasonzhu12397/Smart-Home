
import { GoogleGenAI } from "@google/genai";
import { SmartDevice, DeviceType, AIProvider, SmartRobot, RobotMode, RobotStatus } from "../types";

const apiKey = process.env.API_KEY;
let geminiClient: GoogleGenAI | null = null;

if (apiKey) {
  geminiClient = new GoogleGenAI({ apiKey });
}

// Interface for dispatching actions back to the App
interface Dispatchers {
    updateDevice: (id: string, updates: Partial<SmartDevice>) => void;
    updateRobot: (id: string, updates: Partial<SmartRobot>) => void;
}

// Local Rule Engine (Offline/Fallback)
const localRuleEngine = (
    devices: SmartDevice[], 
    robots: SmartRobot[], 
    query: string, 
    lang: 'en' | 'zh' = 'en', 
    aiName: string = 'Assistant',
    isRBot: boolean = false,
    dispatch?: Dispatchers
): string => {
  const lowerQuery = query.toLowerCase();
  const lowerName = aiName.toLowerCase();

  // R-Bot Physical Persona
  if (isRBot) {
     const bot = robots[0];
     const location = bot ? bot.location : 'Station';
     
     if (lowerQuery.includes('light') && (lowerQuery.includes('off') || lowerQuery.includes('关'))) {
         // ACTION: Turn off lights
         if (dispatch) {
             const lights = devices.filter(d => d.type === DeviceType.LIGHT);
             lights.forEach(l => dispatch.updateDevice(l.id, { isOn: false }));
         }
         return lang === 'zh' 
          ? `收到。R-Bot 正在前往开关位置关闭灯光。已执行物理操作。`
          : `Affirmative. Navigating to light switch... Actuator engaged. Lights extinguished.`;
     }
     if (lowerQuery.includes('light') && (lowerQuery.includes('on') || lowerQuery.includes('开'))) {
         // ACTION: Turn on lights
         if (dispatch) {
             const lights = devices.filter(d => d.type === DeviceType.LIGHT);
             lights.forEach(l => dispatch.updateDevice(l.id, { isOn: true }));
         }
         return lang === 'zh' 
          ? `收到。R-Bot 正在开启灯光。`
          : `Affirmative. Lights activated.`;
     }

     if (lowerQuery.includes('curtain') || lowerQuery.includes('blind') || lowerQuery.includes('window') || lowerQuery.includes('窗帘')) {
         const isOpening = lowerQuery.includes('open') || lowerQuery.includes('开');
         const action = isOpening ? (lang === 'zh' ? '开启' : 'OPEN') : (lang === 'zh' ? '关闭' : 'CLOSE');
         
         if (dispatch) {
             const curtains = devices.filter(d => d.type === DeviceType.CURTAIN);
             curtains.forEach(c => dispatch.updateDevice(c.id, { isOn: isOpening }));
         }

         return lang === 'zh'
           ? `R-Bot 已移动到窗边。机械臂正在${action}窗帘。任务完成。`
           : `R-Bot relocating to window area... Manipulator arm active. Curtains ${action} sequence complete.`;
     }
     if (lowerQuery.includes('status') || lowerQuery.includes('where') || lowerQuery.includes('状态')) {
         return lang === 'zh' 
            ? `所有系统正常。当前位于 ${location}。等待指令。`
            : `All systems nominal. Current vector: ${location}. Awaiting directives.`;
     }
     return lang === 'zh' 
        ? `R-Bot 在线。我可以帮您物理操作家电（开关灯、窗帘）或执行巡逻。` 
        : `R-Bot online. Capable of physical interactions (Lights, Curtains) and patrol duties.`;
  }

  // Standard AI / Wake Word Check
  if (lowerQuery.includes(lowerName)) {
      return lang === 'zh' 
        ? `${aiName} 在此。随时为您服务。` 
        : `${aiName} is here. Ready for commands.`;
  }
  
  // Robot Control Commands (for non-RBot providers)
  if (lowerQuery.includes('robot') || lowerQuery.includes('bot') || lowerQuery.includes('vacuum') || lowerQuery.includes('clean') || lowerQuery.includes('扫地') || lowerQuery.includes('机器人')) {
      const bot = robots[0]; 
      if (!bot) return lang === 'zh' ? "没有找到机器人设备。" : "No robot device found.";

      if (lowerQuery.includes('start') || lowerQuery.includes('clean') || lowerQuery.includes('开始') || lowerQuery.includes('清扫')) {
          if (dispatch) {
              dispatch.updateRobot(bot.id, { mode: RobotMode.CLEANING, status: RobotStatus.WORKING });
          }
          return lang === 'zh'
            ? `指令已发送：${bot.name} 开始清扫模式。`
            : `Command sent: ${bot.name} initiated CLEANING protocol.`;
      }
      if (lowerQuery.includes('dock') || lowerQuery.includes('charge') || lowerQuery.includes('home') || lowerQuery.includes('回充') || lowerQuery.includes('充电')) {
          if (dispatch) {
              dispatch.updateRobot(bot.id, { mode: RobotMode.DOCKING, status: RobotStatus.CHARGING });
          }
          return lang === 'zh'
            ? `指令已发送：${bot.name} 正在返回充电座。`
            : `Command sent: ${bot.name} returning to dock.`;
      }
      if (lowerQuery.includes('patrol') || lowerQuery.includes('巡逻')) {
          if (dispatch) {
              dispatch.updateRobot(bot.id, { mode: RobotMode.PATROL, status: RobotStatus.WORKING });
          }
          return lang === 'zh'
            ? `安全警报：${bot.name} 已切换至巡逻模式。`
            : `Security Alert: ${bot.name} switched to PATROL mode.`;
      }
  }

  // Curtain Control Logic
  if (lowerQuery.includes('curtain') || lowerQuery.includes('blind') || lowerQuery.includes('窗帘')) {
      const isOpening = lowerQuery.includes('open') || lowerQuery.includes('开');
      
      if (dispatch) {
          const curtains = devices.filter(d => d.type === DeviceType.CURTAIN);
          curtains.forEach(c => dispatch.updateDevice(c.id, { isOn: isOpening }));
      }
      
      if (isOpening) {
          return lang === 'zh' ? "已为您打开客厅窗帘。" : "Opening Living Room curtains now.";
      }
      if (lowerQuery.includes('close') || lowerQuery.includes('关')) {
          return lang === 'zh' ? "已为您关闭客厅窗帘。" : "Closing Living Room curtains now.";
      }
  }

  // General Device Control (Lights/Power)
  if (lowerQuery.includes('light') || lowerQuery.includes('turn on') || lowerQuery.includes('off') || lowerQuery.includes('开灯') || lowerQuery.includes('关灯')) {
    const isTurningOn = lowerQuery.includes('turn on') || lowerQuery.includes('开灯');
    
    if (dispatch) {
        // Simple logic: Turn all lights on or off based on command
        // In a real app, we would parse "Living Room Lights" specifically
        const lights = devices.filter(d => d.type === DeviceType.LIGHT);
        lights.forEach(l => dispatch.updateDevice(l.id, { isOn: isTurningOn }));
    }

    return lang === 'zh' 
        ? "指令已确认。正在通过边缘节点下发控制命令..." 
        : "Acknowledged. Local command dispatched to Edge Core via MQTT. State updating...";
  }

  // Status Queries
  if (lowerQuery.includes('status') || lowerQuery.includes('online') || lowerQuery.includes('在线')) {
    const onlineCount = devices.filter(d => d.status === 'ONLINE').length;
    return lang === 'zh'
        ? `系统状态: ${onlineCount} / ${devices.length} 个设备在线。`
        : `System Status: ${onlineCount} of ${devices.length} nodes are currently online.`;
  }

  // Thermostat Queries
  if (lowerQuery.includes('temperature') || lowerQuery.includes('hot') || lowerQuery.includes('cold') || lowerQuery.includes('温度')) {
    const thermo = devices.find(d => d.type === DeviceType.THERMOSTAT);
    if (thermo && thermo.value) {
      return lang === 'zh'
         ? `当前室温为 ${thermo.value}${thermo.unit}。设备功耗 ${thermo.energyUsageWatts}W。`
         : `The current reading is ${thermo.value}${thermo.unit}. Usage is ${thermo.energyUsageWatts}W.`;
    }
  }

  return lang === 'zh'
     ? `我现在处于本地模式。您可以叫我 "${aiName}"。`
     : `I am currently in Local Mode. You can address me as "${aiName}".`;
};

// Main Handler
export const getSmartHomeResponse = async (
  provider: AIProvider,
  devices: SmartDevice[],
  userQuery: string,
  aiName: string = 'Assistant',
  robots: SmartRobot[] = [],
  dispatch?: Dispatchers
): Promise<string> => {
  
  // Detect Language
  const isChinese = /[\u4e00-\u9fa5]/.test(userQuery);
  const lang = isChinese ? 'zh' : 'en';

  // 1. R-Bot (Physical Robot Agent)
  if (provider === 'RBOT') {
      return new Promise(resolve => {
          setTimeout(() => {
              resolve(localRuleEngine(devices, robots, userQuery, lang, aiName, true, dispatch));
          }, 600);
      });
  }

  // 2. Google Gemini
  if (provider === 'GEMINI') {
      if (!geminiClient) return localRuleEngine(devices, robots, userQuery, lang, aiName, false, dispatch);
      try {
        const deviceContext = JSON.stringify(devices.map(d => ({
            name: d.name, type: d.type, status: d.isOn ? 'ON' : 'OFF', value: d.value
        })));
        
        const systemPrompt = isChinese 
            ? `你是智能家居助手"${aiName}"。` 
            : `You are a smart home assistant named "${aiName}".`;

        const response = await geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context: Devices: ${deviceContext}. Query: ${userQuery}`,
            config: { systemInstruction: systemPrompt }
        });
        
        // Still run local engine to check for physical commands that Gemini might just describe
        localRuleEngine(devices, robots, userQuery, lang, aiName, false, dispatch);

        return response.text || (isChinese ? "无法连接云端。" : "Cloud connection failed.");
      } catch (e) {
          return localRuleEngine(devices, robots, userQuery, lang, aiName, false, dispatch);
      }
  }

  // 3. Other Providers (OpenAI, DeepSeek, etc.) Simulation
  return new Promise((resolve) => {
    setTimeout(() => {
        const lowerQuery = userQuery.toLowerCase();
        
        // Handle physical control requests via other AIs
        if (lowerQuery.includes('turn on') || lowerQuery.includes('open') || lowerQuery.includes('打开') || lowerQuery.includes('curtain') || lowerQuery.includes('clean') || lowerQuery.includes('扫地')) {
             const actionResp = localRuleEngine(devices, robots, userQuery, lang, aiName, false, dispatch);
             
             if (provider === 'OPENAI') {
                 resolve(isChinese 
                     ? `ChatGPT: 好的，${actionResp}` 
                     : `ChatGPT: Certainly. ${actionResp}`);
             } else {
                 resolve(`[${provider}] ${actionResp}`);
             }
             return;
        }

        // General Conversation Fallback
        const baseResp = localRuleEngine(devices, robots, userQuery, lang, aiName, false, dispatch);
        
        let prefix = `[${provider}]`;
        if (provider === 'OPENAI') prefix = 'ChatGPT:';
        if (provider === 'DEEPSEEK') prefix = 'DeepSeek:';
        if (provider === 'QWEN') prefix = 'Qwen:';
        if (provider === 'DOUBAO') prefix = 'Doubao:';

        resolve(`${prefix} ${baseResp}`);

    }, 800);
  });
};
