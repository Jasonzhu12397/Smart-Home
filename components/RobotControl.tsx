
import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Battery, 
  Wifi, 
  Map, 
  Video, 
  Crosshair, 
  Play, 
  Pause, 
  Home, 
  ShieldAlert, 
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { SmartRobot, RobotMode, RobotStatus } from '../types';

interface RobotControlProps {
  robot: SmartRobot;
  onUpdate: (updates: Partial<SmartRobot>) => void;
}

const RobotControl: React.FC<RobotControlProps> = ({ robot, onUpdate }) => {
  const [viewMode, setViewMode] = useState<'MAP' | 'CAMERA'>('MAP');
  const [lidarRotation, setLidarRotation] = useState(0);

  // Animation for Lidar
  useEffect(() => {
    const interval = setInterval(() => {
      setLidarRotation(prev => (prev + 5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleModeChange = (newMode: RobotMode) => {
    let newStatus = RobotStatus.WORKING;
    if (newMode === RobotMode.DOCKING) newStatus = RobotStatus.CHARGING;
    if (newMode === RobotMode.IDLE) newStatus = RobotStatus.WORKING; // Standby
    
    onUpdate({ mode: newMode, status: newStatus });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-in fade-in slide-in-from-bottom-4">
      
      {/* Main Viewport (Map/Camera) */}
      <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden border border-slate-800 relative flex flex-col h-[500px] lg:h-auto">
        
        {/* Viewport Header */}
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start pointer-events-none">
          <div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${robot.status === RobotStatus.OFFLINE ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
              <h2 className="text-white font-mono font-bold tracking-widest text-lg">{robot.name.toUpperCase()}</h2>
            </div>
            <p className="text-[10px] text-brand-400 font-mono mt-1">
              STATUS: <span className="text-white">{robot.status}</span> | MODE: <span className="text-white">{robot.mode}</span>
            </p>
          </div>
          <div className="flex gap-2 pointer-events-auto">
             <button 
               onClick={() => setViewMode('MAP')}
               className={`p-2 rounded-lg border backdrop-blur-md transition-all ${viewMode === 'MAP' ? 'bg-brand-500 text-white border-brand-400' : 'bg-black/40 text-slate-400 border-slate-700'}`}
             >
               <Map className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setViewMode('CAMERA')}
               className={`p-2 rounded-lg border backdrop-blur-md transition-all ${viewMode === 'CAMERA' ? 'bg-brand-500 text-white border-brand-400' : 'bg-black/40 text-slate-400 border-slate-700'}`}
             >
               <Video className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden">
           
           {/* Grid Overlay */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

           {viewMode === 'MAP' ? (
             <div className="w-full h-full flex items-center justify-center relative">
                {/* Lidar Pulse */}
                <div className="absolute w-[500px] h-[500px] rounded-full border border-brand-500/10 animate-[ping_4s_linear_infinite]"></div>
                
                {/* Simulated Room Map (Abstract) */}
                <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 opacity-40 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                    <path d="M10,10 L40,10 L40,30 L60,30 L60,10 L90,10 L90,90 L70,90 L70,70 L30,70 L30,90 L10,90 Z" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
                    <rect x="15" y="40" width="10" height="20" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="2" fill="#22d3ee" />
                </svg>

                {/* Robot Icon & Lidar Cone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div 
                      className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-t-[100px] border-t-brand-400/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-bottom"
                      style={{ transform: `translate(-50%, -50%) rotate(${lidarRotation}deg)` }}
                   ></div>
                   <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] relative z-10">
                      <div className="absolute -inset-2 border border-white/30 rounded-full animate-ping"></div>
                   </div>
                </div>

                <div className="absolute bottom-4 left-4 text-[10px] font-mono text-brand-500">
                   LIDAR ACTIVE <br/>
                   AREA MAPPED: 45m²
                </div>
             </div>
           ) : (
             <div className="w-full h-full bg-slate-900 relative">
                {/* Simulated FPV Noise */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-xs">
                   <div className="text-center">
                     <Wifi className="w-12 h-12 mx-auto mb-2 text-slate-800" />
                     VIDEO FEED OFFLINE
                   </div>
                </div>
                {/* HUD Overlay */}
                <div className="absolute inset-4 border border-white/10 rounded-2xl pointer-events-none">
                    <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 w-8 h-8" />
                    <div className="absolute top-2 left-2 text-[10px] text-red-500 font-mono">REC ●</div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col gap-4">
        
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2">
                <Battery className={`w-6 h-6 ${robot.battery < 20 ? 'text-red-500' : 'text-emerald-400'}`} />
                <span className="text-xl font-bold text-white font-mono">{robot.battery}%</span>
                <span className="text-[10px] text-slate-500 uppercase">Battery</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-2">
                <Trash2 className="w-6 h-6 text-brand-400" />
                <span className="text-xl font-bold text-white font-mono">{robot.binFullness}%</span>
                <span className="text-[10px] text-slate-500 uppercase">Bin Level</span>
            </div>
        </div>

        {/* D-Pad Manual Control */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex-1 flex flex-col items-center justify-center relative">
            <h3 className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Manual Override</h3>
            
            <div className="grid grid-cols-3 gap-2 p-4 bg-slate-900/50 rounded-full border border-slate-800 shadow-inner">
               <div></div>
               <button className="w-14 h-14 bg-slate-800 hover:bg-brand-600 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 shadow-lg">
                  <ChevronUp className="w-8 h-8" />
               </button>
               <div></div>
               
               <button className="w-14 h-14 bg-slate-800 hover:bg-brand-600 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 shadow-lg">
                  <ChevronLeft className="w-8 h-8" />
               </button>
               <div className="w-14 h-14 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800">
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
               </div>
               <button className="w-14 h-14 bg-slate-800 hover:bg-brand-600 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 shadow-lg">
                  <ChevronRight className="w-8 h-8" />
               </button>

               <div></div>
               <button className="w-14 h-14 bg-slate-800 hover:bg-brand-600 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 shadow-lg">
                  <ChevronDown className="w-8 h-8" />
               </button>
               <div></div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-3 gap-3">
             <button 
                onClick={() => handleModeChange(robot.mode === RobotMode.CLEANING ? RobotMode.IDLE : RobotMode.CLEANING)}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all ${robot.mode === RobotMode.CLEANING ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'bg-slate-800/50 border-transparent text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
                {robot.mode === RobotMode.CLEANING ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="text-[9px] font-bold uppercase">{robot.mode === RobotMode.CLEANING ? 'Pause' : 'Clean'}</span>
             </button>

             <button 
                onClick={() => handleModeChange(RobotMode.DOCKING)}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all ${robot.mode === RobotMode.DOCKING ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-slate-800/50 border-transparent text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
                <Zap className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase">Dock</span>
             </button>

             <button 
                onClick={() => handleModeChange(RobotMode.PATROL)}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all ${robot.mode === RobotMode.PATROL ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800/50 border-transparent text-slate-400 hover:text-white hover:bg-slate-800'}`}
             >
                <ShieldAlert className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase">Patrol</span>
             </button>
        </div>

      </div>
    </div>
  );
};

export default RobotControl;
