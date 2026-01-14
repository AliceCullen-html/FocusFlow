
import React from 'react';

interface SupportModalProps {
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Suporte</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <section className="space-y-2">
            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest">Fale Conosco</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Estamos aqui para ajudar! Se você encontrar qualquer problema ou tiver sugestões, entre em contato através do nosso canal oficial.
            </p>
          </section>

          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-3">
              <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                  </div>
                  <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail de suporte</p>
                      <p className="text-indigo-600 font-bold">Em andamento...</p>
                  </div>
              </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100"
          >
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
