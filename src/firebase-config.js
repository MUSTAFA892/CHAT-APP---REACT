// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC-Yeo4wcXlg3XuxpWgGEYkTOXBsutyLmc",
  authDomain: "chat-fef24.firebaseapp.com",
  projectId: "chat-fef24",
  storageBucket: "chat-fef24.appspot.com",
  messagingSenderId: "642837252043",
  appId: "1:642837252043:web:ab51d79718b3b47bff984e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();