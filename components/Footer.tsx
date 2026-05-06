'use client';

import Link from 'next/link';

export const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/5 bg-brand-bg">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-accent rounded-md flex items-center justify-center font-bold text-brand-bg">D</div>
        <span className="text-lg font-bold">DataLab</span>
      </div>
      <div className="flex gap-8 text-sm text-brand-text-dim">
        <Link href="#" className="hover:text-brand-accent transition-colors">Instagram</Link>
        <Link href="#" className="hover:text-brand-accent transition-colors">LinkedIn</Link>
        <Link href="#" className="hover:text-brand-accent transition-colors">GitHub</Link>
      </div>
      <p className="text-xs text-brand-text-dim/50">
        © 2026 DataLab. Desenvolvido com foco em inovação.
      </p>
    </div>
  </footer>
);
