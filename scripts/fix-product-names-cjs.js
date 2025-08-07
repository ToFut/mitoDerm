const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Firebase configuration
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

// Product name mappings based on slugs
const productNameMappings = {
  'stem-cell-activator': 'Stem Cell Activator',
  'peptide-complex': 'Peptide Complex',
  'pdrn-serum': 'PDRN Serum',
  'exotech-cream': 'ExoTech Cream',
  'exotech-gel': 'ExoTech Gel',
  'exosignal-hair-spray': 'ExoSignal Hair Spray',
  'exosignal-hair-serum': 'ExoSignal Hair Serum',
  'v-tech-system-mask': 'V-Tech System Mask',
  'v-tech-system-serum': 'V-Tech System Serum'
};

async function fixProductNames() {
  try {
    console.log('Starting to fix product names...');
    console.log('Firebase config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain
    });
    
    // Get all products
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    console.log(`Found ${querySnapshot.size} products`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const product = docSnapshot.data();
      const productId = docSnapshot.id;
      
      console.log(`Processing product: ${productId}`);
      console.log(`Current name: ${product.name}`);
      console.log(`Slug: ${product.slug}`);
      
      // Check if name is undefined or empty
      if (!product.name || product.name === 'undefined' || product.name === '') {
        // Try to get name from slug mapping
        const mappedName = productNameMappings[product.slug];
        
        if (mappedName) {
          // Update the product with the mapped name
          const productRef = doc(db, 'products', productId);
          await updateDoc(productRef, {
            name: mappedName,
            updatedAt: new Date()
          });
          
          console.log(`✅ Updated ${productId}: ${product.slug} -> ${mappedName}`);
          updatedCount++;
        } else {
          // Generate a name from the slug if no mapping exists
          const generatedName = product.slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          const productRef = doc(db, 'products', productId);
          await updateDoc(productRef, {
            name: generatedName,
            updatedAt: new Date()
          });
          
          console.log(`✅ Updated ${productId}: ${product.slug} -> ${generatedName}`);
          updatedCount++;
        }
      } else {
        console.log(`⏭️ Skipped ${productId}: name already exists (${product.name})`);
        skippedCount++;
      }
    }
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total products: ${querySnapshot.size}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log('✅ Product names fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing product names:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the script
fixProductNames(); 