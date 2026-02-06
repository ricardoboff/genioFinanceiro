
import React, { useState, useMemo } from 'react';
import { BankAccount } from '../types';

interface Props {
  accounts: BankAccount[];
  onConnect: (bank: string) => void;
  onSync: (id: string) => void;
}

// Lista expandida de instituições financeiras brasileiras
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
  { name: 'Caixa Econômica', color: 'bg-blue-600', icon: 'fa-building-columns' },
  { name: 'Safra', color: 'bg-amber-700', icon: 'fa-shield-halved' },
  { name: 'Neon', color: 'bg-cyan-500', icon: 'fa-n' },
  { name: 'Banco Pan', color: 'bg-blue-500', icon: 'fa-p' },
  { name: 'Banrisul', color: 'bg-blue-800', icon: 'fa-b' },
  { name: 'Bmg', color: 'bg-orange-600', icon: 'fa-m' }
];

const BankConnection: React.FC<Props> = ({ accounts, onConnect, onSync }) => {
  const [showSelector, setShowSelector] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = useMemo(() => {
    return ALL_INSTITUTIONS.filter(bank => 
      bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleConnectSimulated = (bank: string) => {
    setIsConnecting(true);
    setShowSelector(false);
    setSearchTerm('');
    // Simula o tempo de autenticação do Open Finance
    setTimeout(() => {
      onConnect(bank);
      setIsConnecting(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Suas Contas</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Open Finance Ativo</p>
        </div>
        <button 
          onClick={() => setShowSelector(true)}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-plus text-lg"></i>
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 flex gap-4 items-center">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
          <i className="fa-solid fa-shield-check"></i>
        </div>
        <div>
          <p className="text-xs font-bold text-indigo-900">Segurança de Dados</p>
          <p className="text-[10px] text-indigo-700 leading-tight">
            Conexão direta via APIs oficiais. O Gênio não armazena suas senhas bancárias.
          </p>
        </div>
      </div>

      {isConnecting && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center animate-pulse">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-700">Conectando ao banco...</p>
          <p className="text-[10px] text-slate-400 mt-1">Isso pode levar alguns segundos</p>
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
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Sincronizado {new Date(acc.lastSync).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-800">R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <button 
                onClick={() => onSync(acc.id)}
                className="text-[9px] text-indigo-600 font-bold uppercase tracking-widest mt-1.5 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
              >
                Atualizar <i className="fa-solid fa-rotate-right ml-1"></i>
              </button>
            </div>
          </div>
        ))}

        {accounts.length === 0 && !isConnecting && (
          <div className="text-center py-16 px-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-slate-200">
              <i className="fa-solid fa-building-columns text-3xl"></i>
            </div>
            <h3 className="text-slate-800 font-bold mb-2">Sem contas vinculadas</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-8">
              Conecte seus bancos e cooperativas para importar seus gastos em tempo real.
            </p>
            <button 
              onClick={() => setShowSelector(true)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all"
            >
              Adicionar minha primeira conta
            </button>
          </div>
        )}
      </div>

      {showSelector && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowSelector(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-[3rem] sm:rounded-[3rem] p-6 pb-12 animate-slide-up flex flex-col max-h-[90vh]">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Escolha sua Instituição</h3>
              <p className="text-xs text-slate-400 mt-1">Mais de 1.000 bancos disponíveis via Open Finance</p>
            </div>

            {/* Barra de Busca */}
            <div className="relative mb-6">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
              <input 
                type="text" 
                placeholder="Pesquisar banco, cooperativa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                autoFocus
              />
            </div>

            {/* Lista de Bancos com Scroll */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredBanks.length > 0 ? (
                filteredBanks.map(bank => (
                  <button 
                    key={bank.name}
                    onClick={() => handleConnectSimulated(bank.name)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/50 transition-all active:scale-98"
                  >
                    <div className={`w-12 h-12 rounded-xl ${bank.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                      <i className={`fa-solid ${bank.icon} text-lg`}></i>
                    </div>
                    <span className="text-sm font-bold text-slate-700 flex-1 text-left">{bank.name}</span>
                    <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
                  </button>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-slate-400">Nenhum banco encontrado para "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default BankConnection;
