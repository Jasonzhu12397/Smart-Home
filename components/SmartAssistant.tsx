
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Bot, Mic, MicOff, ChevronDown, Activity, Settings, Save } from 'lucide-react';
import { ChatMessage, SmartDevice, AIProvider } from '../types';
import { getSmartHomeResponse } from '../services/aiService';

interface SmartAssistantProps {
  devices: SmartDevice[];
}

// Web Speech API Type Definition for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ devices }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('GEMINI');
  const [isRecording, setIsRecording] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Custom Persona State
  const [aiName, setAiName] = useState('Jarvis');
  const [tempName, setTempName] = useState('Jarvis');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "System Online. KubeEdge Home AI Ready.",
      timestamp: Date.now(),
      provider: 'LOCAL'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, showSettings]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        // Auto-detect language or default to Chinese for Domestic models
        recognitionRef.current.lang = ['DEEPSEEK', 'QWEN', 'DOUBAO'].includes(provider) ? 'zh-CN' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error("Speech error", event.error);
            setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
            setIsRecording(false);
        };
    }
  }, [provider]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await getSmartHomeResponse(provider, devices, textToSend, aiName);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now(),
      provider: provider
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const startListening = () => {
      if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsRecording(true);
          } catch (e) {
            console.error(e);
          }
      } else {
          alert("Voice input not supported in this browser.");
      }
  };

  const stopListening = () => {
      if (recognitionRef.current) {
          recognitionRef.current.stop();
          setIsRecording(false);
      }
  };

  const saveSettings = () => {
      if (tempName.trim()) {
          setAiName(tempName.trim());
          setShowSettings(false);
          // Add a system log message
          setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'model',
              text: `Persona updated. You can now call me "${tempName.trim()}".`,
              timestamp: Date.now(),
              provider: 'LOCAL'
          }]);
      }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 bg-slate-900 border border-brand-500/50 text-brand-400 p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 hover:bg-brand-500 hover:text-white transition-all duration-300 group"
        >
          <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 rounded-full border border-brand-400 opacity-30 animate-ping pointer-events-none"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full md:w-[420px] md:bottom-24 md:right-8 z-50 h-[90vh] md:h-[650px] flex flex-col bg-slate-950/95 backdrop-blur-xl md:rounded-2xl border border-brand-900/50 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden ring-1 ring-brand-500/20">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 relative z-20">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-brand-500/10 rounded-lg border border-brand-500/20">
                 <Bot className="w-5 h-5 text-brand-400" />
              </div>
              <div className="relative">
                {/* Model Selector */}
                <button 
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="flex items-center gap-1.5 text-white font-bold text-sm tracking-wide hover:bg-white/5 px-2 py-1 rounded transition-colors"
                >
                    {provider === 'GEMINI' && 'GEMINI CORE'}
                    {provider === 'DEEPSEEK' && 'DEEPSEEK V3'}
                    {provider === 'QWEN' && 'ALIYUN QWEN'}
                    {provider === 'DOUBAO' && 'DOUBAO AI'}
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>
                
                {/* Dropdown */}
                {showModelMenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                        {[
                            { id: 'GEMINI', label: 'Gemini 2.5 (US)' },
                            { id: 'DEEPSEEK', label: 'DeepSeek (CN)' },
                            { id: 'QWEN', label: 'Qwen Max (CN)' },
                            { id: 'DOUBAO', label: 'Doubao (CN)' }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => { setProvider(m.id as AIProvider); setShowModelMenu(false); }}
                                className={`w-full text-left px-4 py-3 text-xs font-mono hover:bg-slate-800 transition-colors flex items-center justify-between ${provider === m.id ? 'text-brand-400 bg-brand-900/10' : 'text-slate-300'}`}
                            >
                                {m.label}
                                {provider === m.id && <div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div>}
                            </button>
                        ))}
                    </div>
                )}
                
                <p className="px-2 text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  Name: <span className="text-brand-400">{aiName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <Settings className="w-5 h-5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
             <div className="bg-slate-900 border-b border-slate-800 p-4 animate-in slide-in-from-top-2 duration-200">
                <label className="block text-xs text-slate-500 mb-2 uppercase font-mono">AI Persona Name (Wake Word)</label>
                <div className="flex gap-2">
                    <input 
                       type="text" 
                       value={tempName}
                       onChange={(e) => setTempName(e.target.value)}
                       className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
                       placeholder="e.g. Jarvis, Friday"
                    />
                    <button 
                       onClick={saveSettings}
                       className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg flex items-center gap-2 text-sm font-medium"
                    >
                       <Save className="w-4 h-4" />
                       Save
                    </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                    Works in both Cloud and Offline modes. Try saying "Hello {tempName}".
                </p>
             </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-slate-950 to-slate-900 scrollbar-thin scrollbar-thumb-slate-700 relative">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border backdrop-blur-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-900/20 border-brand-500/30 text-brand-50 rounded-br-sm'
                      : 'bg-slate-800/40 border-slate-700 text-slate-300 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.role === 'model' && (
                      <span className="text-[9px] font-mono text-brand-500 flex items-center gap-1 mb-1 opacity-70">
                          <Activity className="w-3 h-3" />
                          {msg.provider || 'SYSTEM'}
                      </span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/40 rounded-2xl px-4 py-3 border border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Overlay */}
          {isRecording && (
              <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
                  <div className="w-32 h-32 rounded-full bg-brand-500/20 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border border-brand-500 opacity-50 animate-ping"></div>
                      <div className="absolute inset-0 rounded-full border border-brand-400 opacity-30 animate-ping [animation-delay:0.5s]"></div>
                      <Mic className="w-12 h-12 text-brand-400 animate-pulse" />
                  </div>
                  <p className="mt-8 text-white font-mono tracking-widest text-sm animate-pulse">LISTENING...</p>
                  <p className="text-slate-500 text-xs mt-2">Release to Send</p>
                  
                  {/* Waveform Viz */}
                  <div className="flex items-center gap-1 h-8 mt-6">
                      {[...Array(10)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-brand-500 rounded-full animate-[bounce_1s_infinite]"
                            style={{ 
                                height: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.1}s` 
                            }}
                          ></div>
                      ))}
                  </div>
              </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 relative z-20">
            <div className="flex items-end gap-2">
              
              {/* Push to Talk Button */}
              <button
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onMouseLeave={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className="p-3 bg-slate-800 border border-slate-700 text-slate-400 rounded-xl hover:text-white hover:bg-slate-700 active:bg-brand-600 active:text-white active:border-brand-500 transition-all select-none"
              >
                 <Mic className="w-5 h-5" />
              </button>

              <div className="flex-1 relative">
                <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder={isRecording ? "Listening..." : "Execute command..."}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 placeholder:text-slate-600 font-mono resize-none"
                />
                <button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="absolute right-1.5 bottom-1.5 p-1.5 bg-brand-600/80 rounded-lg text-white disabled:opacity-50 disabled:bg-slate-800 hover:bg-brand-500 transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartAssistant;
