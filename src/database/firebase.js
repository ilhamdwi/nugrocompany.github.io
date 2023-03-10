// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFo85E8_4rwdd8N38rzzwBS4iv-qQmBE4",
  authDomain: "jokitugas-f38c7.firebaseapp.com",
  databaseURL: "https://jokitugas-f38c7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jokitugas-f38c7",
  storageBucket: "jokitugas-f38c7.appspot.com",
  messagingSenderId: "105883173112",
  appId: "1:105883173112:web:f4c9612f6a87d2a5e03b0d",
  measurementId: "G-984MCRT3GX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const auth = getAuth(app);
