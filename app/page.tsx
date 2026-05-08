'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BrainCircuit, 
  Database, 
  LineChart, 
  Eye, 
  ArrowRight, 
  Users, 
  Plus, 
  CheckCircle2,
  Send,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Componentes internos
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-brand-bg text-xl">D</div>
            <span className="text-xl font-bold tracking-tight text-brand-text">Data<span className="text-brand-accent">Lab</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-brand-accent transition-colors">Início</Link>
            <Link href="#nucleos" className="hover:text-brand-accent transition-colors">Núcleos</Link>
            <Link href="/posts" className="hover:text-brand-accent transition-colors">Blog</Link>
            <Link href="/login" className="px-4 py-2 bg-brand-surface rounded-full border border-white/10 hover:border-brand-accent transition-all">Login</Link>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-brand-text">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
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
                Início
              </Link>
              <Link href="#nucleos" onClick={() => setIsOpen(false)} className="px-4 py-4 text-brand-text font-bold uppercase tracking-widest text-sm hover:bg-brand-bg hover:text-brand-accent transition-colors rounded-xl">
                Núcleos
              </Link>
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

const NucleoCard = ({ title, icon: Icon, description }: { title: string, icon: any, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 card-bubble group text-center md:text-left"
  >
    <div className="w-14 h-14 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-text group-hover:bg-brand-accent group-hover:text-white transition-all duration-500 md:mx-0 mx-auto">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-bold text-brand-text mt-4">{title}</h3>
    <p className="text-brand-text-dim text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', area: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/candidaturas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar candidatura');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', area: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center px-6 pt-20">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-brand-border text-brand-text text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              Inovação & Pesquisa Científica
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight text-brand-text">
              Data<span className="text-brand-accent">Lab</span>. <br />
              <span className="text-brand-text-dim/40">Powering</span> <br />
              Intelligence.
            </h1>
            <p className="text-xl text-brand-text-dim max-w-md leading-relaxed font-medium">
              Transformando o complexo em inteligível através da ciência de dados de ponta.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="#participe" className="px-10 py-5 bg-brand-text text-white font-bold rounded-2xl hover:bg-brand-accent transition-all shadow-xl shadow-brand-text/10">
                Fazer parte do time
              </Link>
              <Link href="/posts" className="px-10 py-5 bg-white border border-brand-border text-brand-text font-bold rounded-2xl hover:border-brand-accent transition-all flex items-center gap-3">
                Explorar Blog <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            
            <div className="relative flex justify-center">
              {/* Adicionei max-w-md para diminuir o tamanho manualmente */}
              <div className="bg-white p-6 rounded-[3rem] shadow-2xl border border-brand-border rotate-3 hover:rotate-0 transition-transform duration-700 w-full max-w-md mx-auto">
                <div className="rounded-[2rem] overflow-hidden aspect-square">
                  <Image 
                    src="https://lexpuzcbixulwfchrpym.supabase.co/storage/v1/object/public/post-images/Design%20sem%20nome.png" 
                    alt="Logo DataLab" 
                    width={800} 
                    height={800} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Elemento flutuante de badge */}
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-3xl border border-white max-w-[200px] shadow-2xl hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-2">Impacto Real</p>
              <p className="text-xs font-bold text-brand-text leading-tight">Projetos desenvolvidos com foco em performance e escala.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Núcleos Section */}
      <section id="nucleos" className="py-16 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-8 mb-16">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Nossos Núcleos <br /><span className="text-brand-accent">Estratégicos.</span></h2>
              <p className="text-brand-text-dim text-lg font-medium">Excelência acadêmica aplicada a desafios reais do mercado global.</p>
            </div>
            <Link href="/posts" className="text-brand-text font-bold flex items-center gap-2 group">
              Explorar pesquisas <span className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center group-hover:bg-brand-text group-hover:text-white transition-all"><ArrowRight size={18} /></span>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center md:place-items-stretch">
            <NucleoCard 
              title="IA" 
              icon={BrainCircuit} 
              description="Algoritmos generativos, arquitetura de redes neurais e aprendizado profundo avançado."
            />
            <NucleoCard 
              title="Data Engineer & Big Data" 
              icon={Database} 
              description="Pipeline de alta performance, data warehousing e governança de dados escalável."
            />
            <NucleoCard 
              title="Data Science" 
              icon={LineChart} 
              description="Modelagem estatística preditiva e descoberta de padrões em grandes datasets."
            />
            <NucleoCard 
              title="Computer Vision" 
              icon={Eye} 
              description="Detecção de objetos, análise espacial e processamento biométrico em tempo real."
            />
          </div>
        </div>
      </section>

      {/* Parceiros Section */}
      <section className="py-24 px-6 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black uppercase tracking-widest text-brand-text/20">Partnership</h3>
            <p className="font-bold text-brand-text">Conectando academia e indústria</p>
          </div>
          <div className="flex items-center gap-16 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              <Image 
                src="https://lexpuzcbixulwfchrpym.supabase.co/storage/v1/object/public/post-images/datacamp-icon.png" 
                alt="DataCamp Logo" 
                width={140} 
                height={50} 
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="text-3xl font-black tracking-tighter text-black/40">UFU.BR</div>
          </div>
        </div>
      </section>

      {/* Participe Section */}
      <section id="participe" className="py-16 md:py-32 px-6">
        <div className="max-w-6xl mx-auto bg-brand-text rounded-[3.5rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[100px]" />
          
          <div className="grid md:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-7xl font-black leading-none text-white">Join the <br /><span className="text-brand-accent">Future.</span></h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Nós não apenas ensinamos dados. Nós construímos o amanhã. Inscreva-se para fazer parte do próximo processo seletivo do DataLab.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Projetos Reais",
                  "Mentoria Elite",
                  "Networking",
                  "Carreira"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-white font-bold text-sm">
                    <div className="w-6 h-6 bg-brand-accent/20 rounded-lg flex items-center justify-center text-brand-accent"><CheckCircle2 size={14} /></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-brand-bg/50 px-5 py-4 rounded-2xl border border-brand-border focus:border-brand-accent outline-none transition-all font-medium text-sm"
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 ml-1">E-mail</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-brand-bg/50 px-5 py-4 rounded-2xl border border-brand-border focus:border-brand-accent outline-none transition-all font-medium text-sm"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40 ml-1">Interest Area</label>
                    <select 
                      required
                      className="w-full bg-brand-bg/50 px-5 py-4 rounded-2xl border border-brand-border focus:border-brand-accent outline-none transition-all font-medium text-sm appearance-none"
                      value={formData.area}
                      onChange={e => setFormData({...formData, area: e.target.value})}
                      disabled={loading}
                    >
                      <option value="">Selecione a área</option>
                      <option value="ia">Inteligência Artificial</option>
                      <option value="eng">Engenharia de Dados</option>
                      <option value="ds">Ciência de Dados</option>
                      <option value="vis">Visão Computacional</option>
                    </select>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button className="w-full py-5 bg-brand-text text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-accent transition-all mt-4 group disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Candidatura <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 space-y-6"
                >
                  <div className="w-20 h-20 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-brand-text">Candidatura Enviada!</h3>
                    <p className="text-brand-text-dim text-sm">Obrigado por seu interesse. Entraremos em contato em breve.</p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-brand-accent text-white font-bold rounded-xl hover:bg-brand-text transition-all"
                  >
                    Enviar Outra Candidatura
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-text rounded-2xl flex items-center justify-center font-bold text-white text-xl">D</div>
            <div>
              <p className="text-xl font-black tracking-tight">DataLab</p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-text-dim">Academic Center of Excellence</p>
            </div>
          </div>
          <div className="flex gap-12">
            <a href="https://www.instagram.com/datalab.ufu/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-text hover:text-brand-accent transition-colors">Instagram</a>
            <a href="https://www.linkedin.com/company/data-lab-ufu/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-text hover:text-brand-accent transition-colors">LinkedIn</a>
            <a href="https://github.com/DataLab-LigaAcademica" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-text hover:text-brand-accent transition-colors">GitHub</a>
          </div>
          <p className="text-xs font-bold text-brand-text/30">
            © 2026. Made by DataLab.
          </p>
        </div>
      </footer>
    </div>
  );
}
