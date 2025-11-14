// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsU5WS5JvbTESVo44xp04LQIaGsaXTOZU",
  authDomain: "ativos-trans.firebaseapp.com",
  projectId: "ativos-trans",
  storageBucket: "ativos-trans.firebasestorage.app",
  messagingSenderId: "821749851673",
  appId: "1:821749851673:web:20ded142a9a8aadfe42c88"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
