const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

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
const storage = getStorage(app);

// Education media data
const educationVideos = [
  {
    name: 'Introduction to Exosomes Technology',
    description: 'Learn about the revolutionary exosomes technology used in MitoDerm products.',
    tags: ['exosomes', 'technology', 'introduction'],
    category: 'education',
    type: 'video/mp4',
    localPath: 'public/videos/education/intro-exosomes.mp4',
    size: 10240000,
    duration: 180 // 3 minutes
  },
  {
    name: 'PDRN Technology Explained',
    description: 'Deep dive into PDRN (Polynucleotides) technology and its benefits.',
    tags: ['pdrn', 'polynucleotides', 'technology'],
    category: 'education',
    type: 'video/mp4',
    localPath: 'public/videos/education/pdrn-technology.mp4',
    size: 15360000,
    duration: 240 // 4 minutes
  },
  {
    name: 'Peptides in Skincare',
    description: 'Understanding biomimetic peptides and their role in skin regeneration.',
    tags: ['peptides', 'biomimetic', 'skincare'],
    category: 'education',
    type: 'video/mp4',
    localPath: 'public/videos/education/peptides-skincare.mp4',
    size: 12800000,
    duration: 210 // 3.5 minutes
  },
  {
    name: 'Clinical Results and Studies',
    description: 'Review of clinical studies and real-world results with MitoDerm products.',
    tags: ['clinical', 'studies', 'results'],
    category: 'education',
    type: 'video/mp4',
    localPath: 'public/videos/education/clinical-results.mp4',
    size: 20480000,
    duration: 300 // 5 minutes
  },
  {
    name: 'Application Techniques',
    description: 'Professional application techniques for optimal results.',
    tags: ['application', 'techniques', 'professional'],
    category: 'education',
    type: 'video/mp4',
    localPath: 'public/videos/education/application-techniques.mp4',
    size: 17920000,
    duration: 270 // 4.5 minutes
  }
];

const educationDocuments = [
  {
    name: 'Exosomes Technology Whitepaper',
    description: 'Comprehensive scientific whitepaper on exosomes technology.',
    tags: ['exosomes', 'whitepaper', 'scientific'],
    category: 'education',
    type: 'application/pdf',
    localPath: 'public/documents/education/exosomes-whitepaper.pdf',
    size: 2048000
  },
  {
    name: 'Clinical Study Report 2023',
    description: 'Detailed clinical study report with 62 participants.',
    tags: ['clinical', 'study', 'report'],
    category: 'education',
    type: 'application/pdf',
    localPath: 'public/documents/education/clinical-study-2023.pdf',
    size: 3072000
  },
  {
    name: 'Product Application Guide',
    description: 'Step-by-step guide for professional product application.',
    tags: ['application', 'guide', 'professional'],
    category: 'education',
    type: 'application/pdf',
    localPath: 'public/documents/education/application-guide.pdf',
    size: 1536000
  }
];

async function uploadEducationMedia() {
  console.log('🚀 Starting education media upload...');
  
  try {
    // Upload videos
    console.log('\n📹 Uploading education videos...');
    for (const video of educationVideos) {
      try {
        // Check if file exists
        if (!fs.existsSync(video.localPath)) {
          console.log(`⚠️  File not found: ${video.localPath} - skipping...`);
          continue;
        }

        // Read file
        const fileBuffer = fs.readFileSync(video.localPath);
        const fileName = path.basename(video.localPath);
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, `education/videos/${fileName}`);
        await uploadBytes(storageRef, fileBuffer);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Add to Firestore
        const mediaData = {
          name: video.name,
          type: video.type,
          category: video.category,
          url: downloadURL,
          size: video.size,
          description: video.description,
          tags: video.tags,
          metadata: {
            duration: video.duration,
            width: 1920,
            height: 1080
          },
          uploadedAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'media'), mediaData);
        console.log(`✅ Uploaded: ${video.name}`);
        
      } catch (error) {
        console.error(`❌ Error uploading ${video.name}:`, error.message);
      }
    }
    
    // Upload documents
    console.log('\n📄 Uploading education documents...');
    for (const doc of educationDocuments) {
      try {
        // Check if file exists
        if (!fs.existsSync(doc.localPath)) {
          console.log(`⚠️  File not found: ${doc.localPath} - skipping...`);
          continue;
        }

        // Read file
        const fileBuffer = fs.readFileSync(doc.localPath);
        const fileName = path.basename(doc.localPath);
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, `education/documents/${fileName}`);
        await uploadBytes(storageRef, fileBuffer);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Add to Firestore
        const mediaData = {
          name: doc.name,
          type: doc.type,
          category: doc.category,
          url: downloadURL,
          size: doc.size,
          description: doc.description,
          tags: doc.tags,
          metadata: {},
          uploadedAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'media'), mediaData);
        console.log(`✅ Uploaded: ${doc.name}`);
        
      } catch (error) {
        console.error(`❌ Error uploading ${doc.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Education media upload completed!');
    
  } catch (error) {
    console.error('❌ Error during upload:', error);
  }
}

// Run the upload
uploadEducationMedia(); 