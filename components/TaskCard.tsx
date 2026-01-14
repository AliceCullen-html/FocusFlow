
import React, { useState } from 'react';
import { Task, TaskStatus, Priority } from '../types';
import { PRIORITY_COLORS, CATEGORY_ICONS } from '../constants';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus, onDelete, onEdit }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isDone = task.status === TaskStatus.DONE;

  const handleFinish = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setTimeout(() => {
      onUpdateStatus(task.id, TaskStatus.DONE);
      setIsAnimating(false);
    }, 450);
  };

  const handleAction = (e: React.MouseEvent, status: TaskStatus) => {
    e.stopPropagation();
    onUpdateStatus(task.id, status);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  // Estilo de borda lateral baseado na prioridade
  const priorityAccent = 
    task.priority === Priority.HIGH ? 'border-l-[6px] border-l-rose-600 shadow-rose-100/50' :
    task.priority === Priority.MEDIUM ? 'border-l-[4px] border-l-amber-400' : 
    'border-l-[2px] border-l-slate-200';

  return (
    <div 
      onClick={() => onEdit(task)}
      className={`group relative p-4 mb-3 rounded-2xl border-y-2 border-r-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${priorityAccent} ${
      isDone 
        ? 'bg-slate-50/80 border-slate-100 opacity-75 border-l-slate-200' 
        : 'bg-white border-white hover:border-indigo-400 shadow-sm'
    }`}>
      {/* Tooltip de Edição */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 uppercase tracking-widest">
        Clique para editar
      </div>

      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-20">
          <div className="confetti-effect w-16 h-16 bg-emerald-500/30"></div>
          <div className="confetti-effect w-24 h-24 bg-indigo-500/20 delay-100"></div>
          <div className="confetti-effect w-32 h-32 bg-amber-500/10 delay-200"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border transition-colors ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || 'bg-slate-100 text-slate-700'}`}>
          {task.priority}
        </span>
        
        <button 
          onClick={handleDelete}
          className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
          title="Excluir"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-start space-x-3">
        <h3 className={`font-bold text-slate-800 mb-1 leading-tight transition-all duration-500 ${isDone ? 'line-through text-slate-400' : 'text-[16px]'}`}>
          {task.title}
        </h3>
      </div>
      
      <p className={`text-sm mb-4 transition-colors duration-500 ${isDone ? 'text-slate-300' : 'text-slate-500'} line-clamp-2`}>
        {task.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
        <div className="flex items-center space-x-2 text-slate-400">
          <div className={`p-1.5 rounded-lg ${isDone ? 'bg-slate-100 text-slate-300' : 'bg-indigo-50 text-indigo-500'}`}>
            {CATEGORY_ICONS[task.category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS['WORK']}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{task.category}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {!isDone && task.status !== TaskStatus.TODO && (
            <button 
              onClick={(e) => handleAction(e, TaskStatus.TODO)}
              className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors tracking-widest"
            >
              VOLTAR
            </button>
          )}

          {!isDone ? (
            <button 
              onClick={task.status === TaskStatus.TODO ? (e) => handleAction(e, TaskStatus.IN_PROGRESS) : handleFinish}
              className={`relative flex items-center justify-center transition-all duration-300 ${
                task.status === TaskStatus.TODO 
                  ? 'px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] hover:bg-indigo-100 active:scale-95 tracking-widest border border-indigo-100' 
                  : `pl-3 pr-4 py-1.5 rounded-full border-2 border-indigo-200 text-indigo-600 font-black text-[10px] hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 active:scale-90 tracking-widest flex items-center space-x-2 shadow-sm ${isAnimating ? 'animate-check-pop bg-emerald-500 border-emerald-500 text-white' : ''}`
              }`}
            >
              {task.status === TaskStatus.TODO ? (
                'COMEÇAR'
              ) : (
                <>
                  <svg className={`w-5 h-5 transition-transform ${isAnimating ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={isAnimating ? 'hidden' : 'block'}>FINALIZAR</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 animate-in zoom-in duration-300 border border-emerald-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[10px] font-black tracking-widest">CONCLUÍDO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
