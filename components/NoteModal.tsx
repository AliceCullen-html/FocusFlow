
import React, { useState, useEffect } from 'react';
import { Note } from '../types';

interface NoteModalProps {
  onClose: () => void;
  onSave: (note: Note) => Promise<boolean>;
  onDelete?: () => void;
  onTransform: (note: Note) => void;
  note?: Note;
}

const NoteModal: React.FC<NoteModalProps> = ({ onClose, onSave, onDelete, onTransform, note }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    content: note?.content || '',
    pinned: note?.pinned || false,
  });

  useEffect(() => {
    if (!note) {
      const savedDraft = localStorage.getItem('taskly_note_draft');
      if (savedDraft) setFormData(prev => ({ ...prev, content: savedDraft }));
    }
  }, [note]);

  useEffect(() => {
    if (!note && formData.content) {
      const timer = setTimeout(() => localStorage.setItem('taskly_note_draft', formData.content), 500);
      return () => clearTimeout(timer);
    }
  }, [formData.content, note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) { alert("A nota não pode estar vazia."); return; }
    setIsSaving(true);
    const success = await onSave({ id: note?.id || 'new', content: formData.content.trim(), pinned: formData.pinned, created_at: note?.created_at || new Date().toISOString() });
    if (success) { localStorage.removeItem('taskly_note_draft'); onClose(); }
    else setIsSaving(false);
  };

  const isExistingNote = note && note.id !== 'new';

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 md:p-6">
      <div className="bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden h-[92dvh] md:h-auto max-h-[92dvh] flex flex-col">
        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center shrink-0">
           <div className="flex items-center space-x-3">
             <button type="button" disabled={isSaving} onClick={() => setFormData({...formData, pinned: !formData.pinned})} className={`w-10 h-10 rounded-2xl transition-all flex items-center justify-center ${formData.pinned ? 'bg-amber-50 text-amber-500 shadow-inner' : 'bg-slate-50 text-slate-300'}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 9V4l1 1V3H7v1l1-1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>
             </button>
             <h2 className="text-lg font-black text-slate-900 uppercase">{isExistingNote ? 'Editar Nota' : 'Nova Nota'}</h2>
           </div>
           <button onClick={onClose} disabled={isSaving} className="p-3 hover:bg-slate-50 rounded-full text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
        <div className="p-6 md:p-8 space-y-4 flex-1 overflow-y-auto bg-white">
          <textarea autoFocus disabled={isSaving} placeholder="Escreva aqui..." className="w-full h-full text-slate-700 text-base md:text-xl font-medium placeholder:text-slate-200 outline-none border-none bg-transparent resize-none leading-relaxed min-h-[300px]" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
        </div>
        <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col space-y-4 shrink-0 pb-safe">
          <div className="flex space-x-3">
            <button type="button" disabled={isSaving || !formData.content} onClick={() => onTransform({ ...note, id: note?.id || 'new', ...formData, created_at: note?.created_at || new Date().toISOString() } as any)} className="flex-1 py-4 bg-indigo-50 text-indigo-600 rounded-[24px] font-black text-[10px] tracking-widest uppercase flex items-center justify-center space-x-2 border border-indigo-100 shadow-sm disabled:opacity-30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              <span>Mudar p/ Tarefa</span>
            </button>
            {onDelete && isExistingNote && (
              <button 
                type="button" 
                disabled={isSaving} 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} 
                className="w-14 h-14 bg-rose-50 text-rose-500 rounded-[24px] flex items-center justify-center hover:bg-rose-100 border border-rose-200 shadow-sm active:scale-95 transition-transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
          </div>
          <button type="button" disabled={isSaving || !formData.content.trim()} onClick={handleSubmit} className="w-full py-5 bg-[#6366f1] text-white rounded-[24px] font-black text-xs tracking-[0.2em] uppercase shadow-2xl active:scale-[0.98] transition-all disabled:bg-slate-300">
            {isSaving ? "Salvando..." : "Salvar Anotação"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
