const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, where } = require('firebase/firestore');

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testMediaFetch() {
  try {
    console.log('🔍 Testing Firebase media fetch...');
    
    // Test 1: Get all media
    const mediaRef = collection(db, 'media');
    const q = query(mediaRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log(`✅ Found ${querySnapshot.size} media items`);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📁 ${doc.id}: ${data.name} (${data.category})`);
    });
    
    // Test 2: Get by category
    console.log('\n🔍 Testing category filter...');
    const categoryQuery = query(
      collection(db, 'media'),
      where('category', '==', 'education'),
      orderBy('uploadedAt', 'desc')
    );
    
    try {
      const categorySnapshot = await getDocs(categoryQuery);
      console.log(`✅ Found ${categorySnapshot.size} education items`);
    } catch (error) {
      console.log('❌ Category query failed (likely missing index):', error.message);
    }
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
  }
}

testMediaFetch(); 