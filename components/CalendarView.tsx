
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Task, TaskStatus, Priority } from '../types';
import TaskCard from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  onAddWithDate: (date: Date) => void;
  onUpdateStatus?: (id: string, status: TaskStatus) => void;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  tasks, 
  onAddWithDate,
  onUpdateStatus = () => {},
  onDelete = () => {},
  onEdit = () => {}
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [currentPickerMonth, setCurrentPickerMonth] = useState(new Date(selectedDate));
  const pickerRef = useRef<HTMLDivElement>(null);

  // Fecha o seletor ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    if (isPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPickerOpen]);

  // Gera os 7 dias da semana ao redor da data selecionada
  const days = useMemo(() => {
    const arr = [];
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [selectedDate]);

  // Filtra as tarefas que batem exatamente com a data selecionada
  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');
  const dayTasks = useMemo(() => {
    return tasks.filter(t => t.due_date === selectedDateStr);
  }, [tasks, selectedDateStr]);

  // Lógica do Picker (Calendário de Grade)
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderPickerGrid = () => {
    const year = currentPickerMonth.getFullYear();
    const month = currentPickerMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const grid = [];

    for (let i = 0; i < startDay; i++) grid.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    
    for (let d = 1; d <= totalDays; d++) {
      const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
      grid.push(
        <button
          key={d}
          type="button"
          onClick={() => {
            setSelectedDate(new Date(year, month, d));
            setIsPickerOpen(false);
          }}
          className={`h-8 w-8 text-[10px] font-black rounded-xl transition-all flex items-center justify-center ${
            isSelected ? 'bg-[#6366f1] text-white shadow-lg scale-110' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          {d}
        </button>
      );
    }
    return grid;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between relative">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">AGENDA</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        {/* Ícone de Calendário com Popover */}
        <div ref={pickerRef} className="relative">
          <button 
            onClick={() => {
              setIsPickerOpen(!isPickerOpen);
              setCurrentPickerMonth(new Date(selectedDate));
            }}
            className={`w-10 h-10 rounded-2xl shadow-sm border flex items-center justify-center transition-all ${
              isPickerOpen ? 'bg-[#6366f1] text-white border-transparent scale-110' : 'bg-white text-slate-400 border-slate-50 active:scale-90'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {isPickerOpen && (
            <div className="absolute top-12 right-0 w-72 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-5 z-50 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setCurrentPickerMonth(new Date(currentPickerMonth.getFullYear(), currentPickerMonth.getMonth() - 1, 1))}
                  className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                  {currentPickerMonth.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => setCurrentPickerMonth(new Date(currentPickerMonth.getFullYear(), currentPickerMonth.getMonth() + 1, 1))}
                  className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                  <div key={d} className="h-8 w-8 flex items-center justify-center text-[8px] font-black text-slate-300">{d}</div>
                ))}
                {renderPickerGrid()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seletor de Datas (Horizontal Strip) */}
      <div className="flex space-x-3 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
        {days.map((date, idx) => {
          const isActive = date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(new Date(date))}
              className={`flex-shrink-0 w-16 py-5 rounded-[28px] flex flex-col items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-[#6366f1] text-white shadow-xl shadow-indigo-100 scale-110 z-10' 
                  : 'bg-white text-slate-400 border border-slate-50 hover:border-indigo-100 active:scale-95'
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-widest mb-1.5 ${isActive ? 'text-white/70' : 'text-slate-300'}`}>
                {date.toLocaleDateString('pt-BR', { weekday: 'short' }).split('.')[0].toUpperCase()}
              </span>
              <span className="text-lg font-black">{date.getDate()}</span>
              {isToday && !isActive && <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1"></div>}
              {isActive && <div className="w-1 h-1 bg-white rounded-full mt-1 animate-pulse"></div>}
            </button>
          );
        })}
      </div>

      {/* Lista de Tarefas do Dia */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compromissos do Dia</h3>
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">
            {dayTasks.length} {dayTasks.length === 1 ? 'Tarefa' : 'Tarefas'}
          </span>
        </div>

        {dayTasks.length > 0 ? (
          <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {dayTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdateStatus={onUpdateStatus} 
                onDelete={onDelete} 
                onEdit={onEdit} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 border-dashed animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6">Nada agendado para hoje</p>
            <button 
              onClick={() => onAddWithDate(selectedDate)}
              className="px-8 py-3 bg-[#6366f1] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all"
            >
              Adicionar Tarefa
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => onAddWithDate(selectedDate)} 
        className="fixed bottom-28 right-6 w-14 h-14 bg-[#6366f1] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform shadow-indigo-200 z-40"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default CalendarView;
