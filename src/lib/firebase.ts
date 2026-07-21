import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "n8n-story-gsheet",
  appId: "1:545056737730:web:8c038d8b1988bbec212e5b",
  apiKey: "AIzaSyBd52uGUzyncg-OvbcRiLx5mogarIgzMNo",
  authDomain: "n8n-story-gsheet.firebaseapp.com",
  storageBucket: "n8n-story-gsheet.firebasestorage.app",
  messagingSenderId: "545056737730",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-642eb95e-5a12-43c7-8567-344adcf78a43");
export const googleProvider = new GoogleAuthProvider();
