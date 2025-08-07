// Simple script to check products in database
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCe2cVjFFrP_Xq0CotGOWfYjkptlU0BzA8",
  authDomain: "mitoderm-332c1.firebaseapp.com",
  projectId: "mitoderm-332c1",
  storageBucket: "mitoderm-332c1.firebasestorage.app",
  messagingSenderId: "699230498967",
  appId: "1:699230498967:web:93c2c7f3e7e0e8be8279d2",
  measurementId: "G-WHWV7XTQP2"
};

async function checkProducts() {
  try {
    console.log('🔍 Checking products in database...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    console.log(`📦 Found ${snapshot.size} products in database`);
    
    if (snapshot.size === 0) {
      console.log('❌ No products found. This is why the mega menu is empty.');
      console.log('💡 You need to add products through the admin interface.');
      return;
    }
    
    console.log('\n📋 Products:');
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${data.name} (${data.category}) - Active: ${data.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking products:', error);
  }
}

checkProducts(); 