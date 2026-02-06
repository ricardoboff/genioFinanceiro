import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Transaction } from "../types";

/**
 * Usa a IA para processar um extrato bruto do banco e extrair transações estruturadas.
 */
export const processBankStatement = async (rawText: string): Promise<Partial<Transaction>[]> => {
  if (!process.env.API_KEY) return [];

  try {
    // Inicializa o cliente Gemini API right before the call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Usamos gemini-3-pro-preview para tarefas complexas de extração de dados.
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
              description: { type: Type.STRING, description: "Nome amigável da transação (ex: Uber, Netflix)" },
              amount: { type: Type.NUMBER, description: "Valor absoluto da transação" },
              type: { type: Type.STRING, description: "INCOME para entradas, EXPENSE para saídas" },
              category: { type: Type.STRING, description: "Categoria: Alimentação, Transporte, Lazer, Saúde, Moradia, Salário, Investimentos ou Outros" },
              date: { type: Type.STRING, description: "Data aproximada no formato YYYY-MM-DD" }
            },
            required: ["description", "amount", "type", "category", "date"],
            propertyOrdering: ["description", "amount", "type", "category", "date"]
          }
        },
        systemInstruction: "Você é um especialista em processamento de dados bancários. Extraia informações de textos brutos de extratos (Open Finance). Limpe nomes sujos. Se o valor for negativo no extrato, classifique como EXPENSE e retorne o valor positivo. Se for positivo, INCOME.",
      }
    });

    // Access the .text property directly (getter)
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
  if (!process.env.API_KEY) return "O assistente de IA está temporariamente indisponível.";
  if (transactions.length === 0) return "Adicione algumas transações para análise.";

  const transactionSummary = transactions.slice(-20).map(t => 
    `${t.date}: ${t.description} - R$${t.amount} (${t.category})`
  ).join('\n');

  try {
    // Inicializa o cliente Gemini API right before the call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Usamos gemini-3-pro-preview para análise financeira detalhada
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Aqui estão minhas transações recentes:\n\n${transactionSummary}`,
      config: {
        systemInstruction: "Você é um consultor financeiro. Dê 3 dicas curtas e práticas baseadas nos gastos do usuário. Use Markdown.",
      }
    });
    // Access the .text property directly
    return response.text || "Não foi possível gerar dicas no momento.";
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Erro ao processar dicas.";
  }
};