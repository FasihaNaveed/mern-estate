// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-4591a.firebaseapp.com",
  projectId: "mern-estate-4591a",
  storageBucket: "mern-estate-4591a.firebasestorage.app",
  messagingSenderId: "228691463038",
  appId: "1:228691463038:web:bba9a30741ba6017a6012f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);