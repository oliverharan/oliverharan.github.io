// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0fpwBSIfBnb8_Ndct8TIA04dZWHXri7E",
  authDomain: "lens-library-c9d31.firebaseapp.com",
  projectId: "lens-library-c9d31",
  storageBucket: "lens-library-c9d31.appspot.com",
  messagingSenderId: "378670909659",
  appId: "1:378670909659:web:c0bbca89a6809213d5a4fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app);

export { db, storage }; // Export the Firestore instance
