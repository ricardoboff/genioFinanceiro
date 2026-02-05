
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  income: number;
  expense: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, income, expense }) => {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 pt-2">
      {/* Cards for Income/Expense */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <i className="fa-solid fa-arrow-down text-xs"></i>
            </div>
            <span className="text-xs text-slate-500 font-medium">Entradas</span>
          </div>
          <p className="text-lg font-bold text-emerald-600">
            R$ {income.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <i className="fa-solid fa-arrow-up text-xs"></i>
            </div>
            <span className="text-xs text-slate-500 font-medium">Saídas</span>
          </div>
          <p className="text-lg font-bold text-rose-600">
            R$ {expense.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Quick Actions/Info */}
      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-indigo-900 font-semibold text-sm">Resumo da IA</h3>
          <span className="text-indigo-600 text-[10px] bg-white px-2 py-0.5 rounded-full font-bold">NOVO</span>
        </div>
        <p className="text-indigo-800 text-xs leading-relaxed">
          Sua maior categoria de gastos este mês foi <strong>Alimentação</strong>. 
          Considere cozinhar em casa para economizar até 15%.
        </p>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Transações Recentes</h3>
          <button className="text-xs text-indigo-600 font-semibold">Ver todas</button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                   <i className={`fa-solid ${getCategoryIcon(t.category)}`}></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.description}</p>
                  <p className="text-[10px] text-slate-400">{t.category} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR')}
              </p>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">Nenhuma transação registrada.</p>
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
