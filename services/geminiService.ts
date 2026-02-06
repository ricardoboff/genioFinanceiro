
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Transaction } from "../types";

/**
 * Fornece conselhos financeiros baseados nas transações do usuário.
 * Segue as diretrizes da API Gemini 3.
 */
export const getFinancialAdvice = async (transactions: Transaction[]) => {
  // Sempre use process.env.API_KEY diretamente conforme as diretrizes.
  if (!process.env.API_KEY) {
    return "O assistente de IA está temporariamente indisponível.";
  }

  if (transactions.length === 0) {
    return "Adicione algumas transações para que eu possa analisar seu perfil financeiro!";
  }

  const transactionSummary = transactions.slice(-20).map(t => 
    `${t.date}: ${t.description} - R$${t.amount} (${t.category})`
  ).join('\n');

  try {
    // Instancia o SDK logo antes da chamada para garantir o uso da chave mais recente do ambiente.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fix: Using ai.models.generateContent with 'gemini-3-flash-preview' and systemInstruction for optimal text results.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aqui estão minhas transações recentes:\n\n${transactionSummary}`,
      config: {
        systemInstruction: "Você é um consultor financeiro pessoal experiente. Analise as transações fornecidas pelo usuário e dê exatamente 3 conselhos práticos e curtos para melhorar sua saúde financeira. Seja amigável e direto. Use Markdown.",
      }
    });

    // Fix: Accessing .text property directly (not a method) from GenerateContentResponse.
    return response.text;
  } catch (error) {
    console.error("Erro ao obter conselhos da IA:", error);
    return "Ops! Tive um problema ao processar seus dados financeiros agora.";
  }
};
