'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
            <div className="col-span-full p-16 text-center">
              <p className="text-brand-text-dim text-lg font-medium">Nenhum post disponível no momento.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
