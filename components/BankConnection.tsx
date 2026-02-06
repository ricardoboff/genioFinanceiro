
import React, { useState, useMemo } from 'react';
import { BankAccount } from '../types';

interface Props {
  accounts: BankAccount[];
  onConnect: (bank: string, initialBalance: number) => void;
  onSync: (id: string) => void;
}

const ALL_INSTITUTIONS = [
  { name: 'Nubank', color: 'bg-purple-600', icon: 'fa-n' },
  { name: 'Itaú', color: 'bg-orange-500', icon: 'fa-i' },
  { name: 'Bradesco', color: 'bg-red-600', icon: 'fa-b' },
  { name: 'Banco do Brasil', color: 'bg-yellow-400', icon: 'fa-building-columns' },
  { name: 'Santander', color: 'bg-red-700', icon: 'fa-s' },
  { name: 'Inter', color: 'bg-orange-400', icon: 'fa-minus' },
  { name: 'Sicoob', color: 'bg-teal-700', icon: 'fa-circle-nodes' },
  { name: 'Sicredi', color: 'bg-green-600', icon: 'fa-leaf' },
  { name: 'BTG Pactual', color: 'bg-slate-900', icon: 'fa-chart-pie' },
  { name: 'XP Investimentos', color: 'bg-black', icon: 'fa-x' },
  { name: 'C6 Bank', color: 'bg-zinc-800', icon: 'fa-c' },
  { name: 'Caixa Econômica', color: 'bg-blue-600', icon: 'fa-building-columns' }
];

const BankConnection: React.FC<Props> = ({ accounts, onConnect, onSync }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [initialBalance, setInitialBalance] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = useMemo(() => {
    return ALL_INSTITUTIONS.filter(bank => 
      bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleStartConnection = (bankName: string) => {
    setSelectedBank(bankName);
  };

  const handleConfirmConnection = () => {
    if (!selectedBank) return;
    
    setIsConnecting(true);
    const balance = parseFloat(initialBalance.replace(',', '.')) || 0;
    
    // Simula o delay de comunicação com a API do Banco
    setTimeout(() => {
      onConnect(selectedBank, balance);
      setIsConnecting(false);
      setShowSelector(false);
      setSelectedBank(null);
      setInitialBalance('');
      setSearchTerm('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Suas Contas</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Modo Demonstração</p>
        </div>
        <button 
          onClick={() => setShowSelector(true)}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-plus text-lg"></i>
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex gap-4 items-center">
        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shrink-0">
          <i className="fa-solid fa-flask"></i>
        </div>
        <div>
          <p className="text-xs font-bold text-amber-900">Ambiente de Teste</p>
          <p className="text-[10px] text-amber-700 leading-tight">
            Para fins didáticos, você define o saldo inicial e o app simula as transações bancárias.
          </p>
        </div>
      </div>

      {isConnecting && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-700">Autenticando no {selectedBank}...</p>
          <p className="text-[10px] text-slate-400 mt-1">Conexão segura via Open Finance</p>
        </div>
      )}

      <div className="space-y-3">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner ${
                ALL_INSTITUTIONS.find(b => b.name === acc.institution)?.color || 'bg-slate-400'
              }`}>
                <i className={`fa-solid ${ALL_INSTITUTIONS.find(b => b.name === acc.institution)?.icon || 'fa-building'}`}></i>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{acc.institution}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Conectado</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-800">R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <button 
                onClick={() => onSync(acc.id)}
                className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest mt-1.5"
              >
                Sincronizar <i className="fa-solid fa-rotate-right ml-1"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showSelector && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowSelector(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[3rem] p-6 pb-12 animate-slide-up flex flex-col max-h-[90vh]">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            {!selectedBank ? (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Escolha o Banco</h3>
                  <p className="text-xs text-slate-400 mt-1">Pesquise sua instituição</p>
                </div>
                <div className="relative mb-6">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                  <input 
                    type="text" 
                    placeholder="Nome do banco..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {filteredBanks.map(bank => (
                    <button 
                      key={bank.name}
                      onClick={() => handleStartConnection(bank.name)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:bg-slate-50 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl ${bank.color} flex items-center justify-center text-white shrink-0`}>
                        <i className={`fa-solid ${bank.icon}`}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button onClick={() => setSelectedBank(null)} className="mb-4 text-xs font-bold text-indigo-600 flex items-center gap-2">
                  <i className="fa-solid fa-arrow-left"></i> Voltar para lista
                </button>
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-white text-3xl shadow-lg ${
                    ALL_INSTITUTIONS.find(b => b.name === selectedBank)?.color
                  }`}>
                    <i className={`fa-solid ${ALL_INSTITUTIONS.find(b => b.name === selectedBank)?.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Saldo no {selectedBank}</h3>
                  <p className="text-xs text-slate-400 mt-1">Informe seu saldo real para sincronizar</p>
                </div>

                <div className="mb-8">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-center">Saldo Atual (R$)</label>
                  <input 
                    type="text"
                    inputMode="decimal"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    placeholder="0,00"
                    className="w-full text-center text-4xl font-black text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-100"
                    autoFocus
                  />
                </div>

                <button 
                  onClick={handleConfirmConnection}
                  disabled={isConnecting}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  Confirmar e Sincronizar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default BankConnection;
