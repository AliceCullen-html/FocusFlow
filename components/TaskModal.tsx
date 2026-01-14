
import React, { useState, useRef, useEffect } from 'react';
import { Priority, TaskCategory, TaskStatus, Task } from '../types';

interface TaskModalProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task;
  initialDate?: Date;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSave, task, initialDate }) => {
  // Parse da data existente se for edição
  const getInitialDate = () => {
    if (task) {
      // Fix: Use correct field name due_date as defined in Task interface
      const [y, m, d] = task.due_date.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return initialDate || new Date();
  };

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || Priority.MEDIUM,
    category: task?.category || TaskCategory.WORK,
    dueDate: getInitialDate(),
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const localDueDate = formData.dueDate.toLocaleDateString('en-CA');

    // Fix: Use correct field names due_date and created_at as defined in Task interface
    const savedTask: Task = {
      id: task?.id || crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: task?.status || TaskStatus.TODO,
      category: formData.category,
      due_date: localDueDate,
      created_at: task?.created_at || new Date().toISOString(),
    };

    onSave(savedTask);
    onClose();
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white text-slate-900 border-2 border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium cursor-pointer";

  const [currentMonth, setCurrentMonth] = useState(formData.dueDate);
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setFormData({ ...formData, dueDate: selectedDate });
    setIsCalendarOpen(false);
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const renderCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const isSelected = formData.dueDate.getDate() === d && 
                         formData.dueDate.getMonth() === month && 
                         formData.dueDate.getFullYear() === year;
      
      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDateSelect(d)}
          className={`h-8 w-8 text-xs font-black rounded-lg transition-colors flex items-center justify-center
            ${isSelected ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-100' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
            {task ? 'Editar Tarefa' : 'Criar Tarefa'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div>
            <label className="block text-[10px] font-black text-indigo-900 mb-2 ml-1 uppercase tracking-widest opacity-60">Título</label>
            <input
              autoFocus
              required
              type="text"
              placeholder="Ex: Reunião de Planejamento"
              className={inputClasses}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-indigo-900 mb-2 ml-1 uppercase tracking-widest opacity-60">Notas</label>
            <textarea
              placeholder="Algum detalhe extra?"
              rows={2}
              className={inputClasses}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-indigo-900 mb-2 ml-1 uppercase tracking-widest opacity-60">Prioridade</label>
              <select
                className={inputClasses}
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
              >
                <option value={Priority.LOW}>BAIXA</option>
                <option value={Priority.MEDIUM}>MÉDIA</option>
                <option value={Priority.HIGH}>ALTA</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-indigo-900 mb-2 ml-1 uppercase tracking-widest opacity-60">Foco</label>
              <select
                className={inputClasses}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as TaskCategory })}
              >
                <option value={TaskCategory.WORK}>TRABALHO</option>
                <option value={TaskCategory.PERSONAL}>PESSOAL</option>
                <option value={TaskCategory.STUDY}>ESTUDOS</option>
                <option value={TaskCategory.HEALTH}>SAÚDE</option>
                <option value={TaskCategory.URGENT}>URGENTE</option>
              </select>
            </div>
          </div>

          <div className="relative" ref={calendarRef}>
            <label className="block text-[10px] font-black text-indigo-900 mb-2 ml-1 uppercase tracking-widest opacity-60">Data de Entrega</label>
            <div 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`${inputClasses} flex items-center justify-between group-hover:border-indigo-300`}
            >
              <span className="text-slate-800">
                {formData.dueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            {isCalendarOpen && (
              <div className="absolute bottom-full mb-3 left-0 w-72 bg-white rounded-3xl shadow-2xl border border-indigo-100 p-5 animate-in slide-in-from-bottom-2 duration-300 z-[60]">
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-indigo-50 rounded-xl text-indigo-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    {currentMonth.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </span>
                  <button type="button" onClick={() => changeMonth(1)} className="p-1.5 hover:bg-indigo-50 rounded-xl text-indigo-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendarGrid()}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex space-x-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3.5 text-slate-500 font-black text-xs tracking-widest rounded-2xl hover:bg-slate-50 transition-colors uppercase">
              CANCELAR
            </button>
            <button type="submit" className="flex-1 px-6 py-3.5 bg-indigo-600 text-white font-black text-xs tracking-widest rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 uppercase">
              {task ? 'SALVAR' : 'CONFIRMAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
