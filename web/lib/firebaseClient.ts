import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

let app;
let auth;
let storage;

const firebaseConfig = {
  apiKey: "AIzaSyBYsRoPaYRr-Q7FxH6cN4Tq_F2iktR2u8A",
  authDomain: "guiame-85a8b.firebaseapp.com",
  projectId: "guiame-85a8b",
  storageBucket: "guiame-85a8b.firebasestorage.com",//es .com
  messagingSenderId: "943401813994",
  appId: "1:943401813994:web:2402bfc9c500b86f279493",
  measurementId: "G-D33VM79QP2"
};

app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

auth = getAuth(app);
storage = getStorage(app);

export { auth, storage, app };
export const db = getFirestore(app);