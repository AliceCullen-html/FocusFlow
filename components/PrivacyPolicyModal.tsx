
import React from 'react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Política de Privacidade</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Coleta de Dados</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Coletamos informações básicas como nome e e-mail para identificação e dados de uso para melhorar sua experiência.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Uso das Informações</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Seus dados são utilizados exclusivamente para o funcionamento do app e não são vendidos a terceiros.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Segurança</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Utilizamos criptografia e práticas de segurança para proteger suas informações.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Seus Direitos</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Você pode solicitar a exclusão da sua conta e de seus dados a qualquer momento através das configurações do perfil ou suporte.
            </p>
          </section>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
          >
            ENTENDI E ACEITO
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
