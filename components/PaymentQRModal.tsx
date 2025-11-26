
import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Smartphone, ScanLine } from 'lucide-react';

interface PaymentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardName: string;
  cardNumber?: string;
}

const PaymentQRModal: React.FC<PaymentQRModalProps> = ({ isOpen, onClose, cardName, cardNumber }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!isOpen) {
        setTimeLeft(60);
        return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
             // Reset cycle
             return 60; 
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10 relative">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-800">
            <ScanLine className="w-5 h-5 text-brand-600" />
            <span className="font-bold text-sm tracking-tight">Payment Code</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Info */}
        <div className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <span>{cardName}</span>
                <span className="text-slate-400">({cardNumber || '****'})</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Show this code to merchant</p>
        </div>

        {/* Codes */}
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
            {/* Barcode Mockup */}
            <div className="w-full h-16 bg-slate-800 flex items-center justify-between px-2 rounded overflow-hidden relative">
                 {Array.from({length: 40}).map((_, i) => (
                     <div key={i} className="bg-white" style={{
                         width: Math.random() > 0.5 ? '2px' : '4px',
                         height: '100%'
                     }}></div>
                 ))}
                 <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                    <span className="bg-white px-2 py-0.5 text-[10px] font-mono font-bold tracking-[0.2em] text-slate-900 rounded">
                        2849 9382 1029 4851
                    </span>
                 </div>
            </div>

            {/* QR Code Mockup */}
            <div className="w-48 h-48 border-4 border-slate-900 rounded-lg p-2 relative">
                <div className="w-full h-full bg-slate-900 pattern-qr"></div>
                {/* Center Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-lg flex items-center justify-center ring-4 ring-white">
                    <Smartphone className="w-6 h-6 text-brand-600" />
                </div>
            </div>
        </div>

        {/* Footer / Timer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2 text-xs text-slate-500">
               <RefreshCw className={`w-3 h-3 ${timeLeft < 10 ? 'animate-spin' : ''}`} />
               <span>Auto-refresh in {timeLeft}s</span>
           </div>
           <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <span className="text-[10px] font-bold text-emerald-600">SECURE CONNECTION</span>
           </div>
        </div>
      </div>
      
      {/* Screenshot Warning */}
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
          <p className="text-xs text-slate-500 bg-black/50 inline-block px-3 py-1 rounded-full backdrop-blur">
             Code is valid for 60s. Do not share.
          </p>
      </div>

      <style>{`
        .pattern-qr {
            background-image: radial-gradient(#0f172a 40%, transparent 40%);
            background-size: 10px 10px;
        }
      `}</style>
    </div>
  );
};

export default PaymentQRModal;
