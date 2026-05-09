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
            <Link href="/" className="hover:text-brand-accent transition-colors">Mini-cursos</Link>
            <Link href="/" className="hover:text-brand-accent transition-colors">Início</Link>
            <a href="/#nucleos" className="hover:text-brand-accent transition-colors">Núcleos</a>
            <Link href="/posts" className="hover:text-brand-accent transition-colors">Blog</Link>
            <Link href="/login" className="px-5 py-2 bg-brand-text text-white rounded-full hover:bg-brand-accent transition-all">Login</Link>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-brand-text">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 flex flex-col md:hidden transform transition-transform duration-300">
            <div className="flex justify-between items-center p-6 border-b border-brand-border">
              <h2 className="font-bold text-brand-text">Menu</h2>
              <button onClick={() => setIsOpen(false)} className="text-brand-text">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-0 flex-1 p-6">
              <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-4 text-brand-text font-bold uppercase tracking-widest text-sm hover:bg-brand-bg hover:text-brand-accent transition-colors rounded-xl">
                Mini-cursos
              </Link>
              <Link href="/" onClick={() => setIsOpen(false)} className="px-4 py-4 text-brand-text font-bold uppercase tracking-widest text-sm hover:bg-brand-bg hover:text-brand-accent transition-colors rounded-xl">
                Início
              </Link>
              <a href="/#nucleos" onClick={() => setIsOpen(false)} className="px-4 py-4 text-brand-text font-bold uppercase tracking-widest text-sm hover:bg-brand-bg hover:text-brand-accent transition-colors rounded-xl">
                Núcleos
              </a>
              <Link href="/posts" onClick={() => setIsOpen(false)} className="px-4 py-4 text-brand-text font-bold uppercase tracking-widest text-sm hover:bg-brand-bg hover:text-brand-accent transition-colors rounded-xl">
                Blog
              </Link>
            </div>
            <div className="p-6 border-t border-brand-border">
              <Link href="/login" onClick={() => setIsOpen(false)} className="w-full px-5 py-3 bg-brand-text text-white rounded-xl hover:bg-brand-accent transition-all font-bold text-center text-sm uppercase tracking-widest block">
                Login
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};
