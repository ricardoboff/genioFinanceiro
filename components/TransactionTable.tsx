
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { getCategoryIcon } from './Dashboard';

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
  
  const handleExport = () => {
    if (transactions.length === 0) return;
    
    const headers = ['Transação', 'Data', 'Tipo', 'Valor', 'Categoria', 'Pagamento'];
    const rows = transactions.map(t => [
      t.description,
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.spendingType || (t.type === TransactionType.INCOME ? 'Renda' : 'Despesa'),
      t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
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
    link.setAttribute('download', `controle_financeiro_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Renda': return 'bg-[#10b981] text-white'; // Verde esmeralda
      case 'Necessidades': return 'bg-[#ef4444] text-white'; // Vermelho
      case 'Desejos': return 'bg-[#9333ea] text-white'; // Roxo
      default: return 'bg-slate-400 text-white';
    }
  };

  const getPaymentStyle = (method: string) => {
    if (method === 'Pix') return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
    if (method === 'Crédito') return 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20';
    return 'bg-slate-100 text-slate-500 border-slate-200';
  };

  return (
    <div className="space-y-4 pt-4 pb-20 overflow-x-auto">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Planilha de Controle</h2>
        <button 
          onClick={handleExport}
          className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-file-export"></i>
          Exportar CSV
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden min-w-[700px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b] text-white">
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Transação</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Data</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Tipo</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider text-center">Valor</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Categoria</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Pagamento</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                     <i className={`fa-solid ${getCategoryIcon(t.category)} text-slate-300 text-xs`}></i>
                     <span className="text-xs font-bold text-slate-700">{t.description}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-[11px] font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-lg">
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
                    <span className="text-[11px] font-bold text-slate-500">{t.category}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border block text-center ${getPaymentStyle(t.paymentMethod || 'Pix')}`}>
                    {t.paymentMethod || 'Pix'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right space-x-2">
                  <button onClick={() => onEdit(t)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                    <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                  </button>
                  <button onClick={() => onDelete(t.id)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <i className="fa-solid fa-trash-can text-[10px]"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="py-20 text-center">
             <p className="text-slate-400 text-sm font-bold">Nenhum dado encontrado para este mês.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
