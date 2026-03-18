import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCp0xtFuLkUQN8ITlQpUtTd4lbqjGMkpXs",
  authDomain: "henry-sells.firebaseapp.com",
  projectId: "henry-sells",
  storageBucket: "henry-sells.firebasestorage.app",
  messagingSenderId: "573621535196",
  appId: "1:573621535196:web:5746e6f9be9167a9200f19",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
