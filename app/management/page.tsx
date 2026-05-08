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
  ExternalLink,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Post states
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // List states
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar posts:', err.message || err);
    } finally {
      setLoadingPosts(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPostError('A imagem deve ter menos de 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (status: 'published' | 'draft') => {
    if (!postTitle || !postContent) {
      setPostError('Por favor, preencha o título e o conteúdo.');
      return;
    }

    setSubmitting(true);
    setPostError(null);

    try {
      let imageUrl = null;

      // 0. Get session for auth
      const { data: { session } } = await supabase.auth.getSession();

      // 1. Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      // 2. Create post
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
        },
        body: JSON.stringify({ 
          title: postTitle, 
          content: postContent,
          image_url: imageUrl,
          status 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar postagem');
      }

      // Success
      setPostTitle('');
      setPostContent('');
      setImageFile(null);
      setImagePreview(null);
      setShowNewPostModal(false);
      fetchPosts(); // Atualiza a lista após criar
      setShowSuccessModal(true);
    } catch (err) {
      setPostError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
    } finally {
      setSubmitting(false);
    }
  };

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
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden mt-4 text-brand-text">
              <Menu size={24} />
            </button>
          </div>
          <div className="flex gap-4">
             <div className="white-card px-6 py-4 rounded-2xl border border-brand-border flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-brand-text-dim bg-white shadow-xl">
                <Clock size={16} className="text-brand-accent" /> May 05, 2026
             </div>
          </div>
        </header>

        {menuOpen && (
          <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center lg:hidden">
            <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 text-brand-text">
              <X size={24} />
            </button>
            <nav className="space-y-4">
              {[
                { id: 'dashboard', label: 'Overview', icon: BarChart3 },
                { id: 'posts', label: 'Journal', icon: FileText },
                { id: 'members', label: 'Network', icon: Users },
                { id: 'settings', label: 'System', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMenuOpen(false); }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-lg uppercase tracking-widest ${
                    activeTab === item.id 
                      ? 'bg-brand-text text-white shadow-xl' 
                      : 'text-brand-text-dim hover:bg-brand-bg hover:text-brand-text'
                  }`}
                >
                  <item.icon size={24} />
                  {item.label}
                </button>
              ))}
            </nav>
            <button 
              onClick={() => { setShowNewPostModal(true); setMenuOpen(false); }}
              className="mt-8 px-8 py-4 bg-brand-accent text-white font-black rounded-2xl flex items-center gap-3"
            >
              <Plus size={20} /> Create Post
            </button>
          </div>
        )}

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
          <div className="space-y-10">
            <div className="bg-white rounded-[2.5rem] border border-brand-border p-10 flex justify-between items-center shadow-sm">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-brand-accent/10 rounded-[1.5rem] flex items-center justify-center text-brand-accent shadow-xl">
                    <FileText size={36} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">Journal Entries</h3>
                    <p className="text-sm font-bold text-brand-text-dim mt-1 uppercase tracking-widest">Content Management System</p>
                  </div>
               </div>
               <button 
                onClick={() => setShowNewPostModal(true)} 
                className="px-10 py-5 bg-brand-text text-white font-black rounded-2xl hover:bg-brand-accent transition-all flex items-center gap-2"
               >
                <Plus size={20} /> Create New
               </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-brand-border shadow-sm p-4 overflow-x-auto">
               <table className="w-full text-left font-bold min-w-[600px]">
                 <thead>
                    <tr className="border-b border-brand-border/50">
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-brand-text/30">Post Title</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-brand-text/30">Status</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-brand-text/30">Created At</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-brand-text/30 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {loadingPosts ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <Loader2 className="animate-spin mx-auto text-brand-accent mb-4" size={32} />
                          <p className="text-brand-text-dim text-sm font-bold uppercase tracking-widest">Sincronizando banco de dados...</p>
                        </td>
                      </tr>
                    ) : posts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-brand-text-dim">
                          Nenhum post encontrado. Comece criando um novo!
                        </td>
                      </tr>
                    ) : (
                      posts.map((post) => (
                        <tr key={post.id} className="group hover:bg-brand-bg/50 transition-colors border-b border-brand-border/30 last:border-0 text-sm">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              {post.image_url && (
                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-brand-bg border border-brand-border">
                                  <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <p className="font-black text-brand-text tracking-tight truncate max-w-xs">{post.title}</p>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              post.published 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-500'
                            }`}>
                              {post.published ? (
                                <><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Published</>
                              ) : (
                                <><div className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Draft</>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-xs text-brand-text-dim">
                            {new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-white rounded-lg text-brand-text-dim hover:text-brand-accent transition-all shadow-sm">
                                <Edit2 size={16} />
                              </button>
                              <button className="p-2 hover:bg-white rounded-lg text-brand-text-dim hover:text-red-500 transition-all shadow-sm">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                 </tbody>
               </table>
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

            <div className="bg-white rounded-[2.5rem] border border-brand-border shadow-sm p-4 overflow-x-auto">
               <table className="w-full text-left min-w-[600px]">
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
                    setPostError(null);
                  }} 
                  className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center text-brand-text hover:bg-brand-accent hover:text-white transition-all"
                >
                  <Plus size={28} className="rotate-45" />
                </button>
              </div>

              {postError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center">
                  {postError}
                </div>
              )}

              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/30 ml-2">Title</label>
                    <input 
                      type="text" 
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-border rounded-2xl p-5 outline-none focus:border-brand-accent transition-all font-black text-xl tracking-tight" 
                      placeholder="Headline here..." 
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/30 ml-2">Capa do Post</label>
                    <div className="relative group">
                      {imagePreview ? (
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-brand-border">
                           <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                           <button 
                             onClick={() => {
                               setImageFile(null);
                               setImagePreview(null);
                             }}
                             className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all z-20"
                           >
                             <X size={16} />
                           </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-48 bg-brand-bg border-2 border-dashed border-brand-border rounded-2xl cursor-pointer hover:border-brand-accent transition-all">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-brand-text-dim">
                            <Upload size={32} className="mb-3" />
                            <p className="text-xs font-black uppercase tracking-widest">Upload Image</p>
                            <p className="text-[10px] mt-2">PNG, JPG ou WEBP (Max. 5MB)</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/30 ml-2">Structured Content (Markdown)</label>
                    <textarea 
                      rows={8} 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-border rounded-2xl p-6 outline-none focus:border-brand-accent transition-all resize-none font-medium text-sm leading-relaxed" 
                      placeholder="Detailed analysis and markdown supported..." 
                    />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => handleCreatePost('published')}
                      disabled={submitting}
                      className="flex-1 py-5 bg-brand-text text-white font-black rounded-2xl shadow-xl shadow-brand-text/20 hover:bg-brand-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Aguarde...' : 'Deploy to Journal'}
                    </button>
                    <button 
                      onClick={() => handleCreatePost('draft')}
                      disabled={submitting}
                      className="px-10 py-5 bg-white border border-brand-border text-brand-text font-black rounded-2xl hover:border-brand-text transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? '...' : 'Save as Draft'}
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

        {showSuccessModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-brand-text/40 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl border border-brand-border text-center overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight text-brand-text">Sucesso!</h3>
                  <p className="text-brand-text-dim font-medium">Sua postagem foi processada e salva com sucesso no banco de dados.</p>
                </div>
                
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 bg-brand-text text-white font-black rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-brand-text/10"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}