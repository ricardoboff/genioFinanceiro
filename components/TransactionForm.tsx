
import React, { useState } from 'react';
import { Transaction, TransactionType, CATEGORIES } from '../types';

interface Props {
  onAdd: (t: Transaction) => void;
  onClose: () => void;
  selectedDate: Date;
}

const TransactionForm: React.FC<Props> = ({ onAdd, onClose, selectedDate }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    // Se o dia de hoje for no mês selecionado, usa a hora exata. 
    // Senão, usa o primeiro dia do mês selecionado.
    const now = new Date();
    let transactionDate: Date;
    
    if (now.getMonth() === selectedDate.getMonth() && now.getFullYear() === selectedDate.getFullYear()) {
      transactionDate = now;
    } else {
      transactionDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 12, 0, 0);
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      amount: parseFloat(amount.replace(',', '.')),
      date: transactionDate.toISOString(),
      category,
      type,
    };

    onAdd(newTransaction);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Form Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl p-6 overflow-hidden animate-slide-up">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Nova Transação</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-400">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === TransactionType.EXPENSE ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-arrow-up mr-2"></i> Saída
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-arrow-down mr-2"></i> Entrada
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Valor (R$)</label>
            <input 
              type="text" 
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full text-4xl font-bold text-slate-800 bg-transparent border-b-2 border-slate-100 focus:border-indigo-500 focus:outline-none py-2 placeholder:text-slate-200"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Descrição</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aluguel, Supermercado..."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Categoria</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm appearance-none"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-transform active:scale-95 ${type === TransactionType.INCOME ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}`}
          >
            Adicionar Transação
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;
