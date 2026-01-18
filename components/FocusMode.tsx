
import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus } from '../types';
import { supabase } from '../services/supabase';

interface FocusModeProps {
  tasks: Task[];
  userId: string;
}

const FocusMode: React.FC<FocusModeProps> = ({ tasks, userId }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(4);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setSessionsCompleted(prev => prev + 1);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeLeft / (25 * 60));

  return (
    <div className="flex flex-col items-center py-6 space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-32">
      <div className="w-full flex justify-between items-center px-2">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">MODO FOCO</h1>
        <button className="p-2 bg-slate-100 rounded-full text-slate-500">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        </button>
      </div>

      <div className="relative flex items-center justify-center w-72 h-72">
        <svg className="absolute w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="48%" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
          <circle cx="50%" cy="50%" r="48%" stroke="#6366f1" strokeWidth="8" fill="transparent" strokeDasharray="100 100" strokeDashoffset={100 - (progress * 100)} strokeLinecap="round" className="transition-all duration-1000 ease-linear" />
        </svg>
        <div className="text-center z-10">
          <h1 className="text-7xl font-black text-slate-800 tabular-nums">{formatTime(timeLeft)}</h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">SESSÃO DE TRABALHO</p>
        </div>
      </div>

      <div className="w-full bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#6366f1]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TAREFA ATUAL</p>
            <h4 className="font-bold text-slate-900">Finalizar Kit de Design UI</h4>
          </div>
        </div>
        <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={() => setIsActive(!isActive)} 
          className="w-full h-16 bg-[#6366f1] text-white rounded-[32px] font-black text-lg flex items-center justify-center space-x-4 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
        >
          {isActive ? (
            <><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pausar Foco</span></>
          ) : (
            <><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><span>Iniciar Foco</span></>
          )}
        </button>
        <div className="text-center">
          <p className="text-xs font-bold text-slate-400 flex items-center justify-center">
            <span className="mr-2">🏆</span> Meta Diária: {sessionsCompleted} / 8 Sessões de Foco
          </p>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
