import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Mic, Bot } from 'lucide-react';
import { ChatMessage, SmartDevice } from '../types';
import { getHomeInsights } from '../services/geminiService';

interface GeminiChatProps {
  devices: SmartDevice[];
}

const GeminiChat: React.FC<GeminiChatProps> = ({ devices }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "System Online. I am your KubeEdge Assistant. Awaiting commands.",
      timestamp: Date.now()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await getHomeInsights(devices, input);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
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
        <div className="fixed bottom-0 right-0 w-full md:w-[400px] md:bottom-24 md:right-8 z-50 h-[85vh] md:h-[600px] flex flex-col bg-slate-950/95 backdrop-blur-xl md:rounded-2xl border border-brand-900/50 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden ring-1 ring-brand-500/20">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-brand-500/10 rounded-lg border border-brand-500/20">
                 <Bot className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm font-mono tracking-wide">GEMINI CORE</h3>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  CONNECTED
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-slate-950 to-slate-900 scrollbar-thin scrollbar-thumb-slate-700">
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
                  {msg.role === 'model' && <span className="text-[10px] font-mono text-brand-500 block mb-1 opacity-70">AI_RESPONSE_LOG</span>}
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

          {/* Input Area */}
          <div className="p-4 bg-slate-900/90 border-t border-slate-800">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Execute command..."
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 placeholder:text-slate-600 font-mono"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-1.5 p-2 bg-brand-600/80 rounded-lg text-white disabled:opacity-50 disabled:bg-slate-800 hover:bg-brand-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChat;