// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBBkUbIGY5wKkxwx70CerHUEW-_s4uvhTc",
  authDomain: "trans-f6a8f.firebaseapp.com",
  projectId: "trans-f6a8f",
  storageBucket: "trans-f6a8f.firebasestorage.app",
  messagingSenderId: "622028289458",
  appId: "1:622028289458:web:4c3d99fb7ab93d91d0e0ab"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
