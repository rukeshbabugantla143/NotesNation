
// Fix: Using star imports and casting to any to resolve "no exported member" errors in certain environments for Firebase modular SDK
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import * as firebaseFirestore from "firebase/firestore";
import * as firebaseStorage from "firebase/storage";

// Fix: Accessing Vite environment variables using type casting to avoid 'Property env does not exist on type ImportMeta' error
const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyCre06y0yk6wx6YjhgGJ2KKfjBYjoXqSDI",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "notes-cfa93.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "notes-cfa93",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "notes-cfa93.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "1007446058740",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:1007446058740:web:2bce2b62a4098cf786e0a1",
  measurementId: metaEnv.VITE_FIREBASE_MEASUREMENT_ID || "G-8WBHV5VB6H"
};

// Check if configuration exists
export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app;
let auth: any;
let db: any;
let storage: any;
let googleProvider: any;
let signInWithPopup: any;

if (isFirebaseConfigured) {
  try {
    // Fix: Extracting initialization functions from module objects using type casting to resolve reported module errors
    const { initializeApp } = firebaseApp as any;
    const { getAuth, GoogleAuthProvider, signInWithPopup: fbSignInWithPopup } = firebaseAuth as any;
    const { getFirestore } = firebaseFirestore as any;
    const { getStorage } = firebaseStorage as any;

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    signInWithPopup = fbSignInWithPopup;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { auth, db, storage, googleProvider, signInWithPopup };
