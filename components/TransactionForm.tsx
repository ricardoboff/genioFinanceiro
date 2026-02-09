
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, CATEGORIES, SpendingType, PaymentMethod } from '../types';

interface Props {
  transactionToEdit?: Transaction | null;
  onAdd: (t: Transaction) => void;
  onUpdate: (id: string, t: Partial<Transaction>) => void;
  onClose: () => void;
  selectedDate: Date;
}

const TransactionForm: React.FC<Props> = ({ transactionToEdit, onAdd, onUpdate, onClose, selectedDate }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [spendingType, setSpendingType] = useState<SpendingType>('Necessidades');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount.toString().replace('.', ','));
      setCategory(transactionToEdit.category);
      setSpendingType(transactionToEdit.spendingType || 'Necessidades');
      setPaymentMethod(transactionToEdit.paymentMethod || 'Pix');
      setDateStr(new Date(transactionToEdit.date).toISOString().split('T')[0]);
    }
  }, [transactionToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !dateStr) return;

    const [year, month, day] = dateStr.split('-').map(Number);
    const transactionDate = new Date(year, month - 1, day, 12, 0, 0);

    const transactionData = {
      description,
      amount: parseFloat(amount.replace(',', '.')),
      date: transactionDate.toISOString(),
      category,
      type,
      spendingType: type === TransactionType.INCOME ? 'Renda' as SpendingType : spendingType,
      paymentMethod,
    };

    if (transactionToEdit) {
      onUpdate(transactionToEdit.id, transactionData);
    } else {
      onAdd({ id: '', ...transactionData });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl p-6 overflow-hidden animate-slide-up">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">{transactionToEdit ? 'Editar Lançamento' : 'Nova Transação'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-400">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[75vh] pb-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === TransactionType.EXPENSE ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-arrow-down mr-2"></i> Saída
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-arrow-up mr-2"></i> Entrada
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Valor (R$)</label>
              <input 
                type="text" 
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full text-2xl font-bold text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Data</label>
              <input 
                type="date" 
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Descrição</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aluguel, Netflix..."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Meio de Pagamento</label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm appearance-none"
              >
                <option value="Pix">Pix</option>
                <option value="Crédito">Cartão de Crédito</option>
                <option value="Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
          </div>

          {type === TransactionType.EXPENSE && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-1">Classificação (Regra 50/30/20)</label>
              <div className="flex gap-2">
                {['Necessidades', 'Desejos'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpendingType(s as SpendingType)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${spendingType === s ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit"
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg mt-4 ${type === TransactionType.INCOME ? 'bg-emerald-500' : 'bg-rose-500'}`}
          >
            {transactionToEdit ? 'Atualizar Lançamento' : 'Adicionar Transação'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;
