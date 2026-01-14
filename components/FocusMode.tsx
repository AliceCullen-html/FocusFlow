
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Task, TaskStatus } from '../types';
import { supabase } from '../services/supabase';

interface FocusModeProps {
  tasks: Task[];
  userId: string;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODES: Record<TimerMode, { label: string; minutes: number; color: string; bg: string; accent: string }> = {
  focus: { label: 'Foco Total', minutes: 25, color: 'text-indigo-600', bg: 'bg-indigo-600', accent: 'text-indigo-400' },
  shortBreak: { label: 'Pausa Curta', minutes: 5, color: 'text-emerald-600', bg: 'bg-emerald-600', accent: 'text-emerald-400' },
  longBreak: { label: 'Pausa Longa', minutes: 15, color: 'text-blue-600', bg: 'bg-blue-600', accent: 'text-blue-400' },
};

const FocusMode: React.FC<FocusModeProps> = ({ tasks, userId }) => {
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  const savePomodoroSession = async (completed: boolean) => {
    if (timerMode !== 'focus' || !startedAt) return;

    await supabase.from('pomodoro_sessions').insert([{
      user_id: userId,
      task_id: selectedTaskId,
      focus_minutes: MODES.focus.minutes,
      break_minutes: MODES.shortBreak.minutes,
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      completed
    }]);
    setStartedAt(null);
  };

  const switchMode = (mode: TimerMode) => {
    setIsActive(false);
    setTimerMode(mode);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      if (!startedAt && timerMode === 'focus') setStartedAt(new Date().toISOString());
      timerRef.current = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerMode === 'focus') {
        savePomodoroSession(true);
        const nextSessions = sessionsCompleted + 1;
        setSessionsCompleted(nextSessions);
        switchMode(nextSessions % 4 === 0 ? 'longBreak' : 'shortBreak');
      } else {
        switchMode('focus');
      }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft, timerMode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(MODES[timerMode].minutes * 60); setStartedAt(null); };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.DONE);
  const progress = 1 - (timeLeft / (MODES[timerMode].minutes * 60));

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto py-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {(Object.keys(MODES) as TimerMode[]).map(mode => (
          <button key={mode} onClick={() => switchMode(mode)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timerMode === mode ? `${MODES[mode].bg} text-white shadow-lg` : 'text-slate-400 hover:bg-slate-50'}`}>
            {MODES[mode].label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
        <svg className="absolute w-full h-full -rotate-90 scale-105">
          <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
          <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="100 100" strokeDashoffset={100 - (progress * 100)} strokeLinecap="round" className={`${MODES[timerMode].color} transition-all duration-1000 ease-linear`} />
        </svg>
        <div className="text-center z-10">
          <h1 className="text-6xl md:text-7xl font-black text-slate-800 tabular-nums">{formatTime(timeLeft)}</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">{isActive ? 'Focado' : 'Pausado'}</p>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <button onClick={resetTimer} className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
        <button onClick={toggleTimer} className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all active:scale-90 ${isActive ? 'bg-slate-800' : MODES[timerMode].bg}`}>{isActive ? <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}</button>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center min-w-[64px]"><span className="text-[10px] font-black text-slate-300 uppercase">Sessões</span><span className="text-xl font-bold text-slate-700">{sessionsCompleted}</span></div>
      </div>

      <div className="w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
        <label className="block text-[10px] font-black text-slate-400 uppercase mb-4">Objetivo da Sessão</label>
        <select onChange={(e) => setSelectedTaskId(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-500 outline-none" value={selectedTaskId || ""}>
          <option value="">Nenhuma tarefa selecionada</option>
          {pendingTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
    </div>
  );
};

export default FocusMode;
