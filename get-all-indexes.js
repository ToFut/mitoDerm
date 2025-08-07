const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, orderBy, getDocs } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq",
  authDomain: "mitoderm-332c1.firebaseapp.com",
  projectId: "mitoderm-332c1",
  storageBucket: "mitoderm-332c1.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getAllIndexUrls() {
  console.log('Getting all required index URLs...\n');
  
  const queries = [
    {
      name: 'Brands: isActive + createdAt',
      query: () => query(collection(db, 'brands'), where('isActive', '==', true), orderBy('createdAt', 'desc'))
    },
    {
      name: 'Products: isActive + createdAt',
      query: () => query(collection(db, 'products'), where('isActive', '==', true), orderBy('createdAt', 'desc'))
    },
    {
      name: 'Featured Products: featured + isActive + createdAt',
      query: () => query(collection(db, 'products'), where('featured', '==', true), where('isActive', '==', true), orderBy('createdAt', 'desc'))
    },
    {
      name: 'Products by Brand: brandId + isActive + createdAt',
      query: () => query(collection(db, 'products'), where('brandId', '==', 'test'), where('isActive', '==', true), orderBy('createdAt', 'desc'))
    },
    {
      name: 'Products by Category: category + isActive + createdAt',
      query: () => query(collection(db, 'products'), where('category', '==', 'clinic'), where('isActive', '==', true), orderBy('createdAt', 'desc'))
    }
  ];

  for (let i = 0; i < queries.length; i++) {
    const { name, query: queryFn } = queries[i];
    console.log(`${i + 1}. Testing: ${name}`);
    
    try {
      await getDocs(queryFn());
      console.log(`   ✅ Index already exists or is building`);
    } catch (error) {
      if (error.code === 'failed-precondition') {
        const urls = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/g);
        if (urls && urls.length > 0) {
          console.log(`   📋 Create index: ${urls[0]}`);
        }
      } else {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    console.log('');
  }
  
  console.log('📝 Instructions:');
  console.log('1. Copy each URL above and paste it in your browser');
  console.log('2. Click "Create Index" in the Firebase Console');
  console.log('3. Wait for indexes to finish building (may take a few minutes)');
  console.log('4. Run this script again to verify all indexes are ready');
}

getAllIndexUrls(); 