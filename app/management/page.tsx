'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  Plus, 
  LogOut, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_STATS = [
  { label: 'Visualizações Totais', value: '1.2M', change: '+12.5%', icon: Eye },
  { label: 'Engajamento', value: '84.2k', change: '+4.2%', icon: Users },
  { label: 'Tempo Médio', value: '4m 12s', change: '-0.8%', icon: Clock },
  { label: 'Compartilhamentos', value: '12.4k', change: '+18.9%', icon: ExternalLink },
];

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [actionUnavailable, setActionUnavailable] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-brand-border sticky top-0 h-screen flex flex-col p-8 hidden lg:flex">
        <div className="mb-12 px-2">
          <div className="w-12 h-12 bg-brand-text rounded-2xl flex items-center justify-center font-black text-white text-2xl mb-4 shadow-xl">D</div>
          <h1 className="text-2xl font-black text-brand-text tracking-tight">Admin OS</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Overview', icon: BarChart3 },
            { id: 'posts', label: 'Journal', icon: FileText },
            { id: 'members', label: 'Network', icon: Users },
            { id: 'settings', label: 'System', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${
                activeTab === item.id 
                  ? 'bg-brand-text text-white shadow-xl shadow-brand-text/10 scale-105' 
                  : 'text-brand-text-dim hover:bg-brand-bg hover:text-brand-text'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-brand-border space-y-6">
          <button 
            onClick={() => setShowNewPostModal(true)}
            className="w-full py-5 bg-brand-accent text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl transition-all"
          >
            <Plus size={20} /> Create Post
          </button>
          
          <div className="flex items-center gap-4 p-4 bg-brand-bg rounded-[2rem] border border-brand-border">
            <div className="w-10 h-10 rounded-xl bg-brand-text flex items-center justify-center font-black text-white text-xs">AR</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black text-brand-text truncate">Adm Datalab</p>
              <p className="text-[10px] font-bold text-brand-text-dim uppercase tracking-widest">Master</p>
            </div>
            <Link href="/login" className="text-brand-text-dim hover:text-brand-text transition-colors">
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto text-brand-text">
        <header className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-accent mb-3">
              Operational Center
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none border-l-8 border-brand-accent pl-8">{activeTab} View.</h2>
          </div>
          <div className="flex gap-4">
             <div className="white-card px-6 py-4 rounded-2xl border border-brand-border flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-dim bg-white shadow-xl">
                <Clock size={16} className="text-brand-accent" /> May 05, 2026
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-16">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="col-span-full p-16 text-center">
                <p className="text-brand-text-dim text-lg font-medium">Nenhum dado disponível no momento.</p>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-[3rem] border border-brand-border overflow-hidden shadow-sm">
               <div className="p-8 border-b border-brand-border flex flex-col md:flex-row justify-between items-center gap-6 bg-brand-bg/20">
                  <h3 className="text-2xl font-black tracking-tight">Recent Activity</h3>
                  <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-dim" />
                      <input 
                        type="text" 
                        placeholder="Search engine..." 
                        className="w-full md:w-72 bg-white border border-brand-border rounded-2xl pl-12 pr-5 py-4 text-xs font-bold outline-none focus:border-brand-accent transition-all shadow-inner"
                      />
                    </div>
                  </div>
               </div>
               
               <div className="overflow-x-auto p-8 text-center">
                  <p className="text-brand-text-dim text-lg font-medium">Nenhuma atividade no momento.</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-24 h-24 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center">
              <FileText size={48} />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-black text-brand-text">Journal</h3>
              <p className="text-brand-text-dim text-lg font-medium">Funcionalidade disponível em breve.</p>
            </div>
          </div>
        )}

        {/* Member and Settings tabs updated for light mode */}
        {activeTab === 'members' && (
          <div className="space-y-10 max-w-5xl">
            <div className="bg-white rounded-[2.5rem] border border-brand-border p-10 flex justify-between items-center shadow-sm">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-brand-text rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                    <Users size={36} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">Active Queue</h3>
                    <p className="text-sm font-bold text-brand-text-dim mt-1 uppercase tracking-widest">Prospect management pool</p>
                  </div>
               </div>
               <button onClick={() => setShowExportModal(true)} className="px-10 py-5 bg-brand-text text-white font-black rounded-2xl hover:bg-brand-accent transition-all">Export Data</button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-brand-border overflow-hidden shadow-sm p-4">
               <table className="w-full text-left">
                 <thead>
                    <tr>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-brand-text/30">Name</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-brand-text/30">Identity</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-brand-text/30">Field</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-brand-text/30 text-right">Timestamp</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <p className="text-brand-text-dim text-lg font-medium">Nenhum membro no momento.</p>
                      </td>
                    </tr>
                 </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-16">
            <section className="space-y-8">
               <h3 className="text-3xl font-black tracking-tight flex items-center gap-4">
                 <span className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent"><Users size={24} /></span>
                 Access Control
               </h3>
               <div className="bg-white p-10 rounded-[3rem] border border-brand-border shadow-sm space-y-8">
                  <div className="flex gap-4">
                    <input className="flex-1 bg-brand-bg border border-brand-border rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-brand-accent" placeholder="new-admin@datalab.tech" />
                    <button onClick={() => setShowAccessModal(true)} className="px-10 py-5 bg-brand-text text-white font-black rounded-2xl hover:bg-brand-accent transition-all">Grant Access</button>
                  </div>
                  <div className="space-y-3">
                    <p className="text-brand-text-dim text-lg font-medium">Nenhum administrador registrado.</p>
                  </div>
               </div>
            </section>
          </div>
        )}
      </main>

      {/* New Post Modal updated for light mode */}
      <AnimatePresence>
        {showNewPostModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewPostModal(false)}
              className="absolute inset-0 bg-brand-text/20 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[3.5rem] p-12 shadow-2xl border border-brand-border overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-3xl" />
              
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-4xl font-black tracking-tighter">Draft Insight.</h3>
                <button 
                  onClick={() => {
                    setShowNewPostModal(false);
                    setActionUnavailable(false);
                  }} 
                  className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center text-brand-text hover:bg-brand-accent hover:text-white transition-all"
                >
                  <Plus size={28} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/30 ml-2">Title</label>
                    <input type="text" className="w-full bg-brand-bg border border-brand-border rounded-2xl p-5 outline-none focus:border-brand-accent transition-all font-black text-xl tracking-tight" placeholder="Headline here..." />
                 </div>
                 
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/30 ml-2">Structured Content (Markdown)</label>
                    <textarea rows={8} className="w-full bg-brand-bg border border-brand-border rounded-2xl p-6 outline-none focus:border-brand-accent transition-all resize-none font-medium text-sm leading-relaxed" placeholder="Detailed analysis and markdown supported..." />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setActionUnavailable(true)}
                      className={`flex-1 py-5 font-black rounded-2xl shadow-xl transition-all ${
                        actionUnavailable 
                        ? 'bg-red-500 text-white shadow-red-500/20 cursor-not-allowed' 
                        : 'bg-brand-text text-white shadow-brand-text/20 hover:bg-brand-accent'
                      }`}
                    >
                      {actionUnavailable ? 'Indisponível' : 'Deploy to Journal'}
                    </button>
                    <button 
                      onClick={() => setActionUnavailable(true)}
                      className={`px-10 py-5 font-black rounded-2xl border transition-all ${
                        actionUnavailable 
                        ? 'bg-red-50 border-red-200 text-red-500 cursor-not-allowed' 
                        : 'bg-white border-brand-border text-brand-text hover:border-brand-text'
                      }`}
                    >
                      {actionUnavailable ? 'Indisponível' : 'Save as Draft'}
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAccessModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccessModal(false)}
              className="absolute inset-0 bg-brand-text/20 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] p-12 shadow-2xl border border-brand-border overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-3xl" />
              
              <div className="flex justify-between items-center mb-12 relative z-10">
                <h3 className="text-4xl font-black tracking-tighter">Grant Access.</h3>
                <button onClick={() => setShowAccessModal(false)} className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center text-brand-text hover:bg-brand-accent hover:text-white transition-all">
                  <Plus size={28} className="rotate-45" />
                </button>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center py-16 space-y-6">
                <div className="w-20 h-20 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center">
                  <Users size={40} />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-brand-text">Funcionalidade em Desenvolvimento</h3>
                  <p className="text-brand-text-dim mt-3 font-medium text-lg">Funcionalidade disponível em breve.</p>
                  <p className="text-brand-text-dim mt-4 text-sm font-medium">Em breve você poderá gerenciar usuários e integrar com o Supabase Auth.</p>
                </div>
                <button 
                  onClick={() => setShowAccessModal(false)}
                  className="mt-6 px-10 py-3 bg-brand-text text-white font-black rounded-2xl hover:bg-brand-accent transition-all"
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showExportModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExportModal(false)}
              className="absolute inset-0 bg-brand-text/20 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] p-12 shadow-2xl border border-brand-border overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/5 rounded-full blur-3xl" />
              
              <div className="flex justify-between items-center mb-12 relative z-10">
                <h3 className="text-4xl font-black tracking-tighter">Export Data.</h3>
                <button onClick={() => setShowExportModal(false)} className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center text-brand-text hover:bg-brand-accent hover:text-white transition-all">
                  <Plus size={28} className="rotate-45" />
                </button>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center py-16 space-y-6">
                <div className="w-20 h-20 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center">
                  <FileText size={40} />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-brand-text">Funcionalidade em Desenvolvimento</h3>
                  <p className="text-brand-text-dim mt-3 font-medium text-lg">Funcionalidade disponível em breve.</p>
                  <p className="text-brand-text-dim mt-4 text-sm font-medium">Em breve você poderá exportar os dados dos membros em diferentes formatos.</p>
                </div>
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="mt-6 px-10 py-3 bg-brand-text text-white font-black rounded-2xl hover:bg-brand-accent transition-all"
                >
                  Entendi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}