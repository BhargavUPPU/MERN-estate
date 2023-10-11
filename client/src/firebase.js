// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-71b4a.firebaseapp.com",
  projectId: "mern-71b4a",
  storageBucket: "mern-71b4a.appspot.com",
  messagingSenderId: "992458830592",
  appId: "1:992458830592:web:4d78b6ef1a1cf5f75ef9e5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);