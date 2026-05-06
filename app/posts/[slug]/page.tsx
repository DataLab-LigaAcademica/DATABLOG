'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useParams } from 'next/navigation';
import { Calendar, User, Clock, Share2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

// Mock Post Data
const MOCK_POST = {
  title: 'O Futuro dos Modelos de Linguagem de Larga Escala (LLMs)',
  content: `
# Inteligência Artificial em 2024

A evolução dos **Modelos de Linguagem de Larga Escala (LLMs)** tem sido o motor principal da inovação tecnológica recente. No DataLab, estamos focados em entender como essas arquiteturas podem ser otimizadas para aplicações específicas e éticas.

## Arquiteturas Transformers

A arquitetura original dos Transformers, introduzida pelo Google em 2017, passou por refinamentos drásticos. Hoje, técnicas como *Attention Over Window* e *Sparse MoE (Mixture of Experts)* permitem que modelos com trilhões de parâmetros rodem com uma fração do custo computacional.

### O Papel do DataLab

Nossa pesquisa atual foca em:
1. **Eficiência**: Menos parâmetros, mais inteligência.
2. **Contexto**: Janelas de contexto de milhões de tokens.
3. **Multimodalidade**: Integração nativa de visão e áudio.

O futuro é promissor e os dados são o combustível dessa revolução.
  `,
  author: 'Dr. Alex Rivera',
  author_avatar: 'AR',
  date: '04 Mai, 2024',
  read_time: '12 min',
  image: 'https://picsum.photos/seed/ai-future/1200/600',
  tags: ['IA', 'Pesquisa', 'Futuro']
};

export default function PostDetail() {
  const params = useParams();
  const slug = params.slug;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Navbar />

      <main className="flex-1 pt-48 pb-24 px-6 text-brand-text">
        <article className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <header className="space-y-10">
            <Link href="/posts" className="inline-flex items-center gap-3 text-brand-text text-xs font-black uppercase tracking-widest hover:text-brand-accent transition-colors group">
              <span className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center group-hover:bg-brand-text group-hover:text-white transition-all"><ArrowLeft size={16} /></span> Voltar
            </Link>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                {MOCK_POST.tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 bg-brand-accent/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-accent">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-brand-text">
                {MOCK_POST.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-8 py-10 border-y border-brand-border">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-brand-text text-white flex items-center justify-center font-black text-xl shadow-xl">
                  {MOCK_POST.author_avatar}
                </div>
                <div>
                  <p className="text-lg font-black text-brand-text leading-none">{MOCK_POST.author}</p>
                  <p className="text-xs font-bold text-brand-text-dim mt-1">Pesquisador Principal @ DataLab</p>
                </div>
              </div>

              <div className="flex items-center gap-8 text-[10px] font-black text-brand-text/40 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-3"><Calendar size={16} className="text-brand-accent" /> {MOCK_POST.date}</span>
                 <span className="flex items-center gap-3"><Clock size={16} className="text-brand-accent" /> {MOCK_POST.read_time}</span>
              </div>
            </div>
          </header>

          {/* Feature Image */}
          <div className="relative aspect-[21/9] rounded-[3.5rem] overflow-hidden shadow-2xl border border-brand-border bg-white p-2">
             <div className="w-full h-full rounded-[3rem] overflow-hidden">
               <Image 
                src={MOCK_POST.image} 
                alt={MOCK_POST.title} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
               />
             </div>
          </div>

          {/* Content */}
          <div className="markdown-body max-w-3xl mx-auto">
            <ReactMarkdown>{MOCK_POST.content}</ReactMarkdown>
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
