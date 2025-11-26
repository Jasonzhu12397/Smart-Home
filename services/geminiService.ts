
import { GoogleGenAI } from "@google/genai";
import { SmartDevice, DeviceType } from "../types";

// Hybrid Intelligence Service
// 1. Tries to use Google Gemini API if Key is present.
// 2. Falls back to Local Rule Engine if offline or no key.

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// Local Fallback Logic (Rule Engine)
const localRuleEngine = (devices: SmartDevice[], query: string): string => {
  const lowerQuery = query.toLowerCase();
  
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

  if (lowerQuery.includes('energy') || lowerQuery.includes('power')) {
    const total = devices.reduce((acc, d) => d.isOn ? acc + d.energyUsageWatts : acc, 0);
    return `Current aggregate power consumption is ${total} Watts.`;
  }

  return "I am currently in Local Mode. Please ensure internet connectivity for advanced AI analysis, or issue basic commands.";
};

export const getHomeInsights = async (
  devices: SmartDevice[],
  userQuery: string
): Promise<string> => {
  // 1. Check for API Key availability
  if (!apiKey || !ai) {
    console.warn("Gemini API Key missing. Switching to Local Mode.");
    return new Promise(resolve => {
        setTimeout(() => resolve(localRuleEngine(devices, userQuery)), 600);
    });
  }

  try {
    const deviceContext = JSON.stringify(devices.map(d => ({
      name: d.name,
      type: d.type,
      location: d.location,
      status: d.isOn ? 'ON' : 'OFF',
      value: d.value,
      power: d.energyUsageWatts + 'W'
    })));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Context: The user is asking about their smart home.
        Current Device State (JSON): ${deviceContext}
        User Query: ${userQuery}
      `,
      config: {
        systemInstruction: `You are the KubeEdge Home AI Assistant.
        Your goal is to manage the smart home, optimize energy, and ensure security.
        Analyze the provided JSON device state to answer the user's question.
        
        Keep answers concise (under 50 words) and actionable.
        If the user asks to "turn on" or "change" something, acknowledge it and say you have updated the state (simulation).
        If the energy usage seems high, suggest optimizations.`,
      }
    });

    return response.text || "I'm having trouble connecting to the Edge node right now.";
  } catch (error) {
    console.error("Gemini API Error (Fallback to Local):", error);
    // 2. Fallback on network error
    return localRuleEngine(devices, userQuery);
  }
};
