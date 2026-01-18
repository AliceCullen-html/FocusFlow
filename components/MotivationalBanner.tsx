
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getMotivationalQuote } from '../services/geminiService';
import { Task } from '../types';

interface MotivationalBannerProps {
  tasks: Task[];
}

const MotivationalBanner: React.FC<MotivationalBannerProps> = ({ tasks }) => {
  const [quote, setQuote] = useState<string>("Consultando as Escrituras...");
  const [loading, setLoading] = useState(true);
  
  // Carrega histórico do localStorage para persistir entre sessões
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('taskly_verse_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const isFetching = useRef(false);

  const fetchQuote = useCallback(async () => {
    if (isFetching.current) return;
    setLoading(true);
    isFetching.current = true;
    
    try {
      const newQuote = await getMotivationalQuote(tasks, history);
      setQuote(newQuote);
      
      // Atualiza histórico e salva no localStorage (mantém apenas os últimos 20)
      setHistory(prev => {
        const updated = [newQuote, ...prev.filter(q => q !== newQuote)].slice(0, 20);
        localStorage.setItem('taskly_verse_history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [tasks, history]);

  // Dispara sempre que o componente é montado (ao voltar para a página)
  useEffect(() => {
    fetchQuote();
  }, []); // Executa apenas no mount para garantir uma troca por visualização

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1c4b] to-[#4c1d95] rounded-[40px] p-8 shadow-xl shadow-indigo-100 group border-none mb-6">
      <div className="relative z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-[#f59e0b] text-[10px] font-black uppercase tracking-widest mb-10">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.254 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          SABEDORIA DE PROVÉRBIOS
        </div>

        <div className="min-h-[6rem] flex items-center">
          <h2 className="text-white/60 text-2xl font-medium leading-tight italic tracking-tight">
            {loading ? (
              <span className="opacity-40 font-light italic animate-pulse">Consultando as Escrituras...</span>
            ) : (
              `"${quote}"`
            )}
          </h2>
        </div>
      </div>
      
      {/* Decoração de fundo conforme screenshot */}
      <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-[-20deg] translate-x-12"></div>
      <div className="absolute bottom-6 right-8 opacity-20">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </div>
    </div>
  );
};

export default MotivationalBanner;
