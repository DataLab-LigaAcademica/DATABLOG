'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, User, Clock, Share2, ArrowLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        // Tenta buscar com o join
        const { data, error } = await supabase
          .from('posts')
          .select('*, authors(name, avatar_url)')
          .eq('slug', slug)
          .single();

        if (error) {
          // Se for erro de relação (PGRST200), tenta sem o join
          if (error.code === 'PGRST200') {
            console.warn('Relação authors não encontrada. Buscando post sem autor...');
            const { data: simpleData, error: simpleError } = await supabase
              .from('posts')
              .select('*')
              .eq('slug', slug)
              .single();
            
            if (simpleError) throw simpleError;
            setPost(simpleData);
            return;
          }
          throw error;
        }

        if (!data) {
          router.push('/posts');
          return;
        }
        setPost(data);
      } catch (err: any) {
        console.error('Erro ao buscar post:', err.message || err);
        router.push('/posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent mb-4" size={48} />
        <p className="text-brand-text-dim text-xs font-black uppercase tracking-widest">Sincronizando Conteúdo...</p>
      </div>
    );
  }

  if (!post) return null;

  // Estimar tempo de leitura
  const wordsPerMinute = 200;
  const textLength = post.content.split(/\s+/).length;
  const readTime = Math.ceil(textLength / wordsPerMinute);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 md:pt-48 pb-24 px-6 text-brand-text">
        <article className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <header className="space-y-10">
            <Link href="/posts" className="inline-flex items-center gap-3 text-brand-text text-xs font-black uppercase tracking-widest hover:text-brand-accent transition-colors group">
              <span className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center group-hover:bg-brand-text group-hover:text-white transition-all"><ArrowLeft size={16} /></span> Voltar
            </Link>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-brand-accent/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-accent">
                  Article
                </span>
                {post.published && (
                  <span className="px-4 py-1.5 bg-green-100 rounded-full text-[10px] font-black uppercase tracking-widest text-green-600 border border-green-200">
                    Verified
                  </span>
                )}
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-brand-text">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-8 py-10 border-y border-brand-border">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-brand-text text-white flex items-center justify-center font-black text-xl shadow-xl">
                  {post.authors?.name?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div>
                  <p className="text-lg font-black text-brand-text leading-none">{post.authors?.name || 'Administrador'}</p>
                  <p className="text-xs font-bold text-brand-text-dim mt-1">Research Author @ DataLab</p>
                </div>
              </div>

              <div className="flex items-center gap-8 text-[10px] font-black text-brand-text/40 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-3"><Calendar size={16} className="text-brand-accent" /> {new Date(post.created_at).toLocaleDateString()}</span>
                 <span className="flex items-center gap-3"><Clock size={16} className="text-brand-accent" /> {readTime} min read</span>
              </div>
            </div>
          </header>

          {/* Feature Image */}
          {post.image_url && (
            <div className="relative aspect-[21/9] rounded-[3.5rem] overflow-hidden shadow-2xl border border-brand-border bg-white p-2">
               <div className="w-full h-full rounded-[3rem] overflow-hidden">
                 <Image 
                  src={post.image_url} 
                  alt={post.title} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                 />
               </div>
            </div>
          )}

          {/* Content */}
          <div className="markdown-body max-w-3xl mx-auto">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Share */}
          <footer className="pt-16 border-t border-brand-border flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black uppercase tracking-widest text-brand-text-dim">Spread the word:</span>
               <div className="flex gap-3">
                 {[1,2,3].map(i => (
                    <button key={i} className="w-12 h-12 glass rounded-full border border-brand-border flex items-center justify-center hover:bg-brand-text hover:text-white transition-all text-brand-text">
                      <Share2 size={18} />
                    </button>
                 ))}
               </div>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">End of Insight</p>
              <p className="text-xs font-bold text-brand-text-dim mt-1 italic">Knowledge is power. Share responsibly.</p>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}
