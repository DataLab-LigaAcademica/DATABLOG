'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/management');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-brand-border relative overflow-hidden"
        >
          <div className="text-center space-y-4 mb-12">
            <div className="w-20 h-20 bg-brand-bg rounded-3xl flex items-center justify-center text-brand-text mx-auto mb-6 border border-brand-border shadow-inner">
              <Lock size={36} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-brand-text">Admin Portal</h1>
            <p className="text-brand-text-dim text-sm font-medium">Acesso restrito para o núcleo DataLab</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 ml-1">E-mail Address</label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-dim group-focus-within:text-brand-accent transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 transition-all text-sm font-medium"
                  placeholder="admin@datalab.tech"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40">Password</label>
                <button type="button" className="text-[10px] text-brand-accent font-black uppercase tracking-widest hover:underline">Reset</button>
              </div>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-dim group-focus-within:text-brand-accent transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl py-4 pl-14 pr-14 outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/5 transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-text-dim hover:text-brand-text transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-brand-text text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-accent active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-10 shadow-xl shadow-brand-text/10"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Authenticate"}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-brand-border text-center">
            <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim hover:text-brand-text transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={14} /> Voltar ao site público
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}