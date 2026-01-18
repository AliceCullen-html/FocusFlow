
import React from 'react';
import { Note } from '../types';

interface NotesViewProps {
  notes: Note[];
  onAdd: () => void;
  onEdit: (note: Note) => void;
  onTogglePin: (note: Note) => void;
}

const NoteCard: React.FC<{ 
  note: Note; 
  onEdit: (note: Note) => void; 
  onTogglePin: (note: Note) => void 
}> = ({ note, onEdit, onTogglePin }) => (
  <div 
    onClick={() => onEdit(note)}
    className="bg-white p-6 rounded-[32px] border border-slate-100/50 shadow-sm hover:shadow-md active:scale-[0.98] transition-all mb-4 cursor-pointer relative group"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-2 flex-1">
        <span className="text-xl">📝</span>
        <h4 className="font-bold text-slate-800 leading-tight line-clamp-1">
          {note.content.split('\n')[0] || 'Nota sem texto'}
        </h4>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onTogglePin(note); }}
        className={`p-2 rounded-xl transition-all shrink-0 ${note.pinned ? 'text-amber-500 bg-amber-50 shadow-inner' : 'text-slate-200 hover:text-slate-400'}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 9V4l1 1V3H7v1l1-1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
        </svg>
      </button>
    </div>
    
    <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed mb-4">
      {note.content.split('\n').slice(1).join(' ') || (note.content ? '' : 'Toque para escrever...')}
    </p>
    
    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
        {new Date(note.created_at).toLocaleDateString('pt-BR')}
      </span>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
         <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Editar Nota →</span>
      </div>
    </div>
  </div>
);

const NotesView: React.FC<NotesViewProps> = ({ notes, onAdd, onEdit, onTogglePin }) => {
  const pinned = notes.filter(n => n.pinned);
  const others = notes.filter(n => !n.pinned);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 pb-32">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">MINHAS NOTAS</h1>
        <button className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 border border-slate-50">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
           </svg>
        </button>
      </div>

      <button 
        onClick={onAdd}
        className="w-full py-6 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-[32px] text-indigo-600 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 active:scale-[0.97] transition-all hover:bg-indigo-100"
      >
        <div className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span>Nova Anotação</span>
      </button>

      {pinned.length > 0 && (
        <section className="animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center space-x-2 mb-4 px-2">
            <span className="text-amber-500">📌</span>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fixadas</h3>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {pinned.map(n => <NoteCard key={n.id} note={n} onEdit={onEdit} onTogglePin={onTogglePin} />)}
          </div>
        </section>
      )}

      <section className="animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex items-center space-x-2 mb-4 px-2">
          <span className="text-slate-300">🗂</span>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Outras</h3>
        </div>
        <div className="grid grid-cols-1 gap-1">
          {others.length > 0 ? (
            others.map(n => <NoteCard key={n.id} note={n} onEdit={onEdit} onTogglePin={onTogglePin} />)
          ) : (
            <div className="p-16 text-center bg-white rounded-[32px] border border-slate-50 border-dashed">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
               </div>
               <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Nenhuma nota por aqui</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NotesView;
