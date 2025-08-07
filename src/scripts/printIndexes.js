const { FIREBASE_INDEXES, printIndexUrls } = require('../lib/utils/firebaseIndexes');

console.log('🔥 Firebase Index URLs:');
console.log('📋 Copy and paste these URLs to create the required indexes:');
console.log('');

Object.entries(FIREBASE_INDEXES).forEach(([name, url]) => {
  console.log(`📌 ${name}:`);
  console.log(url);
  console.log('');
});

console.log('📝 Instructions:');
console.log('1. Click on each URL above');
console.log('2. Sign in to your Firebase Console');
console.log('3. Click "Create Index"');
console.log('4. Wait for the index to be created (may take a few minutes)');
console.log('5. Repeat for all indexes');
console.log('');
console.log('✅ Once all indexes are created, the media system will work properly!'); 