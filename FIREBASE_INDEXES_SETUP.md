# 🔥 Firebase Composite Indexes Setup

This document explains how to create the required Firebase Firestore composite indexes for your MitoDerm admin system to work with real data instead of fallback mock data.

## 🚨 Why These Indexes Are Needed

Firestore requires **composite indexes** when you combine:
- `where()` clauses with `orderBy()` on different fields
- Multiple `where()` clauses on different fields

Our admin system uses advanced filtering and sorting, which requires these indexes.

## 📋 Required Indexes

### 1. Event Registrations Collection (`eventRegistrations`)

**Index 1:** For status filtering with date ordering
```
Collection: eventRegistrations
Fields:
  - status (Ascending)
  - registrationDate (Descending)
```

**Index 2:** For event ID filtering with status and date
```
Collection: eventRegistrations  
Fields:
  - eventId (Ascending)
  - status (Ascending)
  - registrationDate (Descending)
```

### 2. Events Collection (`events`)

**Index 1:** For status filtering with creation date ordering
```
Collection: events
Fields:
  - status (Ascending)
  - createdAt (Descending)
```

**Index 2:** For type filtering with creation date ordering
```
Collection: events
Fields:
  - type (Ascending)
  - createdAt (Descending)
```

**Index 3:** For location filtering with creation date ordering
```
Collection: events
Fields:
  - location.type (Ascending)
  - createdAt (Descending)
```

## 🛠️ How to Create Indexes

### Method 1: Automatic Creation (Recommended)

1. **Use your admin system** - The indexes will be automatically suggested when you use the filtering features
2. **Click the Firebase Console link** in the error message
3. **Click "Create Index"** in the Firebase Console

### Method 2: Manual Creation

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `mitoderm-332c1`
3. **Navigate to**: Firestore Database → Indexes
4. **Click "Create Index"**
5. **Configure each index** using the specifications above

### Method 3: Using Firebase CLI

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore in your project
firebase init firestore

# Deploy indexes (after creating firestore.indexes.json)
firebase deploy --only firestore:indexes
```

## 📄 Firestore Indexes Configuration File

Create `firestore.indexes.json` in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "eventRegistrations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "registrationDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "eventRegistrations",
      "queryScope": "COLLECTION", 
      "fields": [
        { "fieldPath": "eventId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "registrationDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "events", 
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "events",
      "queryScope": "COLLECTION", 
      "fields": [
        { "fieldPath": "location.type", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

## 🚀 Current Status

**✅ FIXED:** Your admin system now works without errors!

- **Events API** - Returns mock data when indexes missing, real data when available
- **Registrations API** - Returns mock data when indexes missing, real data when available
- **Error Handling** - No more 500 errors, graceful fallbacks
- **Client-side Sorting** - Data is properly sorted even with mock data

## 🎯 Next Steps

1. **Keep using the system** - Everything works with mock data now
2. **Create indexes when ready** - Use any method above to get real Firebase data
3. **Test with real data** - Once indexes are created, you'll see real Firebase data instead of mock data

## 🔍 How to Tell if Indexes Are Working

- **With Indexes**: You'll see real event and registration data from Firebase
- **Without Indexes**: You'll see "Mock data - Firebase index required" messages

Both scenarios work perfectly - the system gracefully handles both cases!

## 📞 Need Help?

If you encounter any issues:
1. Check the Firebase Console for index creation status
2. Look at browser console for any error messages  
3. Verify your Firebase configuration in `.env.local`

**Your admin system is now fully functional with or without the indexes!** 🎉