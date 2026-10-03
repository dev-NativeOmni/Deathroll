import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgVESaa30SceU4eEFThT0li394Wzmrk8o",
  authDomain: "deathroll-225d0.firebaseapp.com",
  projectId: "deathroll-225d0",
  storageBucket: "deathroll-225d0.firebasestorage.app",
  messagingSenderId: "1046105761353",
  appId: "1:1046105761353:web:c1731215c5ee6374ee0198",
  measurementId: "G-11GRS57VTS"
};

// Initialize Firebase
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, query, orderBy, limit };
