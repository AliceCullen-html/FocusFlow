
import React, { useState, useRef, useEffect } from 'react';
import { Priority, TaskCategory, TaskStatus, Task } from '../types';

interface TaskModalProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task;
  initialDate?: Date;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSave, task, initialDate }) => {
  const getInitialDate = () => {
    if (task) {
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

  // Alterado de text-sm para text-base para evitar zoom no iOS
  const inputClasses = "w-full px-5 py-4 bg-slate-50 text-slate-900 border-2 border-slate-50 rounded-2xl focus:border-indigo-100 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-base font-bold appearance-none";

  const [currentMonth, setCurrentMonth] = useState(formData.dueDate);
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setFormData({ ...formData, dueDate: selectedDate });
    setIsCalendarOpen(false);
  };

  const renderCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-8 w-8 md:h-9 md:w-9"></div>);
    for (let d = 1; d <= totalDays; d++) {
      const isSelected = formData.dueDate.getDate() === d && formData.dueDate.getMonth() === month && formData.dueDate.getFullYear() === year;
      days.push(
        <button key={d} type="button" onClick={() => handleDateSelect(d)} className={`h-8 w-8 md:h-9 md:w-9 text-[10px] md:text-xs font-black rounded-xl transition-colors flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 md:p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-12 md:slide-in-from-bottom-0 duration-500 md:duration-300 max-h-[92dvh] flex flex-col">
        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20 shrink-0">
          <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
            {task ? 'Editar' : 'Criar'} Tarefa
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 overflow-y-auto custom-scrollbar flex-1 overscroll-contain">
          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Título</label>
            <input autoFocus required type="text" placeholder="O que precisa ser feito?" className={inputClasses} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Notas</label>
            <textarea placeholder="Detalhes (opcional)" rows={3} className={`${inputClasses} resize-none`} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Prioridade</label>
              <select className={inputClasses} value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}>
                <option value={Priority.LOW}>BAIXA</option>
                <option value={Priority.MEDIUM}>MÉDIA</option>
                <option value={Priority.HIGH}>ALTA</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Contexto</label>
              <select className={inputClasses} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as TaskCategory })}>
                <option value={TaskCategory.WORK}>TRABALHO</option>
                <option value={TaskCategory.PERSONAL}>PESSOAL</option>
                <option value={TaskCategory.STUDY}>ESTUDOS</option>
                <option value={TaskCategory.HEALTH}>SAÚDE</option>
                <option value={TaskCategory.URGENT}>URGENTE</option>
              </select>
            </div>
          </div>

          <div className="relative" ref={calendarRef}>
            <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Data Limite</label>
            <button type="button" onClick={() => setIsCalendarOpen(!isCalendarOpen)} className={`${inputClasses} flex items-center justify-between text-left`}>
              <span>{formData.dueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</span>
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>

            {isCalendarOpen && (
              <div className="absolute bottom-full mb-2 left-0 w-full md:w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-[70] animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">{currentMonth.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
                  <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendarGrid()}
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="p-6 md:p-8 bg-slate-50/30 border-t border-slate-50 flex space-x-4 shrink-0 pb-safe">
          <button type="button" onClick={onClose} className="flex-1 py-4 text-slate-400 font-black text-xs tracking-widest uppercase hover:text-slate-600 transition-colors">Cancelar</button>
          <button type="submit" onClick={handleSubmit} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-indigo-100 active:scale-95 transition-all">
            {task ? 'Salvar' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
