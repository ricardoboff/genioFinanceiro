
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, View, CATEGORIES } from './types';
import { storageService } from './services/storageService';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Analytics from './components/Analytics';
import AIAssistant from './components/AIAssistant';
import TransactionForm from './components/TransactionForm';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load transactions on mount
  useEffect(() => {
    const saved = storageService.getTransactions();
    if (saved.length === 0) {
      // Seed initial data if empty
      const initial: Transaction[] = [
        { id: '1', description: 'Salário Mensal', amount: 5000, date: new Date().toISOString(), category: 'Salário', type: TransactionType.INCOME },
        { id: '2', description: 'Aluguel', amount: 1500, date: new Date().toISOString(), category: 'Moradia', type: TransactionType.EXPENSE },
        { id: '3', description: 'Supermercado', amount: 450, date: new Date().toISOString(), category: 'Alimentação', type: TransactionType.EXPENSE },
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

  const balance = useMemo(() => {
    return transactions.reduce((acc, t) => 
      t.type === TransactionType.INCOME ? acc + t.amount : acc - t.amount, 0
    );
  }, [transactions]);

  const income = useMemo(() => {
    return transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const expense = useMemo(() => {
    return transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-6 pb-12 rounded-b-[2.5rem]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold tracking-tight">Gênio Financeiro</h1>
          <button className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <i className="fa-solid fa-bell"></i>
          </button>
        </div>
        <div className="text-center">
          <p className="text-indigo-100 text-sm opacity-80 mb-1 uppercase tracking-widest font-semibold">Saldo Total</p>
          <h2 className="text-4xl font-bold">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 -mt-6 bg-[#f8fafc] rounded-t-3xl pb-24">
        {view === 'dashboard' && <Dashboard transactions={transactions} income={income} expense={expense} />}
        {view === 'transactions' && <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />}
        {view === 'analytics' && <Analytics transactions={transactions} />}
        {view === 'ai' && <AIAssistant transactions={transactions} />}
      </main>

      {/* FAB - Floating Action Button */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="absolute bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center transition-transform active:scale-95 z-40"
      >
        <i className="fa-solid fa-plus text-xl"></i>
      </button>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-100 flex justify-around py-3 safe-area-bottom z-50">
        <NavItem icon="fa-house" label="Home" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <NavItem icon="fa-list-ul" label="Extrato" active={view === 'transactions'} onClick={() => setView('transactions')} />
        <NavItem icon="fa-chart-pie" label="Gastos" active={view === 'analytics'} onClick={() => setView('analytics')} />
        <NavItem icon="fa-robot" label="IA" active={view === 'ai'} onClick={() => setView('ai')} />
      </nav>

      {/* Transaction Form Modal */}
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
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
    <i className={`fa-solid ${icon} text-lg`}></i>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
