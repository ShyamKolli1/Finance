// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6D-f1jwcDwKspzZnzvaXdXalb2HEcELg",
  authDomain: "finance-tracker-ac631.firebaseapp.com",
  projectId: "finance-tracker-ac631",
  storageBucket: "finance-tracker-ac631.firebasestorage.app",
  messagingSenderId: "404754894885",
  appId: "1:404754894885:web:b7b450c0246349914dafcc",
  measurementId: "G-YVKTKP5HNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other files
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAuth = auth;
window.firebaseCollection = collection;
window.firebaseDoc = doc;
window.firebaseSetDoc = setDoc;
window.firebaseGetDoc = getDoc;
window.firebaseOnSnapshot = onSnapshot;
window.firebaseUpdateDoc = updateDoc;
window.firebaseDeleteDoc = deleteDoc;
window.firebaseOnAuthStateChanged = onAuthStateChanged;
window.firebaseSignOut = signOut;

console.log('✅ Firebase initialized successfully!');
