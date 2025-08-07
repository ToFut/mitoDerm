# Firebase Setup Guide for Real Data Management

## Overview

This guide will help you set up Firebase for real data storage and management of the Mitoderm admin dashboard. Firebase provides:

- **Firestore Database**: Real-time NoSQL database
- **Cloud Storage**: File storage for images and videos
- **Authentication**: User management
- **Hosting**: Web hosting (optional)

## Step 1: Create Firebase Project

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Click "Create a project" or "Add project"

### 2. Project Setup
- **Project name**: `mitoderm-admin` (or your preferred name)
- **Enable Google Analytics**: Yes (recommended)
- **Analytics account**: Create new or use existing
- Click "Create project"

### 3. Enable Services

#### Enable Firestore Database:
1. Go to "Firestore Database" in left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location: `us-central1` (or closest to your users)
5. Click "Done"

#### Enable Cloud Storage:
1. Go to "Storage" in left sidebar
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select location: `us-central1`
5. Click "Done"

## Step 2: Get Firebase Configuration

### 1. Project Settings
1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section

### 2. Add Web App
1. Click the web icon `</>`
2. **App nickname**: `mitoderm-web`
3. **Firebase Hosting**: No (for now)
4. Click "Register app"

### 3. Copy Configuration
You'll see a config object like this:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 3: Environment Variables

### 1. Update `.env.local`
Add these variables to your `.env.local` file:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 2. Replace with Your Values
Replace the placeholder values with your actual Firebase configuration.

## Step 4: Security Rules

### 1. Firestore Security Rules
Go to Firestore Database → Rules and update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users can read/write all data
    function isAdmin() {
      return request.auth != null && 
        request.auth.token.email in [
          'admin@mitoderm.com',
          'shiri@mitoderm.com',
          'segev@futurixs.com',
          'ilona@mitoderm.co.il'
        ];
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Anyone can read products
      allow write: if isAdmin(); // Only admins can write
    }
    
    // Videos collection
    match /videos/{videoId} {
      allow read: if true; // Anyone can read videos
      allow write: if isAdmin(); // Only admins can write
    }
    
    // Certification requests
    match /certificationRequests/{requestId} {
      allow read: if request.auth != null; // Authenticated users can read
      allow create: if request.auth != null; // Authenticated users can create
      allow update: if isAdmin(); // Only admins can update
      allow delete: if isAdmin(); // Only admins can delete
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if true; // Anyone can read categories
      allow write: if isAdmin(); // Only admins can write
    }
    
    // Rewards collection
    match /rewards/{rewardId} {
      allow read: if true; // Anyone can read rewards
      allow write: if isAdmin(); // Only admins can write
    }
  }
}
```

### 2. Storage Security Rules
Go to Storage → Rules and update to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Admin users can upload/delete files
    function isAdmin() {
      return request.auth != null && 
        request.auth.token.email in [
          'admin@mitoderm.com',
          'shiri@mitoderm.com',
          'segev@futurixs.com',
          'ilona@mitoderm.co.il'
        ];
    }
    
    // Product images
    match /products/{productId}/{fileName} {
      allow read: if true; // Anyone can view
      allow write: if isAdmin(); // Only admins can upload
    }
    
    // Video files
    match /videos/{videoId}/{fileName} {
      allow read: if true; // Anyone can view
      allow write: if isAdmin(); // Only admins can upload
    }
    
    // Thumbnails
    match /thumbnails/{videoId}/{fileName} {
      allow read: if true; // Anyone can view
      allow write: if isAdmin(); // Only admins can upload
    }
  }
}
```

## Step 5: Database Structure

### Collections to Create:

#### 1. `products` Collection
```javascript
{
  id: "auto-generated",
  name: "V-Tech Serum",
  price: 450,
  stock: 12,
  requiresCertification: true,
  certificationLevel: "basic",
  isActive: true,
  description: "Synthetic exosomes with PDRN polynucleotides",
  image: "https://storage.googleapis.com/...",
  category: "Serums",
  sku: "VT-SERUM-001",
  weight: 30,
  dimensions: "5cm x 5cm x 10cm",
  ingredients: "Synthetic Exosomes, PDRN Polynucleotides...",
  instructions: "Apply 2-3 drops to clean skin twice daily...",
  benefits: "Advanced skin regeneration, improved texture...",
  contraindications: "Not suitable for pregnant women...",
  expiryDate: "2025-12-31",
  manufacturer: "MitoDerm Laboratories",
  tags: ["serum", "anti-aging", "regeneration"],
  featured: true,
  bestSeller: true,
  newArrival: false,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. `videos` Collection
```javascript
{
  id: "auto-generated",
  title: "Introduction to V-Tech Products",
  category: "Product Knowledge",
  difficulty: "easy",
  xpReward: 50,
  description: "Learn about V-Tech products and their applications",
  videoUrl: "https://storage.googleapis.com/...",
  thumbnailUrl: "https://storage.googleapis.com/...",
  duration: 300, // seconds
  isActive: true,
  views: 0,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 3. `certificationRequests` Collection
```javascript
{
  id: "auto-generated",
  userId: "user-id",
  userName: "Sarah Cohen",
  userEmail: "sarah@clinic.com",
  requestType: "certification",
  status: "pending",
  message: "I would like to become certified...",
  requestedAt: timestamp,
  respondedAt: timestamp,
  adminResponse: "Certification approved...",
  adminId: "admin-user-id",
  adminName: "Admin Name"
}
```

#### 4. `categories` Collection
```javascript
{
  id: "auto-generated",
  name: "Product Knowledge",
  description: "Learn about V-Tech products and their applications",
  icon: "📚",
  color: "#48bb78",
  isActive: true,
  sortOrder: 1,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 5. `rewards` Collection
```javascript
{
  id: "auto-generated",
  name: "Beginner Badge",
  description: "Complete your first 5 videos",
  xpRequired: 250,
  rewardType: "badge",
  rewardValue: "Beginner Badge",
  isActive: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Step 6: Testing the Setup

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Admin Dashboard
1. Sign in with admin email
2. Go to `/admin`
3. Try adding a product
4. Check Firebase Console to see data

### 3. Check Firebase Console
- Go to Firestore Database → Data
- You should see your collections and documents
- Go to Storage → Files to see uploaded files

## Step 7: Production Deployment

### 1. Update Security Rules
For production, update security rules to be more restrictive:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
        request.auth.token.email in [
          'admin@mitoderm.com',
          'shiri@mitoderm.com',
          'segev@futurixs.com',
          'ilona@mitoderm.co.il'
        ];
    }
    
    // More restrictive rules for production
    match /{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

### 2. Environment Variables
Update your production environment variables with the same Firebase config.

### 3. Deploy
Deploy your Next.js app to Vercel, Netlify, or your preferred hosting.

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**
   - Check environment variables are set correctly
   - Restart development server

2. **"Permission denied"**
   - Check Firestore security rules
   - Ensure user is authenticated

3. **"File upload failed"**
   - Check Storage security rules
   - Verify file size limits

4. **"Database not found"**
   - Ensure Firestore is enabled in Firebase Console
   - Check project ID in environment variables

### Support:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Stack Overflow: https://stackoverflow.com/questions/tagged/firebase

## Next Steps

Once Firebase is set up:

1. **Real-time Updates**: Data will update in real-time across all users
2. **File Storage**: Images and videos will be stored in Google Cloud Storage
3. **Scalability**: Firebase automatically scales with your usage
4. **Analytics**: Track usage and performance
5. **Backup**: Automatic backups and data recovery

Your admin dashboard is now ready for real production use with persistent data storage! 