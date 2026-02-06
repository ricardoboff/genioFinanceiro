
import React, { useState, useMemo } from 'react';
import { BankAccount } from '../types';

interface Props {
  accounts: BankAccount[];
  onConnect: (bank: string, rawData: string) => void;
  onSync: (id: string) => void;
}

const ALL_INSTITUTIONS = [
  { name: 'Nubank', color: 'bg-purple-600', icon: 'fa-n' },
  { name: 'Itaú', color: 'bg-orange-500', icon: 'fa-i' },
  { name: 'Bradesco', color: 'bg-red-600', icon: 'fa-b' },
  { name: 'Sicoob', color: 'bg-teal-700', icon: 'fa-circle-nodes' },
  { name: 'Inter', color: 'bg-orange-400', icon: 'fa-minus' },
  { name: 'Santander', color: 'bg-red-700', icon: 'fa-s' }
];

// Dados brutos simulados que viriam da API do Banco via Open Finance
const MOCK_RAW_STATEMENTS: Record<string, string> = {
  'Nubank': "01/10 COMPRA DEBITO 3422 UBER* TRIP R$ 25,90 | 02/10 RECEBIMENTO PIX SALARIO EMPRESA X R$ 4500,00 | 05/10 PAGAMENTO BOLETO ENEL DISTR R$ 180,50",
  'Itaú': "EXTRATO 10/10 - DEB. AUTOMATICO NETFLIX COM BR R$ 55,90 | 11/10 CREDITO TED JOAO SILVA R$ 150,00 | 12/10 COMPRA IFOOD *RESTAURANTE R$ 89,00",
  'Sicoob': "MOVIMENTACAO: 15/10 - SAQUE TERMINAL 001 R$ 100,00 | 16/10 - COMPRA POSTO IPIRANGA R$ 250,00 | 17/10 - RENDIMENTO APLICACAO R$ 12,40"
};

const BankConnection: React.FC<Props> = ({ accounts, onConnect, onSync }) => {
  const [step, setStep] = useState<'list' | 'consent' | 'syncing'>('list');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = useMemo(() => {
    return ALL_INSTITUTIONS.filter(bank => 
      bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleStartConnection = (bankName: string) => {
    setSelectedBank(bankName);
    setStep('consent');
  };

  const handleAuthorize = () => {
    setStep('syncing');
    const rawData = selectedBank ? MOCK_RAW_STATEMENTS[selectedBank] || MOCK_RAW_STATEMENTS['Nubank'] : '';
    
    // Simula o tempo de handshake do Open Finance + Processamento de IA
    setTimeout(() => {
      if (selectedBank) onConnect(selectedBank, rawData);
      setStep('list');
      setSelectedBank(null);
    }, 3500);
  };

  return (
    <div className="space-y-6 pt-4">
      {step === 'list' && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Open Finance</h2>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Conexão Segura Ativa</p>
            </div>
            <button 
              onClick={() => setStep('list')}
              className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center"
            >
              <i className="fa-solid fa-shield-halved"></i>
            </button>
          </div>

          <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold text-sm mb-2">Por que conectar?</h3>
            <p className="text-[11px] text-indigo-100 leading-relaxed mb-4">
              Nossa IA analisa seu extrato real, limpa os nomes dos estabelecimentos e categoriza tudo automaticamente para você.
            </p>
            <button 
              onClick={() => {}} 
              className="bg-white/20 hover:bg-white/30 p-4 rounded-2xl w-full flex items-center justify-center gap-3 transition-all"
            >
              <i className="fa-solid fa-plus"></i>
              <span className="text-xs font-bold">Conectar Nova Instituição</span>
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Instituições Disponíveis</h4>
            <div className="grid grid-cols-1 gap-3">
              {filteredBanks.map(bank => (
                <button 
                  key={bank.name}
                  onClick={() => handleStartConnection(bank.name)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group active:scale-95 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${bank.color} flex items-center justify-center text-white`}>
                      <i className={`fa-solid ${bank.icon}`}></i>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{bank.name}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 group-hover:text-indigo-500 transition-colors"></i>
                </button>
              ))}
            </div>
          </div>

          {accounts.length > 0 && (
            <div className="pt-4 space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Contas Conectadas</h4>
              {accounts.map(acc => (
                <div key={acc.id} className="bg-white p-5 rounded-[2rem] border-l-4 border-l-emerald-500 shadow-sm flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="text-slate-800 font-bold text-sm">{acc.institution}</div>
                     <span className="text-[8px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Sincronizado</span>
                   </div>
                   <button onClick={() => onSync(acc.id)} className="text-indigo-600 text-[10px] font-bold uppercase">
                     Atualizar <i className="fa-solid fa-rotate text-[8px] ml-1"></i>
                   </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {step === 'consent' && (
        <div className="fixed inset-0 z-[200] bg-white animate-fade-in flex flex-col p-8">
           <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-building-columns text-4xl text-indigo-600"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">Autorizar Acesso</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">
                Ao prosseguir, você autoriza o <strong>Gênio Financeiro</strong> a ler seus dados de transações do <strong>{selectedBank}</strong> via Open Finance.
              </p>

              <div className="w-full space-y-3 text-left bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dados compartilhados:</p>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <i className="fa-solid fa-check text-emerald-500"></i> Saldos e limites
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <i className="fa-solid fa-check text-emerald-500"></i> Extratos (últimos 90 dias)
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <i className="fa-solid fa-check text-emerald-500"></i> Dados da conta
                </div>
              </div>
           </div>

           <div className="space-y-3 pb-8">
              <button 
                onClick={handleAuthorize}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold text-lg shadow-xl shadow-indigo-100"
              >
                Autorizar e Sincronizar
              </button>
              <button 
                onClick={() => setStep('list')}
                className="w-full py-5 bg-white text-slate-400 rounded-3xl font-bold text-sm"
              >
                Cancelar
              </button>
           </div>
        </div>
      )}

      {step === 'syncing' && (
        <div className="fixed inset-0 z-[300] bg-indigo-600 flex flex-col items-center justify-center p-12 text-center text-white">
           <div className="relative w-24 h-24 mb-8">
             <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-robot text-2xl"></i>
             </div>
           </div>
           <h3 className="text-xl font-bold mb-2">Conectando ao {selectedBank}...</h3>
           <p className="text-indigo-100 text-sm opacity-80 animate-pulse">
             O Gênio de IA está analisando seus lançamentos e organizando seu extrato.
           </p>
           
           <div className="mt-12 w-full max-w-xs">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60">
                <span>Extraindo Dados</span>
                <span>80%</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-4/5"></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BankConnection;
