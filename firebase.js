import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyATZn6T1zJgHmqs7PDuzSvMUd12m1xpcb0",
  authDomain: "blackjack-3b83e.firebaseapp.com",
  projectId: "blackjack-3b83e",
  storageBucket: "blackjack-3b83e.firebasestorage.app",
  messagingSenderId: "92535997287",
  appId: "1:92535997287:web:b99e810bb2612c62a7a5c2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
};