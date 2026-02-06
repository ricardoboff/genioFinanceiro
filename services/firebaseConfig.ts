
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Fix: Consolidating modular auth imports to ensure they are correctly exported and resolved
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSHVmQzOzykcHZdAyrIAA4WT9EcKccKP8",
  authDomain: "geniofinanceiro-7d8c9.firebaseapp.com",
  projectId: "geniofinanceiro-7d8c9",
  storageBucket: "geniofinanceiro-7d8c9.firebasestorage.app",
  messagingSenderId: "801914709880",
  appId: "1:801914709880:web:440c2652e34ea7427a8a8d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Fix: Exporting auth methods directly from the config to bypass potential "no exported member" issues in other files
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
};
