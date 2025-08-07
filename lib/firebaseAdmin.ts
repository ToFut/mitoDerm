import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;
let db: any = null;

try {
  // Check if required Firebase Admin credentials are available
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin credentials are not properly configured. Using fallback mode.');
    console.warn('Missing:', {
      projectId: !projectId,
      clientEmail: !clientEmail,
      privateKey: !privateKey
    });
    
    // Export a null db to handle gracefully in API routes
    db = null;
  } else {
    if (!getApps().length) {
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      app = getApps()[0];
    }

    db = getFirestore(app);
    console.log('Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  db = null;
}

export { db }; 