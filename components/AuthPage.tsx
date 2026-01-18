
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

  useEffect(() => {
    const savedEmail = localStorage.getItem('taskly_saved_email');
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
          options: { data: { name }, emailRedirectTo: window.location.origin }
        });
        if (signUpError) setError(signUpError.message);
        else if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, name });
          setSuccessMessage('Conta criada! Verifique seu e-mail.');
          setAuthMode('login');
        }
      } 
      else if (authMode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) setError(signInError.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : signInError.message);
        else {
          if (rememberMe) localStorage.setItem('taskly_saved_email', email);
          else localStorage.removeItem('taskly_saved_email');
          onLogin();
        }
      }
      else if (authMode === 'recover') {
        await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        setSuccessMessage('Link de recuperação enviado (se o e-mail existir).');
        setAuthMode('login');
      }
      else if (authMode === 'reset') {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) setError(updateError.message);
        else {
          setSuccessMessage('Senha atualizada! Acesse sua conta.');
          setAuthMode('login');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (showLanding) return <LandingPage onBack={() => setShowLanding(false)} />;

  const inputContainerClass = "relative w-full mb-4";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2 ml-1";
  // Alterado para text-base (16px) e padding maior para conforto no toque
  const inputClass = "w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[20px] focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/5 outline-none font-medium text-slate-800 transition-all placeholder:text-slate-300 text-base appearance-none";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:p-8 font-sans overflow-y-auto">
      {/* Header Logo */}
      <div className="w-full flex items-center space-x-3 mt-8 md:mt-12 mb-10 md:mb-14">
        <div className="w-11 h-11 bg-[#6366f1] rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">TASKLY</h1>
      </div>

      {/* Hero Text */}
      <div className="w-full max-w-sm mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.1] mb-5 tracking-tight">
          Domine sua <span className="text-[#6366f1]">Produtividade</span>
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed text-sm">
          Gerencie tarefas, organize notas e maximize seu foco em um só lugar.
        </p>
      </div>

      {/* Auth Form Container */}
      <div className="w-full max-w-sm flex-1">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div className={inputContainerClass}>
              <label className={labelClass}>Nome</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input required type="text" placeholder="Seu nome" className={inputClass} value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
          )}

          <div className={inputContainerClass}>
            <label className={labelClass}>E-mail</label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input required type="email" placeholder="seu@email.com" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          {(authMode === 'login' || authMode === 'register' || authMode === 'reset') && (
            <div className={inputContainerClass}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Senha</label>
                {authMode === 'login' && (
                  <button type="button" onClick={() => setAuthMode('recover')} className="text-xs font-bold text-[#6366f1] hover:underline">Esqueceu?</button>
                )}
              </div>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input required type="password" placeholder="••••••••" className={inputClass} value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <div className={inputContainerClass}>
              <label className={labelClass}>Confirmar Senha</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <input required type="password" placeholder="••••••••" className={inputClass} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>
          )}

          <div className="pt-6 space-y-4">
            <button disabled={loading} type="submit" className="w-full h-16 bg-[#6366f1] text-white rounded-[20px] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all flex items-center justify-center space-x-2">
              <span>{loading ? 'CARREGANDO...' : authMode === 'login' ? 'ENTRAR' : authMode === 'register' ? 'CRIAR CONTA' : 'RECUPERAR'}</span>
            </button>
            
            <button 
              type="button" 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="w-full h-16 bg-slate-50 text-slate-900 border border-slate-100 rounded-[20px] font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all"
            >
              {authMode === 'login' ? 'CADASTRAR' : 'VOLTAR PARA LOGIN'}
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex space-x-6 pb-6">
        <button onClick={() => setShowPrivacy(true)}>PRIVACIDADE</button>
        <button onClick={() => setShowTerms(true)}>TERMOS</button>
      </footer>

      {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsOfUseModal onClose={() => setShowTerms(false)} />}
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </div>
  );
};

export default AuthPage;
