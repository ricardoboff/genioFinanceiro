
import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy, 
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
    const q = query(
      collection(db, TRANSACTIONS_COL), 
      where('uid', '==', uid),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Transaction[];
      callback(transactions);
    });
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'>) => {
    return await addDoc(collection(db, TRANSACTIONS_COL), transaction);
  },

  deleteTransaction: async (id: string) => {
    await deleteDoc(doc(db, TRANSACTIONS_COL, id));
  },

  // Perfil e Usuários
  saveProfile: async (profile: UserProfile) => {
    await setDoc(doc(db, PROFILES_COL, profile.uid), profile);
  },

  getProfile: async (uid: string): Promise<UserProfile | null> => {
    const d = await getDoc(doc(db, PROFILES_COL, uid));
    return d.exists() ? d.data() as UserProfile : null;
  },

  updateProfile: async (uid: string, data: Partial<UserProfile>) => {
    await updateDoc(doc(db, PROFILES_COL, uid), data);
  },

  deleteProfile: async (uid: string) => {
    // Em um app real, aqui também deletaríamos as transações do usuário
    await deleteDoc(doc(db, PROFILES_COL, uid));
  },

  getAllProfiles: async (): Promise<UserProfile[]> => {
    const snapshot = await getDocs(collection(db, PROFILES_COL));
    return snapshot.docs.map(d => d.data() as UserProfile);
  },

  getProfileByUsername: async (username: string): Promise<UserProfile | null> => {
    const q = query(collection(db, PROFILES_COL), where('username', '==', username));
    const snap = await getDocs(q);
    return !snap.empty ? snap.docs[0].data() as UserProfile : null;
  }
};
