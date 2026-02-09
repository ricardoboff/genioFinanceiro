
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
  uid?: string;
  automated?: boolean; // Indica se veio do Open Finance
  institution?: string; // Nome do banco de origem
  bankDetails?: string; // Agência e Conta (ex: 0001 / 12345-6)
}

export interface BankAccount {
  id: string;
  institution: string;
  agency: string;
  accountNumber: string;
  lastSync: string;
  status: 'active' | 'error' | 'syncing';
  balance: number;
}

export interface UserProfile {
  uid: string;
  nome: string;
  telefone: string;
  username: string;
  passwordDisplay: string;
  isAdmin: boolean;
}

export type View = 'dashboard' | 'transactions' | 'analytics' | 'ai' | 'admin' | 'profile' | 'banks';

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Moradia',
  'Salário',
  'Investimentos',
  'Outros'
];
