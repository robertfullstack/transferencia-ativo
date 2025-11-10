// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAaQ2F9uGHm_Z6jnahYeOjxnEgDqlXbeZg",
  authDomain: "tec-serv-468b7.firebaseapp.com",
  databaseURL: "https://tec-serv-468b7-default-rtdb.firebaseio.com",
  projectId: "tec-serv-468b7",
  storageBucket: "tec-serv-468b7.firebasestorage.app",
  messagingSenderId: "577413763329",
  appId: "1:577413763329:web:3709be19efba59de7b0b00"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
