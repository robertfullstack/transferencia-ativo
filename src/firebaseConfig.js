// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyCL75e3y4pO4siCi3N_jjBDUmLrvFhsba8",
  authDomain: "atrativo-social.firebaseapp.com",
  databaseURL: "https://atrativo-social-default-rtdb.firebaseio.com",
  projectId: "atrativo-social",
  storageBucket: "atrativo-social.appspot.com",
  messagingSenderId: "147961984705",
  appId: "1:147961984705:web:38893f9ea008de50328640",
  measurementId: "G-F09PQ0D4R1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
