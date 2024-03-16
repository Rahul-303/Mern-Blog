// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "meta-blogs.firebaseapp.com",
  projectId: "meta-blogs",
  storageBucket: "meta-blogs.appspot.com",
  messagingSenderId: "513051290412",
  appId: "1:513051290412:web:35cee9e63f2c5463d75a89",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
