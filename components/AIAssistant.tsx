
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface Props {
  transactions: Transaction[];
}

const AIAssistant: React.FC<Props> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(transactions);
    setAdvice(result || "Não foi possível carregar o conselho.");
    setLoading(false);
  };

  useEffect(() => {
    if (transactions.length > 0 && !advice) {
      fetchAdvice();
    }
  }, [transactions]);

  return (
    <div className="space-y-6 pt-6">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <i className="fa-solid fa-robot text-2xl"></i>
          </div>
          <div>
            <h2 className="text-lg font-bold">Gênio de IA</h2>
            <p className="text-indigo-100 text-xs">Seu consultor financeiro inteligente</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p className="text-xs text-indigo-100 italic">Analisando seus padrões de gastos...</p>
          </div>
        ) : advice ? (
          <div className="prose prose-sm prose-invert max-w-none">
            <div className="bg-white/10 p-4 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed border border-white/10">
              {advice}
            </div>
          </div>
        ) : (
          <p className="text-sm italic">Clique abaixo para obter conselhos personalizados.</p>
        )}

        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="mt-6 w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold text-sm transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Consultando...' : 'Atualizar Dicas'}
        </button>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-4">O que eu posso fazer?</h3>
        <ul className="space-y-3">
          <li className="flex gap-3 text-xs text-slate-600">
            <i className="fa-solid fa-check text-indigo-500 mt-0.5"></i>
            Analisar categorias com gastos acima da média.
          </li>
          <li className="flex gap-3 text-xs text-slate-600">
            <i className="fa-solid fa-check text-indigo-500 mt-0.5"></i>
            Sugerir metas de economia baseadas na sua renda.
          </li>
          <li className="flex gap-3 text-xs text-slate-600">
            <i className="fa-solid fa-check text-indigo-500 mt-0.5"></i>
            Dar dicas de investimentos para o seu perfil.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AIAssistant;
