const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq",
  authDomain: "mitoderm-ai.firebaseapp.com",
  projectId: "mitoderm-ai",
  storageBucket: "mitoderm-ai.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Sample media data
const sampleMedia = [
  {
    name: "V-Tech System Introduction",
    type: "video/mp4",
    category: "education",
    description: "Complete introduction to the V-Tech System and its benefits",
    tags: ["education", "v-tech", "introduction", "product"],
    size: 15728640, // 15MB
    url: "https://sample-videos.com/zip/10/mp4/720/Big_Buck_Bunny_720p_1mb.mp4"
  },
  {
    name: "Exosome Treatment Guide",
    type: "video/mp4", 
    category: "clinical",
    description: "Step-by-step guide for exosome treatments and protocols",
    tags: ["clinical", "exosome", "treatment", "protocol"],
    size: 20971520, // 20MB
    url: "https://sample-videos.com/zip/10/mp4/720/Big_Buck_Bunny_720p_2mb.mp4"
  },
  {
    name: "PDRN Technology Overview",
    type: "video/mp4",
    category: "technology", 
    description: "Deep dive into PDRN technology and its applications",
    tags: ["technology", "pdrn", "overview", "science"],
    size: 26214400, // 25MB
    url: "https://sample-videos.com/zip/10/mp4/720/Big_Buck_Bunny_720p_3mb.mp4"
  },
  {
    name: "Business Development Strategies",
    type: "application/pdf",
    category: "business",
    description: "Comprehensive guide to growing your cosmetic business",
    tags: ["business", "development", "strategy", "growth"],
    size: 5242880, // 5MB
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    name: "Product Training Manual",
    type: "application/pdf",
    category: "products",
    description: "Complete product training and usage manual",
    tags: ["products", "training", "manual", "guide"],
    size: 8388608, // 8MB
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

async function uploadSampleMedia() {
  try {
    console.log('Starting to upload sample media...');
    
    for (const media of sampleMedia) {
      console.log(`Uploading: ${media.name}`);
      
      // Create media item in Firestore
      const mediaData = {
        name: media.name,
        type: media.type,
        category: media.category,
        url: media.url,
        size: media.size,
        uploadedAt: serverTimestamp(),
        description: media.description,
        alt: media.name,
        tags: media.tags,
        metadata: {
          duration: media.type.startsWith('video/') ? 300 : undefined // 5 minutes for videos
        }
      };

      const mediaRef = collection(db, 'media');
      const docRef = await addDoc(mediaRef, mediaData);
      
      console.log(`✅ Uploaded: ${media.name} (ID: ${docRef.id})`);
    }
    
    console.log('✅ All sample media uploaded successfully!');
    console.log('You can now check the education page to see the uploaded content.');
    
  } catch (error) {
    console.error('❌ Error uploading sample media:', error);
  }
}

// Run the upload
uploadSampleMedia(); 