
import React, { useState } from 'react';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfUseModal from './TermsOfUseModal';
import SupportModal from './SupportModal';

interface LandingPageProps {
  onBack: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onBack }) => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-y-auto pb-20 animate-in fade-in duration-700 font-sans selection:bg-indigo-100">
      {/* Header Fixo de Navegação */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="font-black text-slate-900 tracking-tighter uppercase text-sm">Taskly</span>
          </div>
          <button 
            onClick={onBack}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            Entrar no App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-700">
          ✨ Produtividade sem distrações
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8 animate-in slide-in-from-bottom-8 duration-700">
          Domine sua Produtividade.<br />
          <span className="text-indigo-600">Foque no que Importa.</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-slate-500 text-xl font-medium mb-4 animate-in slide-in-from-bottom-8 duration-700 delay-100">
          Gerencie suas tarefas, organize quadros Kanban e maximize sua concentração com o Pomodoro inteligente integrado — tudo em um só lugar.
        </p>
        
        <p className="text-indigo-600/60 font-black text-xs uppercase tracking-widest mb-12 animate-in fade-in duration-1000 delay-200">
          Produtividade simples para quem quer fazer mais em menos tempo.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <button 
            onClick={onBack}
            className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-indigo-200"
          >
            Criar conta grátis
          </button>
          <div className="flex flex-col items-center md:items-start">
             <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                <svg className="w-4 h-4 mr-1.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Dados protegidos e criptografados
             </div>
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Setup instantâneo e gratuito</p>
          </div>
        </div>
        
        {/* Mockup Principal */}
        <div className="relative max-w-5xl mx-auto rounded-[32px] overflow-hidden shadow-[0_48px_100px_-20px_rgba(79,70,229,0.3)] border-8 border-slate-900 bg-slate-900 animate-in zoom-in duration-1000 delay-200">
          <div className="bg-slate-50 w-full h-[500px] flex">
             <div className="w-16 md:w-48 bg-white border-r border-slate-100 p-4 hidden md:flex flex-col space-y-4">
                <div className="h-6 w-24 bg-slate-100 rounded-md mb-8"></div>
                {[1,2,3,4].map(i => <div key={i} className={`h-10 w-full rounded-xl ${i === 1 ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}></div>)}
             </div>
             <div className="flex-1 p-6 md:p-10 space-y-8 overflow-hidden text-left">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-40 bg-slate-200 rounded-lg"></div>
                    <div className="h-10 w-32 bg-indigo-600 rounded-xl"></div>
                </div>
                <div className="w-full h-32 bg-gradient-to-br from-slate-800 to-indigo-900 rounded-3xl p-6 flex items-center">
                    <div className="space-y-2">
                        <div className="h-3 w-32 bg-amber-500/20 rounded-full"></div>
                        <div className="h-6 w-72 bg-white/10 rounded-lg"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100"></div>)}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white/50 border-y border-slate-100 mt-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Confiado por profissionais de alta performance</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale">
              <span className="text-2xl font-black tracking-tighter text-slate-900">STUDIO_X</span>
              <span className="text-2xl font-black tracking-tighter text-slate-900">DEVFLOW</span>
              <span className="text-2xl font-black tracking-tighter text-slate-900">PEAK_PROD</span>
              <span className="text-2xl font-black tracking-tighter text-slate-900">FOCUS_LABS</span>
          </div>
          <div className="mt-12 flex items-center justify-center space-x-4">
              <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200">
                          <img src={`https://i.pravatar.cc/32?img=${i+20}`} className="w-full h-full rounded-full" />
                      </div>
                  ))}
              </div>
              <p className="text-xs font-bold text-slate-500">+1.000 pessoas já usam o Taskly todos os dias.</p>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">O que você ganha com o Taskly?</h2>
            <p className="text-slate-500 font-medium">Recursos pensados para o seu fluxo de trabalho real.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                {
                    title: "Organização Inteligente",
                    desc: "Categorize e priorize tarefas por nível de urgência com um sistema de cores intuitivo.",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />,
                    color: "bg-indigo-50 text-indigo-600"
                },
                {
                    title: "Fluxo Visual Kanban",
                    desc: "Arraste e solte suas tarefas entre os estágios. Visualize o progresso em tempo real.",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />,
                    color: "bg-blue-50 text-blue-600"
                },
                {
                    title: "Foco Pomodoro",
                    desc: "Use o cronômetro integrado para manter ciclos de Deep Work sem distrações.",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    color: "bg-emerald-50 text-emerald-600"
                },
                {
                    title: "Evolução e Dados",
                    desc: "Acompanhe suas sessões de foco e evolução de produtividade com estatísticas claras.",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />,
                    color: "bg-amber-50 text-amber-600"
                },
                {
                    title: "Interface Minimalista",
                    desc: "Design limpo, rápido e sem recursos desnecessários que roubam sua atenção.",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
                    color: "bg-rose-50 text-rose-600"
                },
                {
                    title: "Segurança Total",
                    desc: "Seus dados são protegidos com criptografia de ponta e infraestrutura robusta.",
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                    color: "bg-slate-50 text-slate-600"
                }
            ].map((feature, i) => (
                <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {feature.icon}
                        </svg>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-6 py-20 bg-slate-900 rounded-[40px] shadow-2xl text-center mx-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">
                Transforme esforço em resultado agora.
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
                Junte-se ao sistema que trabalha a favor da sua concentração e clareza mental.
            </p>
            <button 
                onClick={onBack}
                className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-2xl shadow-indigo-200 relative z-10"
            >
                CRIAR MINHA CONTA GRÁTIS
            </button>
            <div className="mt-8 flex flex-col items-center justify-center space-y-2 relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acesso imediato • Sem cartão de crédito</p>
            </div>
      </section>
      
      {/* Footer Institucional */}
      <footer className="max-w-6xl mx-auto px-12 pt-20 flex flex-col md:flex-row items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <div className="mb-4 md:mb-0">© 2025 TASKLY - PRODUTIVIDADE E FOCO</div>
        <div className="flex space-x-8">
          <button onClick={() => setShowPrivacy(true)} className="hover:text-indigo-600 transition-colors uppercase">Privacidade</button>
          <button onClick={() => setShowTerms(true)} className="hover:text-indigo-600 transition-colors uppercase">Termos</button>
          <button onClick={() => setShowSupport(true)} className="hover:text-indigo-600 transition-colors uppercase">Contato</button>
        </div>
      </footer>

      {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsOfUseModal onClose={() => setShowTerms(false)} />}
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </div>
  );
};

export default LandingPage;
