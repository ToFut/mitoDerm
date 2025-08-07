const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

async function fixProductImages() {
  const productsRef = db.collection('products');
  const snapshot = await productsRef.get();
  for (const doc of snapshot.docs) {
    const product = doc.data();
    const slug = product.slug;
    if (!slug) continue;
    // Try to find a main image for this product with any extension
    let found = false;
    for (const ext of EXTENSIONS) {
      const mainImage = `${slug}-main${ext}`;
      const mainImagePath = path.join(IMAGES_DIR, mainImage);
      if (fs.existsSync(mainImagePath)) {
        const url = `/images/products/${mainImage}`;
        const update = {
          image: url,
          images: [{ url, alt: product.name || slug }],
        };
        await doc.ref.update(update);
        console.log(`Updated product ${slug} with image ${url}`);
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`No local image found for product ${slug}`);
    }
  }
  console.log('Done updating product images.');
}

fixProductImages().catch(console.error); 