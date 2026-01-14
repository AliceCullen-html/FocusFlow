
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus, Priority, TaskCategory } from './types';
import { supabase } from './services/supabase';
import TaskCard from './components/TaskCard';
import MotivationalBanner from './components/MotivationalBanner';
import TaskModal from './components/TaskModal';
import CalendarView from './components/CalendarView';
import FocusMode from './components/FocusMode';
import AuthPage from './components/AuthPage';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'dashboard' | 'kanban' | 'calendar' | 'focus'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Escuta mudanças de autenticação
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsAuthLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event);
      if (event === 'PASSWORD_RECOVERY') {
        setIsResettingPassword(true);
      } else if (event === 'SIGNED_OUT') {
        setIsResettingPassword(false);
        setSession(null);
      } else if (event === 'SIGNED_IN') {
        setSession(session);
        setIsResettingPassword(false);
      }
      setSession(session);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Busca tarefas quando a sessão está ativa e não estamos em modo de recuperação
  useEffect(() => {
    if (session && !isResettingPassword) {
      fetchTasks();
    }
  }, [session, isResettingPassword]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
    setLoading(false);
  };

  const addTask = async (task: Task) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: session.user.id }])
      .select();

    if (!error && data) {
      setTasks([data[0], ...tasks]);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    const { error } = await supabase
      .from('tasks')
      .update(updatedTask)
      .eq('id', updatedTask.id);

    if (!error) {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    }
    setEditingTask(null);
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    const completed_at = status === TaskStatus.DONE ? new Date().toISOString() : null;
    const { error } = await supabase
      .from('tasks')
      .update({ status, completed_at })
      .eq('id', id);

    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status, completed_at } : t));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === TaskStatus.DONE).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
  }), [tasks]);

  // Enquanto verifica a sessão inicial, mostra um loader elegante
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Preparando seu Fluxo...</p>
      </div>
    );
  }

  // Se estivermos em fluxo de redefinição ou sem sessão, mostramos a AuthPage
  if (!session || isResettingPassword) {
    return (
      <AuthPage 
        onLogin={() => setIsResettingPassword(false)} 
        forceResetMode={isResettingPassword} 
      />
    );
  }

  const renderDashboard = () => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const todaysTasks = tasks.filter(t => t.due_date === todayStr && t.status !== TaskStatus.DONE);
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <MotivationalBanner tasks={tasks} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
             <p className="text-sm font-medium text-slate-500 mb-1">Total de Tarefas</p>
             <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Pendentes</p>
            <p className="text-3xl font-bold text-amber-600">{stats.todo}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Em Andamento</p>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Concluídas</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Próximas Tarefas</h2>
            <div className="space-y-3">
              {todaysTasks.length > 0 ? todaysTasks.map(task => (
                <TaskCard key={task.id} task={task} onUpdateStatus={updateTaskStatus} onDelete={deleteTask} onEdit={setEditingTask} />
              )) : (
                <div className="bg-emerald-50 text-emerald-700 p-8 rounded-2xl border border-emerald-100 text-center italic font-medium">
                  Tudo em dia para hoje! Vamos planejar o amanhã?
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Histórico Recente</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {tasks.filter(t => t.status === TaskStatus.DONE).slice(0, 5).map(task => (
                <div key={task.id} className="p-4 flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 z-40">
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">FocusFlow</h1>
          </div>
          <nav className="flex-1 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
              { id: 'kanban', label: 'Kanban', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
              { id: 'calendar', label: 'Calendário', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { id: 'focus', label: 'Modo Foco', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
            ].map(item => (
              <button key={item.id} onClick={() => setView(item.id as any)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${view === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                <span>{item.label}</span>
              </button>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-rose-400 hover:bg-rose-50 mt-4">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               <span>Sair</span>
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-6 md:px-10 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize">{view}</h2>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center">
            Nova Tarefa
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50">
          {loading ? (
             <div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="max-w-6xl mx-auto h-full">
              {view === 'dashboard' ? renderDashboard() : 
               view === 'kanban' ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE].map(status => (
                   <div key={status} className="bg-slate-100/50 p-4 rounded-3xl min-h-[500px]">
                     <h3 className="text-xs font-black text-slate-500 uppercase mb-4 px-2">{status}</h3>
                     {tasks.filter(t => t.status === status).map(t => <TaskCard key={t.id} task={t} onUpdateStatus={updateTaskStatus} onDelete={deleteTask} onEdit={setEditingTask} />)}
                   </div>
                 ))}
               </div> : 
               view === 'calendar' ? <CalendarView tasks={tasks} onAddWithDate={(d) => { setSelectedCalendarDate(d); setIsModalOpen(true); }} /> :
               <FocusMode tasks={tasks} userId={session.user.id} />}
            </div>
          )}
        </div>
      </main>

      {(isModalOpen || editingTask) && (
        <TaskModal 
          onClose={() => { setIsModalOpen(false); setEditingTask(null); setSelectedCalendarDate(undefined); }} 
          onSave={editingTask ? updateTask : addTask} 
          task={editingTask || undefined}
          initialDate={selectedCalendarDate}
        />
      )}
    </div>
  );
};

export default App;
