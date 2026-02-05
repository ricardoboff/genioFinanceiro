
import { Transaction } from '../types';

const STORAGE_KEY = 'genio_financeiro_transactions';

export const storageService = {
  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  },
  
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
};
