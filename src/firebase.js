import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyBOfheFJavB0iQrXa2fFxJ6Oc3z2G1mtg0",
  authDomain: "acmwebsite-7e84b.firebaseapp.com",
  projectId: "acmwebsite-7e84b",
  storageBucket: "acmwebsite-7e84b.firebasestorage.app",
  messagingSenderId: "385674623140",
  appId: "1:385674623140:web:eee4c3b30f3a878b7ece31",
  measurementId: "G-FYK016TD8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };