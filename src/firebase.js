import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUTTAUh5g2nDoXqCBs-szUhDuC9BswdEU",
  authDomain: "itd112-cs.firebaseapp.com",
  projectId: "itd112-cs",
  storageBucket: "itd112-cs.firebasestorage.app",
  messagingSenderId: "816027822795",
  appId: "1:816027822795:web:bee585f2cf0acb3491094e",
  measurementId: "G-MQSF0J35B2"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };