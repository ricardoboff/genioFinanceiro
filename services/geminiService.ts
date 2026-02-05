
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Função para obter a instância da IA com segurança
const getAIInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Atenção: API_KEY não configurada nas variáveis de ambiente.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Erro ao inicializar GoogleGenAI:", e);
    return null;
  }
};

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  const ai = getAIInstance();
  
  if (!ai) {
    return "O assistente de IA está temporariamente indisponível. Verifique se a API_KEY foi configurada corretamente nas configurações do seu deploy (Vercel/Firebase).";
  }

  if (transactions.length === 0) {
    return "Adicione algumas transações para que eu possa analisar seu perfil financeiro!";
  }

  const transactionSummary = transactions.slice(-20).map(t => 
    `${t.date}: ${t.description} - R$${t.amount} (${t.category})`
  ).join('\n');

  const prompt = `
    Como um consultor financeiro pessoal experiente, analise as seguintes transações recentes do usuário e forneça 3 dicas práticas para melhorar sua saúde financeira. 
    Seja amigável, direto e use o contexto dos gastos.
    
    Transações:
    ${transactionSummary}
    
    Responda em formato Markdown curto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao obter conselhos da IA:", error);
    return "Ops! Tive um problema ao processar seus dados. Verifique sua conexão ou a validade da sua chave de API.";
  }
};
