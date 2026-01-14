
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import LandingPage from './LandingPage';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfUseModal from './TermsOfUseModal';
import SupportModal from './SupportModal';

interface AuthPageProps {
  onLogin: () => void;
  forceResetMode?: boolean;
}

type AuthMode = 'login' | 'register' | 'recover' | 'reset';

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, forceResetMode = false }) => {
  const [showLanding, setShowLanding] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
  const [authMode, setAuthMode] = useState<AuthMode>(forceResetMode ? 'reset' : 'login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Carrega e-mail salvo e preferência de "Lembrar-me"
  useEffect(() => {
    const savedEmail = localStorage.getItem('focusflow_saved_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (forceResetMode) setAuthMode('reset');
  }, [forceResetMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (authMode === 'register') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { 
            data: { name },
            emailRedirectTo: window.location.origin 
          }
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, name });
          await supabase.from('user_settings').upsert({ 
            user_id: data.user.id,
            pomodoro_focus: 25,
            pomodoro_break: 5,
            long_break: 15,
            dark_mode: false,
            notifications: true
          });

          setSuccessMessage('Conta criada! Verifique seu e-mail para confirmar.');
          setAuthMode('login');
        }
      } 
      else if (authMode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : signInError.message);
        } else {
          // Salva ou remove e-mail do localStorage conforme a preferência
          if (rememberMe) {
            localStorage.setItem('focusflow_saved_email', email);
          } else {
            localStorage.removeItem('focusflow_saved_email');
          }
          onLogin();
        }
      }
      else if (authMode === 'recover') {
        const { error: recoverError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`,
        });
        
        // Feedback neutro por segurança
        setSuccessMessage('Se este e-mail estiver cadastrado, você receberá um link de recuperação em breve.');
        setAuthMode('login');
      }
      else if (authMode === 'reset') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('A senha deve ter pelo menos 8 caracteres.');
          setLoading(false);
          return;
        }

        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
          setError(updateError.message);
        } else {
          setSuccessMessage('Senha atualizada com sucesso! Você já pode acessar seu dashboard.');
          setAuthMode('login');
        }
      }
    } catch (err: any) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  if (showLanding) {
    return <LandingPage onBack={() => setShowLanding(false)} />;
  }

  const renderForm = () => {
    switch (authMode) {
      case 'recover':
        return (
          <>
            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recuperar Senha</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 px-4">
                Informe seu e-mail para receber um link de redefinição.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">Seu E-mail</label>
                <input required type="email" placeholder="exemplo@flow.com" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                {loading ? 'ENVIANDO...' : 'ENVIAR LINK'}
              </button>
              <button type="button" onClick={() => switchMode('login')} className="w-full text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
                VOLTAR PARA O LOGIN
              </button>
            </form>
          </>
        );
      case 'reset':
        return (
          <>
            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Nova Senha</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 px-4">
                Escolha uma senha forte para proteger seu foco.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">Nova Senha (mín. 8 caracteres)</label>
                <input required type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">Confirmar Nova Senha</label>
                <input required type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                {loading ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
              </button>
            </form>
          </>
        );
      default:
        const isRegistering = authMode === 'register';
        return (
          <>
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {isRegistering ? 'Criar Conta' : 'Acessar App'}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                {isRegistering ? 'Sua jornada começa aqui' : 'Que bom ver você de novo'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">Nome Completo</label>
                  <input required type="text" placeholder="Seu nome" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all" value={name} onChange={e => setName(e.target.value)} />
                </div>
              )}
              
              <div className="animate-in fade-in slide-in-from-left-4 duration-300 stagger-1">
                <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">E-mail</label>
                <input required type="email" placeholder="exemplo@flow.com" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="animate-in fade-in slide-in-from-left-4 duration-300 stagger-2">
                <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">Senha</label>
                <input required type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none font-bold text-slate-700 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              {!isRegistering && (
                <div className="flex items-center justify-between px-1 animate-in fade-in duration-500">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 bg-slate-50 border-2 border-slate-200 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-all" 
                        checked={rememberMe} 
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-600 uppercase tracking-widest transition-colors">Lembrar-me</span>
                  </label>
                  <button type="button" onClick={() => switchMode('recover')} className="text-[9px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors">
                    Esqueceu sua senha?
                  </button>
                </div>
              )}

              {isRegistering && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300 stagger-3">
                  <label className="block text-[10px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">Confirmar Senha</label>
                  <input required type="password" placeholder="••••••••" className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none font-bold text-slate-700 transition-all ${confirmPassword && password !== confirmPassword ? 'border-rose-200' : 'border-slate-50'}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
              )}

              <div className="pt-2">
                <button disabled={loading} type="submit" className="group w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center relative overflow-hidden">
                  {loading ? 'PROCESSANDO...' : isRegistering ? 'CRIAR MINHA CONTA' : 'ENTRAR NO APP'}
                </button>
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-slate-50">
              <button onClick={() => switchMode(isRegistering ? 'login' : 'register')} className="w-full text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center justify-center space-x-2">
                <span>{isRegistering ? 'Já tenho conta? Fazer Login' : 'Não tem conta? Registre-se grátis'}</span>
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden selection:bg-indigo-100 font-sans relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
        <div className="flex-1 max-w-xl animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center space-x-3 mb-8 group cursor-default">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200 transition-transform group-hover:scale-110 group-hover:rotate-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">FocusFlow</h1>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
            Domine sua <span className="text-indigo-600">Produtividade</span>
          </h2>
          <p className="text-slate-500 text-xl mb-4 leading-relaxed font-medium">
            Gerencie tarefas, quadros Kanban e maximize seu foco com o Modo Pomodoro e insights inteligentes de IA.
          </p>
          <div className="flex flex-wrap items-center gap-6 mb-12">
            <button onClick={() => setShowLanding(true)} className="flex items-center space-x-2 px-5 py-2.5 border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all rounded-full font-black text-[10px] uppercase tracking-widest group shadow-sm bg-white">
              <span>Ver como funciona</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 delay-200">
          <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(79,70,229,0.15)] p-10 border border-slate-100 relative overflow-hidden transition-all duration-500">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in slide-in-from-top-2">
                <p className="text-xs font-bold text-rose-600 uppercase text-center">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in slide-in-from-top-2">
                <p className="text-xs font-bold text-emerald-600 uppercase text-center">{successMessage}</p>
              </div>
            )}
            {renderForm()}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 left-0 w-full px-12 flex flex-col md:flex-row items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
        <div className="mb-4 md:mb-0">© 2025 FOCUSFLOW</div>
        <div className="flex space-x-8">
          <button onClick={() => setShowPrivacy(true)} className="hover:text-indigo-400 transition-colors uppercase">Privacidade</button>
          <button onClick={() => setShowTerms(true)} className="hover:text-indigo-400 transition-colors uppercase">Termos</button>
          <button onClick={() => setShowSupport(true)} className="hover:text-indigo-400 transition-colors uppercase">Suporte</button>
        </div>
      </footer>

      {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsOfUseModal onClose={() => setShowTerms(false)} />}
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </div>
  );
};

export default AuthPage;
