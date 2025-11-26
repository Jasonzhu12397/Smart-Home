import React from 'react';
import { Lightbulb, Thermometer, Video, Activity, Speaker, Power, RefreshCw, Zap } from 'lucide-react';
import { SmartDevice, DeviceType, ConnectionStatus } from '../types';

interface DeviceCardProps {
  device: SmartDevice;
  onToggle: (id: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onToggle }) => {
  const isOnline = device.status === ConnectionStatus.ONLINE;
  const isActive = device.isOn && isOnline;

  const getIcon = () => {
    switch (device.type) {
      case DeviceType.LIGHT: return <Lightbulb className={`w-5 h-5 ${isActive ? 'text-yellow-300' : 'text-slate-400'}`} />;
      case DeviceType.THERMOSTAT: return <Thermometer className={`w-5 h-5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />;
      case DeviceType.CAMERA: return <Video className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />;
      case DeviceType.SPEAKER: return <Speaker className={`w-5 h-5 ${isActive ? 'text-accent-400' : 'text-slate-400'}`} />;
      default: return <Activity className={`w-5 h-5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />;
    }
  };

  // Dynamic border and shadow for "active" high-tech feel
  const containerClasses = isActive
    ? 'border-brand-500/40 bg-brand-900/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700';

  return (
    <div className={`relative p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 group ${containerClasses}`}>
      
      {/* Top Row: Icon & Power Button */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl transition-all duration-500 ${isActive ? 'bg-slate-900/80 shadow-inner' : 'bg-slate-800/50'}`}>
          {getIcon()}
        </div>
        
        {isOnline ? (
          <button 
            onClick={() => onToggle(device.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive 
                ? 'bg-brand-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
        ) : (
          <div className="p-1.5 bg-red-500/10 rounded-full animate-pulse">
            <RefreshCw className="w-4 h-4 text-red-500/50" />
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-1">
        <h3 className={`text-sm font-semibold tracking-wide ${isActive ? 'text-white' : 'text-slate-400'}`}>
          {device.name}
        </h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
          {device.location}
        </p>
      </div>

      {/* Status Footer */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
        {/* Status / Value */}
        <div className="flex items-center gap-2">
           {device.value && isActive ? (
             <span className="text-lg font-mono font-bold text-white flex items-baseline gap-0.5">
               {device.value}
               <span className="text-[10px] text-slate-400 font-sans font-normal">{device.unit}</span>
             </span>
           ) : (
             <span className="text-xs text-slate-500 font-medium">
               {isOnline ? (isActive ? 'Active' : 'Standby') : 'Offline'}
             </span>
           )}
        </div>

        {/* Power Usage */}
        {isOnline && (
          <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
            <Zap className={`w-3 h-3 ${isActive ? 'text-brand-400 fill-brand-400' : 'text-slate-600'}`} />
            <span>{device.energyUsageWatts}W</span>
          </div>
        )}
      </div>

      {/* Decorative Corner Accent */}
      {isActive && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-tr-2xl pointer-events-none"></div>
      )}
    </div>
  );
};

export default DeviceCard;