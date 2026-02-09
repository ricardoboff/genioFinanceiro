
import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { getCategoryIcon } from './Dashboard';

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  onImportPrevious: () => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onEdit, onDelete, onImportPrevious }) => {
  // Agrupar por dia
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString('pt-BR');
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return Object.entries(groups).sort((a, b) => {
      const dateA = a[0].split('/').reverse().join('');
      const dateB = b[0].split('/').reverse().join('');
      return dateB.localeCompare(dateA);
    });
  }, [transactions]);

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Lançamentos Diários</h2>
        <div className="flex gap-2">
          {transactions.length > 0 && (
            <button 
              onClick={onImportPrevious}
              className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold border border-indigo-100 flex items-center gap-1"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Importar Fixas
            </button>
          )}
          <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-bold">
            {transactions.length} Itens
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {groupedTransactions.map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date}</h3>
              <div className="flex-1 h-[1px] bg-slate-100"></div>
            </div>
            <div className="space-y-2">
              {items.map(t => (
                <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-50 transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                       <i className={`fa-solid ${getCategoryIcon(t.category)}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.description}</p>
                      <span className="text-[10px] text-slate-400 font-medium">{t.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                      <p className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => onEdit(t)} className="w-8 h-8 flex items-center justify-center text-slate-200 hover:text-indigo-400 transition-colors">
                        <i className="fa-solid fa-pen-to-square text-xs"></i>
                      </button>
                      <button onClick={() => onDelete(t.id)} className="w-8 h-8 flex items-center justify-center text-slate-200 hover:text-rose-400 transition-colors">
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center py-12 px-6 bg-white rounded-[2rem] border border-slate-100 shadow-inner">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-calendar-xmark text-slate-200 text-2xl"></i>
            </div>
            <p className="text-slate-500 text-sm font-bold mb-2">Nada por aqui ainda!</p>
            <p className="text-slate-400 text-xs mb-8">Registre seus ganhos e gastos manualmente clicando no botão +</p>
            
            <button 
              onClick={onImportPrevious}
              className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm border-2 border-dashed border-indigo-200 flex items-center justify-center gap-3 hover:bg-indigo-100 transition-colors"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Importar do mês anterior
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
