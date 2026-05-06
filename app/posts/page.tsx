'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data (será substituído por Supabase)
const MOCK_POSTS = [
  {
    id: '1',
    title: 'O Futuro dos Modelos de Linguagem de Larga Escala (LLMs)',
    slug: 'futuro-llms-2024',
    excerpt: 'Explorando como a arquitetura Transformer está evoluindo para modelos mais eficientes e especializados.',
    author: 'Equipe DataLab',
    date: '04 Mai, 2024',
    image: 'https://picsum.photos/seed/ai-llm/800/400',
    tags: ['IA', 'Research']
  },
  {
    id: '2',
    title: 'Engenharia de Dados em Nuvem: Desafios e Boas Práticas',
    slug: 'cloud-data-engineering',
    excerpt: 'Como construir pipelines de dados resilientes utilizando ferramentas modernas de orquestração.',
    author: 'Nucleo de Engenharia',
    date: '02 Mai, 2024',
    image: 'https://picsum.photos/seed/data-eng/800/400',
    tags: ['Dados', 'Cloud']
  }
];

export default function BlogListing() {
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MOCK_POSTS.map((post) => (
              <motion.article 
                key={post.id}
                whileHover={{ y: -10 }}
                className="card-bubble overflow-hidden flex flex-col group p-2"
              >
                <div className="aspect-[4/3] relative overflow-hidden rounded-[1.5rem]">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-brand-text shadow-xl">
                      {post.tags[0]}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4 flex-1 flex flex-col bg-white">
                  <div className="flex items-center gap-4 text-[10px] text-brand-text-dim font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2"><User size={12} className="text-brand-accent" /> {post.author}</span>
                    <span className="flex items-center gap-2"><Calendar size={12} className="text-brand-accent" /> {post.date}</span>
                  </div>
                  
                  <h2 className="text-2xl font-black text-brand-text leading-tight group-hover:text-brand-accent transition-colors">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h2>
                  
                  <p className="text-brand-text-dim text-sm font-medium line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="pt-4 mt-auto">
                    <Link 
                      href={`/posts/${post.slug}`}
                      className="w-12 h-12 rounded-full border border-brand-border flex items-center justify-center hover:bg-brand-text hover:text-white transition-all text-brand-text"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
