'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, User, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function BlogListing() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Tenta buscar com o join
        const { data, error } = await supabase
          .from('posts')
          .select('*, authors(name, avatar_url)')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) {
          // Se for erro de relação (PGRST200), tenta sem o join
          if (error.code === 'PGRST200') {
            console.warn('Relação authors não encontrada. Buscando posts sem autor...');
            const { data: simpleData, error: simpleError } = await supabase
              .from('posts')
              .select('*')
              .eq('published', true)
              .order('created_at', { ascending: false });
            
            if (simpleError) throw simpleError;
            setPosts(simpleData || []);
            return;
          }
          throw error;
        }
        setPosts(data || []);
      } catch (err: any) {
        console.error('Erro ao buscar posts:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-40 pb-24 px-6 text-brand-text">
        <div className="max-w-7xl mx-auto space-y-16">
          <header className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-accent">
              Knowledge Base
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] mb-4">Data<span className="text-brand-accent">Blog</span></h1>
            <p className="text-brand-text-dim text-xl font-medium leading-relaxed">
              Pesquisas científicas, avanços técnicos e insights dos núcleos de inteligência do DataLab.
            </p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="animate-spin text-brand-accent" size={48} />
              <p className="text-sm font-bold text-brand-text-dim uppercase tracking-widest">Sincronizando Insights...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-brand-border rounded-[3rem] bg-white">
              <p className="text-brand-text-dim text-lg font-medium">Nenhum post publicado no momento.</p>
              <p className="text-xs font-bold text-brand-text-dim/50 uppercase tracking-widest mt-2">Fique ligado para novas atualizações.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={post.id}
                  className="group bg-white rounded-[2.5rem] border border-brand-border p-4 hover:border-brand-accent hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <Link href={`/posts/${post.slug}`} className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 bg-brand-bg block">
                    {post.image_url ? (
                      <Image 
                        src={post.image_url} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-border">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </Link>

                  <div className="px-4 space-y-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-text/40">
                      <span className="flex items-center gap-2">
                        <Calendar size={12} className="text-brand-accent" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black tracking-tight group-hover:text-brand-accent transition-colors">
                      <Link href={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-brand-text-dim font-medium leading-relaxed line-clamp-3">
                      {post.content.replace(/[#*`]/g, '').substring(0, 150)}...
                    </p>

                    <div className="pt-6 mt-auto border-t border-brand-border flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-text text-white flex items-center justify-center font-black text-[10px]">
                          {post.authors?.name?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-text">
                          {post.authors?.name || 'Datalab Adm'}
                        </span>
                      </div>
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center text-brand-text group-hover:bg-brand-accent group-hover:border-brand-accent group-hover:text-white transition-all"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
