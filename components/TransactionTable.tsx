
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { getCategoryIcon } from './Dashboard';

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const COLORS_SPENDING = {
  'Necessidades': '#ef4444', // Red
  'Desejos': '#9333ea',      // Purple
  'Renda': '#10b981',        // Emerald
};

const COLORS_PAYMENT = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
  
  // Dados para Gráfico 50/30/20 (Spending Type)
  const spendingTypeData = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const type = t.spendingType || 'Necessidades';
        totals[type] = (totals[type] || 0) + t.amount;
      });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Dados para Gráfico de Meios de Pagamento
  const paymentMethodData = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const method = t.paymentMethod || 'Outro';
        totals[method] = (totals[method] || 0) + t.amount;
      });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const handleExport = () => {
    if (transactions.length === 0) return;
    
    const headers = ['Transação', 'Data', 'Tipo', 'Valor', 'Categoria', 'Meio de Pagamento'];
    const rows = transactions.map(t => [
      t.description,
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.spendingType || (t.type === TransactionType.INCOME ? 'Renda' : 'Gasto'),
      t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      t.category,
      t.paymentMethod || 'Outro'
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_genio_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Renda': return 'bg-[#10b981] text-white'; 
      case 'Necessidades': return 'bg-[#ef4444] text-white'; 
      case 'Desejos': return 'bg-[#9333ea] text-white'; 
      default: return 'bg-slate-400 text-white';
    }
  };

  const getPaymentPillStyle = (method: string) => {
    if (method === 'Pix' || method === 'Débito') return 'bg-[#10b981]/20 text-[#059669] border-[#10b981]/30';
    if (method === 'Crédito') return 'bg-[#ef4444]/20 text-[#dc2626] border-[#ef4444]/30';
    return 'bg-slate-100 text-slate-500 border-slate-200';
  };

  return (
    <div className="space-y-6 pt-4 pb-20">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Relatório & Análise</h2>
        <button 
          onClick={handleExport}
          className="bg-[#1a1c23] text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-share-nodes"></i>
          Exportar CSV
        </button>
      </div>

      {/* Seção de Gráficos de Resumo */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {/* Gráfico 50/30/20 */}
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-indigo-500"></i>
              Regra de Gastos (50/30/20)
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {spendingTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_SPENDING[entry.name as keyof typeof COLORS_SPENDING] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`}
                  />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Métodos de Pagamento */}
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-credit-card text-emerald-500"></i>
              Gastos por Meio de Pagamento
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData} layout="vertical" margin={{ left: -10, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} 
                    width={70}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(val: number) => `R$ ${val.toLocaleString('pt-BR')}`}
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PAYMENT[index % COLORS_PAYMENT.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Dados */}
      <div className="overflow-x-auto bg-white rounded-[1.5rem] border border-slate-100 shadow-sm min-w-full">
        <table className="w-full text-left border-collapse table-fixed min-w-[750px]">
          <thead>
            <tr className="bg-[#2d3748] text-white">
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider w-1/4">Transação</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider w-[100px]">Data</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider w-[120px]">Tipo</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider text-center w-[120px]">Valor</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider w-[150px]">Categoria</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider w-[150px]">Meio Pagto</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider text-right w-[80px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                     <i className={`fa-solid ${getCategoryIcon(t.category)} text-slate-300 text-[10px] flex-shrink-0`}></i>
                     <span className="text-xs font-bold text-slate-700 truncate">{t.description}</span>
                  </div>
                </td>
                <td className="py-4 px-4 bg-[#d1fae5]/30">
                  <span className="text-[11px] font-bold text-slate-600">
                    {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase block text-center shadow-sm ${getBadgeStyle(t.spendingType || (t.type === TransactionType.INCOME ? 'Renda' : 'Necessidades'))}`}>
                    {t.spendingType || (t.type === TransactionType.INCOME ? 'Renda' : 'Necessidades')}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-xs font-black text-slate-800">
                    R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase">{t.category}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-full border block text-center truncate ${getPaymentPillStyle(t.paymentMethod || 'Pix')}`}>
                    {t.paymentMethod || 'Pix'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(t)} className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center">
                      <i className="fa-solid fa-pen text-[9px]"></i>
                    </button>
                    <button onClick={() => onDelete(t.id)} className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center">
                      <i className="fa-solid fa-trash text-[9px]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="py-16 text-center">
             <i className="fa-solid fa-table-list text-slate-200 text-3xl mb-3 block"></i>
             <p className="text-slate-400 text-xs font-bold">Sem dados para o período.</p>
          </div>
        )}
      </div>
      <p className="text-[9px] text-slate-400 text-center mt-4">Dica: Deslize lateralmente se a tabela for maior que sua tela.</p>
    </div>
  );
};

export default TransactionTable;
