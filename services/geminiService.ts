
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

/**
 * Usa a IA para processar um extrato bruto do banco e extrair transações estruturadas.
 */
export const processBankStatement = async (rawText: string): Promise<Partial<Transaction>[]> => {
  try {
    // Requisito: Utilizar process.env.API_KEY diretamente na inicialização do GoogleGenAI
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analise este extrato bruto e extraia os lançamentos: \n\n${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING, description: "Nome amigável da transação" },
              amount: { type: Type.NUMBER, description: "Valor absoluto" },
              type: { type: Type.STRING, description: "INCOME ou EXPENSE" },
              category: { type: Type.STRING, description: "Categoria" },
              date: { type: Type.STRING, description: "Data YYYY-MM-DD" }
            },
            required: ["description", "amount", "type", "category", "date"],
            propertyOrdering: ["description", "amount", "type", "category", "date"]
          }
        },
        systemInstruction: "Você é um especialista em processamento de dados bancários via Open Finance. Limpe nomes sujos e normalize categorias.",
      }
    });

    // Acessar .text como propriedade, não como método.
    const jsonStr = response.text?.trim();
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
    return [];
  } catch (error) {
    console.error("Erro ao processar extrato com IA:", error);
    return [];
  }
};

/**
 * Fornece conselhos financeiros baseados nas transações do usuário.
 */
export const getFinancialAdvice = async (transactions: Transaction[]) => {
  if (transactions.length === 0) return "Adicione algumas transações para análise.";

  const transactionSummary = transactions.slice(-20).map(t => 
    `${t.date}: ${t.description} - R$${t.amount} (${t.category})`
  ).join('\n');

  try {
    // Requisito: Utilizar process.env.API_KEY diretamente na inicialização do GoogleGenAI
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aqui estão minhas transações recentes:\n\n${transactionSummary}`,
      config: {
        systemInstruction: "Você é um consultor financeiro. Dê 3 dicas curtas e práticas baseadas nos gastos do usuário. Use Markdown.",
      }
    });
    // Acessar .text como propriedade
    return response.text || "Não foi possível gerar dicas no momento.";
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Erro ao processar dicas.";
  }
};
