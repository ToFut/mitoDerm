#!/usr/bin/env node

/**
 * Run Database Population Script
 * Simple wrapper to run the populate script
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('🚀 Starting MitoDerm Database Population...\n');

// Check if Firebase environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing Firebase environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.log('\n💡 Please set up your Firebase environment variables in .env.local');
  console.log('   You can copy from .env.example if available');
  process.exit(1);
}

console.log('✅ Firebase environment variables are configured');
console.log('📦 Loading populate script...\n');

try {
  const { populateDatabase } = require('./populate-brands-products.js');
  
  populateDatabase()
    .then(() => {
      console.log('\n✨ Database population completed successfully!');
      console.log('\n🎯 Next Steps:');
      console.log('1. Start your development server: npm run dev');
      console.log('2. Navigate to /admin/brands to manage your brands and products');
      console.log('3. Test the dynamic mega menu by hovering over "Products" in the navigation');
      console.log('4. Add more brands and products through the admin interface');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database population failed:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Error loading populate script:', error);
  process.exit(1);
} 