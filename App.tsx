
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, View, UserProfile, BankAccount, CATEGORIES } from './types';
import { storageService } from './services/storageService';
// Fix: Import auth instance and methods from our local config to avoid module resolution errors
import { 
  auth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from './services/firebaseConfig';

import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Analytics from './components/Analytics';
import AIAssistant from './components/AIAssistant';
import TransactionForm from './components/TransactionForm';
import MonthSelector from './components/MonthSelector';
import BankConnection from './components/BankConnection';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminPanel from './components/Admin/AdminPanel';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Escuta mudanças no estado de autenticação via modular SDK.
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await storageService.getProfile(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error("Erro ao carregar perfil:", err);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setTransactions([]);
        setBankAccounts([]);
      }
      setIsLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = storageService.subscribeTransactions(currentUser.uid, (data) => {
      setTransactions(data);
    });
    return () => unsub();
  }, [currentUser]);

  // Implementação da lógica de login utilizando modular SDK
  const handleLogin = async (username: string, pass: string) => {
    try {
      // Como o app usa username, simulamos um e-mail para o Firebase Auth.
      const email = `${username.trim().toLowerCase()}@genio.com`;
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      console.error("Erro de login:", e);
      alert("Erro ao entrar: Verifique seu usuário e senha.");
    }
  };

  // Implementação da lógica de registro utilizando modular SDK
  const handleRegister = async (data: any) => {
    try {
      const email = `${data.username.trim().toLowerCase()}@genio.com`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, data.password);
      const profile: UserProfile = {
        uid: userCredential.user.uid,
        nome: data.nome,
        telefone: data.telefone,
        username: data.username,
        passwordDisplay: data.password, 
        isAdmin: false
      };
      await storageService.saveProfile(profile);
      setUserProfile(profile);
    } catch (e: any) {
      console.error("Erro de registro:", e);
      alert("Erro ao cadastrar: " + (e.message || "Verifique os dados e tente novamente."));
    }
  };

  const handleAddTransaction = async (t: Transaction) => {
    if (!currentUser) return;
    const { id, ...data } = t;
    try {
      await storageService.addTransaction({ ...data, uid: currentUser.uid });
      setIsFormOpen(false);
    } catch (e: any) {
      alert("Erro ao salvar transação.");
    }
  };

  const handleConnectBank = (institution: string) => {
    const newAcc: BankAccount = {
      id: Math.random().toString(36).substr(2, 9),
      institution,
      lastSync: new Date().toISOString(),
      status: 'active',
      balance: Math.random() * 5000
    };
    setBankAccounts([...bankAccounts, newAcc]);
    
    // Simular importação de transações via Open Finance
    const mockTrans: Transaction = {
      id: '',
      description: `Compra Automatizada ${institution}`,
      amount: 45.90,
      date: new Date().toISOString(),
      category: 'Alimentação',
      type: TransactionType.EXPENSE,
      automated: true,
      institution
    };
    handleAddTransaction(mockTrans);
  };

  const handleSyncBank = (id: string) => {
    setBankAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, lastSync: new Date().toISOString() } : acc
    ));
    alert("Sincronização concluída! Novos lançamentos importados.");
  };

  const sortedTransactions = useMemo(() => {
    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
    });
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedDate]);

  if (isLoading) return <LoadingScreen />;

  if (!currentUser) {
    return isRegistering 
      ? <Register onRegister={handleRegister} onBack={() => setIsRegistering(false)} />
      : <Login onLogin={handleLogin} onGoToRegister={() => setIsRegistering(true)} />;
  }

  const monthlyIncome = sortedTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpense = sortedTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
  const monthlyBalance = monthlyIncome - monthlyExpense;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      <header className="bg-indigo-600 text-white p-6 pb-12 rounded-b-[2.5rem]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Olá, {userProfile?.nome.split(' ')[0] || 'Gênio'}</h1>
            <span className="text-[10px] text-indigo-200">@{userProfile?.username || 'user'}</span>
          </div>
          <button onClick={() => setView('profile')} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-user"></i>
          </button>
        </div>
        
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} />

        <div className="text-center">
          <p className="text-indigo-100 text-[10px] uppercase font-bold mb-1">Resultado Mensal</p>
          <h2 className="text-4xl font-black">R$ {monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 -mt-6 bg-[#f8fafc] rounded-t-3xl pb-24">
        {view === 'dashboard' && <Dashboard transactions={sortedTransactions} income={monthlyIncome} expense={monthlyExpense} />}
        {view === 'transactions' && <TransactionList transactions={sortedTransactions} onDelete={(id) => storageService.deleteTransaction(id)} onImportPrevious={() => {}} />}
        {view === 'analytics' && <Analytics transactions={sortedTransactions} />}
        {view === 'ai' && <AIAssistant transactions={sortedTransactions} />}
        {view === 'banks' && <BankConnection accounts={bankAccounts} onConnect={handleConnectBank} onSync={handleSyncBank} />}
        {view === 'admin' && userProfile?.isAdmin && <AdminPanel />}
        {view === 'profile' && (
          <div className="pt-6 space-y-4">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4">Configurações</h3>
               <button onClick={() => setView('banks')} className="w-full flex items-center justify-between py-3 text-slate-600 font-bold text-sm">
                  <span><i className="fa-solid fa-building-columns mr-3 text-indigo-500"></i> Open Finance</span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
               </button>
               <button onClick={() => signOut(auth)} className="w-full text-left py-3 text-rose-500 font-bold text-sm">
                  <i className="fa-solid fa-right-from-bracket mr-3"></i> Sair
               </button>
             </div>
          </div>
        )}
      </main>

      <button onClick={() => setIsFormOpen(true)} className="absolute bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg z-40">
        <i className="fa-solid fa-plus text-xl"></i>
      </button>

      <nav className="bg-white border-t flex justify-around py-3 safe-area-bottom z-50">
        <NavItem icon="fa-house" label="Resumo" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <NavItem icon="fa-list-ul" label="Diário" active={view === 'transactions'} onClick={() => setView('transactions')} />
        <NavItem icon="fa-building-columns" label="Bancos" active={view === 'banks'} onClick={() => setView('banks')} />
        <NavItem icon="fa-robot" label="Gênio" active={view === 'ai'} onClick={() => setView('ai')} />
      </nav>

      {isFormOpen && <TransactionForm selectedDate={selectedDate} onAdd={handleAddTransaction} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
    <i className={`fa-solid ${icon} text-lg`}></i>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center bg-indigo-600">
    <div className="text-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="font-bold">Carregando Gênio...</p>
    </div>
  </div>
);

export default App;
