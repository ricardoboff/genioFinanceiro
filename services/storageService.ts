
import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  onSnapshot,
  setDoc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { Transaction, UserProfile } from '../types';

const TRANSACTIONS_COL = 'transactions';
const PROFILES_COL = 'profiles';

export const storageService = {
  // Transações
  subscribeTransactions: (uid: string, callback: (transactions: Transaction[]) => void) => {
    try {
      const q = query(
        collection(db, TRANSACTIONS_COL), 
        where('uid', '==', uid)
      );
      
      return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Transaction[];
        callback(transactions);
      }, (error) => {
        console.error("Erro no onSnapshot do Firestore:", error);
      });
    } catch (err) {
      console.error("Erro ao inscrever transações:", err);
      throw err;
    }
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
    try {
      return await addDoc(collection(db, TRANSACTIONS_COL), transaction);
    } catch (err) {
      console.error("Erro ao adicionar transação:", err);
      throw err;
    }
  },

  updateTransaction: async (id: string, data: Partial<Transaction>) => {
    try {
      const transactionRef = doc(db, TRANSACTIONS_COL, id);
      await updateDoc(transactionRef, data);
    } catch (err) {
      console.error("Erro ao atualizar transação:", err);
      throw err;
    }
  },

  deleteTransaction: async (id: string) => {
    try {
      await deleteDoc(doc(db, TRANSACTIONS_COL, id));
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
      throw err;
    }
  },

  // Perfil e Usuários
  saveProfile: async (profile: UserProfile) => {
    try {
      await setDoc(doc(db, PROFILES_COL, profile.uid), profile);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      throw err;
    }
  },

  getProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const d = await getDoc(doc(db, PROFILES_COL, uid));
      return d.exists() ? d.data() as UserProfile : null;
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      return null;
    }
  },

  updateProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      await updateDoc(doc(db, PROFILES_COL, uid), data);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      throw err;
    }
  },

  getAllProfiles: async (): Promise<UserProfile[]> => {
    try {
      const snapshot = await getDocs(collection(db, PROFILES_COL));
      return snapshot.docs.map(d => d.data() as UserProfile);
    } catch (err) {
      console.error("Erro ao buscar todos perfis:", err);
      return [];
    }
  },

  getProfileByUsername: async (username: string): Promise<UserProfile | null> => {
    try {
      const q = query(collection(db, PROFILES_COL), where('username', '==', username));
      const snap = await getDocs(q);
      return !snap.empty ? snap.docs[0].data() as UserProfile : null;
    } catch (err) {
      console.error("Erro ao buscar perfil por username:", err);
      return null;
    }
  }
};
