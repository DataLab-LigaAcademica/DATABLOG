'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 px-6 py-6 pointer-events-none">
        <nav className="max-w-4xl mx-auto glass rounded-full px-6 py-3 border border-white/40 shadow-xl flex justify-between items-center pointer-events-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-text rounded-lg flex items-center justify-center font-bold text-white text-lg transition-transform group-hover:scale-110">D</div>
            <span className="text-lg font-bold tracking-tight text-brand-text">Data<span className="text-brand-accent">Lab</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-brand-text-dim">
            <Link href="/" className="hover:text-brand-accent transition-colors">Início</Link>
            <Link href="/#nucleos" className="hover:text-brand-accent transition-colors">Núcleos</Link>
            <Link href="/posts" className="hover:text-brand-accent transition-colors">Blog</Link>
            <Link href="/login" className="px-5 py-2 bg-brand-text text-white rounded-full hover:bg-brand-accent transition-all">Login</Link>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-brand-text">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>
      {isOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-40 flex flex-col items-center justify-center md:hidden">
          <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-brand-text">
            <X size={24} />
          </button>
          <div className="flex flex-col items-center gap-8 text-lg font-bold uppercase tracking-widest text-brand-text-dim">
            <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-brand-accent transition-colors">Início</Link>
            <Link href="/#nucleos" onClick={() => setIsOpen(false)} className="hover:text-brand-accent transition-colors">Núcleos</Link>
            <Link href="/posts" onClick={() => setIsOpen(false)} className="hover:text-brand-accent transition-colors">Blog</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="px-5 py-2 bg-brand-text text-white rounded-full hover:bg-brand-accent transition-all">Login</Link>
          </div>
        </div>
      )}
    </>
  );
};
