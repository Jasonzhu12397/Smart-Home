import React from 'react';
import { Cpu, LayoutDashboard, Workflow, Key, Settings, Server, Activity, FileText } from 'lucide-react';

interface SidebarProps {
  mode: 'CLIENT' | 'ADMIN';
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mode, activeTab, onTabChange }) => {
  
  const clientMenu = [
    { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'automations', icon: Workflow, label: 'Automations' },
    { id: 'keys', icon: Key, label: 'Wallet & Keys' },
  ];

  const adminMenu = [
    { id: 'overview', icon: Activity, label: 'Cluster Status' },
    { id: 'nodes', icon: Server, label: 'Edge Nodes' },
    { id: 'logs', icon: FileText, label: 'System Logs' },
    { id: 'settings', icon: Settings, label: 'Configuration' },
  ];

  const menu = mode === 'CLIENT' ? clientMenu : adminMenu;

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-72 glass-panel border-r border-slate-800 z-30">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <div className="relative">
            <Cpu className={`w-8 h-8 ${mode === 'ADMIN' ? 'text-red-500' : 'text-brand-400'}`} />
            <div className={`absolute inset-0 blur-lg opacity-40 ${mode === 'ADMIN' ? 'bg-red-500' : 'bg-brand-400'}`}></div>
          </div>
          <span className="tracking-tighter">
            {mode === 'CLIENT' ? (
              <>SMART<span className="text-brand-400">HOME</span></>
            ) : (
              <>KUBE<span className="text-red-500">ADMIN</span></>
            )}
          </span>
        </h1>
        <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-widest pl-11">
          {mode === 'CLIENT' ? 'Personal Client' : 'Server Control'}
        </p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menu.map((item) => (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
              activeTab === item.id 
                ? 'text-white shadow-lg shadow-white/5 bg-white/5' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {activeTab === item.id && (
              <div className={`absolute inset-0 bg-gradient-to-r opacity-100 border-l-2 ${
                mode === 'ADMIN' 
                ? 'from-red-500/20 to-transparent border-red-500' 
                : 'from-brand-500/20 to-transparent border-brand-400'
              }`}></div>
            )}
            <item.icon className={`w-5 h-5 z-10 ${
              activeTab === item.id 
                ? (mode === 'ADMIN' ? 'text-red-400' : 'text-brand-400')
                : 'text-slate-500 group-hover:text-slate-300'
            }`} />
            <span className="z-10">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer for Sidebar */}
      <div className="p-6 border-t border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center font-bold text-xs text-white">
            JD
          </div>
          <div>
            <p className="text-xs font-bold text-white">John Doe</p>
            <p className="text-[10px] text-slate-500">{mode === 'CLIENT' ? 'Home Owner' : 'SysAdmin'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;