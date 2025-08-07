const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCe2cVjFFrP_Xq0CotGOWfYjkptlU0BzA8",
  authDomain: "mitoderm-332c1.firebaseapp.com",
  projectId: "mitoderm-332c1",
  storageBucket: "mitoderm-332c1.firebasestorage.app",
  messagingSenderId: "699230498967",
  appId: "1:699230498967:web:93c2c7f3e7e0e8be8279d2",
  measurementId: "G-WHWV7XTQP2"
};

async function testProducts() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Fetching products...');
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.docs.length} products:`);
    
    querySnapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.name} (slug: ${data.slug})`);
    });
    
    if (querySnapshot.docs.length === 0) {
      console.log('No products found in database');
    }
    
  } catch (error) {
    console.error('Error testing products:', error);
  }
}

testProducts(); 