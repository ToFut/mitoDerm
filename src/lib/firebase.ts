import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCe2cVjFFrP_Xq0CotGOWfYjkptlU0BzA8",
  authDomain: "mitoderm-332c1.firebaseapp.com",
  projectId: "mitoderm-332c1",
  storageBucket: "mitoderm-332c1.firebasestorage.app",
  messagingSenderId: "699230498967",
  appId: "1:699230498967:web:93c2c7f3e7e0e8be8279d2",
  measurementId: "G-WHWV7XTQP2"
};

// Initialize Firebase with error handling
let app: FirebaseApp | null;
let db: Firestore | null;
let storage: FirebaseStorage | null;
let auth: Auth | null;
let analytics: Analytics | null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  
  // Initialize Analytics (only in browser)
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Provide fallback objects
  app = null;
  db = null;
  storage = null;
  auth = null;
  analytics = null;
}

export { db, storage, auth, analytics };
export default app; 