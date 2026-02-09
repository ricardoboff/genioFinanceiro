
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { getCategoryIcon } from './Dashboard';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onImportPrevious: () => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onDelete, onImportPrevious }) => {
  
  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    
    const headers = ['Transação', 'Data', 'Tipo', 'Valor', 'Categoria', 'Meio de Pagamento'];
    const rows = transactions.map(t => [
      t.description,
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.spendingType || (t.type === TransactionType.INCOME ? 'Renda' : 'Saída'),
      t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      t.category,
      t.paymentMethod || 'N/A'
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `controle_financeiro_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSpendingTypeColor = (type: string) => {
    switch (type) {
      case 'Renda': return 'bg-[#10b981]'; // Verde
      case 'Necessidades': return 'bg-[#ef4444]'; // Vermelho
      case 'Desejos': return 'bg-[#9333ea]'; // Roxo
      default: return 'bg-slate-400';
    }
  };

  const getPaymentPillColor = (method: string) => {
    switch (method) {
      case 'Pix': return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20';
      case 'Crédito': return 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20';
      case 'Débito': return 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 pt-6 pb-20">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-lg font-black text-slate-800">Histórico de Controle</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#1a1c23] text-white text-[10px] font-bold px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            <i className="fa-solid fa-file-export"></i>
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1c23] text-white">
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider rounded-tl-3xl">Transação</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Data</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Tipo</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Valor</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider">Categoria</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-wider rounded-tr-3xl">Meio de Pagto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((t, idx) => (
              <tr key={t.id} className={`${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'} group`}>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => onDelete(t.id)} className="opacity-0 group-hover:opacity-100 text-rose-300 hover:text-rose-500 transition-all">
                       <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{t.description}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-[11px] text-slate-500 font-medium whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-4 px-4">
                  <span className={`${getSpendingTypeColor(t.spendingType || (t.type === TransactionType.INCOME ? 'Renda' : 'Necessidades'))} text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase block text-center min-w-[100px]`}>
                    {t.spendingType || (t.type === TransactionType.INCOME ? 'Renda' : 'Necessidades')}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs font-black text-slate-800 whitespace-nowrap">
                  R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid ${getCategoryIcon(t.category)} text-slate-300 text-[10px]`}></i>
                    <span className="text-[11px] font-bold text-slate-600">{t.category}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                   <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border block text-center whitespace-nowrap ${getPaymentPillColor(t.paymentMethod || 'Dinheiro')}`}>
                    {t.paymentMethod || 'Dinheiro'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {transactions.length === 0 && (
          <div className="py-20 text-center">
            <i className="fa-solid fa-folder-open text-slate-200 text-4xl mb-4 block"></i>
            <p className="text-slate-400 text-sm font-bold">Nenhum registro para exibir</p>
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="mt-4 px-2">
           <button 
              onClick={onImportPrevious}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold hover:border-indigo-300 hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
           >
              <i className="fa-solid fa-repeat"></i>
              Importar lançamentos do mês anterior
           </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
