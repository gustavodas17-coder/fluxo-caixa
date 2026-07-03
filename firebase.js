import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAm_vFtrwCIBhpx0igK55Ghou3R7MFMAf4",
    authDomain: "fluxo-caixa-app-71d5e.firebaseapp.com",
    projectId: "fluxo-caixa-app-71d5e",
    storageBucket: "fluxo-caixa-app-71d5e.firebasestorage.app",
    messagingSenderId: "226435297494",
    appId: "1:226435297494:web:f2ab5d092c4c4c16bad977"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    collection,
    addDoc,
    getDocs,
    query,
    where
};