import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAs3Zj6FDUERJ6Gun0cSWk_Egj340n4hUs",
  authDomain: "flashcards-a017d.firebaseapp.com",
  projectId: "flashcards-a017d",
  storageBucket: "flashcards-a017d.appspot.com",
  messagingSenderId: "309136877437",
  appId: "1:309136877437:web:97c6f61e1e5674c866ce14",
  measurementId: "G-PD0B6LNTQY"
};

const firebaseApp = initializeApp(firebaseConfig);
export { firebaseApp };