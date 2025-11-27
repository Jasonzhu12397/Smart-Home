
export enum DeviceType {
  LIGHT = 'LIGHT',
  THERMOSTAT = 'THERMOSTAT',
  CAMERA = 'CAMERA',
  SENSOR = 'SENSOR',
  SPEAKER = 'SPEAKER'
}

export enum ConnectionStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  SYNCING = 'SYNCING'
}

export interface SmartDevice {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: ConnectionStatus;
  isOn: boolean;
  value?: number | string; // e.g., temperature, brightness, current track
  unit?: string;
  energyUsageWatts: number;
}

export interface SystemMetrics {
  totalDevices: number;
  onlineDevices: number;
  totalPowerUsage: number;
  edgeNodeHealth: 'Healthy' | 'Warning' | 'Critical';
}

export type AIProvider = 'GEMINI' | 'DEEPSEEK' | 'QWEN' | 'DOUBAO' | 'LOCAL';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  provider?: AIProvider;
}

export interface SceneAction {
  deviceId: string;
  isOn: boolean;
  value?: number | string;
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  color: string;
  actions: SceneAction[];
}

export interface Automation {
  id: string;
  name: string;
  triggerType: 'TIME' | 'SENSOR' | 'LOCATION';
  triggerDescription: string;
  sceneId: string;
  isActive: boolean;
}

// Digital Key / Wallet Types
export enum KeyType {
  CAR = 'CAR',
  HOME = 'HOME',
  OFFICE = 'OFFICE',
  ETC = 'ETC', // Electronic Toll Collection
  BANK_CARD = 'BANK_CARD'
}

export interface DigitalKey {
  id: string;
  name: string;
  type: KeyType;
  brandIcon?: string; 
  model?: string; // License plate for ETC, Issuer for Bank
  cardNumber?: string; // Last 4 digits
  expiryDate?: string;
  status: 'LOCKED' | 'UNLOCKED' | 'CONNECTING' | 'ACTIVE';
  batteryLevel?: number; 
  balance?: number; // For ETC cards
  currency?: string;
  lastUsed?: string;
  capabilities: ('UNLOCK' | 'TRUNK' | 'CLIMATE' | 'SHARE' | 'RECHARGE' | 'HISTORY' | 'PAYMENT')[];
}

// Robot Types
export enum RobotMode {
  IDLE = 'IDLE',
  CLEANING = 'CLEANING',
  DOCKING = 'DOCKING',
  PATROL = 'PATROL'
}

export enum RobotStatus {
  CHARGING = 'CHARGING',
  WORKING = 'WORKING',
  STUCK = 'STUCK',
  OFFLINE = 'OFFLINE'
}

export interface SmartRobot {
  id: string;
  name: string;
  battery: number;
  mode: RobotMode;
  status: RobotStatus;
  location: string; // e.g., "Living Room"
  binFullness: number; // 0-100
  cameraUrl?: string; // Simulated FPV feed
}

// Admin / Server Side Types
export interface NodeStatus {
  name: string;
  role: 'Edge' | 'Cloud';
  status: 'Ready' | 'NotReady';
  cpu: string;
  memory: string;
  lastHeartbeat: string;
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  component: string;
  message: string;
  timestamp: string;
}

// Global Definitions for Mini Programs
declare global {
  interface Window {
    wx: any;
    my: any;
    AlipayJSBridge: any;
  }
}
