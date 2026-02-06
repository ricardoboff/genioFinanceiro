
import React, { useState } from 'react';
import { BankAccount } from '../types';

interface Props {
  accounts: BankAccount[];
  onConnect: (bank: string) => void;
  onSync: (id: string) => void;
}

const AVAILABLE_BANKS = [
  { name: 'Nubank', color: 'bg-purple-600', icon: 'fa-n' },
  { name: 'Itaú', color: 'bg-orange-500', icon: 'fa-i' },
  { name: 'Bradesco', color: 'bg-red-600', icon: 'fa-b' },
  { name: 'Banco do Brasil', color: 'bg-yellow-400', icon: 'fa-building-columns' },
  { name: 'Inter', color: 'bg-orange-400', icon: 'fa-minus' }
];

const BankConnection: React.FC<Props> = ({ accounts, onConnect, onSync }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectSimulated = (bank: string) => {
    setIsConnecting(true);
    setShowSelector(false);
    // Simula o tempo de autenticação do Open Finance
    setTimeout(() => {
      onConnect(bank);
      setIsConnecting(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Bancos Conectados</h2>
        <button 
          onClick={() => setShowSelector(true)}
          className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3 items-start">
        <i className="fa-solid fa-shield-halved text-indigo-600 mt-1"></i>
        <div>
          <p className="text-xs font-bold text-indigo-900">Segurança Open Finance</p>
          <p className="text-[10px] text-indigo-700 leading-tight mt-1">
            Seus dados são protegidos por criptografia de ponta a ponta e regulados pelo Banco Central.
          </p>
        </div>
      </div>

      {isConnecting && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-700">Autenticando com a instituição...</p>
          <p className="text-[10px] text-slate-400 mt-1">Redirecionando para o ambiente seguro</p>
        </div>
      )}

      <div className="space-y-3">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${
                AVAILABLE_BANKS.find(b => b.name === acc.institution)?.color || 'bg-slate-400'
              }`}>
                <i className={`fa-solid ${AVAILABLE_BANKS.find(b => b.name === acc.institution)?.icon}`}></i>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{acc.institution}</p>
                <p className="text-[10px] text-slate-400">Última sincronização: {new Date(acc.lastSync).toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-800">R$ {acc.balance.toLocaleString('pt-BR')}</p>
              <button 
                onClick={() => onSync(acc.id)}
                className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-1"
              >
                Sincronizar <i className="fa-solid fa-rotate ml-1"></i>
              </button>
            </div>
          </div>
        ))}

        {accounts.length === 0 && !isConnecting && (
          <div className="text-center py-12 px-8 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <i className="fa-solid fa-link-slash text-slate-300 text-xl"></i>
            </div>
            <p className="text-slate-500 text-sm font-bold mb-1">Nenhuma conta conectada</p>
            <p className="text-slate-400 text-[10px] leading-relaxed mb-6">
              Conecte seus bancos para importar lançamentos automaticamente via Open Finance.
            </p>
            <button 
              onClick={() => setShowSelector(true)}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-xs border border-indigo-100 shadow-sm"
            >
              Conectar Primeiro Banco
            </button>
          </div>
        )}
      </div>

      {showSelector && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSelector(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-[2.5rem] p-8 animate-slide-up">
            <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Selecione seu Banco</h3>
            <div className="grid grid-cols-2 gap-4 pb-10">
              {AVAILABLE_BANKS.map(bank => (
                <button 
                  key={bank.name}
                  onClick={() => handleConnectSimulated(bank.name)}
                  className="flex flex-col items-center gap-3 p-4 rounded-3xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl ${bank.color} flex items-center justify-center text-white shadow-lg`}>
                    <i className={`fa-solid ${bank.icon} text-lg`}></i>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{bank.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankConnection;
