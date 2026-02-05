
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType, CATEGORIES } from '../types';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const Analytics: React.FC<Props> = ({ transactions }) => {
  const expenseData = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyHistory = useMemo(() => {
    // Basic grouping by date for the last 7 entries for demo
    return transactions.slice(-7).reverse().map(t => ({
      name: t.description.substring(0, 10),
      valor: t.amount,
      tipo: t.type === TransactionType.INCOME ? 'Entrada' : 'Saída'
    }));
  }, [transactions]);

  return (
    <div className="space-y-8 pt-4 pb-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
        <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
           <i className="fa-solid fa-chart-pie text-indigo-500"></i>
           Gastos por Categoria
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50">
        <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
           <i className="fa-solid fa-chart-column text-indigo-500"></i>
           Histórico Recente
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyHistory}>
              <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="valor" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
