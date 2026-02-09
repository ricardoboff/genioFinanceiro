
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
  // Dados para o gráfico de Gastos Diários Totais
  const chartData = useMemo(() => {
    const dailyData: Record<string, number> = {};
    
    // Pegar apenas gastos do mês selecionado
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const day = new Date(t.date).getDate();
        dailyData[day] = (dailyData[day] || 0) + t.amount;
      });

    // Criar array ordenado pelos dias do mês
    // Se não houver dados, retorna um array vazio para não quebrar o gráfico
    const data = Object.entries(dailyData)
      .map(([day, value]) => ({ day: parseInt(day), value }))
      .sort((a, b) => a.day - b.day);

    // Se houver apenas 1 ponto, o recharts pode não renderizar bem a área, 
    // idealmente teríamos pelo menos 2 pontos ou preencheríamos os dias vazios.
    return data;
  }, [transactions]);

  return (
    <div className="space-y-4 pt-6">
      {/* Grid de KPIs - Estilo Imagem */}
      <div className="grid grid-cols-2 gap-3">
        {/* Entradas */}
        <div className="bg-[#10b981] p-4 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-arrow-up text-xs"></i>
            </div>
            <span className="text-[10px] font-bold uppercase opacity-80">Entradas do Mês</span>
          </div>
          <p className="text-xl font-black">R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Saídas */}
        <div className="bg-[#ef4444] p-4 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-arrow-down text-xs"></i>
            </div>
            <span className="text-[10px] font-bold uppercase opacity-80">Saídas do Mês</span>
          </div>
          <p className="text-xl font-black">R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Investimentos */}
        <div className="bg-[#3b82f6] p-4 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chart-line text-xs"></i>
            </div>
            <span className="text-[10px] font-bold uppercase opacity-80">Total Investido no Mês</span>
          </div>
          <p className="text-xl font-black">R$ {invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Saldo */}
        <div className="bg-[#1e293b] p-4 rounded-3xl text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-wallet text-xs"></i>
            </div>
            <span className="text-[10px] font-bold uppercase opacity-80">Saldo Total do Mês</span>
          </div>
          <p className="text-xl font-black">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Gráfico de Gastos Diários - Estilo Imagem Ajustado */}
      <div className="bg-[#1e40af] p-5 rounded-[2rem] shadow-xl overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold text-sm">Gastos Diários Totais</h3>
          <span className="text-[10px] text-white/50 font-medium">Mês Atual</span>
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
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff60', fontSize: 10 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', fontSize: '10px', padding: '8px' }}
                itemStyle={{ color: '#1e40af', fontWeight: 'bold' }}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                labelFormatter={(value) => `Dia ${value}`}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Gasto']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#ffffff" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                dot={{ fill: '#ffffff', r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2, fill: '#1e40af' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Transações Recentes */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold text-slate-800 text-sm">Últimos Lançamentos</h3>
          <i className="fa-solid fa-ellipsis text-slate-300"></i>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 4).map(t => (
            <div key={t.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                   <i className={`fa-solid ${getCategoryIcon(t.category)}`}></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{t.description}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">{t.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-black ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                  R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[9px] text-slate-400">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-slate-400 py-4 text-xs italic">Nenhuma transação encontrada.</p>
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
