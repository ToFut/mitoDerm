const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

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

// Product-specific images (using reliable image hosting)
const productImages = {
  'V-Tech System Serum': {
    url: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'V-Tech System Serum - Advanced exosome technology'
  },
  'V-Tech System Gel Mask': {
    url: 'https://images.pexels.com/photos/3785148/pexels-photo-3785148.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'V-Tech System Gel Mask - Professional treatment mask'
  },
  'ExoSignal Hair Serum': {
    url: 'https://images.pexels.com/photos/3785149/pexels-photo-3785149.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'ExoSignal Hair Serum - Advanced hair regeneration'
  },
  'ExoSignal Hair Spray': {
    url: 'https://images.pexels.com/photos/3785150/pexels-photo-3785150.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'ExoSignal Hair Spray - Professional hair care'
  },
  'EXOTECH Gel': {
    url: 'https://images.pexels.com/photos/3785151/pexels-photo-3785151.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'EXOTECH Gel - Advanced skin technology'
  },
  'EXOTECH Cream': {
    url: 'https://images.pexels.com/photos/3785152/pexels-photo-3785152.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'EXOTECH Cream - Professional skincare'
  },
  'PDRN Serum': {
    url: 'https://images.pexels.com/photos/3785153/pexels-photo-3785153.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'PDRN Serum - Polynucleotide technology'
  },
  'Peptide Complex': {
    url: 'https://images.pexels.com/photos/3785154/pexels-photo-3785154.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'Peptide Complex - Advanced peptide technology'
  },
  'Stem Cell Activator': {
    url: 'https://images.pexels.com/photos/3785155/pexels-photo-3785155.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    alt: 'Stem Cell Activator - Revolutionary cell technology'
  }
};

async function updateProductImages() {
  try {
    console.log('Updating product images...');
    
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    let updatedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const productData = docSnapshot.data();
      const productTitle = productData.title;
      
      if (productImages[productTitle]) {
        const newImage = productImages[productTitle];
        
        // Update the product with new image
        await updateDoc(doc(db, 'products', docSnapshot.id), {
          images: [newImage]
        });
        
        console.log(`✅ Updated: ${productTitle}`);
        updatedCount++;
      } else {
        console.log(`⚠️  No image found for: ${productTitle}`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with new images!`);
    console.log('\nThe images should now display properly on the products page.');
    
  } catch (error) {
    console.error('Error updating product images:', error);
  }
}

updateProductImages(); 