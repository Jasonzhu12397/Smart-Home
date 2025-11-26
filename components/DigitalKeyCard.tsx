
import React, { useState } from 'react';
import { Lock, Unlock, Car, Home, Battery, Share2, Wind, Archive, Key, CreditCard, RotateCw, History, QrCode, Wifi } from 'lucide-react';
import { DigitalKey, KeyType } from '../types';

interface DigitalKeyCardProps {
  data: DigitalKey;
  onAction: (id: string, action: string) => void;
}

const DigitalKeyCard: React.FC<DigitalKeyCardProps> = ({ data, onAction }) => {
  const [isPressing, setIsPressing] = useState(false);
  
  // Choose gradient based on key type
  const getGradient = () => {
    switch (data.type) {
      case KeyType.CAR: return 'bg-gradient-to-br from-slate-800 via-slate-900 to-black border-slate-700';
      case KeyType.HOME: return 'bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border-indigo-500/30';
      case KeyType.OFFICE: return 'bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 border-emerald-500/30';
      case KeyType.ETC: return 'bg-gradient-to-br from-orange-900 via-slate-900 to-slate-950 border-orange-500/30';
      case KeyType.BANK_CARD: return 'bg-gradient-to-r from-violet-600 to-indigo-600 border-white/10';
      default: return 'bg-slate-900';
    }
  };

  const isEtc = data.type === KeyType.ETC;
  const isBank = data.type === KeyType.BANK_CARD;

  return (
    <div className={`relative w-full aspect-[1.586/1] rounded-2xl p-6 flex flex-col justify-between overflow-hidden border shadow-2xl transition-all duration-500 group ${getGradient()} ${data.status === 'UNLOCKED' ? 'shadow-emerald-500/20 border-emerald-500/50' : ''}`}>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/10 transition-colors"></div>
      
      {/* Bank Card Specific Design */}
      {isBank && (
        <>
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-6 right-6 flex items-center gap-2">
             <Wifi className="w-6 h-6 text-white/50 rotate-90" />
          </div>
          {/* Chip */}
          <div className="absolute top-12 left-8 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md border border-yellow-600/50 shadow-sm opacity-90">
             <div className="w-full h-full border border-black/10 rounded-md relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-px bg-black/20"></div>
                <div className="absolute top-0 left-1/2 w-px h-full bg-black/20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-black/20"></div>
             </div>
          </div>
        </>
      )}

      {/* Header (Non-Bank) */}
      {!isBank && (
        <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full backdrop-blur-md ${isEtc ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-white'}`}>
                {data.type === KeyType.CAR && <Car className="w-6 h-6" />}
                {data.type === KeyType.HOME && <Home className="w-6 h-6" />}
                {data.type === KeyType.ETC && <CreditCard className="w-6 h-6" />}
                {data.type === KeyType.OFFICE && <Key className="w-6 h-6" />}
            </div>
            <div>
                <h3 className="text-xl font-bold text-white tracking-wide">{data.name}</h3>
                <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">{data.model || 'Smart Access'}</p>
            </div>
            </div>
            
            {data.batteryLevel && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-full backdrop-blur text-xs text-slate-300 border border-white/10">
                <Battery className="w-3 h-3" />
                <span>{data.batteryLevel}%</span>
            </div>
            )}

            {isEtc && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-full backdrop-blur text-xs text-orange-400 border border-orange-500/30">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                <span>ACTIVE</span>
            </div>
            )}
        </div>
      )}

      {/* Center Status Visual */}
      {!isBank && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
            {data.type === KeyType.ETC ? <CreditCard className="w-40 h-40" /> : <Car className="w-40 h-40" />}
          </div>
      )}

      {/* ETC Specific Middle Content */}
      {isEtc && (
        <div className="z-10 mt-2">
           <p className="text-[10px] text-slate-400 uppercase tracking-widest">Current Balance</p>
           <p className="text-3xl font-mono font-bold text-white tracking-tighter">
             <span className="text-lg mr-1 text-slate-500">¥</span>{data.balance?.toLocaleString()}
           </p>
        </div>
      )}
      
      {/* Bank Card specific Middle/Bottom */}
      {isBank && (
         <div className="z-10 mt-auto pt-16">
             <p className="text-2xl font-mono text-white tracking-widest shadow-black drop-shadow-md">
                 •••• •••• •••• {data.cardNumber || '0000'}
             </p>
             <div className="flex justify-between items-end mt-4">
                 <div>
                    <p className="text-[9px] text-white/70 uppercase font-bold tracking-widest">Card Holder</p>
                    <p className="text-sm font-medium text-white tracking-wider uppercase">{data.name}</p>
                 </div>
                 <div className="flex items-center gap-4">
                     <div className="text-right mr-2">
                        <p className="text-[8px] text-white/70 uppercase">Valid Thru</p>
                        <p className="text-xs text-white font-mono">{data.expiryDate || '12/28'}</p>
                     </div>
                     {/* Visa/Mastercard Logo Simulation */}
                     <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/90 mix-blend-hard-light"></div>
                        <div className="w-8 h-8 rounded-full bg-yellow-500/90 mix-blend-hard-light"></div>
                     </div>
                 </div>
             </div>
         </div>
      )}

      {/* Controls */}
      <div className={`z-10 ${isBank ? 'absolute top-0 right-0 h-full flex flex-col justify-end p-6 bg-gradient-to-l from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' : 'mt-auto'}`}>
        <div className="flex justify-between items-end">
          
          {/* Main Action Area */}
          {!isEtc && !isBank ? (
            <div className="flex gap-4">
              {/* Primary Unlock Button */}
              <button
                onMouseDown={() => setIsPressing(true)}
                onMouseUp={() => setIsPressing(false)}
                onMouseLeave={() => setIsPressing(false)}
                onClick={() => onAction(data.id, data.status === 'LOCKED' ? 'UNLOCK' : 'LOCK')}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300 ${
                  data.status === 'UNLOCKED' 
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10 active:scale-95'
                }`}
              >
                {data.status === 'UNLOCKED' ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                <span className="text-[9px] font-bold mt-1 uppercase">{data.status}</span>
              </button>

              {/* Secondary Actions */}
              {data.capabilities.includes('CLIMATE') && (
                <button onClick={() => onAction(data.id, 'CLIMATE')} className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                  <Wind className="w-5 h-5" />
                </button>
              )}
              {data.capabilities.includes('TRUNK') && (
                <button onClick={() => onAction(data.id, 'TRUNK')} className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
                  <Archive className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : isEtc ? (
            <div className="flex gap-4">
               {/* ETC Actions */}
               <button onClick={() => onAction(data.id, 'RECHARGE')} className="flex items-center gap-2 px-4 py-3 bg-orange-600/80 hover:bg-orange-500 border border-orange-400/30 text-white text-xs font-bold rounded-xl backdrop-blur transition-colors">
                  <RotateCw className="w-4 h-4" />
                  Top Up
               </button>
               <button onClick={() => onAction(data.id, 'HISTORY')} className="flex items-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-xs font-bold rounded-xl backdrop-blur transition-colors">
                  <History className="w-4 h-4" />
                  Records
               </button>
            </div>
          ) : isBank ? (
            <div className="flex flex-col gap-3">
               <button onClick={() => onAction(data.id, 'PAYMENT')} className="flex items-center gap-2 px-6 py-3 bg-white text-brand-900 shadow-lg shadow-white/20 hover:bg-slate-200 text-sm font-bold rounded-full transition-colors">
                  <QrCode className="w-4 h-4" />
                  Show Payment Code
               </button>
            </div>
          ) : null}

          {data.capabilities.includes('SHARE') && !isEtc && !isBank && (
            <button 
              onClick={() => onAction(data.id, 'SHARE')}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600/80 hover:bg-brand-500 text-white text-xs font-bold rounded-xl backdrop-blur transition-colors"
            >
              <Share2 className="w-3 h-3" />
              Key
            </button>
          )}
        </div>
        
        {!isBank && (
            <div className="mt-4 flex justify-between text-[10px] text-slate-500 font-mono">
            <span>ID: {data.id.substring(0, 8)}...</span>
            <span>{data.lastUsed ? `Used: ${data.lastUsed}` : (isEtc ? 'Ready for Toll' : 'Ready')}</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default DigitalKeyCard;
