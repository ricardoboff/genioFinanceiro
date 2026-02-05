
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, View } from './types';
import { storageService } from './services/storageService';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Analytics from './components/Analytics';
import AIAssistant from './components/AIAssistant';
import TransactionForm from './components/TransactionForm';
import MonthSelector from './components/MonthSelector';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const saved = storageService.getTransactions();
    if (saved.length === 0) {
      const now = new Date();
      const initial: Transaction[] = [
        { id: '1', description: 'Salário Mensal', amount: 5000, date: now.toISOString(), category: 'Salário', type: TransactionType.INCOME },
        { id: '2', description: 'Aluguel', amount: 1500, date: now.toISOString(), category: 'Moradia', type: TransactionType.EXPENSE },
        { id: '3', description: 'Supermercado', amount: 450, date: now.toISOString(), category: 'Alimentação', type: TransactionType.EXPENSE },
      ];
      setTransactions(initial);
      storageService.saveTransactions(initial);
    } else {
      setTransactions(saved);
    }
  }, []);

  const handleAddTransaction = (t: Transaction) => {
    const updated = [t, ...transactions];
    setTransactions(updated);
    storageService.saveTransactions(updated);
    setIsFormOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    storageService.saveTransactions(updated);
  };

  // Filtragem Global por Mês/Ano
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
    });
  }, [transactions, selectedDate]);

  const monthlyIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const monthlyExpense = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);
  }, [filteredTransactions]);

  const monthlyBalance = monthlyIncome - monthlyExpense;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      <header className="bg-indigo-600 text-white p-6 pb-12 rounded-b-[2.5rem] transition-all duration-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold tracking-tight">Gênio Financeiro</h1>
          <button className="bg-white/20 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center">
            <i className="fa-solid fa-user-circle text-lg"></i>
          </button>
        </div>
        
        <MonthSelector selectedDate={selectedDate} onChange={setSelectedDate} />

        <div className="text-center">
          <p className="text-indigo-100 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Resultado do Mês</p>
          <h2 className={`text-4xl font-black ${monthlyBalance < 0 ? 'text-rose-200' : 'text-white'}`}>
            R$ {monthlyBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 -mt-6 bg-[#f8fafc] rounded-t-3xl pb-24">
        {view === 'dashboard' && <Dashboard transactions={filteredTransactions} income={monthlyIncome} expense={monthlyExpense} />}
        {view === 'transactions' && <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} />}
        {view === 'analytics' && <Analytics transactions={filteredTransactions} />}
        {view === 'ai' && <AIAssistant transactions={filteredTransactions} />}
      </main>

      <button 
        onClick={() => setIsFormOpen(true)}
        className="absolute bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center transition-transform active:scale-95 z-40"
      >
        <i className="fa-solid fa-plus text-xl"></i>
      </button>

      <nav className="bg-white border-t border-slate-100 flex justify-around py-3 safe-area-bottom z-50">
        <NavItem icon="fa-house" label="Resumo" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <NavItem icon="fa-list-ul" label="Diário" active={view === 'transactions'} onClick={() => setView('transactions')} />
        <NavItem icon="fa-chart-pie" label="Análise" active={view === 'analytics'} onClick={() => setView('analytics')} />
        <NavItem icon="fa-robot" label="Gênio IA" active={view === 'ai'} onClick={() => setView('ai')} />
      </nav>

      {isFormOpen && (
        <TransactionForm 
          onAdd={handleAddTransaction} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
    <i className={`fa-solid ${icon} text-lg`}></i>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
