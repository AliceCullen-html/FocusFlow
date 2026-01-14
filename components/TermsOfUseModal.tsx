
import React from 'react';

interface TermsOfUseModalProps {
  onClose: () => void;
}

const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Termos de Uso</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Aceitação</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Ao utilizar este aplicativo, você concorda com estes termos.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Uso Permitido</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              O usuário compromete-se a utilizar o app de forma legal, sendo proibido qualquer comportamento que possa danificar a plataforma ou outros usuários.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Propriedade Intelectual</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Todo o conteúdo, design e código deste app são de nossa propriedade exclusiva.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Limitação de Responsabilidade</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              O app é fornecido "como está". Não nos responsabilizamos por falhas de conexão ou uso indevido por parte do usuário.
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

export default TermsOfUseModal;
