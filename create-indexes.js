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

async function createIndexes() {
  console.log('Creating Firebase indexes...');
  
  try {
    // Test queries to trigger index creation
    console.log('Testing brands query...');
    const brandsRef = collection(db, 'brands');
    const brandsQuery = query(brandsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
    await getDocs(brandsQuery);
    console.log('✅ Brands index created/verified');
    
    console.log('Testing products query...');
    const productsRef = collection(db, 'products');
    const productsQuery = query(productsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
    await getDocs(productsQuery);
    console.log('✅ Products index created/verified');
    
    console.log('Testing featured products query...');
    const featuredQuery = query(productsRef, where('featured', '==', true), where('isActive', '==', true), orderBy('createdAt', 'desc'));
    await getDocs(featuredQuery);
    console.log('✅ Featured products index created/verified');
    
    console.log('Testing products by brand query...');
    const brandProductsQuery = query(productsRef, where('brandId', '==', 'test'), where('isActive', '==', true), orderBy('createdAt', 'desc'));
    await getDocs(brandProductsQuery);
    console.log('✅ Products by brand index created/verified');
    
    console.log('Testing products by category query...');
    const categoryQuery = query(productsRef, where('category', '==', 'clinic'), where('isActive', '==', true), orderBy('createdAt', 'desc'));
    await getDocs(categoryQuery);
    console.log('✅ Products by category index created/verified');
    
    console.log('\n🎉 All indexes have been created successfully!');
    console.log('\nNote: It may take a few minutes for the indexes to be fully active.');
    console.log('You can monitor index creation in the Firebase Console:');
    console.log('https://console.firebase.google.com/project/mitoderm-332c1/firestore/indexes');
    
  } catch (error) {
    console.error('Error creating indexes:', error);
    
    if (error.code === 'failed-precondition') {
      console.log('\n📋 Index creation URLs:');
      console.log('Copy and paste these URLs in your browser to create the indexes manually:');
      
      // Extract URLs from error messages
      const urls = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/g);
      if (urls) {
        urls.forEach((url, index) => {
          console.log(`${index + 1}. ${url}`);
        });
      }
    }
  }
}

createIndexes(); 