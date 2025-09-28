import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config from the nationalparks-2341c project
const firebaseConfig = {
  apiKey: "AIzaSyDUXwd80ZMF_lAGJSqNuhfxTDU2bgnhO4s",
  authDomain: "nationalparks-2341c.firebaseapp.com",
  projectId: "nationalparks-2341c",
  storageBucket: "nationalparks-2341c.firebasestorage.app",
  messagingSenderId: "579452508133",
  appId: "1:579452508133:web:51408aa4233a7f3aaac10c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 