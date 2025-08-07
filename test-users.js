const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCe2cVjFFrP_Xq0CotGOWfYjkptlU0BzA8",
  authDomain: "mitoderm-332c1.firebaseapp.com",
  projectId: "mitoderm-332c1",
  storageBucket: "mitoderm-332c1.firebasestorage.app",
  messagingSenderId: "699230498967",
  appId: "1:699230498967:web:93c2c7f3e7e0e8be8279d2",
  measurementId: "G-WHWV7XTQP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function testUserCreation() {
  try {
    console.log('Testing user creation...');
    
    // Test user data
    const testUser = {
      email: `testuser${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User',
      phone: '+972-50-123-4567',
      clinic: 'Test Clinic',
      profession: 'Dermatologist',
      address: 'Tel Aviv, Israel'
    };

    console.log('Creating user with email:', testUser.email);

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      testUser.email,
      testUser.password
    );

    console.log('Firebase Auth user created:', userCredential.user.uid);

    // Update profile with name
    await updateProfile(userCredential.user, {
      displayName: testUser.name
    });

    console.log('Profile updated with name');

    // Create user document in Firestore
    const userDoc = {
      email: testUser.email,
      name: testUser.name,
      role: 'user',
      status: 'active',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      profile: {
        phone: testUser.phone || '',
        clinic: testUser.clinic || '',
        profession: testUser.profession || '',
        address: testUser.address || '',
        certificationStatus: 'none'
      }
    };

    const docRef = await addDoc(collection(db, 'users'), userDoc);
    console.log('Firestore user document created with ID:', docRef.id);

    // Test retrieving users
    console.log('\nTesting user retrieval...');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    console.log('Total users in database:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(`User: ${userData.name} (${userData.email}) - Role: ${userData.role} - Status: ${userData.status}`);
    });

    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testUserCreation(); 