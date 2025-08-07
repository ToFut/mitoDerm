#!/usr/bin/env node

/**
 * Upload Original MitoDerm Products Script
 * Uploads all original products with images, videos, and descriptions to Firebase
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} = require('firebase/firestore');
const { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} = require('firebase/storage');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe2cVjFFrP_Xq0CotGOWfYjkptlU0BzA8",
  authDomain: "mitoderm-332c1.firebaseapp.com",
  projectId: "mitoderm-332c1",
  storageBucket: "mitoderm-332c1.firebasestorage.app",
  messagingSenderId: "699230498967",
  appId: "1:699230498967:web:8c8c8c8c8c8c8c8c8c8c8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Original MitoDerm Products Data
const originalProducts = [
  {
    // V-Tech System Products
    slug: 'v-tech-system-serum',
    title: 'V-Tech System Serum',
    shortDescription: 'High-concentration exosome serum for clinical use',
    description: 'V-Tech System Serum contains 20 billion synthetic exosomes in a powerful formula that includes high molecular weight PDRN polynucleotides (2% - 20 mg/ml), advanced biomimetic peptides (20 mg), and plant stem cells for cell renewal.',
    subtitle: 'Professional Exosome Serum',
    badge: 'Featured',
    category: 'clinic',
    application: 'Medical Aesthetics',
    technology: 'Exosomes',
    target: 'Anti-aging, Skin Regeneration',
    professionalGrade: 'Medical Grade',
    keywords: ['exosomes', 'anti-aging', 'professional', 'medical', 'serum'],
    features: [
      '20 billion synthetic exosomes per ampoule',
      'High molecular weight PDRN polynucleotides',
      'Advanced biomimetic peptides',
      'Plant stem cells for cell renewal',
      'Professional medical grade formulation'
    ],
    specifications: {
      'Size': '5ml per ampoule',
      'Concentration': '20 billion exosomes/mL',
      'Technology': 'Synthetic Exosomes + PDRN',
      'Application': 'Medical aesthetics, skin regeneration',
      'Professional Grade': 'Certified for medical use'
    },
    ingredients: [
      'Synthetic Exosomes',
      'PDRN Polynucleotides',
      'Biomimetic Peptides',
      'Plant Stem Cells',
      'Hyaluronic Acid'
    ],
    benefits: [
      {
        title: 'Advanced Cell Communication',
        description: 'Synthetic exosomes enhance cellular communication for superior skin regeneration'
      },
      {
        title: 'Professional Results',
        description: 'Medical-grade formulation delivers clinical-level results'
      },
      {
        title: 'Anti-Aging Technology',
        description: 'Advanced peptides and PDRN technology for comprehensive anti-aging effects'
      }
    ],
    aiContent: 'V-Tech System Serum represents the pinnacle of synthetic exosome technology, delivering 20 billion exosomes per treatment for unparalleled skin regeneration and medical aesthetic results. This professional-grade serum combines cutting-edge exosome technology with advanced biomimetic peptides and PDRN polynucleotides to provide superior cellular communication and skin renewal.',
    images: [
      {
        url: '/images/products/v-tech-serum.jpg',
        alt: 'V-Tech System Serum'
      }
    ],
    price: 299.99,
    stock: 50,
    featured: true,
    isActive: true
  },
  {
    slug: 'v-tech-system-mask',
    title: 'V-Tech System Gel Mask',
    shortDescription: 'Intensive treatment mask with exosome technology',
    description: 'V-Tech System Gel Mask contains low molecular weight polynucleotides (1%), acetyl heptapeptide-9 with gold carrier, copper tripeptide-1, purified polysaccharides from snail mucin, and low molecular weight hyaluronic acid with aloe vera.',
    subtitle: 'Professional Treatment Mask',
    badge: 'Professional',
    category: 'clinic',
    application: 'Intensive Treatment',
    technology: 'Exosomes',
    target: 'Deep Hydration, Skin Repair',
    professionalGrade: 'Medical Grade',
    keywords: ['mask', 'treatment', 'hydration', 'repair', 'professional'],
    features: [
      'Low molecular weight polynucleotides',
      'Acetyl heptapeptide-9 with gold carrier',
      'Copper tripeptide-1',
      'Purified polysaccharides from snail mucin',
      'Low molecular weight hyaluronic acid'
    ],
    specifications: {
      'Size': '5ml per treatment',
      'Application': 'Weekly intensive treatment',
      'Duration': '20 minutes per session',
      'Technology': 'Exosome + Peptide Complex',
      'Professional Grade': 'Medical aesthetic treatment'
    },
    ingredients: [
      'Low Molecular Weight Polynucleotides',
      'Acetyl Heptapeptide-9',
      'Copper Tripeptide-1',
      'Snail Mucin Polysaccharides',
      'Low Molecular Weight Hyaluronic Acid',
      'Aloe Vera'
    ],
    benefits: [
      {
        title: 'Deep Hydration',
        description: 'Advanced hydration technology for intensive skin moisturizing'
      },
      {
        title: 'Skin Repair',
        description: 'Comprehensive skin repair and regeneration capabilities'
      },
      {
        title: 'Anti-Inflammatory',
        description: 'Reduces inflammation and promotes healing'
      }
    ],
    aiContent: 'The V-Tech System Gel Mask provides intensive treatment with advanced exosome technology. This professional-grade mask combines low molecular weight polynucleotides with gold-enhanced peptides and snail mucin polysaccharides for deep hydration, skin repair, and anti-inflammatory effects.',
    images: [
      {
        url: '/images/products/v-tech-mask.jpg',
        alt: 'V-Tech System Gel Mask'
      }
    ],
    price: 89.99,
    stock: 75,
    featured: false,
    isActive: true
  },
  {
    slug: 'exosignal-hair-serum',
    title: 'ExoSignal Hair Serum',
    shortDescription: 'Advanced hair growth serum with PDRN technology',
    description: 'ExoSignal Hair Serum utilizes advanced PDRN technology specifically formulated for hair loss treatment, promoting hair follicle regeneration and stimulating new hair growth. Contains 20 billion exosomes, PDRN, and biomimetic peptides.',
    subtitle: 'Hair Loss Treatment',
    badge: 'Featured',
    category: 'clinic',
    application: 'Hair Loss Treatment',
    technology: 'PDRN',
    target: 'Hair Growth, Scalp Health',
    professionalGrade: 'Medical Grade',
    keywords: ['hair loss', 'hair growth', 'PDRN', 'scalp', 'treatment'],
    features: [
      '20 billion synthetic exosomes',
      'PDRN + high molecular weight hyaluronic acid',
      '8 biomimetic peptides',
      'Plant stem cells + vitamins',
      'Professional hair loss treatment'
    ],
    specifications: {
      'Size': '5ml per ampoule',
      'Application': 'Hair loss treatment and regeneration',
      'Technology': 'PDRN + Exosome-based hair follicle stimulation',
      'Target': 'Hair follicles and scalp tissue',
      'Professional Grade': 'Medical aesthetic treatment'
    },
    ingredients: [
      'PDRN',
      'Synthetic Exosomes',
      'Biotin',
      'Niacinamide',
      'Biomimetic Peptides',
      'Plant Stem Cells',
      'Vitamins'
    ],
    benefits: [
      {
        title: 'Hair Growth Stimulation',
        description: 'Extends anagen phase and shortens telogen phase for active hair growth'
      },
      {
        title: 'Scalp Health',
        description: 'Reduces chronic scalp inflammation and improves circulation'
      },
      {
        title: 'Hair Strength',
        description: 'Strengthens existing hair and improves hair quality'
      }
    ],
    aiContent: 'ExoSignal Hair Serum is a revolutionary hair loss treatment that combines PDRN technology with synthetic exosomes for superior hair follicle regeneration. This advanced formulation extends the growth phase while shortening the resting phase, effectively reducing hair loss and promoting new hair growth.',
    images: [
      {
        url: '/images/products/exosignal-hair-serum.jpg',
        alt: 'ExoSignal Hair Serum'
      }
    ],
    price: 199.99,
    stock: 30,
    featured: true,
    isActive: true
  },
  {
    slug: 'exosignal-hair-spray',
    title: 'ExoSignal Hair Spray',
    shortDescription: 'Daily hair care spray with exosome technology',
    description: 'ExoSignal Hair Spray is a concentrated spray with PDRN and biomimetic peptides. Balances scalp condition, excellent for oily scalp with excess sebum, reduces irritation and redness, supports hair follicle health.',
    subtitle: 'Daily Hair Care',
    badge: 'Daily Care',
    category: 'home',
    application: 'Daily Hair Care',
    technology: 'Exosomes',
    target: 'Hair Protection, Scalp Balance',
    professionalGrade: 'Consumer Grade',
    keywords: ['hair spray', 'daily care', 'scalp balance', 'hair protection'],
    features: [
      'Concentrated PDRN spray',
      'Biomimetic peptides',
      'Scalp balance technology',
      'Reduces sebum excess',
      'Daily hair protection'
    ],
    specifications: {
      'Size': '150ml',
      'Formulation': 'Exosome-enhanced hair spray',
      'Application': 'Daily hair care and maintenance',
      'Technology': 'Exosome delivery system',
      'Target': 'Hair health and scalp maintenance'
    },
    ingredients: [
      'Exosomes',
      'PDRN',
      'Argan Oil',
      'Vitamin B5',
      'Biomimetic Peptides'
    ],
    benefits: [
      {
        title: 'Hair Protection',
        description: 'Protects hair from daily damage and environmental factors'
      },
      {
        title: 'Moisture Retention',
        description: 'Maintains optimal hair moisture levels'
      },
      {
        title: 'Shine Enhancement',
        description: 'Improves hair shine and overall appearance'
      }
    ],
    aiContent: 'ExoSignal Hair Spray provides daily hair care with advanced exosome technology. This revolutionary spray balances scalp condition, reduces excess sebum, and supports healthy hair follicles for continuous hair health maintenance.',
    images: [
      {
        url: '/images/products/exosignal-spray.jpg',
        alt: 'ExoSignal Hair Spray'
      }
    ],
    price: 49.99,
    stock: 75,
    featured: false,
    isActive: true
  },
  {
    slug: 'exotech-gel',
    title: 'EXOTECH Gel',
    shortDescription: 'Advanced facial gel with exosome technology',
    description: 'EXOTECH Gel is an advanced facial cream that combines cutting-edge exosome technology with premium skincare ingredients for superior skin regeneration and anti-aging results.',
    subtitle: 'Advanced Facial Gel',
    badge: 'Home Care',
    category: 'home',
    application: 'Daily Facial Care',
    technology: 'Exosomes',
    target: 'Anti-aging, Skin Regeneration',
    professionalGrade: 'Consumer Grade',
    keywords: ['facial gel', 'anti-aging', 'skin regeneration', 'home care'],
    features: [
      'Advanced exosome technology',
      'Premium facial gel formulation',
      'Anti-aging and skin regeneration',
      'Professional-grade home care',
      'Enhanced skin texture and tone'
    ],
    specifications: {
      'Size': '50ml',
      'Formulation': 'Advanced facial gel with exosomes',
      'Application': 'Daily facial care and anti-aging',
      'Technology': 'Exosome-enhanced delivery system',
      'Target': 'Skin regeneration and anti-aging'
    },
    ingredients: [
      'Exosomes',
      'Hyaluronic Acid',
      'Aloe Vera',
      'PDRN',
      'Biomimetic Peptides'
    ],
    benefits: [
      {
        title: 'Hydration',
        description: 'Advanced hydration technology for optimal skin moisture'
      },
      {
        title: 'Anti-aging',
        description: 'Comprehensive anti-aging effects with exosome technology'
      },
      {
        title: 'Skin Smoothing',
        description: 'Improves skin texture and overall appearance'
      }
    ],
    aiContent: 'EXOTECH Gel represents advanced home care with exosome technology. This premium facial gel combines cutting-edge exosome delivery with traditional skincare ingredients for superior anti-aging and skin regeneration results.',
    images: [
      {
        url: '/images/products/exotech-gel.jpg',
        alt: 'EXOTECH Gel'
      }
    ],
    price: 79.99,
    stock: 100,
    featured: false,
    isActive: true
  },
  {
    slug: 'exotech-cream',
    title: 'EXOTECH Cream',
    shortDescription: 'Rich moisturizing cream for daily use',
    description: 'EXOTECH Cream is a rich moisturizing cream that combines exosome technology with premium ingredients for deep moisturizing, skin barrier repair, and anti-aging benefits.',
    subtitle: 'Rich Moisturizing Cream',
    badge: 'Home Care',
    category: 'home',
    application: 'Daily Moisturizing',
    technology: 'Exosomes',
    target: 'Deep Moisturizing, Skin Barrier',
    professionalGrade: 'Consumer Grade',
    keywords: ['moisturizing cream', 'skin barrier', 'anti-aging', 'home care'],
    features: [
      'Rich moisturizing formulation',
      'Exosome technology',
      'Skin barrier repair',
      'Anti-aging benefits',
      'Daily use formula'
    ],
    specifications: {
      'Size': '100ml',
      'Formulation': 'Rich moisturizing cream with exosomes',
      'Application': 'Daily moisturizing after cleansing',
      'Technology': 'Exosome delivery system',
      'Target': 'Deep moisturizing and skin barrier repair'
    },
    ingredients: [
      'Exosomes',
      'Shea Butter',
      'Vitamin E',
      'Hyaluronic Acid',
      'Natural Oils'
    ],
    benefits: [
      {
        title: 'Deep Moisturizing',
        description: 'Provides intensive hydration for all skin types'
      },
      {
        title: 'Skin Barrier Repair',
        description: 'Strengthens and repairs the skin barrier'
      },
      {
        title: 'Anti-aging',
        description: 'Comprehensive anti-aging benefits with exosome technology'
      }
    ],
    aiContent: 'EXOTECH Cream provides rich moisturizing with advanced exosome technology. This premium cream combines traditional moisturizing ingredients with cutting-edge exosome delivery for superior skin barrier repair and anti-aging effects.',
    images: [
      {
        url: '/images/products/exotech-cream.jpg',
        alt: 'EXOTECH Cream'
      }
    ],
    price: 69.99,
    stock: 120,
    featured: false,
    isActive: true
  },
  {
    slug: 'pdrn-serum',
    title: 'PDRN Serum',
    shortDescription: 'PDRN serum for skin cell renewal',
    description: 'PDRN Serum contains polynucleotide technology for optimal skin cell renewal and regeneration. Advanced formulation for professional skin treatment.',
    subtitle: 'Cell Renewal Serum',
    badge: 'Professional',
    category: 'clinic',
    application: 'Skin Cell Renewal',
    technology: 'PDRN',
    target: 'Cell Renewal, Skin Regeneration',
    professionalGrade: 'Medical Grade',
    keywords: ['PDRN', 'cell renewal', 'skin regeneration', 'professional'],
    features: [
      'Polynucleotide technology',
      'Advanced cell renewal',
      'Professional skin treatment',
      'Enhanced skin regeneration',
      'Medical grade formulation'
    ],
    specifications: {
      'Size': '30ml',
      'Technology': 'PDRN Polynucleotides',
      'Application': 'Skin cell renewal and regeneration',
      'Professional Grade': 'Medical aesthetic treatment',
      'Target': 'Cell renewal and skin regeneration'
    },
    ingredients: [
      'PDRN Polynucleotides',
      'Hyaluronic Acid',
      'Peptides',
      'Vitamins',
      'Antioxidants'
    ],
    benefits: [
      {
        title: 'Cell Renewal',
        description: 'Advanced cell renewal technology for skin regeneration'
      },
      {
        title: 'Skin Regeneration',
        description: 'Comprehensive skin regeneration and repair'
      },
      {
        title: 'Professional Results',
        description: 'Medical-grade results for professional treatments'
      }
    ],
    aiContent: 'PDRN Serum utilizes advanced polynucleotide technology for superior skin cell renewal and regeneration. This professional-grade serum delivers medical-grade results for comprehensive skin treatment and repair.',
    images: [
      {
        url: '/images/products/pdrn-serum.jpg',
        alt: 'PDRN Serum'
      }
    ],
    price: 149.99,
    stock: 25,
    featured: true,
    isActive: true
  },
  {
    slug: 'peptide-complex',
    title: 'Peptide Complex',
    shortDescription: 'Biomimetic peptide complex for advanced skin treatment',
    description: 'Peptide Complex contains advanced biomimetic peptides that mimic natural growth factors for comprehensive skin treatment and anti-aging effects.',
    subtitle: 'Biomimetic Peptide Complex',
    badge: 'Advanced',
    category: 'clinic',
    application: 'Advanced Skin Treatment',
    technology: 'Peptides',
    target: 'Anti-aging, Skin Treatment',
    professionalGrade: 'Medical Grade',
    keywords: ['peptides', 'biomimetic', 'anti-aging', 'skin treatment'],
    features: [
      'Biomimetic peptide technology',
      'Advanced skin treatment',
      'Anti-aging effects',
      'Professional formulation',
      'Enhanced skin results'
    ],
    specifications: {
      'Size': '50ml',
      'Technology': 'Biomimetic Peptides',
      'Application': 'Advanced skin treatment and anti-aging',
      'Professional Grade': 'Medical aesthetic treatment',
      'Target': 'Anti-aging and comprehensive skin treatment'
    },
    ingredients: [
      'Biomimetic Peptides',
      'Growth Factors',
      'Hyaluronic Acid',
      'Antioxidants',
      'Vitamins'
    ],
    benefits: [
      {
        title: 'Advanced Treatment',
        description: 'Comprehensive skin treatment with biomimetic technology'
      },
      {
        title: 'Anti-aging',
        description: 'Advanced anti-aging effects with peptide technology'
      },
      {
        title: 'Skin Enhancement',
        description: 'Enhances overall skin quality and appearance'
      }
    ],
    aiContent: 'Peptide Complex represents advanced biomimetic technology for comprehensive skin treatment. This professional-grade complex mimics natural growth factors for superior anti-aging and skin enhancement results.',
    images: [
      {
        url: '/images/products/peptide-complex.jpg',
        alt: 'Peptide Complex'
      }
    ],
    price: 129.99,
    stock: 40,
    featured: false,
    isActive: true
  },
  {
    slug: 'stem-cell-activator',
    title: 'Stem Cell Activator',
    shortDescription: 'Natural stem cell activation for skin regeneration',
    description: 'Stem Cell Activator utilizes natural stem cell activation technology for comprehensive skin regeneration and anti-aging effects.',
    subtitle: 'Natural Stem Cell Activation',
    badge: 'Premium',
    category: 'clinic',
    application: 'Stem Cell Activation',
    technology: 'Stem Cells',
    target: 'Skin Regeneration, Anti-aging',
    professionalGrade: 'Medical Grade',
    keywords: ['stem cells', 'skin regeneration', 'anti-aging', 'premium'],
    features: [
      'Natural stem cell activation',
      'Comprehensive skin regeneration',
      'Advanced anti-aging technology',
      'Premium formulation',
      'Professional results'
    ],
    specifications: {
      'Size': '30ml',
      'Technology': 'Natural Stem Cell Activation',
      'Application': 'Stem cell activation and skin regeneration',
      'Professional Grade': 'Medical aesthetic treatment',
      'Target': 'Skin regeneration and anti-aging'
    },
    ingredients: [
      'Plant Stem Cells',
      'Growth Factors',
      'Antioxidants',
      'Vitamins',
      'Natural Extracts'
    ],
    benefits: [
      {
        title: 'Stem Cell Activation',
        description: 'Activates natural stem cells for skin regeneration'
      },
      {
        title: 'Skin Regeneration',
        description: 'Comprehensive skin regeneration and renewal'
      },
      {
        title: 'Anti-aging',
        description: 'Advanced anti-aging with stem cell technology'
      }
    ],
    aiContent: 'Stem Cell Activator utilizes natural stem cell activation technology for superior skin regeneration and anti-aging effects. This premium formulation delivers professional results through advanced stem cell technology.',
    images: [
      {
        url: '/images/products/stem-cell-activator.jpg',
        alt: 'Stem Cell Activator'
      }
    ],
    price: 249.99,
    stock: 20,
    featured: true,
    isActive: true
  }
];

// Sample image URLs (you can replace these with actual image uploads)
const sampleImages = {
  'v-tech-serum': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
  'v-tech-mask': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
  'exosignal-hair-serum': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
  'exosignal-spray': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
  'exotech-gel': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
  'exotech-cream': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
  'pdrn-serum': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
  'peptide-complex': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop',
  'stem-cell-activator': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
};

async function uploadProductToFirebase(productData) {
  try {
    console.log(`📦 Uploading product: ${productData.title}`);
    
    // Add timestamps
    const productWithTimestamps = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Upload to Firestore
    const docRef = await addDoc(collection(db, 'products'), productWithTimestamps);
    
    console.log(`✅ Product uploaded successfully: ${productData.title} (ID: ${docRef.id})`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Error uploading product ${productData.title}:`, error);
    throw error;
  }
}

async function uploadImageToStorage(imageUrl, productSlug, imageName) {
  try {
    // For demo purposes, we'll use placeholder images
    // In production, you would upload actual image files
    console.log(`🖼️  Using placeholder image for ${productSlug}: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error(`❌ Error uploading image for ${productSlug}:`, error);
    return null;
  }
}

async function uploadAllProducts() {
  console.log('🚀 Starting upload of original MitoDerm products...\n');
  
  const results = [];
  
  for (const product of originalProducts) {
    try {
      // Update image URLs with sample images
      const imageKey = product.slug.split('-')[0];
      const sampleImageUrl = sampleImages[imageKey] || sampleImages['v-tech-serum'];
      
      const productWithImages = {
        ...product,
        images: [
          {
            url: sampleImageUrl,
            alt: product.title
          }
        ]
      };
      
      const productId = await uploadProductToFirebase(productWithImages);
      results.push({
        title: product.title,
        id: productId,
        status: 'success'
      });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to upload ${product.title}:`, error);
      results.push({
        title: product.title,
        status: 'failed',
        error: error.message
      });
    }
  }
  
  return results;
}

async function main() {
  try {
    console.log('🎯 MitoDerm Original Products Upload Script');
    console.log('==========================================\n');
    
    const results = await uploadAllProducts();
    
    console.log('\n📊 Upload Results:');
    console.log('==================');
    
    const successful = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');
    
    console.log(`✅ Successfully uploaded: ${successful.length} products`);
    console.log(`❌ Failed to upload: ${failed.length} products`);
    
    if (successful.length > 0) {
      console.log('\n✅ Successfully uploaded products:');
      successful.forEach(product => {
        console.log(`   - ${product.title} (ID: ${product.id})`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n❌ Failed uploads:');
      failed.forEach(product => {
        console.log(`   - ${product.title}: ${product.error}`);
      });
    }
    
    console.log('\n🎉 Upload process completed!');
    console.log('📱 Check your admin dashboard to see the uploaded products.');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { uploadAllProducts, originalProducts }; 