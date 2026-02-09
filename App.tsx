
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, View, UserProfile } from './types';
import { storageService } from './services/storageService';
import { 
  auth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from './services/firebaseConfig';

import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionTable from './components/TransactionTable';
import AIAssistant from './components/AIAssistant';
import TransactionForm from './components/TransactionForm';
import MonthSelector from './components/MonthSelector';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminPanel from './components/Admin/AdminPanel';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const handleLogin = async (username: string, pass: string) => {
    try {
      const email = `${username.trim().toLowerCase()}@genio.com`;
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      alert("Erro ao entrar: Verifique seu usuário e senha.");
    }
  };

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
      alert("Erro ao cadastrar.");
    }
  };

  const handleAddTransaction = async (t: Transaction) => {
    if (!currentUser) return;
    const { id, ...data } = t;
    try {
      await storageService.addTransaction({ ...data, uid: currentUser.uid });
      setIsFormOpen(false);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleUpdateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      await storageService.updateTransaction(id, data);
      setEditingTransaction(null);
      setIsFormOpen(false);
    } catch (e: any) {
      console.error(e);
    }
  };

  const openEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setIsFormOpen(true);
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

  const income = sortedTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
  const totalInvested = sortedTransactions.filter(t => t.category === 'Investimentos').reduce((acc, t) => acc + t.amount, 0);
  const expense = sortedTransactions.filter(t => t.type === TransactionType.EXPENSE && t.category !== 'Investimentos').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense - totalInvested;

  const todayFormatted = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#1a1c23] shadow-2xl overflow-hidden relative">
      <header className="p-6 pb-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-black text-white">Central de Controle</h1>
            <p className="text-slate-400 text-[11px] mt-1 capitalize">{todayFormatted}</p>
          </div>
          <button onClick={() => setView('profile')} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
            <i className="fa-solid fa-user"></i>
          </button>
        </div>
        
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} />
      </header>

      <main className="flex-1 overflow-y-auto px-4 bg-[#f8fafc] rounded-t-[2.5rem] pb-24">
        {view === 'dashboard' && <Dashboard transactions={sortedTransactions} income={income} expense={expense} invested={totalInvested} balance={balance} />}
        {view === 'transactions' && <TransactionList transactions={sortedTransactions} onDelete={(id) => storageService.deleteTransaction(id)} onImportPrevious={() => {}} />}
        {view === 'table' && <TransactionTable transactions={sortedTransactions} onEdit={openEdit} onDelete={(id) => storageService.deleteTransaction(id)} />}
        {view === 'ai' && <AIAssistant transactions={sortedTransactions} />}
        {view === 'admin' && userProfile?.isAdmin && <AdminPanel />}
        {view === 'profile' && (
          <div className="pt-6 space-y-4">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4">Configurações</h3>
               <button onClick={() => signOut(auth)} className="w-full text-left py-3 text-rose-500 font-bold text-sm">
                  <i className="fa-solid fa-right-from-bracket mr-3"></i> Sair da Conta
               </button>
             </div>
             <div className="text-center px-6">
                <p className="text-[10px] text-slate-400">Gênio Financeiro v2.1 • Smart Control</p>
             </div>
          </div>
        )}
      </main>

      <button 
        onClick={() => { setEditingTransaction(null); setIsFormOpen(true); }} 
        className="absolute bottom-24 right-6 w-14 h-14 bg-[#1a1c23] text-white rounded-full shadow-lg z-40 border-2 border-white/10"
      >
        <i className="fa-solid fa-plus text-xl"></i>
      </button>

      <nav className="bg-white border-t flex justify-around py-3 safe-area-bottom z-50">
        <NavItem icon="fa-chart-pie" label="Resumo" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <NavItem icon="fa-table-list" label="Planilha" active={view === 'table'} onClick={() => setView('table')} />
        <NavItem icon="fa-wand-magic-sparkles" label="Gênio" active={view === 'ai'} onClick={() => setView('ai')} />
      </nav>

      {isFormOpen && (
        <TransactionForm 
          transactionToEdit={editingTransaction}
          selectedDate={selectedDate} 
          onAdd={handleAddTransaction} 
          onUpdate={handleUpdateTransaction}
          onClose={() => { setIsFormOpen(false); setEditingTransaction(null); }} 
        />
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-[#1a1c23]' : 'text-slate-400'}`}>
    <i className={`fa-solid ${icon} text-lg`}></i>
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center bg-[#1a1c23]">
    <div className="text-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="font-bold">Acessando Central...</p>
    </div>
  </div>
);

export default App;
