
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus, Priority, TaskCategory, Note } from './types';
import { supabase } from './services/supabase';
import TaskCard from './components/TaskCard';
import MotivationalBanner from './components/MotivationalBanner';
import TaskModal from './components/TaskModal';
import CalendarView from './components/CalendarView';
import FocusMode from './components/FocusMode';
import AuthPage from './components/AuthPage';
import NotesView from './components/NotesView';
import NoteModal from './components/NoteModal';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState<'dashboard' | 'kanban' | 'agenda' | 'foco' | 'notas'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);
  const [dismissBanner, setDismissBanner] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (e) {
        console.error("Erro ao iniciar sessão:", e);
      } finally {
        setIsAuthLoading(false);
      }
    };
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true);
      } else if (event === 'SIGNED_OUT') {
        setIsResettingPassword(false);
        setSession(null);
        setTasks([]);
        setNotes([]);
      } else if (event === 'SIGNED_IN') {
        setSession(session);
        setIsResettingPassword(false);
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && !isResettingPassword) {
      fetchTasks();
      fetchNotes();
    }
  }, [session, isResettingPassword]);

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (!error && data) setTasks(data);
  };

  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('notes').select('*').eq('user_id', user.id).order('pinned', { ascending: false }).order('created_at', { ascending: false });
    if (!error && data) setNotes(data);
  };

  const addTask = async (task: Task) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data, error } = await supabase.from('tasks').insert([{ ...task, user_id: user.id }]).select();
    if (!error && data) { setTasks([data[0], ...tasks]); return true; }
    return false;
  };

  const addNote = async (note: Note) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase.from('notes').insert({ content: note.content, pinned: note.pinned, user_id: user.id });
    if (!error) { await fetchNotes(); return true; }
    return false;
  };

  const updateTask = async (updatedTask: Task) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase.from('tasks').update(updatedTask).eq('id', updatedTask.id).eq('user_id', user.id);
    if (!error) { setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t)); setEditingTask(null); return true; }
    return false;
  };

  const updateNote = async (updatedNote: Note) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { error } = await supabase.from('notes').update({ content: updatedNote.content, pinned: updatedNote.pinned, updated_at: new Date().toISOString() }).eq('id', updatedNote.id).eq('user_id', user.id);
    if (!error) { await fetchNotes(); setEditingNote(null); return true; }
    return false;
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    const completed_at = status === TaskStatus.DONE ? new Date().toISOString() : null;
    const { error } = await supabase.from('tasks').update({ status, completed_at }).eq('id', id);
    if (!error) setTasks(tasks.map(t => t.id === id ? { ...t, status, completed_at } : t));
  };

  const deleteTask = async (id: string) => {
    // Exclusão imediata no estado (Otimista)
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));
    
    try {
      // Deletar no banco sem confirmação
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) {
        // Se der erro, restaura o estado original
        setTasks(originalTasks);
        console.error("Erro ao excluir no banco:", error.message);
      }
    } catch (err: any) {
      setTasks(originalTasks);
      console.error("Erro de rede ao excluir:", err.message);
    }
  };

  const deleteNote = async (id: string) => {
    if (!id || id === 'new') return;
    
    // Exclusão imediata no estado (Otimista)
    const originalNotes = [...notes];
    setNotes(prev => prev.filter(n => n.id !== id));
    
    // Fecha o modal e limpa edição imediatamente
    setIsNoteModalOpen(false);
    setEditingNote(null);
    
    try {
      // Deletar no banco sem confirmação
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) {
        // Restaura se falhar
        setNotes(originalNotes);
        console.error("Erro ao excluir nota no banco:", error.message);
      }
    } catch (err: any) {
      setNotes(originalNotes);
      console.error("Erro de rede ao excluir nota:", err.message);
    }
  };

  const handleTransformToTask = (note: Note) => {
    setEditingNote(null);
    setIsNoteModalOpen(false);
    setEditingTask({ id: crypto.randomUUID(), title: note.content.split('\n')[0].substring(0, 50), description: note.content, priority: Priority.MEDIUM, status: TaskStatus.TODO, category: TaskCategory.PERSONAL, due_date: new Date().toLocaleDateString('en-CA'), created_at: new Date().toISOString() });
    setIsModalOpen(true);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === TaskStatus.DONE).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
  }), [tasks]);

  const renderDashboard = () => (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">INÍCIO</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organize sua vida hoje</p>
        </div>
        <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
      {!dismissBanner && <MotivationalBanner tasks={tasks} />}
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'PENDENTES', val: stats.todo, color: 'text-indigo-600', bg: 'bg-indigo-50' }, { label: 'EM FOCO', val: stats.inProgress, color: 'text-amber-500', bg: 'bg-amber-50' }, { label: 'FEITO', val: stats.completed, color: 'text-emerald-500', bg: 'bg-emerald-50' }].map(s => (
          <div key={s.label} className={`${s.bg} p-4 rounded-3xl border border-white/50 flex flex-col items-center justify-center shadow-sm`}>
            <span className={`text-xl font-black ${s.color}`}>{s.val}</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarefas Recentes</h3>
          <button onClick={() => setView('kanban')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Ver Kanban →</button>
        </div>
        {tasks.length > 0 ? (
          <div className="space-y-1">
            {tasks.slice(0, 5).map(t => <TaskCard key={t.id} task={t} onUpdateStatus={updateTaskStatus} onDelete={deleteTask} onEdit={setEditingTask} />)}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Sua lista está vazia</p>
            <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Criar Tarefa</button>
          </div>
        )}
      </div>
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-28 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[40]"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg></button>
    </div>
  );

  if (isAuthLoading) return <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center"><div className="w-12 h-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">TASKLY</p></div>;
  if (!session || isResettingPassword) return <AuthPage onLogin={() => setIsResettingPassword(false)} forceResetMode={isResettingPassword} />;

  const navItems = [
    { id: 'dashboard', label: 'INÍCIO', icon: (active: boolean) => <svg className={`w-6 h-6 ${active ? 'text-[#6366f1]' : 'text-slate-400'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zM4 13h7v7H4v-7zM13 4h7v7h-7V4zM13 13h7v7h-7v-7z" /></svg> },
    { id: 'kanban', label: 'KANBAN', icon: (active: boolean) => <svg className={`w-6 h-6 ${active ? 'text-[#6366f1]' : 'text-slate-400'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg> },
    { id: 'agenda', label: 'AGENDA', icon: (active: boolean) => <svg className={`w-6 h-6 ${active ? 'text-[#6366f1]' : 'text-slate-400'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { id: 'notas', label: 'NOTAS', icon: (active: boolean) => <svg className={`w-6 h-6 ${active ? 'text-[#6366f1]' : 'text-slate-400'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: 'foco', label: 'FOCO', icon: (active: boolean) => <svg className={`w-6 h-6 ${active ? 'text-[#6366f1]' : 'text-slate-400'}`} fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-md mx-auto h-screen overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {view === 'dashboard' ? renderDashboard() : 
           view === 'kanban' ? <div className="space-y-6 pb-24"><h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">KANBAN</h1>{[TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE].map(status => (<div key={status} className="bg-white p-4 rounded-[32px] shadow-sm mb-4"><h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 px-2 tracking-widest">{status === TaskStatus.TODO ? 'PENDENTE' : status === TaskStatus.IN_PROGRESS ? 'EM ANDAMENTO' : 'CONCLUÍDO'}</h3>{tasks.filter(t => t.status === status).map(t => <TaskCard key={t.id} task={t} onUpdateStatus={updateTaskStatus} onDelete={deleteTask} onEdit={setEditingTask} />)}</div>))}</div> : 
           view === 'agenda' ? <CalendarView tasks={tasks} onAddWithDate={(d) => { setSelectedCalendarDate(d); setIsModalOpen(true); }} onUpdateStatus={updateTaskStatus} onDelete={deleteTask} onEdit={setEditingTask} /> :
           view === 'notas' ? <NotesView notes={notes} onAdd={() => setIsNoteModalOpen(true)} onEdit={setEditingNote} onTogglePin={(n) => updateNote({...n, pinned: !n.pinned})} /> :
           <FocusMode tasks={tasks} userId={session?.user?.id || ''} />}
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-4 flex justify-around items-center z-50">
          {navItems.map(item => (<button key={item.id} onClick={() => setView(item.id as any)} className="flex flex-col items-center space-y-1 relative px-2"><div className={`p-2 rounded-2xl transition-all ${view === item.id ? 'bg-indigo-50' : ''}`}>{item.icon(view === item.id)}</div><span className={`text-[8px] font-black tracking-[0.1em] ${view === item.id ? 'text-[#6366f1]' : 'text-slate-400'}`}>{item.label}</span></button>))}
        </nav>
      </main>
      {(isModalOpen || editingTask) && <TaskModal onClose={() => { setIsModalOpen(false); setEditingTask(null); setSelectedCalendarDate(undefined); }} onSave={editingTask?.id && tasks.find(t => t.id === editingTask.id) ? updateTask : addTask} task={editingTask || undefined} initialDate={selectedCalendarDate} />}
      {(isNoteModalOpen || editingNote) && <NoteModal onClose={() => { setIsNoteModalOpen(false); setEditingNote(null); }} onSave={editingNote ? updateNote : addNote} onDelete={editingNote && editingNote.id !== 'new' ? () => deleteNote(editingNote.id) : undefined} onTransform={handleTransformToTask} note={editingNote || undefined} />}
    </div>
  );
};

export default App;
