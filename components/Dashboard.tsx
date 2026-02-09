
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  income: number;
  expense: number;
  invested: number;
  balance: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, income, expense, invested, balance }) => {
  const chartData = useMemo(() => {
    const dailyData: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const day = new Date(t.date).getDate();
        dailyData[day] = (dailyData[day] || 0) + t.amount;
      });

    return Object.entries(dailyData)
      .map(([day, value]) => ({ day: parseInt(day), value }))
      .sort((a, b) => a.day - b.day);
  }, [transactions]);

  return (
    <div className="space-y-4 pt-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#10b981] p-4 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-arrow-up text-xs"></i>
            </div>
            <span className="text-[10px] font-bold uppercase opacity-80">Entradas do Mês</span>
          </div>
          <p className="text-xl font-black">R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-[#ef4444] p-4 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-arrow-down text-xs"></i>
            </div>
            <span className="text-[10px] font-bold uppercase opacity-80">Saídas do Mês</span>
          </div>
          <p className="text-xl font-black">R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-[#3b82f6] p-4 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-xs"></i>
            </div>
            <span className="text-[10px] font-bold uppercase opacity-80">Total Investido</span>
          </div>
          <p className="text-xl font-black">R$ {invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-[#1e293b] p-4 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-wallet text-xs"></i>
            </div>
            <span className="text-[10px] font-bold uppercase opacity-80">Saldo Líquido</span>
          </div>
          <p className="text-xl font-black">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="bg-[#1e40af] p-5 rounded-[2rem] shadow-xl overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold text-sm">Gastos Diários Totais</h3>
          <span className="text-[10px] text-white/50 font-medium">Fluxo Mensal</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -40, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff15" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#ffffff60', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', fontSize: '10px' }}
                formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, 'Gasto']}
              />
              <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={{ fill: '#ffffff', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm mb-4 px-2">Recentes</h3>
        <div className="space-y-3">
          {transactions.slice(0, 4).map(t => (
            <div key={t.id} className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                   <i className={`fa-solid ${getCategoryIcon(t.category)} text-xs`}></i>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">{t.description}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-black">{t.category}</p>
                </div>
              </div>
              <p className={`text-xs font-black ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
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
    case 'Investimentos': return 'fa-chart-pie';
    case 'Assinaturas': return 'fa-tv';
    default: return 'fa-tags';
  }
};

export default Dashboard;
