import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

/**
 * Fornece conselhos financeiros baseados nas transações do usuário.
 */
export const getFinancialAdvice = async (transactions: Transaction[]) => {
  if (transactions.length === 0) return "Adicione algumas transações para que eu possa analisar seu perfil e dar dicas personalizadas.";

  const transactionSummary = transactions.slice(-20).map(t => 
    `${t.date}: ${t.description} - R$${t.amount} (${t.category})`
  ).join('\n');

  try {
    // Using gemini-3-flash-preview for basic financial summarization and advice.
    // Always initialize a new GoogleGenAI instance right before the call to ensure the latest config.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aqui estão minhas transações recentes:\n\n${transactionSummary}`,
      config: {
        systemInstruction: "Você é um consultor financeiro amigável e focado em economia doméstica. Dê 3 dicas curtas e práticas baseadas nos gastos manuais do usuário. Não mencione bancos, apenas o comportamento de gastos. Use Markdown.",
      }
    });
    
    // Access the .text property directly as it returns string | undefined.
    return response.text || "Não foi possível gerar dicas no momento.";
  } catch (error) {
    console.error("Erro na IA:", error);
    return "O Gênio está descansando um pouco. Tente novamente mais tarde.";
  }
};
