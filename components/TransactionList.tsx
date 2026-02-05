
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { getCategoryIcon } from './Dashboard';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Extrato Detalhado</h2>
        <div className="flex bg-slate-200 p-1 rounded-lg text-[10px]">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}
          >
            Tudo
          </button>
          <button 
            onClick={() => setFilter(TransactionType.INCOME)}
            className={`px-3 py-1 rounded-md transition-colors ${filter === TransactionType.INCOME ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}
          >
            Entradas
          </button>
          <button 
            onClick={() => setFilter(TransactionType.EXPENSE)}
            className={`px-3 py-1 rounded-md transition-colors ${filter === TransactionType.EXPENSE ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-slate-500'}`}
          >
            Saídas
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.id} className="group relative bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-50 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                 <i className={`fa-solid ${getCategoryIcon(t.category)}`}></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{t.description}</p>
                <p className="text-[10px] text-slate-400">{t.category} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <button 
                onClick={() => onDelete(t.id)}
                className="text-slate-300 hover:text-rose-500 transition-colors"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <i className="fa-solid fa-box-open text-4xl text-slate-200 mb-4"></i>
            <p className="text-slate-400 text-sm">Nada por aqui ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
