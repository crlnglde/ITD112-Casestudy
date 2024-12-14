import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwEtE5ZqxN1PXsVb_k3LXLsjHFb0Z5UeA",
  authDomain: "cs1-adc90.firebaseapp.com",
  projectId: "cs1-adc90",
  storageBucket: "cs1-adc90.firebasestorage.app",
  messagingSenderId: "670048387987",
  appId: "1:670048387987:web:a19affdf9f4a792a319e66",
  measurementId: "G-SZV166M3JV"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };