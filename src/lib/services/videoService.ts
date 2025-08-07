import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface Video {
  id?: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  isActive: boolean;
  views: number;
  createdAt?: any;
  updatedAt?: any;
}

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db || !storage) {
    throw new Error('Firebase is not initialized');
  }
  return { db, storage };
};

// Get all videos
export const getVideos = async (): Promise<Video[]> => {
  try {
    const { db } = checkFirebase();
    const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[];
  } catch (error) {
    console.error('Error getting videos:', error);
    return [];
  }
};

// Get active videos only
export const getActiveVideos = async (): Promise<Video[]> => {
  try {
    const { db } = checkFirebase();
    const q = query(
      collection(db, 'videos'), 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[];
  } catch (error) {
    console.error('Error getting active videos:', error);
    return [];
  }
};

// Add new video
export const addVideo = async (video: Omit<Video, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Promise<string | null> => {
  try {
    const { db } = checkFirebase();
    const docRef = await addDoc(collection(db, 'videos'), {
      ...video,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding video:', error);
    return null;
  }
};

// Update video
export const updateVideo = async (id: string, video: Partial<Video>): Promise<boolean> => {
  try {
    const { db } = checkFirebase();
    const docRef = doc(db, 'videos', id);
    await updateDoc(docRef, {
      ...video,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating video:', error);
    return false;
  }
};

// Delete video
export const deleteVideo = async (id: string): Promise<boolean> => {
  try {
    const { db } = checkFirebase();
    const docRef = doc(db, 'videos', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
};

// Upload video file
export const uploadVideo = async (file: File, videoId: string): Promise<string | null> => {
  try {
    const { storage } = checkFirebase();
    const storageRef = ref(storage, `videos/${videoId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading video:', error);
    return null;
  }
};

// Upload thumbnail
export const uploadThumbnail = async (file: File, videoId: string): Promise<string | null> => {
  try {
    const { storage } = checkFirebase();
    const storageRef = ref(storage, `thumbnails/${videoId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    return null;
  }
};

// Delete video file
export const deleteVideoFile = async (videoUrl: string): Promise<boolean> => {
  try {
    const { storage } = checkFirebase();
    const videoRef = ref(storage, videoUrl);
    await deleteObject(videoRef);
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
};

// Delete thumbnail
export const deleteThumbnail = async (thumbnailUrl: string): Promise<boolean> => {
  try {
    const { storage } = checkFirebase();
    const thumbnailRef = ref(storage, thumbnailUrl);
    await deleteObject(thumbnailRef);
    return true;
  } catch (error) {
    console.error('Error deleting thumbnail:', error);
    return false;
  }
};

// Get videos by category
export const getVideosByCategory = async (category: string): Promise<Video[]> => {
  try {
    const { db } = checkFirebase();
    const q = query(
      collection(db, 'videos'), 
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[];
  } catch (error) {
    console.error('Error getting videos by category:', error);
    return [];
  }
};

// Increment video views
export const incrementVideoViews = async (videoId: string): Promise<boolean> => {
  try {
    const { db } = checkFirebase();
    const docRef = doc(db, 'videos', videoId);
    await updateDoc(docRef, {
      views: increment(1)
    });
    return true;
  } catch (error) {
    console.error('Error incrementing video views:', error);
    return false;
  }
};

// Helper function for increment
const increment = (n: number) => {
  return n;
}; 