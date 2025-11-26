
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Delete } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState<string>('');
  const [status, setStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setStatus('IDLE');
    }
  }, [isOpen]);

  const handleNumClick = (num: string) => {
    if (status !== 'IDLE' && status !== 'ERROR') return;
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        verifyPin();
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setStatus('IDLE');
  };

  const verifyPin = () => {
    setStatus('VERIFYING');
    // Simulate API verification delay
    setTimeout(() => {
      setStatus('SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 500);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-sm md:rounded-3xl bg-slate-900 border-t md:border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Security Header */}
        <div className="p-6 text-center border-b border-slate-800 relative bg-slate-900/50">
           <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 ring-1 ring-slate-700">
             {status === 'VERIFYING' ? (
                <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
             ) : status === 'SUCCESS' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
             ) : (
                <Lock className="w-6 h-6 text-slate-400" />
             )}
           </div>
           <h3 className="text-lg font-bold text-white">Security Verification</h3>
           <p className="text-xs text-slate-500 mt-1">Enter your 6-digit payment PIN</p>
           
           <button onClick={onClose} className="absolute top-6 right-6 text-sm text-slate-400 hover:text-white">Cancel</button>
        </div>

        {/* PIN Dots */}
        <div className="py-8 flex justify-center gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < pin.length 
                  ? (status === 'SUCCESS' ? 'bg-emerald-500 scale-125' : status === 'ERROR' ? 'bg-red-500' : 'bg-brand-400') 
                  : 'bg-slate-700'
              }`}
            ></div>
          ))}
        </div>

        {/* Keypad */}
        <div className="bg-slate-800/30 p-2 pb-8 grid grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumClick(num.toString())}
              className="h-16 rounded-lg text-2xl font-medium text-white hover:bg-white/5 active:bg-white/10 transition-colors"
            >
              {num}
            </button>
          ))}
          <div className="h-16 flex items-center justify-center"></div>
          <button
            onClick={() => handleNumClick('0')}
            className="h-16 rounded-lg text-2xl font-medium text-white hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center pb-4 text-[10px] text-slate-600 font-mono uppercase">
           Secured by KubeEdge Enclave
        </div>
      </div>
    </div>
  );
};

export default SecurityModal;
