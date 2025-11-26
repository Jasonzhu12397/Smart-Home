import React, { useState } from 'react';
import { Server, Activity, Terminal, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { NodeStatus, SystemLog } from '../types';
import Sidebar from './Sidebar';

// Mock Data for Admin
const mockNodes: NodeStatus[] = [
  { name: 'master-node-01', role: 'Cloud', status: 'Ready', cpu: '12%', memory: '45%', lastHeartbeat: '2s ago' },
  { name: 'edge-node-livingroom', role: 'Edge', status: 'Ready', cpu: '5%', memory: '18%', lastHeartbeat: '50ms ago' },
  { name: 'edge-node-garage', role: 'Edge', status: 'NotReady', cpu: '-', memory: '-', lastHeartbeat: '5m ago' },
];

const mockLogs: SystemLog[] = [
  { id: '1', level: 'INFO', component: 'cloudcore', message: 'Syncing device status to edge-node-livingroom', timestamp: '10:00:01' },
  { id: '2', level: 'INFO', component: 'mqtt-broker', message: 'Client connected: device-id-ax99', timestamp: '10:00:05' },
  { id: '3', level: 'WARN', component: 'edgecore', message: 'High latency detected on device id:4', timestamp: '10:05:22' },
  { id: '4', level: 'ERROR', component: 'mapper', message: 'Failed to read sensor data register 0x04', timestamp: '10:06:10' },
  { id: '5', level: 'INFO', component: 'auth', message: 'Admin user logged in via web console', timestamp: '10:12:00' },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-dark-950 text-slate-200 font-sans md:pl-72 relative">
       {/* Reusable Sidebar in Admin Mode */}
       <Sidebar mode="ADMIN" activeTab={activeTab} onTabChange={setActiveTab} />
       
       <main className="p-8 max-w-[1600px] mx-auto space-y-8">
         <header className="flex justify-between items-center border-b border-slate-800 pb-6">
           <div>
             <h2 className="text-2xl font-bold text-white">Cluster Control Plane</h2>
             <p className="text-slate-500 font-mono text-xs mt-1">KubeEdge v1.15.1 | Cluster ID: k8s-home-prod</p>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-mono text-emerald-500">SYSTEM ONLINE</span>
           </div>
         </header>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
               <div className="flex justify-between mb-2">
                 <Server className="text-indigo-400 w-5 h-5" />
                 <span className="text-xs text-slate-500">NODES</span>
               </div>
               <p className="text-2xl font-mono font-bold">3/3</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
               <div className="flex justify-between mb-2">
                 <Activity className="text-emerald-400 w-5 h-5" />
                 <span className="text-xs text-slate-500">API LATENCY</span>
               </div>
               <p className="text-2xl font-mono font-bold">12ms</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
               <div className="flex justify-between mb-2">
                 <AlertCircle className="text-orange-400 w-5 h-5" />
                 <span className="text-xs text-slate-500">WARNINGS</span>
               </div>
               <p className="text-2xl font-mono font-bold">1</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
               <div className="flex justify-between mb-2">
                 <Clock className="text-brand-400 w-5 h-5" />
                 <span className="text-xs text-slate-500">UPTIME</span>
               </div>
               <p className="text-2xl font-mono font-bold">14d 2h</p>
            </div>
         </div>

         {/* Node List */}
         <div className="bg-slate-900/40 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
               <Server className="w-4 h-4 text-slate-400" />
               <h3 className="text-sm font-bold text-white">Node Status</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-950/50 text-slate-400 font-mono text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Node Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">CPU</th>
                    <th className="px-6 py-4">Memory</th>
                    <th className="px-6 py-4">Heartbeat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockNodes.map((node) => (
                    <tr key={node.name} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-white">{node.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] border ${node.role === 'Cloud' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-brand-500/10 border-brand-500/30 text-brand-400'}`}>
                          {node.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {node.status === 'Ready' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                          <span className={node.status === 'Ready' ? 'text-emerald-400' : 'text-red-400'}>{node.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono">{node.cpu}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono">{node.memory}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{node.lastHeartbeat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>

         {/* System Logs */}
         <div className="bg-black/40 rounded-2xl border border-slate-800 font-mono text-xs overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-slate-400" />
                 <h3 className="text-sm font-bold text-white">System Logs</h3>
               </div>
               <span className="text-slate-500 animate-pulse">Live</span>
            </div>
            <div className="p-4 space-y-2 h-64 overflow-y-auto">
               {mockLogs.map(log => (
                 <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded">
                    <span className="text-slate-600 w-20 shrink-0">{log.timestamp}</span>
                    <span className={`w-16 shrink-0 font-bold ${log.level === 'INFO' ? 'text-blue-400' : log.level === 'WARN' ? 'text-yellow-400' : 'text-red-500'}`}>
                      {log.level}
                    </span>
                    <span className="text-indigo-300 w-24 shrink-0">[{log.component}]</span>
                    <span className="text-slate-300">{log.message}</span>
                 </div>
               ))}
               <div className="flex gap-4 p-1 animate-pulse opacity-50">
                 <span className="text-slate-600">_</span>
               </div>
            </div>
         </div>

       </main>
    </div>
  );
};

export default AdminDashboard;