
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[]) => {
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
    return "Desculpe, não consegui analisar seus dados agora. Tente novamente mais tarde.";
  }
};
