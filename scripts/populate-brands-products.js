#!/usr/bin/env node

/**
 * Populate Brands and Products Script
 * Creates sample brands and products based on existing MitoDerm content
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  getDocs,
  where
} = require('firebase/firestore');

// Firebase configuration (you'll need to add your actual config)
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

// Sample brands data based on MitoDerm content
const sampleBrands = [
  {
    name: 'V-Tech System',
    nameHebrew: 'V-Tech System',
    description: 'Advanced exosome technology for clinical applications',
    descriptionHebrew: 'טכנולוגיית אקסוזומים מתקדמת ליישומים קליניים',
    logo: '/images/products/v-tech-logo.png',
    category: 'clinic',
    technology: 'Exosomes',
    featured: true,
    isActive: true,
    slug: 'v-tech-system'
  },
  {
    name: 'ExoSignal',
    nameHebrew: 'ExoSignal',
    description: 'Revolutionary hair treatment technology',
    descriptionHebrew: 'טכנולוגיית טיפול שיער מהפכנית',
    logo: '/images/products/exosignal-logo.png',
    category: 'clinic',
    technology: 'PDRN',
    featured: true,
    isActive: true,
    slug: 'exosignal'
  },
  {
    name: 'EXOTECH',
    nameHebrew: 'EXOTECH',
    description: 'Advanced home care products with exosome technology',
    descriptionHebrew: 'מוצרי טיפול בית מתקדמים עם טכנולוגיית אקסוזומים',
    logo: '/images/products/exotech-logo.png',
    category: 'home',
    technology: 'Exosomes',
    featured: false,
    isActive: true,
    slug: 'exotech'
  },
  {
    name: 'MitoDerm Professional',
    nameHebrew: 'MitoDerm Professional',
    description: 'Professional-grade skincare solutions',
    descriptionHebrew: 'פתרונות טיפוח עור מקצועיים',
    logo: '/images/products/mitoderm-pro-logo.png',
    category: 'professional',
    technology: 'Peptides',
    featured: false,
    isActive: true,
    slug: 'mitoderm-professional'
  }
];

// Sample products data
const sampleProducts = [
  // V-Tech System Products
  {
    name: 'V-Tech System Serum',
    nameHebrew: 'סרום V-Tech System',
    description: 'High-concentration exosome serum for clinical use',
    descriptionHebrew: 'סרום אקסוזומים בריכוז גבוה לשימוש קליני',
    brandId: '', // Will be set after brand creation
    brandName: 'V-Tech System',
    category: 'clinic',
    technology: 'Exosomes',
    price: 299.99,
    images: ['/images/products/v-tech-serum.jpg'],
    featured: true,
    isActive: true,
    slug: 'v-tech-system-serum',
    specifications: {
      size: '30ml',
      ingredients: ['Synthetic Exosomes', 'Hyaluronic Acid', 'Peptides'],
      usage: 'Apply 2-3 times daily to clean skin',
      benefits: ['Anti-aging', 'Skin regeneration', 'Collagen production']
    }
  },
  {
    name: 'V-Tech System Mask',
    nameHebrew: 'מסכת V-Tech System',
    description: 'Intensive treatment mask with exosome technology',
    descriptionHebrew: 'מסכת טיפול אינטנסיבית עם טכנולוגיית אקסוזומים',
    brandId: '', // Will be set after brand creation
    brandName: 'V-Tech System',
    category: 'clinic',
    technology: 'Exosomes',
    price: 89.99,
    images: ['/images/products/v-tech-mask.jpg'],
    featured: false,
    isActive: true,
    slug: 'v-tech-system-mask',
    specifications: {
      size: '50ml',
      ingredients: ['Synthetic Exosomes', 'Aloe Vera', 'Vitamin E'],
      usage: 'Apply once weekly for 20 minutes',
      benefits: ['Deep hydration', 'Skin repair', 'Anti-inflammatory']
    }
  },
  
  // ExoSignal Products
  {
    name: 'ExoSignal Hair Serum',
    nameHebrew: 'סרום שיער ExoSignal',
    description: 'Advanced hair growth serum with PDRN technology',
    descriptionHebrew: 'סרום צמיחת שיער מתקדם עם טכנולוגיית PDRN',
    brandId: '', // Will be set after brand creation
    brandName: 'ExoSignal',
    category: 'clinic',
    technology: 'PDRN',
    price: 199.99,
    images: ['/images/products/exosignal-hair-serum.jpg'],
    featured: true,
    isActive: true,
    slug: 'exosignal-hair-serum',
    specifications: {
      size: '60ml',
      ingredients: ['PDRN', 'Biotin', 'Niacinamide'],
      usage: 'Apply to scalp daily',
      benefits: ['Hair growth', 'Scalp health', 'Hair strength']
    }
  },
  {
    name: 'ExoSignal Hair Spray',
    nameHebrew: 'ספריי שיער ExoSignal',
    description: 'Daily hair care spray with exosome technology',
    descriptionHebrew: 'ספריי טיפול שיער יומיומי עם טכנולוגיית אקסוזומים',
    brandId: '', // Will be set after brand creation
    brandName: 'ExoSignal',
    category: 'home',
    technology: 'Exosomes',
    price: 49.99,
    images: ['/images/products/exosignal-spray.jpg'],
    featured: false,
    isActive: true,
    slug: 'exosignal-hair-spray',
    specifications: {
      size: '150ml',
      ingredients: ['Exosomes', 'Argan Oil', 'Vitamin B5'],
      usage: 'Spray on damp hair daily',
      benefits: ['Hair protection', 'Moisture retention', 'Shine enhancement']
    }
  },
  
  // EXOTECH Products
  {
    name: 'EXOTECH Gel',
    nameHebrew: 'ג\'ל EXOTECH',
    description: 'Advanced facial gel with exosome technology',
    descriptionHebrew: 'ג\'ל פנים מתקדם עם טכנולוגיית אקסוזומים',
    brandId: '', // Will be set after brand creation
    brandName: 'EXOTECH',
    category: 'home',
    technology: 'Exosomes',
    price: 79.99,
    images: ['/images/products/exotech-gel.jpg'],
    featured: false,
    isActive: true,
    slug: 'exotech-gel',
    specifications: {
      size: '50ml',
      ingredients: ['Exosomes', 'Hyaluronic Acid', 'Aloe Vera'],
      usage: 'Apply morning and evening',
      benefits: ['Hydration', 'Anti-aging', 'Skin smoothing']
    }
  },
  {
    name: 'EXOTECH Cream',
    nameHebrew: 'קרם EXOTECH',
    description: 'Rich moisturizing cream for daily use',
    descriptionHebrew: 'קרם לחות עשיר לשימוש יומיומי',
    brandId: '', // Will be set after brand creation
    brandName: 'EXOTECH',
    category: 'home',
    technology: 'Exosomes',
    price: 69.99,
    images: ['/images/products/exotech-cream.jpg'],
    featured: false,
    isActive: true,
    slug: 'exotech-cream',
    specifications: {
      size: '100ml',
      ingredients: ['Exosomes', 'Shea Butter', 'Vitamin E'],
      usage: 'Apply after cleansing',
      benefits: ['Deep moisturizing', 'Skin barrier repair', 'Anti-aging']
    }
  },
  
  // MitoDerm Professional Products
  {
    name: 'MitoDerm Pro Serum',
    nameHebrew: 'סרום MitoDerm Pro',
    description: 'Professional peptide serum for advanced treatments',
    descriptionHebrew: 'סרום פפטידים מקצועי לטיפולים מתקדמים',
    brandId: '', // Will be set after brand creation
    brandName: 'MitoDerm Professional',
    category: 'professional',
    technology: 'Peptides',
    price: 399.99,
    images: ['/images/products/mitoderm-pro-serum.jpg'],
    featured: true,
    isActive: true,
    slug: 'mitoderm-pro-serum',
    specifications: {
      size: '30ml',
      ingredients: ['Bioactive Peptides', 'Growth Factors', 'Hyaluronic Acid'],
      usage: 'Apply 1-2 times daily',
      benefits: ['Collagen stimulation', 'Skin tightening', 'Wrinkle reduction']
    }
  },
  {
    name: 'MitoDerm Pro Mask',
    nameHebrew: 'מסכת MitoDerm Pro',
    description: 'Professional treatment mask for intensive care',
    descriptionHebrew: 'מסכת טיפול מקצועית לטיפול אינטנסיבי',
    brandId: '', // Will be set after brand creation
    brandName: 'MitoDerm Professional',
    category: 'professional',
    technology: 'Peptides',
    price: 129.99,
    images: ['/images/products/mitoderm-pro-mask.jpg'],
    featured: false,
    isActive: true,
    slug: 'mitoderm-pro-mask',
    specifications: {
      size: '75ml',
      ingredients: ['Bioactive Peptides', 'Algae Extract', 'Vitamin C'],
      usage: 'Apply weekly for 30 minutes',
      benefits: ['Intensive repair', 'Brightening', 'Firming']
    }
  }
];

async function checkExistingData() {
  console.log('🔍 Checking existing data...');
  
  try {
    // Check brands
    const brandsRef = collection(db, 'brands');
    const brandsSnapshot = await getDocs(brandsRef);
    console.log(`Found ${brandsSnapshot.size} existing brands`);
    
    // Check products
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);
    console.log(`Found ${productsSnapshot.size} existing products`);
    
    return {
      brandsCount: brandsSnapshot.size,
      productsCount: productsSnapshot.size
    };
  } catch (error) {
    console.error('Error checking existing data:', error);
    return { brandsCount: 0, productsCount: 0 };
  }
}

async function createBrands() {
  console.log('\n🏭 Creating brands...');
  const brandIds = {};
  
  for (const brand of sampleBrands) {
    try {
      const brandData = {
        ...brand,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'brands'), brandData);
      brandIds[brand.name] = docRef.id;
      console.log(`✅ Created brand: ${brand.name} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`❌ Error creating brand ${brand.name}:`, error);
    }
  }
  
  return brandIds;
}

async function createProducts(brandIds) {
  console.log('\n📦 Creating products...');
  
  for (const product of sampleProducts) {
    try {
      const brandId = brandIds[product.brandName];
      if (!brandId) {
        console.warn(`⚠️  No brand ID found for ${product.brandName}, skipping product ${product.name}`);
        continue;
      }
      
      const productData = {
        ...product,
        brandId: brandId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log(`✅ Created product: ${product.name} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`❌ Error creating product ${product.name}:`, error);
    }
  }
}

async function populateDatabase() {
  console.log('🚀 Starting database population...\n');
  
  try {
    // Check existing data
    const existingData = await checkExistingData();
    
    if (existingData.brandsCount > 0 || existingData.productsCount > 0) {
      console.log('⚠️  Database already contains data!');
      console.log(`   Brands: ${existingData.brandsCount}`);
      console.log(`   Products: ${existingData.productsCount}`);
      console.log('\n💡 To reset the database, delete existing data first.');
      return;
    }
    
    // Create brands
    const brandIds = await createBrands();
    
    // Create products
    await createProducts(brandIds);
    
    console.log('\n🎉 Database population completed successfully!');
    console.log(`✅ Created ${sampleBrands.length} brands`);
    console.log(`✅ Created ${sampleProducts.length} products`);
    console.log('\n📋 Summary:');
    console.log('   - V-Tech System: 2 products (clinic)');
    console.log('   - ExoSignal: 2 products (clinic/home)');
    console.log('   - EXOTECH: 2 products (home)');
    console.log('   - MitoDerm Professional: 2 products (professional)');
    
    console.log('\n🔗 Next Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Navigate to /admin/brands to manage brands and products');
    console.log('3. Test the dynamic mega menu by hovering over "Products"');
    console.log('4. Add more brands and products through the admin interface');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
  }
}

// Run the script
if (require.main === module) {
  populateDatabase()
    .then(() => {
      console.log('\n✨ Script completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { populateDatabase, sampleBrands, sampleProducts }; 