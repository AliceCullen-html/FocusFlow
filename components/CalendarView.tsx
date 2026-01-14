
import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  onAddWithDate: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onAddWithDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'bg-rose-600';
      case Priority.MEDIUM: return 'bg-amber-500';
      default: return 'bg-slate-400';
    }
  };

  const renderCells = () => {
    const cells = [];
    
    // Espaços vazios do mês anterior
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[120px] bg-slate-50/50 border border-slate-100"></div>);
    }

    // Dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      // Fix: Use correct field name due_date as defined in Task interface
      const dayTasks = tasks.filter(t => t.due_date === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      cells.push(
        <div 
          key={day} 
          onClick={() => onAddWithDate(new Date(year, month, day))}
          className={`min-h-[120px] p-2 border border-slate-100 bg-white hover:bg-slate-50 transition-colors cursor-pointer group relative`}
        >
          <span className={`text-sm font-bold ${isToday ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg' : 'text-slate-500'}`}>
            {day}
          </span>
          
          <div className="mt-2 space-y-1 overflow-hidden">
            {dayTasks.slice(0, 3).map(task => (
              <div 
                key={task.id} 
                className={`text-[9px] font-bold truncate px-1.5 py-0.5 rounded border border-white/20 text-white shadow-sm ${getPriorityColor(task.priority)}`}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="text-[9px] font-bold text-slate-400 px-1 italic">
                + {dayTasks.length - 3} mais...
              </div>
            )}
          </div>

          <button className="absolute bottom-2 right-2 p-1 bg-indigo-50 text-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-black text-slate-800 capitalize tracking-tight">
            {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
            Hoje
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
          <div key={d} className="py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
        ))}
      </div>

      {/* Grid de Dias */}
      <div className="grid grid-cols-7">
        {renderCells()}
      </div>
    </div>
  );
};

export default CalendarView;
