const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin with environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  storageBucket: 'mitoderm-co-il.appspot.com'
});

const db = admin.firestore();

// Updated product data with proper images
const products = [
  {
    slug: 'v-tech-system',
    name: 'V-Tech System',
    nameHebrew: 'מערכת V-Tech',
    title: 'Advanced Exosome Technology',
    subtitle: 'Revolutionary Synthetic Exosomes',
    shortDescription: 'Cutting-edge exosome technology for professional aesthetic treatments',
    description: 'The V-Tech System represents the pinnacle of synthetic exosome technology, designed specifically for medical aesthetic professionals. This advanced system combines proprietary exosome formulations with state-of-the-art delivery mechanisms to achieve unprecedented results in skin rejuvenation and tissue regeneration.',
    descriptionHebrew: 'מערכת V-Tech מייצגת את שיא הטכנולוגיה של אקסוזומים סינתטיים, שתוכננה במיוחד עבור אנשי מקצוע באסתטיקה רפואית. מערכת מתקדמת זו משלבת תכשירי אקסוזומים ייחודיים עם מנגנוני אספקה מתקדמים להשגת תוצאות חסרות תקדים בהצערת עור ובתחדשות רקמות.',
    price: 0,
    stock: 100,
    requiresCertification: true,
    certificationLevel: 'advanced',
    isActive: true,
    image: '/images/products/vtech-system-main.jpg',
    images: [
      { url: '/images/products/vtech-system-main.jpg', alt: 'V-Tech System Main Product' },
      { url: '/images/products/vtech-system-detail.jpg', alt: 'V-Tech System Detail View' },
      { url: '/images/products/vtech-system-application.jpg', alt: 'V-Tech System Application' }
    ],
    category: 'clinic',
    sku: 'VTS-001',
    weight: 50,
    dimensions: '10x5x3 cm',
    ingredients: 'Synthetic Exosomes, PDRN, Peptides, Hyaluronic Acid, Growth Factors',
    instructions: 'Apply to clean skin using sterile technique. Use with micro-needling or direct application.',
    benefits: 'Enhanced skin regeneration, improved texture, reduced fine lines, increased collagen production',
    contraindications: 'Active infections, open wounds, pregnancy, breastfeeding',
    expiryDate: '24 months',
    manufacturer: 'MitoDerm',
    tags: ['exosomes', 'clinic', 'professional', 'anti-aging', 'regeneration'],
    featured: true,
    bestSeller: true,
    newArrival: false,
    badge: 'Featured',
    technology: 'Synthetic Exosome Technology',
    application: 'Professional aesthetic treatments',
    target: 'Skin rejuvenation and tissue regeneration',
    features: [
      'Advanced exosome formulation',
      'Professional-grade delivery system',
      'Enhanced bioavailability',
      'Long-lasting results'
    ],
    specifications: {
      'Volume': '10ml',
      'Concentration': 'High potency',
      'Storage': 'Refrigerated',
      'Shelf Life': '24 months'
    }
  },
  {
    slug: 'exosignal-hair',
    name: 'ExoSignal Hair',
    nameHebrew: 'אקסוסיגנל שיער',
    title: 'Hair Regeneration Technology',
    subtitle: 'Advanced Hair Growth Solution',
    shortDescription: 'Revolutionary hair regeneration technology using exosome signaling',
    description: 'ExoSignal Hair utilizes cutting-edge exosome technology to stimulate hair follicle regeneration and promote natural hair growth. This innovative solution targets the root causes of hair loss while providing essential nutrients for healthy hair development.',
    descriptionHebrew: 'אקסוסיגנל שיער משתמש בטכנולוגיית אקסוזומים מתקדמת כדי לעורר תחדשות זקיקי שיער ולקדם צמיחת שיער טבעית. פתרון חדשני זה מתמקד בגורמי השורש של נשירת שיער תוך מתן חומרים מזינים חיוניים להתפתחות שיער בריא.',
    price: 0,
    stock: 75,
    requiresCertification: true,
    certificationLevel: 'basic',
    isActive: true,
    image: '/images/products/exosignal-hair-main.jpg',
    images: [
      { url: '/images/products/exosignal-hair-main.jpg', alt: 'ExoSignal Hair Main Product' },
      { url: '/images/products/exosignal-hair-detail.jpg', alt: 'ExoSignal Hair Detail View' },
      { url: '/images/products/exosignal-hair-application.jpg', alt: 'ExoSignal Hair Application' }
    ],
    category: 'clinic',
    sku: 'ESH-002',
    weight: 30,
    dimensions: '8x4x2 cm',
    ingredients: 'Exosome Signaling Molecules, PDRN, Biotin, Zinc, Vitamin D3',
    instructions: 'Apply to scalp using micro-needling technique. Treatment protocol includes 6-8 sessions.',
    benefits: 'Stimulates hair follicle regeneration, promotes natural hair growth, reduces hair loss, improves hair density',
    contraindications: 'Scalp infections, active psoriasis, pregnancy',
    expiryDate: '18 months',
    manufacturer: 'MitoDerm',
    tags: ['hair', 'regeneration', 'clinic', 'growth', 'follicle'],
    featured: true,
    bestSeller: true,
    newArrival: false,
    badge: 'Best Seller',
    technology: 'Exosome Signaling Technology',
    application: 'Hair loss treatment and regeneration',
    target: 'Hair follicle stimulation and growth',
    features: [
      'Exosome signaling molecules',
      'Follicle regeneration technology',
      'Natural growth stimulation',
      'Long-term results'
    ],
    specifications: {
      'Volume': '5ml',
      'Concentration': 'High potency',
      'Storage': 'Refrigerated',
      'Shelf Life': '18 months'
    }
  },
  {
    slug: 'exotech-gel',
    name: 'EXOTECH Gel',
    nameHebrew: 'אקסוטק ג\'ל',
    title: 'Advanced Gel Technology',
    subtitle: 'Professional Treatment Gel',
    shortDescription: 'High-performance gel formulation for professional aesthetic treatments',
    description: 'EXOTECH Gel combines advanced exosome technology with a unique gel formulation designed for optimal skin penetration and long-lasting effects. This professional-grade treatment gel provides superior results in skin rejuvenation and texture improvement.',
    descriptionHebrew: 'אקסוטק ג\'ל משלב טכנולוגיית אקסוזומים מתקדמת עם תכשיר ג\'ל ייחודי שתוכנן לחדירה אופטימלית לעור ותוצאות מתמשכות. ג\'ל טיפול ברמה מקצועית זה מספק תוצאות מעולות בהצערת עור ושיפור מרקם.',
    price: 0,
    stock: 120,
    requiresCertification: true,
    certificationLevel: 'basic',
    isActive: true,
    image: '/images/products/exotech-gel-main.jpg',
    images: [
      { url: '/images/products/exotech-gel-main.jpg', alt: 'EXOTECH Gel Main Product' },
      { url: '/images/products/exotech-gel-detail.jpg', alt: 'EXOTECH Gel Detail View' },
      { url: '/images/products/exotech-gel-application.jpg', alt: 'EXOTECH Gel Application' }
    ],
    category: 'clinic',
    sku: 'EXG-003',
    weight: 25,
    dimensions: '6x3x2 cm',
    ingredients: 'Exosome Technology, Hyaluronic Acid, Peptides, Vitamin C, EGF',
    instructions: 'Apply to clean skin. Can be used with micro-needling or as standalone treatment.',
    benefits: 'Deep skin penetration, enhanced absorption, long-lasting hydration, improved skin texture',
    contraindications: 'Active acne, open wounds, skin infections',
    expiryDate: '12 months',
    manufacturer: 'MitoDerm',
    tags: ['gel', 'clinic', 'hydration', 'texture', 'penetration'],
    featured: false,
    bestSeller: true,
    newArrival: false,
    badge: 'Popular',
    technology: 'Advanced Gel Technology',
    application: 'Professional skin treatments',
    target: 'Skin hydration and texture improvement',
    features: [
      'Advanced gel formulation',
      'Enhanced penetration',
      'Long-lasting hydration',
      'Professional results'
    ],
    specifications: {
      'Volume': '15ml',
      'Concentration': 'Medium-high',
      'Storage': 'Room temperature',
      'Shelf Life': '12 months'
    }
  },
  {
    slug: 'exosignal-spray',
    name: 'ExoSignal Spray',
    nameHebrew: 'אקסוסיגנל ספריי',
    title: 'Advanced Spray Technology',
    subtitle: 'Convenient Application System',
    shortDescription: 'Innovative spray delivery system for exosome technology',
    description: 'ExoSignal Spray offers a revolutionary approach to exosome delivery through an advanced spray system. This innovative technology ensures optimal coverage and absorption while providing a convenient application method for both professional and home use.',
    descriptionHebrew: 'אקסוסיגנל ספריי מציע גישה מהפכנית לאספקת אקסוזומים באמצעות מערכת ספריי מתקדמת. טכנולוגיה חדשנית זו מבטיחה כיסוי וספיגה אופטימליים תוך מתן שיטת יישום נוחה לשימוש מקצועי וביתי.',
    price: 0,
    stock: 90,
    requiresCertification: false,
    certificationLevel: 'none',
    isActive: true,
    image: '/images/products/exosignal-spray-main.jpg',
    images: [
      { url: '/images/products/exosignal-spray-main.jpg', alt: 'ExoSignal Spray Main Product' },
      { url: '/images/products/exosignal-spray-detail.jpg', alt: 'ExoSignal Spray Detail View' },
      { url: '/images/products/exosignal-spray-application.jpg', alt: 'ExoSignal Spray Application' }
    ],
    category: 'home',
    sku: 'ESS-004',
    weight: 40,
    dimensions: '12x4x4 cm',
    ingredients: 'Exosome Technology, Aloe Vera, Vitamin E, Hyaluronic Acid',
    instructions: 'Spray directly onto clean skin. Use 2-3 times daily for best results.',
    benefits: 'Convenient application, even coverage, quick absorption, suitable for daily use',
    contraindications: 'Sensitive skin, open wounds',
    expiryDate: '18 months',
    manufacturer: 'MitoDerm',
    tags: ['spray', 'home', 'convenient', 'daily', 'absorption'],
    featured: false,
    bestSeller: false,
    newArrival: true,
    badge: 'New',
    technology: 'Spray Delivery Technology',
    application: 'Daily skin care and maintenance',
    target: 'Convenient skin treatment',
    features: [
      'Advanced spray system',
      'Even coverage',
      'Quick absorption',
      'Daily use friendly'
    ],
    specifications: {
      'Volume': '30ml',
      'Concentration': 'Medium',
      'Storage': 'Room temperature',
      'Shelf Life': '18 months'
    }
  },
  {
    slug: 'pdrn-serum',
    name: 'PDRN Serum',
    nameHebrew: 'סרום PDRN',
    title: 'Advanced PDRN Technology',
    subtitle: 'Professional Regeneration Serum',
    shortDescription: 'High-concentration PDRN serum for advanced skin regeneration',
    description: 'PDRN Serum utilizes the latest in Polydeoxyribonucleotide technology to stimulate cellular regeneration and tissue repair. This advanced formulation provides exceptional results in skin rejuvenation and wound healing.',
    descriptionHebrew: 'סרום PDRN משתמש בטכנולוגיית Polydeoxyribonucleotide המתקדמת ביותר כדי לעורר תחדשות תאית ותיקון רקמות. תכשיר מתקדם זה מספק תוצאות יוצאות דופן בהצערת עור וריפוי פצעים.',
    price: 0,
    stock: 60,
    requiresCertification: true,
    certificationLevel: 'advanced',
    isActive: true,
    image: '/images/products/pdrn-serum-main.jpg',
    images: [
      { url: '/images/products/pdrn-serum-main.jpg', alt: 'PDRN Serum Main Product' },
      { url: '/images/products/pdrn-serum-detail.jpg', alt: 'PDRN Serum Detail View' },
      { url: '/images/products/pdrn-serum-application.jpg', alt: 'PDRN Serum Application' }
    ],
    category: 'clinic',
    sku: 'PDRN-005',
    weight: 20,
    dimensions: '5x3x2 cm',
    ingredients: 'PDRN, Hyaluronic Acid, Peptides, Growth Factors, Vitamin C',
    instructions: 'Apply to clean skin using sterile technique. Best results with micro-needling.',
    benefits: 'Enhanced cellular regeneration, improved wound healing, increased collagen production, skin rejuvenation',
    contraindications: 'Active infections, open wounds, pregnancy',
    expiryDate: '12 months',
    manufacturer: 'MitoDerm',
    tags: ['pdrn', 'clinic', 'regeneration', 'healing', 'professional'],
    featured: true,
    bestSeller: false,
    newArrival: false,
    badge: 'Advanced',
    technology: 'PDRN Technology',
    application: 'Professional skin regeneration',
    target: 'Cellular regeneration and tissue repair',
    features: [
      'High-concentration PDRN',
      'Cellular regeneration',
      'Tissue repair',
      'Professional results'
    ],
    specifications: {
      'Volume': '10ml',
      'Concentration': 'High potency',
      'Storage': 'Refrigerated',
      'Shelf Life': '12 months'
    }
  },
  {
    slug: 'stem-cell-activator',
    name: 'Stem Cell Activator',
    nameHebrew: 'מפעיל תאי גזע',
    title: 'Stem Cell Technology',
    subtitle: 'Advanced Cellular Activation',
    shortDescription: 'Revolutionary stem cell activation technology for skin regeneration',
    description: 'Stem Cell Activator represents the cutting edge of cellular regeneration technology. This advanced formulation activates dormant stem cells to promote natural skin regeneration and tissue renewal.',
    descriptionHebrew: 'מפעיל תאי גזע מייצג את החזית של טכנולוגיית תחדשות תאית. תכשיר מתקדם זה מפעיל תאי גזע רדומים כדי לקדם תחדשות עור טבעית וחידוש רקמות.',
    price: 0,
    stock: 45,
    requiresCertification: true,
    certificationLevel: 'expert',
    isActive: true,
    image: '/images/products/stem-cell-activator-main.jpg',
    images: [
      { url: '/images/products/stem-cell-activator-main.jpg', alt: 'Stem Cell Activator Main Product' },
      { url: '/images/products/stem-cell-activator-detail.jpg', alt: 'Stem Cell Activator Detail View' },
      { url: '/images/products/stem-cell-activator-application.jpg', alt: 'Stem Cell Activator Application' }
    ],
    category: 'clinic',
    sku: 'SCA-006',
    weight: 15,
    dimensions: '4x3x2 cm',
    ingredients: 'Stem Cell Activators, Growth Factors, Peptides, Hyaluronic Acid, Vitamin E',
    instructions: 'Apply using advanced techniques. Requires professional training and certification.',
    benefits: 'Stem cell activation, enhanced regeneration, tissue renewal, long-lasting results',
    contraindications: 'Active cancer, pregnancy, severe skin conditions',
    expiryDate: '6 months',
    manufacturer: 'MitoDerm',
    tags: ['stem-cells', 'clinic', 'expert', 'activation', 'regeneration'],
    featured: false,
    bestSeller: false,
    newArrival: true,
    badge: 'Expert',
    technology: 'Stem Cell Activation Technology',
    application: 'Expert-level skin regeneration',
    target: 'Stem cell activation and tissue renewal',
    features: [
      'Stem cell activation',
      'Advanced regeneration',
      'Tissue renewal',
      'Expert-level results'
    ],
    specifications: {
      'Volume': '5ml',
      'Concentration': 'Ultra-high potency',
      'Storage': 'Refrigerated',
      'Shelf Life': '6 months'
    }
  }
];

async function updateProductsInDatabase() {
  console.log('Updating products in database...');
  
  const productsRef = db.collection('products');
  
  for (const product of products) {
    try {
      // Check if product exists
      const snapshot = await productsRef.where('slug', '==', product.slug).get();
      
      if (!snapshot.empty) {
        // Update existing product
        const doc = snapshot.docs[0];
        await doc.ref.update({
          ...product,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Updated product: ${product.name}`);
      } else {
        // Create new product
        await productsRef.add({
          ...product,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Created product: ${product.name}`);
      }
    } catch (error) {
      console.error(`Error updating product ${product.name}:`, error);
    }
  }
  
  console.log('All products updated successfully!');
}

async function main() {
  try {
    console.log('Starting product database update...');
    await updateProductsInDatabase();
    console.log('Database update completed successfully!');
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    process.exit(0);
  }
}

main(); 