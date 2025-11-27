
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Bell, 
  Zap,
  Droplets,
  ThermometerSun,
  Play,
  Moon,
  Sun,
  Power,
  Wifi,
  Home,
  BoxSelect,
  Key as KeyIcon,
  Bot
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import DeviceCard from './components/DeviceCard';
import ScannerModal from './components/ScannerModal';
import SmartAssistant from './components/SmartAssistant'; // Replaces GeminiChat
import DigitalKeyCard from './components/DigitalKeyCard';
import SecurityModal from './components/SecurityModal';
import PaymentQRModal from './components/PaymentQRModal';
import Sidebar from './components/Sidebar';
import RobotControl from './components/RobotControl';
import { SmartDevice, DeviceType, ConnectionStatus, Scene, Automation, DigitalKey, KeyType, SmartRobot, RobotMode, RobotStatus } from './types';
import { getEnv } from './utils/env';

// Mock Data Generators
const generateHistoryData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    usage: Math.floor(Math.random() * 500) + 200, // Watts
    temp: Math.floor(Math.random() * 5) + 20 // Celsius
  }));
};

const initialDevices: SmartDevice[] = [
  {
    id: '1',
    name: 'Main Lights',
    type: DeviceType.LIGHT,
    location: 'Living Room',
    status: ConnectionStatus.ONLINE,
    isOn: true,
    energyUsageWatts: 45
  },
  {
    id: '2',
    name: 'Thermostat',
    type: DeviceType.THERMOSTAT,
    location: 'Living Room',
    status: ConnectionStatus.ONLINE,
    isOn: true,
    value: 22.5,
    unit: '°C',
    energyUsageWatts: 150
  },
  {
    id: '3',
    name: 'Security Cam',
    type: DeviceType.CAMERA,
    location: 'Entrance',
    status: ConnectionStatus.ONLINE,
    isOn: true,
    energyUsageWatts: 12
  },
  {
    id: '4',
    name: 'AC Unit',
    type: DeviceType.THERMOSTAT,
    location: 'Bedroom',
    status: ConnectionStatus.OFFLINE,
    isOn: false,
    value: 24,
    unit: '°C',
    energyUsageWatts: 0
  },
  {
    id: '5',
    name: 'Smart Audio',
    type: DeviceType.SPEAKER,
    location: 'Living Room',
    status: ConnectionStatus.ONLINE,
    isOn: false,
    value: 'Paused',
    energyUsageWatts: 5
  },
  {
    id: '6',
    name: 'Corridor Light',
    type: DeviceType.LIGHT,
    location: 'Entrance',
    status: ConnectionStatus.ONLINE,
    isOn: false,
    energyUsageWatts: 0
  },
  {
    id: '7',
    name: 'Bedside Lamp',
    type: DeviceType.LIGHT,
    location: 'Bedroom',
    status: ConnectionStatus.ONLINE,
    isOn: true,
    energyUsageWatts: 9
  },
  {
    id: '8',
    name: 'LR Curtains',
    type: DeviceType.CURTAIN,
    location: 'Living Room',
    status: ConnectionStatus.ONLINE,
    isOn: false, // Closed
    energyUsageWatts: 0
  }
];

const initialScenes: Scene[] = [
  {
    id: 's1',
    name: 'Cyberpunk Mode',
    icon: 'Moon',
    color: 'from-fuchsia-600 to-purple-600',
    actions: [
      { deviceId: '1', isOn: true }, 
      { deviceId: '2', isOn: true, value: 20 }, 
      { deviceId: '5', isOn: true }
    ]
  },
  {
    id: 's2',
    name: 'Focus',
    icon: 'Sun',
    color: 'from-cyan-500 to-blue-500',
    actions: [
      { deviceId: '1', isOn: true },
      { deviceId: '2', isOn: true, value: 23 },
    ]
  },
  {
    id: 's3',
    name: 'Shutdown',
    icon: 'Power',
    color: 'from-red-500 to-orange-500',
    actions: [
      { deviceId: '1', isOn: false },
      { deviceId: '2', isOn: true, value: 18 },
      { deviceId: '5', isOn: false }
    ]
  }
];

const initialAutomations: Automation[] = [
  {
    id: 'a1',
    name: 'Sunset Trigger',
    triggerType: 'TIME',
    triggerDescription: 'At 19:00',
    sceneId: 's1',
    isActive: true
  },
  {
    id: 'a2',
    name: 'Arrival Protocol',
    triggerType: 'LOCATION',
    triggerDescription: 'GPS Arrive',
    sceneId: 's2',
    isActive: true
  }
];

const initialKeys: DigitalKey[] = [
  {
    id: 'k1',
    name: 'Model Y',
    type: KeyType.CAR,
    model: 'Tesla',
    status: 'LOCKED',
    batteryLevel: 82,
    lastUsed: 'Today, 8:30 AM',
    capabilities: ['UNLOCK', 'TRUNK', 'CLIMATE', 'SHARE']
  },
  {
    id: 'k2',
    name: 'Main Entrance',
    type: KeyType.HOME,
    model: 'Yale Assure',
    status: 'LOCKED',
    batteryLevel: 45,
    lastUsed: 'Yesterday, 18:00',
    capabilities: ['UNLOCK', 'SHARE']
  },
  {
    id: 'k3',
    name: 'Highway ETC',
    type: KeyType.ETC,
    model: 'ETC Card (Shanghai)',
    status: 'ACTIVE',
    balance: 520.50,
    lastUsed: '2 days ago',
    capabilities: ['RECHARGE', 'HISTORY']
  },
  {
    id: 'k4',
    name: 'John Doe',
    type: KeyType.BANK_CARD,
    model: 'CMB Wing Lung',
    cardNumber: '8823',
    expiryDate: '09/27',
    status: 'ACTIVE',
    capabilities: ['PAYMENT']
  }
];

const initialRobots: SmartRobot[] = [
  {
    id: 'r1',
    name: 'R-Bot 01',
    battery: 88,
    mode: RobotMode.IDLE,
    status: RobotStatus.WORKING,
    location: 'Docking Station',
    binFullness: 12
  }
];

const App: React.FC = () => {
  const [devices, setDevices] = useState<SmartDevice[]>(initialDevices);
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);
  const [keys, setKeys] = useState<DigitalKey[]>(initialKeys);
  const [robots, setRobots] = useState<SmartRobot[]>(initialRobots);
  
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [energyData, setEnergyData] = useState(generateHistoryData());
  const [activeTab, setActiveTab] = useState('home');
  const [env, setEnv] = useState<ReturnType<typeof getEnv>>({ isWeChat: false, isAlipay: false, isMiniProgram: false, platform: 'web' });

  // Security & Payment State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentKey, setSelectedPaymentKey] = useState<DigitalKey | null>(null);

  useEffect(() => {
    // 1. Environment Detection
    const currentEnv = getEnv();
    setEnv(currentEnv);
    
    // 2. Data Simulation
    const interval = setInterval(() => {
      setDevices(prev => prev.map(d => {
        if (d.status !== ConnectionStatus.ONLINE) return d;
        const powerFluctuation = d.isOn ? Math.floor(Math.random() * 5) - 2 : 0;
        const newPower = Math.max(0, d.energyUsageWatts + powerFluctuation);
        let newValue = d.value;
        if (d.type === DeviceType.THERMOSTAT && typeof d.value === 'number') {
           const tempFluctuation = (Math.random() * 0.2) - 0.1;
           newValue = Number((d.value + tempFluctuation).toFixed(1));
        }
        return { ...d, energyUsageWatts: newPower, value: newValue };
      }));

      // Robot Simulation
      setRobots(prev => prev.map(bot => {
         if (bot.mode === RobotMode.CLEANING) {
             return { ...bot, battery: Math.max(0, bot.battery - 1), binFullness: Math.min(100, bot.binFullness + 1) };
         }
         if (bot.mode === RobotMode.DOCKING && bot.battery < 100) {
             return { ...bot, battery: bot.battery + 2 };
         }
         return bot;
      }));

    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalPower = devices.reduce((acc, d) => d.isOn ? acc + d.energyUsageWatts : acc, 0);
  const onlineCount = devices.filter(d => d.status === ConnectionStatus.ONLINE).length;

  const handleToggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: !d.isOn } : d));
  };

  const handleUpdateDevice = (id: string, updates: Partial<SmartDevice>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleTriggerScene = (scene: Scene) => {
    setDevices(prev => prev.map(device => {
      const action = scene.actions.find(a => a.deviceId === device.id);
      if (action) {
        return {
          ...device,
          isOn: action.isOn,
          value: action.value !== undefined ? action.value : device.value
        };
      }
      return device;
    }));
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const handleKeyAction = (id: string, action: string) => {
    const key = keys.find(k => k.id === id);
    
    if (action === 'PAYMENT' && key) {
        setSelectedPaymentKey(key);
        setIsSecurityModalOpen(true);
        return;
    }

    if (action === 'UNLOCK' || action === 'LOCK') {
      setKeys(prev => prev.map(k => k.id === id ? { ...k, status: action === 'UNLOCK' ? 'UNLOCKED' : 'LOCKED', lastUsed: 'Now' } : k));
    }
    if (action === 'RECHARGE') {
      alert("Recharge initiated for ETC card");
    }
  };

  const handleSecuritySuccess = () => {
      setIsSecurityModalOpen(false);
      setIsPaymentModalOpen(true);
  };

  const handleScanComplete = (deviceId: string) => {
    setIsScannerOpen(false);
    const newDevice: SmartDevice = {
      id: deviceId,
      name: `New Node ${Math.floor(Math.random() * 100)}`,
      type: DeviceType.SENSOR,
      location: 'Unassigned',
      status: ConnectionStatus.ONLINE,
      isOn: true,
      value: '22',
      unit: '°C',
      energyUsageWatts: 5
    };
    setDevices(prev => [...prev, newDevice]);
  };

  const handleRobotUpdate = (updates: Partial<SmartRobot>) => {
      // In a real app we would use ID, but here we assume single R-Bot
      setRobots(prev => prev.map(r => r.id === 'r1' ? { ...r, ...updates } : r));
  };

  // Group devices by Location
  const devicesByRoom = devices.reduce((acc, device) => {
    if (!acc[device.location]) acc[device.location] = [];
    acc[device.location].push(device);
    return acc;
  }, {} as Record<string, SmartDevice[]>);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-lg backdrop-blur-md shadow-xl">
          <p className="text-slate-400 text-[10px] mb-1 font-mono">{label}</p>
          <p className="text-brand-400 text-sm font-bold font-mono">{payload[0].value} W</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen bg-dark-950 text-slate-200 font-sans pb-24 md:pb-0 md:pl-72 relative overflow-x-hidden selection:bg-brand-500/30 ${env.isMiniProgram ? 'pt-2' : ''}`}>
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid z-0 pointer-events-none opacity-40"></div>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Reusable Sidebar Component */}
      <Sidebar mode="CLIENT" activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="relative z-10 p-4 md:p-10 max-w-[1600px] mx-auto">
        
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">SMART<span className="text-brand-400">HOME</span></h1>
            {env.isMiniProgram && <span className="text-[9px] text-slate-500 font-mono uppercase">via {env.platform} MP</span>}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsScannerOpen(true)} className="p-2.5 bg-brand-600/20 border border-brand-500/30 rounded-full text-brand-400 backdrop-blur-md">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-300 backdrop-blur-md">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* HUD Status Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Net Load', value: totalPower, unit: 'W', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
                { label: 'Avg Temp', value: '22.4', unit: '°C', icon: ThermometerSun, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20' },
                { label: 'Humidity', value: '42', unit: '%', icon: Droplets, color: 'text-brand-400', bg: 'bg-brand-400/10', border: 'border-brand-400/20' },
                { label: 'Online', value: `${onlineCount}/${devices.length}`, unit: 'Nodes', icon: Wifi, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
              ].map((stat, idx) => (
                <div key={idx} className={`glass-panel p-4 rounded-2xl border ${stat.border} flex flex-col justify-between h-28 relative overflow-hidden group`}>
                   <div className="flex justify-between items-start z-10">
                      <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   </div>
                   <div className="z-10">
                      <h3 className="text-2xl font-bold font-mono text-white tracking-tighter">
                        {stat.value}<span className="text-xs font-normal text-slate-500 ml-1 font-sans">{stat.unit}</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{stat.label}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Column: Room Lists */}
              <div className="lg:col-span-2 space-y-8">
                {Object.entries(devicesByRoom).map(([room, roomDevices]) => (
                  <div key={room}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                      <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono border border-slate-700 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur">
                        {room}
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {roomDevices.map(device => (
                        <DeviceCard key={device.id} device={device} onToggle={handleToggleDevice} />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quick Action: Add Device */}
                <button 
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full py-4 border border-dashed border-slate-700 rounded-2xl text-slate-500 hover:text-brand-400 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span className="text-sm font-medium">Scan New IoT Node</span>
                </button>
              </div>

              {/* Right Column: Chart & Scenes */}
              <div className="space-y-6">
                
                {/* Chart Card */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800" style={{ minWidth: 0 }}>
                   <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                     <Zap className="w-4 h-4 text-brand-400" />
                     POWER CONSUMPTION
                   </h3>
                   <div className="h-48 w-full -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={energyData}>
                        <defs>
                          <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{stroke: '#22d3ee', strokeWidth: 1, strokeDasharray: '4 4'}} />
                        <Area type="monotone" dataKey="usage" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorUsage)" />
                      </AreaChart>
                    </ResponsiveContainer>
                   </div>
                </div>

                {/* Scenes Mini Grid */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 mb-4 pl-1">QUICK SCENES</h3>
                  <div className="space-y-3">
                    {scenes.map(scene => (
                      <button
                        key={scene.id}
                        onClick={() => handleTriggerScene(scene)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-brand-500/30 hover:bg-brand-900/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${scene.color} flex items-center justify-center text-white shadow-lg`}>
                              {scene.icon === 'Moon' && <Moon className="w-5 h-5" />}
                              {scene.icon === 'Sun' && <Sun className="w-5 h-5" />}
                              {scene.icon === 'Power' && <Power className="w-5 h-5" />}
                           </div>
                           <div className="text-left">
                             <h4 className="font-semibold text-white text-sm">{scene.name}</h4>
                             <p className="text-[10px] text-slate-500">{scene.actions.length} Actions</p>
                           </div>
                        </div>
                        <Play className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Robot Control Tab */}
        {activeTab === 'robots' && (
           <RobotControl robot={robots[0]} onUpdate={handleRobotUpdate} />
        )}

        {activeTab === 'automations' && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
               <h2 className="text-lg font-bold text-white mb-4">Active Automations</h2>
               <div className="space-y-3">
                 {automations.map(auto => (
                   <div key={auto.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${auto.isActive ? 'bg-brand-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-600'}`}></div>
                         <div>
                           <p className="text-sm font-medium text-slate-200">{auto.name}</p>
                           <p className="text-xs text-slate-500">{auto.triggerDescription}</p>
                         </div>
                      </div>
                      <button onClick={() => handleToggleAutomation(auto.id)} className={`text-xs px-3 py-1 rounded border ${auto.isActive ? 'border-brand-500/30 text-brand-400 bg-brand-500/10' : 'border-slate-700 text-slate-500'}`}>
                        {auto.isActive ? 'RUNNING' : 'PAUSED'}
                      </button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
             {keys.map(key => <DigitalKeyCard key={key.id} data={key} onAction={handleKeyAction} />)}
             {/* Add New Key Placeholder */}
             <button className="relative w-full aspect-[1.6/1] rounded-2xl p-6 flex flex-col items-center justify-center border border-dashed border-slate-700 text-slate-500 hover:text-brand-400 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all group">
                <div className="p-4 bg-slate-800/50 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Add New Key or Card</span>
             </button>
          </div>
        )}

      </main>

      {/* Overlays */}
      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanComplete={handleScanComplete}
      />

      <SecurityModal 
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={handleSecuritySuccess}
      />

      <PaymentQRModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cardName={selectedPaymentKey?.name || 'Card'}
        cardNumber={selectedPaymentKey?.cardNumber}
      />

      {/* New AI Assistant with Voice and Robot Support */}
      <SmartAssistant 
        devices={devices} 
        robots={robots}
        onUpdateDevice={handleUpdateDevice}
        onUpdateRobot={handleRobotUpdate}
      />

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#020617]/90 backdrop-blur-xl border-t border-slate-800 z-50 pb-safe">
        <div className="flex justify-around items-center h-20">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'robots', icon: Bot, label: 'Bot' },
            { id: 'keys', icon: KeyIcon, label: 'Wallet' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'text-brand-400' 
                  : 'text-slate-500'
              }`}
            >
              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-brand-500/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
};

export default App;
