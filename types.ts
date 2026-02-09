
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export type SpendingType = 'Renda' | 'Necessidades' | 'Desejos';
export type PaymentMethod = 'Dinheiro' | 'Pix' | 'Crédito' | 'Débito';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
  spendingType: SpendingType;
  paymentMethod: PaymentMethod;
  uid?: string;
}

export interface UserProfile {
  uid: string;
  nome: string;
  telefone: string;
  username: string;
  passwordDisplay: string;
  isAdmin: boolean;
}

export type View = 'dashboard' | 'transactions' | 'analytics' | 'ai' | 'admin' | 'profile';

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Moradia',
  'Salário',
  'Investimentos',
  'Assinaturas',
  'Outros'
];
