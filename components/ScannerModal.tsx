import React, { useState, useEffect } from 'react';
import { X, Scan, Wifi, CheckCircle } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (scannedData: string) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onScanComplete }) => {
  const [scanning, setScanning] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setScanning(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          // Simulate successful scan after animation
          setTimeout(() => {
            onScanComplete("device_id_detected_mock_123");
          }, 800);
          return 100;
        }
        return prev + 2; // Speed of scan
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, onScanComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl shadow-brand-900/40">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800/50 bg-slate-900/80">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
            <Scan className="w-4 h-4 text-brand-400" />
            Node Scanner
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport Simulation */}
        <div className="relative h-96 bg-black flex flex-col items-center justify-center overflow-hidden">
          
          {scanning ? (
            <>
              {/* Fake camera feed background */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)]"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              
              {/* Scan Frame */}
              <div className="relative z-10 w-64 h-64 border border-slate-700/50 rounded-2xl overflow-hidden">
                {/* Scanner Beam */}
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan_2s_ease-in-out_infinite]" 
                     style={{ top: `${progress}%` }}></div>
                
                {/* HUD Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-500 rounded-br-lg"></div>
              </div>

              <div className="absolute bottom-8 left-0 right-0 text-center">
                 <p className="text-xs text-brand-400 font-mono animate-pulse">SEARCHING QR MATRIX...</p>
                 <p className="text-[10px] text-slate-600 mt-1">Keep device steady</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                 <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white font-mono">NODE IDENTIFIED</h3>
              <p className="text-emerald-400 text-xs mt-2 font-mono">Mac: A2:F3:11:8B</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
            <span>Protocol: MQTT/TCP</span>
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${scanning ? 'bg-brand-500 animate-pulse' : 'bg-emerald-500'}`}></div>
               <span>{scanning ? 'LINKING...' : 'SYNCED'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerModal;