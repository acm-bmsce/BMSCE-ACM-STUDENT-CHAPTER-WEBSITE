import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "acm-website.firebaseapp.com",
  projectId: "acm-website",
  storageBucket: "acm-website.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };