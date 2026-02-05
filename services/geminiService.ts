
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

/**
 * Fornece conselhos financeiros baseados nas transações do usuário.
 * Segue as diretrizes da API Gemini 3.
 */
export const getFinancialAdvice = async (transactions: Transaction[]) => {
  // Sempre use process.env.API_KEY diretamente.
  if (!process.env.API_KEY) {
    console.warn("Atenção: API_KEY não configurada.");
    return "O assistente de IA está temporariamente indisponível. Verifique as configurações da API.";
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
    // Instancia o SDK logo antes da chamada, conforme diretrizes.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      // Usando gemini-3-pro-preview para tarefas de análise complexa.
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    // A propriedade .text retorna a string diretamente (não é um método).
    return response.text;
  } catch (error) {
    console.error("Erro ao obter conselhos da IA:", error);
    return "Ops! Tive um problema ao processar seus dados. Verifique sua conexão ou a validade da sua chave de API.";
  }
};
