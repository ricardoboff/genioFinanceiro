
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, View, UserProfile } from './types';
import { storageService } from './services/storageService';
import { auth } from './services/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  deleteUser
} from 'firebase/auth';

import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Analytics from './components/Analytics';
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
      }
      setIsLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    try {
      const unsub = storageService.subscribeTransactions(currentUser.uid, (data) => {
        setTransactions(data);
      });
      return () => unsub();
    } catch (err) {
      console.error("Erro na inscrição de transações:", err);
    }
  }, [currentUser]);

  const handleLogin = async (username: string, pass: string) => {
    const email = `${username}@genio.app`;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      console.error(e);
      let msg = "Erro ao entrar. Verifique usuário e senha.";
      if (e.code === 'auth/invalid-api-key' || e.code === 'auth/invalid-config') msg = "Chave de API do Firebase não configurada ou inválida.";
      if (e.code === 'auth/user-not-found') msg = "Usuário não encontrado.";
      if (e.code === 'auth/wrong-password') msg = "Senha incorreta.";
      alert(msg);
    }
  };

  const handleRegister = async (data: any) => {
    const email = `${data.username}@genio.app`;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, data.password);
      const profile: UserProfile = {
        uid: res.user.uid,
        nome: data.nome,
        telefone: data.telefone,
        username: data.username,
        passwordDisplay: data.password,
        isAdmin: data.username === 'admin'
      };
      await storageService.saveProfile(profile);
      setIsRegistering(false);
    } catch (e: any) {
      console.error(e);
      let msg = "Erro ao cadastrar usuário.";
      if (e.code === 'auth/weak-password') msg = "A senha deve ter pelo menos 6 caracteres.";
      if (e.code === 'auth/email-already-in-use') msg = "Este nome de usuário já está em uso.";
      alert(msg + "\n" + (e.message || ""));
    }
  };

  const handleAddTransaction = async (t: Transaction) => {
    if (!currentUser) return;
    const { id, ...data } = t;
    try {
      await storageService.addTransaction({ ...data, uid: currentUser.uid });
      setIsFormOpen(false);
    } catch (e: any) {
      console.error("Erro ao salvar transação:", e);
      let msg = "Não foi possível salvar a transação.";
      if (e.message?.includes("permission-denied")) {
        msg += "\nErro de permissão no Firestore. Verifique suas regras de segurança.";
      }
      alert(msg + "\nErro: " + e.code);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
    });
  }, [transactions, selectedDate]);

  if (isLoading) return <LoadingScreen />;

  if (!currentUser) {
    return isRegistering 
      ? <Register onRegister={handleRegister} onBack={() => setIsRegistering(false)} />
      : <Login onLogin={handleLogin} onGoToRegister={() => setIsRegistering(true)} />;
  }

  const monthlyIncome = filteredTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpense = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
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
        {view === 'dashboard' && <Dashboard transactions={filteredTransactions} income={monthlyIncome} expense={monthlyExpense} />}
        {view === 'transactions' && <TransactionList transactions={filteredTransactions} onDelete={(id) => storageService.deleteTransaction(id)} onImportPrevious={() => {}} />}
        {view === 'analytics' && <Analytics transactions={filteredTransactions} />}
        {view === 'ai' && <AIAssistant transactions={filteredTransactions} />}
        {view === 'admin' && userProfile?.isAdmin && <AdminPanel />}
        {view === 'profile' && (
          <ProfileMenu 
            user={userProfile!} 
            onLogout={() => signOut(auth)} 
            onChangePass={async (p) => {
                if (!auth.currentUser) return;
                try {
                  await updatePassword(auth.currentUser, p);
                  await storageService.updateProfile(auth.currentUser.uid, { passwordDisplay: p });
                  alert("Senha alterada!");
                } catch(err) { alert("Erro ao alterar. Logue novamente."); }
            }} 
            onDelete={async () => {
                if (!auth.currentUser) return;
                try {
                  const uid = auth.currentUser.uid;
                  await storageService.deleteProfile(uid);
                  await deleteUser(auth.currentUser);
                } catch(err) { alert("Erro ao excluir."); }
            }} 
          />
        )}
      </main>

      <button onClick={() => setIsFormOpen(true)} className="absolute bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg z-40">
        <i className="fa-solid fa-plus text-xl"></i>
      </button>

      <nav className="bg-white border-t flex justify-around py-3 safe-area-bottom z-50">
        <NavItem icon="fa-house" label="Resumo" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <NavItem icon="fa-list-ul" label="Diário" active={view === 'transactions'} onClick={() => setView('transactions')} />
        <NavItem icon="fa-chart-pie" label="Análise" active={view === 'analytics'} onClick={() => setView('analytics')} />
        {userProfile?.isAdmin ? (
          <NavItem icon="fa-user-shield" label="Admin" active={view === 'admin'} onClick={() => setView('admin')} />
        ) : (
          <NavItem icon="fa-robot" label="Gênio" active={view === 'ai'} onClick={() => setView('ai')} />
        )}
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

const ProfileMenu: React.FC<{ user: UserProfile, onLogout: () => void, onChangePass: (p: string) => void, onDelete: () => void }> = ({ user, onLogout, onChangePass, onDelete }) => (
  <div className="pt-6 space-y-4">
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-4">Sua Conta</h3>
      <p className="text-sm text-slate-500 mb-1">Nome: {user?.nome}</p>
      <p className="text-sm text-slate-500 mb-1">Usuário: @{user?.username}</p>
      <p className="text-sm text-slate-500 mb-6">WhatsApp: {user?.telefone}</p>
      
      <div className="space-y-2">
        <button onClick={() => {
          const np = prompt("Nova senha:");
          if (np) onChangePass(np);
        }} className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs">Alterar Senha</button>
        <button onClick={onLogout} className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs">Sair do App</button>
        <button onClick={onDelete} className="w-full py-3 text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-4">Excluir Cadastro</button>
      </div>
    </div>
  </div>
);

export default App;
