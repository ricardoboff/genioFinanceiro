
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  income: number;
  expense: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, income, expense }) => {
  const recentTransactions = transactions.slice(0, 5);
  const expensePercentage = income > 0 ? (expense / income) * 100 : 0;

  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <i className="fa-solid fa-arrow-down text-xs"></i>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Ganhos</span>
          </div>
          <p className="text-lg font-bold text-emerald-600">R$ {income.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <i className="fa-solid fa-arrow-up text-xs"></i>
            </div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Gastos</span>
          </div>
          <p className="text-lg font-bold text-rose-600">R$ {expense.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Controle de Orçamento Mensal */}
      <div className="bg-white p-5 rounded-2xl border border-slate-50 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-slate-800">Uso da Receita</h3>
          <span className="text-[10px] font-bold text-slate-400">{expensePercentage.toFixed(1)}% consumido</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${expensePercentage > 90 ? 'bg-rose-500' : expensePercentage > 70 ? 'bg-amber-500' : 'bg-indigo-500'}`}
            style={{ width: `${Math.min(expensePercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 italic">
          {expensePercentage > 100 ? 'Você gastou mais do que ganhou este mês!' : 'Seu orçamento está sob controle.'}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Últimos Lançamentos</h3>
          <i className="fa-solid fa-calendar-day text-slate-300"></i>
        </div>
        <div className="space-y-3">
          {recentTransactions.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-50 hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                   <i className={`fa-solid ${getCategoryIcon(t.category)}`}></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium capitalize">{t.category} • {new Date(t.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR')}
              </p>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-xs">Nenhum lançamento neste mês.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Alimentação': return 'fa-utensils';
    case 'Transporte': return 'fa-bus';
    case 'Lazer': return 'fa-gamepad';
    case 'Saúde': return 'fa-heart-pulse';
    case 'Educação': return 'fa-book';
    case 'Moradia': return 'fa-house-chimney';
    case 'Salário': return 'fa-money-bill-wave';
    case 'Investimentos': return 'fa-chart-line';
    default: return 'fa-tags';
  }
};

export default Dashboard;
