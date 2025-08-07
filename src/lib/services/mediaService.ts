import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { db, storage } from '../firebase';

export interface MediaItem {
  id?: string;
  name: string;
  type: string;
  category: string;
  url: string;
  size: number;
  uploadedAt: Date;
  description?: string;
  alt?: string;
  tags: string[];
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
  };
}

export interface UploadProgress {
  [fileName: string]: number;
}

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db || !storage) {
    throw new Error('Firebase is not initialized');
  }
  return { db, storage };
};

// Get all media items
export const getMedia = async (): Promise<MediaItem[]> => {
  try {
    const { db } = checkFirebase();
    const mediaRef = collection(db, 'media');
    const q = query(mediaRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
    })) as MediaItem[];
  } catch (error) {
    console.error('Error fetching media:', error);
    throw new Error('Failed to fetch media');
  }
};

// Get media by category
export const getMediaByCategory = async (category: string): Promise<MediaItem[]> => {
  try {
    const { db } = checkFirebase();
    const mediaRef = collection(db, 'media');
    const q = query(
      mediaRef, 
      where('category', '==', category),
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
    })) as MediaItem[];
  } catch (error) {
    console.error('Error fetching media by category (falling back to client-side filter):', error);
    
    // Fallback: get all media and filter client-side
    try {
      const allMedia = await getMedia();
      return allMedia.filter(item => 
        item.category === category || 
        item.tags.includes(category)
      );
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
};

// Upload media files
export const uploadMedia = async (
  formData: FormData, 
  onProgress?: (progress: UploadProgress) => void
): Promise<MediaItem[]> => {
  try {
    const { db, storage } = checkFirebase();
    const files = formData.getAll('files') as File[];
    const category = formData.get('category') as string || 'education';
    const uploadedItems: MediaItem[] = [];
    const progress: UploadProgress = {};

    for (const file of files) {
      try {
        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const storageRef = ref(storage, `media/${fileName}`);

        // Upload to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update progress
        progress[file.name] = 100;
        onProgress?.(progress);

        // Determine file type category
        let fileCategory = category;
        if (file.type.startsWith('video/')) {
          fileCategory = category === 'education' ? 'education' : 'videos';
        } else if (file.type.startsWith('image/')) {
          fileCategory = 'images';
        } else if (file.type.includes('pdf') || file.type.includes('document')) {
          fileCategory = 'documents';
        }

        // Create media item in Firestore
        const mediaData: Omit<MediaItem, 'id'> = {
          name: file.name,
          type: file.type,
          category: fileCategory,
          url: downloadURL,
          size: file.size,
          uploadedAt: new Date(),
          description: '',
          alt: file.name,
          tags: [category, fileCategory],
          metadata: {}
        };

        const mediaRef = collection(db, 'media');
        const docRef = await addDoc(mediaRef, {
          ...mediaData,
          uploadedAt: serverTimestamp()
        });

        uploadedItems.push({
          id: docRef.id,
          ...mediaData
        });

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        progress[file.name] = -1; // Error state
        onProgress?.(progress);
      }
    }

    return uploadedItems;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw new Error('Failed to upload media');
  }
};

// Delete media item
export const deleteMedia = async (mediaId: string): Promise<void> => {
  try {
    const { db, storage } = checkFirebase();
    // Get media item to get the storage URL
    const mediaRef = doc(db, 'media', mediaId);
    const mediaSnap = await getDoc(mediaRef);
    
    if (mediaSnap.exists()) {
      const mediaData = mediaSnap.data() as MediaItem;
      
      // Delete from Firebase Storage
      if (mediaData.url) {
        try {
          const storageRef = ref(storage, mediaData.url);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.warn('Storage file not found, continuing with Firestore deletion');
        }
      }
      
      // Delete from Firestore
      await deleteDoc(mediaRef);
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    throw new Error('Failed to delete media');
  }
};

// Update media item
export const updateMedia = async (mediaId: string, updates: Partial<MediaItem>): Promise<void> => {
  try {
    const { db } = checkFirebase();
    const mediaRef = doc(db, 'media', mediaId);
    await updateDoc(mediaRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating media:', error);
    throw new Error('Failed to update media');
  }
};

// Get media by type
export const getMediaByType = async (type: string): Promise<MediaItem[]> => {
  try {
    const { db } = checkFirebase();
    const mediaRef = collection(db, 'media');
    const q = query(
      mediaRef, 
      where('type', '==', type),
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
    })) as MediaItem[];
  } catch (error) {
    console.error('Error fetching media by type:', error);
    throw new Error('Failed to fetch media by type');
  }
};

// Search media
export const searchMedia = async (searchTerm: string): Promise<MediaItem[]> => {
  try {
    const { db } = checkFirebase();
    const mediaRef = collection(db, 'media');
    const q = query(mediaRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const allMedia = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
    })) as MediaItem[];
    
    return allMedia.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  } catch (error) {
    console.error('Error searching media:', error);
    throw new Error('Failed to search media');
  }
};

// Get media statistics
export const getMediaStats = async () => {
  try {
    const { db } = checkFirebase();
    const mediaRef = collection(db, 'media');
    const querySnapshot = await getDocs(mediaRef);
    
    const mediaItems = querySnapshot.docs.map(doc => doc.data()) as MediaItem[];
    
    const stats = {
      total: mediaItems.length,
      images: mediaItems.filter(item => item.type.startsWith('image/')).length,
      videos: mediaItems.filter(item => item.type.startsWith('video/')).length,
      documents: mediaItems.filter(item => !item.type.startsWith('image/') && !item.type.startsWith('video/')).length,
      totalSize: mediaItems.reduce((acc, item) => acc + item.size, 0),
      categories: {} as { [key: string]: number }
    };
    
    mediaItems.forEach(item => {
      stats.categories[item.category] = (stats.categories[item.category] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting media stats:', error);
    throw new Error('Failed to get media stats');
  }
};

// Bulk delete media
export const bulkDeleteMedia = async (mediaIds: string[]): Promise<void> => {
  try {
    for (const mediaId of mediaIds) {
      await deleteMedia(mediaId);
    }
  } catch (error) {
    console.error('Error bulk deleting media:', error);
    throw new Error('Failed to bulk delete media');
  }
};

// Get storage usage
export const getStorageUsage = async (): Promise<{ used: number; total: number }> => {
  try {
    const { db } = checkFirebase();
    // Get total size from Firestore instead of Storage metadata
    const mediaRef = collection(db, 'media');
    const querySnapshot = await getDocs(mediaRef);
    
    const totalSize = querySnapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      return acc + (data.size || 0);
    }, 0);
    
    return {
      used: totalSize,
      total: 5 * 1024 * 1024 * 1024 // 5GB free tier
    };
  } catch (error) {
    console.error('Error getting storage usage:', error);
    return { used: 0, total: 0 };
  }
}; 