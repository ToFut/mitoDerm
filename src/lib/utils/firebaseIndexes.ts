// Firebase Index URLs for missing composite indexes
export const FIREBASE_INDEXES = {
  // Media collection - category + uploadedAt
  mediaCategoryUploadedAt: 'https://console.firebase.google.com/v1/r/project/mitoderm-332c1/firestore/indexes?create_composite=Ckxwcm9qZWN0cy9taXRvZGVybS0zMzJjMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvbWVkaWEvaW5kZXhlcy9fEAEaDAoIY2F0ZWdvcnkQARoOCgp1cGxvYWRlZEF0EAIaDAoIX19uYW1lX18QAg',
  
  // Media collection - type + uploadedAt
  mediaTypeUploadedAt: 'https://console.firebase.google.com/v1/r/project/mitoderm-332c1/firestore/indexes?create_composite=Ckxwcm9qZWN0cy9taXRvZGVybS0zMzJjMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvbWVkaWEvaW5kZXhlcy9fEAEaBAoEdHlwZRABGg4KCnVwbG9hZGVkQXQQAhoMCghfX25hbWVfXxAC',
  
  // Certifications collection - status + submittedAt
  certificationsStatusSubmittedAt: 'https://console.firebase.google.com/v1/r/project/mitoderm-332c1/firestore/indexes?create_composite=Ckxwcm9qZWN0cy9taXRvZGVybS0zMzJjMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvY2VydGlmaWNhdGlvbnMvaW5kZXhlcy9fEAEaBgoGc3RhdHVzEAEaDgoKc3VibWl0dGVkQXQQAhoMCghfX25hbWVfXxAC'
};

export const getIndexUrl = (indexName: keyof typeof FIREBASE_INDEXES): string => {
  return FIREBASE_INDEXES[indexName];
};

export const printIndexUrls = () => {
  console.log('🔥 Firebase Index URLs:');
  console.log('📋 Copy and paste these URLs to create the required indexes:');
  console.log('');
  
  Object.entries(FIREBASE_INDEXES).forEach(([name, url]) => {
    console.log(`📌 ${name}:`);
    console.log(url);
    console.log('');
  });
}; 