
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getMotivationalQuote } from '../services/geminiService';
// Import TaskStatus to use in comparison
import { Task, TaskStatus } from '../types';

interface MotivationalBannerProps {
  tasks: Task[];
}

const MotivationalBanner: React.FC<MotivationalBannerProps> = ({ tasks }) => {
  const [quote, setQuote] = useState<string>("Buscando sabedoria em Provérbios...");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  
  // Ref para evitar múltiplas chamadas simultâneas
  const isFetching = useRef(false);

  const fetchQuote = useCallback(async () => {
    if (isFetching.current) return;
    
    setLoading(true);
    isFetching.current = true;
    
    try {
      const newQuote = await getMotivationalQuote(tasks, history);
      setQuote(newQuote);
      
      // Adiciona ao histórico e mantém apenas os últimos 10 para não sobrecarregar o prompt
      setHistory(prev => {
        const updated = [newQuote, ...prev.filter(q => q !== newQuote)];
        return updated.slice(0, 10);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [tasks, history]);

  // Carrega a primeira vez e quando o refreshKey mudar
  useEffect(() => {
    fetchQuote();
  }, [refreshKey]);

  // Monitora conclusão de tarefas para sugerir novo versículo, mas com debounce simples
  // Fix: Compare against TaskStatus enum instead of incorrect string literal
  const completedCount = tasks.filter(t => t.status === TaskStatus.DONE).length;
  useEffect(() => {
    if (completedCount > 0) {
      fetchQuote();
    }
  }, [completedCount]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-indigo-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200 group border border-slate-700">
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-amber-500/20">
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.254 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Sabedoria de Provérbios
          </div>
          
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            disabled={loading}
            className="p-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
            title="Novo Provérbio"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="min-h-[5rem] flex items-center">
          <h2 className="text-slate-100 text-xl md:text-2xl font-medium leading-relaxed italic tracking-tight transition-all duration-500">
            {loading ? (
              <span className="opacity-40 font-light italic animate-pulse">Consultando as Escrituras...</span>
            ) : (
              `"${quote}"`
            )}
          </h2>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>
    </div>
  );
};

export default MotivationalBanner;
