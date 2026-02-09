
import React, { useState, useMemo } from 'react';
import { BankAccount } from '../types';

interface Props {
  accounts: BankAccount[];
  onConnect: (info: { name: string, agency: string, account: string, rawData: string }) => void;
  onSync: (id: string) => void;
}

const ALL_INSTITUTIONS = [
  { name: 'Nubank', color: 'bg-purple-600', hex: '#820ad1', icon: 'fa-n' },
  { name: 'Itaú', color: 'bg-orange-500', hex: '#ff7800', icon: 'fa-i' },
  { name: 'Bradesco', color: 'bg-red-600', hex: '#cc092f', icon: 'fa-b' },
  { name: 'Sicoob', color: 'bg-teal-700', hex: '#003641', icon: 'fa-circle-nodes' },
  { name: 'Inter', color: 'bg-orange-400', hex: '#ff7a00', icon: 'fa-minus' },
  { name: 'Santander', color: 'bg-red-700', hex: '#ec0000', icon: 'fa-s' }
];

const getMonthDate = (day: string) => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${year}-${month}-${day}`;
};

const MOCK_RAW_STATEMENTS: Record<string, string> = {
  'Nubank': `${getMonthDate('01')} COMPRA DEBITO 3422 UBER* TRIP R$ 25,90 | ${getMonthDate('02')} RECEBIMENTO PIX SALARIO EMPRESA X R$ 4500,00 | ${getMonthDate('05')} PAGAMENTO BOLETO ENEL DISTR R$ 180,50`,
  'Itaú': `${getMonthDate('10')} EXTRATO - DEB. AUTOMATICO NETFLIX COM BR R$ 55,90 | ${getMonthDate('11')} CREDITO TED JOAO SILVA R$ 150,00 | ${getMonthDate('12')} COMPRA IFOOD *RESTAURANTE R$ 89,00`,
  'Sicoob': `${getMonthDate('15')} MOVIMENTACAO: SAQUE TERMINAL 001 R$ 100,00 | ${getMonthDate('16')} COMPRA POSTO IPIRANGA R$ 250,00 | ${getMonthDate('17')} RENDIMENTO APLICACAO R$ 12,40`
};

type ConnectionStep = 'list' | 'cpf' | 'redirecting' | 'bank_login' | 'syncing';

const BankConnection: React.FC<Props> = ({ accounts, onConnect, onSync }) => {
  const [step, setStep] = useState<ConnectionStep>('list');
  const [selectedBank, setSelectedBank] = useState<typeof ALL_INSTITUTIONS[0] | null>(null);
  const [cpf, setCpf] = useState('');
  const [agency, setAgency] = useState('0001');
  const [accountNum, setAccountNum] = useState('12345-6');
  const [bankPass, setBankPass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = useMemo(() => {
    return ALL_INSTITUTIONS.filter(bank => 
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !accounts.some(acc => acc.institution === bank.name)
    );
  }, [searchTerm, accounts]);

  const handleStartConnection = (bank: typeof ALL_INSTITUTIONS[0]) => {
    setSelectedBank(bank);
    setStep('cpf');
  };

  const handleCpfSubmit = () => {
    if (cpf.length < 11) return alert("Por favor, insira um CPF válido.");
    setStep('redirecting');
    setTimeout(() => setStep('bank_login'), 2000);
  };

  const handleBankAuth = () => {
    if (!agency || !accountNum || !bankPass) return alert("Preencha todos os campos do banco.");
    
    setStep('syncing');
    const rawData = selectedBank ? MOCK_RAW_STATEMENTS[selectedBank.name] || MOCK_RAW_STATEMENTS['Nubank'] : '';
    
    setTimeout(() => {
      if (selectedBank) {
        onConnect({
          name: selectedBank.name,
          agency,
          account: accountNum,
          rawData
        });
      }
      setStep('list');
      setSelectedBank(null);
      setCpf('');
      setBankPass('');
    }, 3500);
  };

  return (
    <div className="space-y-6 pt-4 pb-24 h-full overflow-y-auto">
      {step === 'list' && (
        <>
          <div className="flex justify-between items-center px-1">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Minhas Contas</h2>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Open Finance Ativo</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-shield-check"></i>
            </div>
          </div>

          {/* Seção de Contas Conectadas */}
          {accounts.length > 0 && (
            <div className="space-y-4">
              {accounts.map(acc => {
                const bankInfo = ALL_INSTITUTIONS.find(i => i.name === acc.institution);
                return (
                  <div key={acc.id} className="relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full opacity-5 ${bankInfo?.color || 'bg-slate-400'}`}></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${bankInfo?.color || 'bg-slate-400'} flex items-center justify-center text-white text-xl shadow-inner`}>
                          <i className={`fa-solid ${bankInfo?.icon || 'fa-building-columns'}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{acc.institution}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Ag: {acc.agency} | Cc: {acc.accountNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${acc.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <button onClick={() => onSync(acc.id)} className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1 hover:underline">
                          Sincronizar <i className="fa-solid fa-rotate ml-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {accounts.length === 0 && (
            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fa-solid fa-building-columns text-6xl"></i>
              </div>
              <h3 className="font-bold text-sm mb-2">Conecte seu primeiro banco</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Importe seus gastos automaticamente usando a tecnologia Open Finance do Banco Central.
              </p>
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                <i className="fa-solid fa-lock"></i>
                CRIPTOGRAFIA DE PONTA A PONTA
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Conectar novo banco</h4>
            <div className="grid grid-cols-1 gap-3">
              {filteredBanks.map(bank => (
                <button 
                  key={bank.name}
                  onClick={() => handleStartConnection(bank)}
                  className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group active:scale-95 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${bank.color} flex items-center justify-center text-white text-xl shadow-inner`}>
                      <i className={`fa-solid ${bank.icon}`}></i>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">{bank.name}</span>
                      <span className="text-[9px] text-slate-400 font-medium">Disponível via Open Finance</span>
                    </div>
                  </div>
                  <i className="fa-solid fa-plus text-[12px] text-slate-200 group-hover:text-indigo-500 transition-colors"></i>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {step === 'cpf' && (
        <div className="fixed inset-0 z-[200] bg-white animate-fade-in flex flex-col p-8">
           <button onClick={() => setStep('list')} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-8">
             <i className="fa-solid fa-arrow-left"></i>
           </button>
           <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-3xl ${selectedBank?.color} flex items-center justify-center text-white text-3xl shadow-lg`}>
                  <i className={`fa-solid ${selectedBank?.icon}`}></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Conectar {selectedBank?.name}</h3>
                  <p className="text-xs text-slate-500">Primeiro, identifique-se com seu CPF</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">CPF do Titular</label>
                  <input 
                    type="tel"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button 
                  onClick={handleCpfSubmit}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  Continuar
                </button>
              </div>
           </div>
           <p className="text-center text-[10px] text-slate-300 font-medium pb-8">Protegido por Gênio Financeiro Open Auth</p>
        </div>
      )}

      {step === 'redirecting' && (
        <div className="fixed inset-0 z-[300] bg-slate-50 flex flex-col items-center justify-center p-12 text-center">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-8 animate-bounce">
              <i className="fa-solid fa-share-from-square text-3xl text-indigo-500"></i>
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Redirecionando...</h3>
           <p className="text-sm text-slate-500 leading-relaxed">
             Estamos te levando para o ambiente seguro do <strong>{selectedBank?.name}</strong> para você autorizar o acesso.
           </p>
           <div className="mt-8 flex gap-2">
             <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
             <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse delay-75"></div>
             <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse delay-150"></div>
           </div>
        </div>
      )}

      {step === 'bank_login' && (
        <div className={`fixed inset-0 z-[400] ${selectedBank?.color} flex flex-col animate-slide-up overflow-y-auto pb-8`}>
           <div className="p-8 pt-16 flex-1 flex flex-col min-h-full">
              <div className="flex justify-between items-center mb-12">
                <i className={`fa-solid ${selectedBank?.icon} text-4xl text-white`}></i>
                <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] text-white font-bold tracking-widest uppercase">Ambiente Seguro</div>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2">Acessar Conta</h2>
              <p className="text-white/70 text-sm mb-12">Autorize o compartilhamento de dados.</p>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-5 rounded-3xl border border-white/20">
                    <label className="text-[10px] text-white/50 font-bold uppercase mb-1 block">Agência</label>
                    <input 
                      type="tel"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
                    />
                  </div>
                  <div className="bg-white/10 p-5 rounded-3xl border border-white/20">
                    <label className="text-[10px] text-white/50 font-bold uppercase mb-1 block">Conta</label>
                    <input 
                      type="tel"
                      value={accountNum}
                      onChange={(e) => setAccountNum(e.target.value)}
                      className="w-full bg-transparent text-white font-bold text-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-white/10 p-5 rounded-3xl border border-white/20 group focus-within:bg-white/20 transition-all">
                  <label className="text-[10px] text-white/50 font-bold uppercase mb-1 block">Senha Eletrônica</label>
                  <input 
                    type="password"
                    value={bankPass}
                    onChange={(e) => setBankPass(e.target.value)}
                    placeholder="Sua senha bancária"
                    className="w-full bg-transparent text-white font-bold text-lg placeholder:text-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-[2.5rem] mb-8 border border-white/10">
                 <p className="text-xs text-white font-bold mb-4">Dados Solicitados:</p>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 text-[11px] text-white/80">
                     <i className="fa-solid fa-circle-check text-white"></i> Extratos de 90 dias
                   </div>
                   <div className="flex items-center gap-3 text-[11px] text-white/80">
                     <i className="fa-solid fa-circle-check text-white"></i> Saldos e Investimentos
                   </div>
                 </div>
              </div>

              <div className="mt-auto space-y-3">
                <button 
                  onClick={handleBankAuth}
                  className="w-full py-5 bg-white text-slate-900 rounded-[2rem] font-bold text-lg shadow-xl active:scale-95 transition-all"
                >
                  Confirmar e Autorizar
                </button>
                <button 
                  onClick={() => setStep('list')}
                  className="w-full py-4 text-white/60 font-bold text-sm"
                >
                  Cancelar
                </button>
              </div>
           </div>
        </div>
      )}

      {step === 'syncing' && (
        <div className="fixed inset-0 z-[500] bg-indigo-600 flex flex-col items-center justify-center p-12 text-center text-white">
           <div className="relative w-32 h-32 mb-12">
             <div className="absolute inset-0 border-8 border-white/10 rounded-full"></div>
             <div className="absolute inset-0 border-8 border-white border-t-transparent rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <i className="fa-solid fa-robot text-3xl mb-1"></i>
                <span className="text-[8px] font-black uppercase tracking-tighter">IA Gênio</span>
             </div>
           </div>
           <h3 className="text-2xl font-black mb-4">Importando Lançamentos</h3>
           <p className="text-indigo-100 text-sm opacity-80 max-w-xs leading-relaxed">
             O Gênio está analisando seu extrato em tempo real. Cada gasto está sendo categorizado.
           </p>
           
           <div className="mt-16 w-full max-w-xs bg-white/10 p-4 rounded-3xl">
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-progress-fill"></div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-fill {
          animation: progress-fill 3.5s linear forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default BankConnection;
