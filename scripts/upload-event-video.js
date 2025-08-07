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

// Event video data
const eventVideos = [
  {
    name: 'Event Introduction Video',
    description: 'Introduction video explaining what our events are about',
    localPath: 'public/videos/eventIntroVideo.webm',
    category: 'events',
    tags: ['event', 'introduction', 'overview'],
    type: 'video/webm',
    size: 2048000 // 2MB
  },
  {
    name: 'Workshop Highlights',
    description: 'Highlights from our latest workshop',
    localPath: 'public/videos/workshop-highlights.mp4',
    category: 'events',
    tags: ['event', 'workshop', 'highlights'],
    type: 'video/mp4',
    size: 5120000 // 5MB
  }
];

async function uploadEventVideo(video) {
  try {
    console.log(`📹 Uploading: ${video.name}`);
    
    // Check if file exists
    if (!fs.existsSync(video.localPath)) {
      console.log(`⚠️  File not found: ${video.localPath} - skipping...`);
      return null;
    }

    // Read file
    const fileBuffer = fs.readFileSync(video.localPath);
    const fileName = path.basename(video.localPath);
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `events/videos/${fileName}`);
    await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Add to Firestore with event tag
    const mediaData = {
      name: video.name,
      type: video.type,
      category: video.category,
      url: downloadURL,
      size: video.size,
      description: video.description,
      tags: [...video.tags, 'event-page'],
      metadata: {
        duration: 0, // Will be updated if needed
        width: 1920,
        height: 1080,
        eventRelated: true
      },
      uploadedAt: serverTimestamp(),
      uploadedBy: 'admin'
    };
    
    const docRef = await addDoc(collection(db, 'media'), mediaData);
    console.log(`✅ Uploaded: ${video.name} (ID: ${docRef.id})`);
    
    return {
      id: docRef.id,
      url: downloadURL,
      ...mediaData
    };
    
  } catch (error) {
    console.error(`❌ Error uploading ${video.name}:`, error.message);
    return null;
  }
}

async function uploadAllEventVideos() {
  console.log('🚀 Starting event video upload...');
  
  const uploadedVideos = [];
  
  for (const video of eventVideos) {
    const result = await uploadEventVideo(video);
    if (result) {
      uploadedVideos.push(result);
    }
  }
  
  console.log(`\n📊 Upload Summary:`);
  console.log(`✅ Successfully uploaded: ${uploadedVideos.length} videos`);
  console.log(`❌ Failed: ${eventVideos.length - uploadedVideos.length} videos`);
  
  if (uploadedVideos.length > 0) {
    console.log('\n📋 Uploaded Videos:');
    uploadedVideos.forEach(video => {
      console.log(`  - ${video.name}: ${video.url}`);
    });
  }
  
  return uploadedVideos;
}

// Run the upload
if (require.main === module) {
  uploadAllEventVideos()
    .then(() => {
      console.log('\n🎉 Event video upload completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Upload failed:', error);
      process.exit(1);
    });
}

module.exports = { uploadAllEventVideos, uploadEventVideo }; 