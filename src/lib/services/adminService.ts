import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  onSnapshot,
  DocumentData,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db || !storage) {
    throw new Error('Firebase is not initialized');
  }
  return { db, storage };
};

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCertifications: number;
  pendingCertifications: number;
  totalVideos: number;
  totalImages: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  isActive: boolean;
  profile?: {
    phone?: string;
    clinic?: string;
    profession?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  images: string[];
  stock: number;
  featured: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  shippingAddress?: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
}

export interface Certification {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewerId?: string;
  reviewerName?: string;
  documents: string[];
  notes?: string;
}

export interface Activity {
  id: string;
  type: 'user' | 'product' | 'order' | 'certification' | 'video' | 'image';
  action: string;
  message: string;
  timestamp: Timestamp;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: Timestamp;
  uploadedBy: string;
  category?: string;
}

export class AdminService {
  // Real-time stats subscription
  private statsSubscriptions: Map<string, () => void> = new Map();

  // Get real-time admin stats
  async getRealTimeStats(callback: (stats: AdminStats) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const unsubscribe = onSnapshot(
        collection(db, 'admin_stats'),
        async (snapshot) => {
          if (!snapshot.empty) {
            const statsDoc = snapshot.docs[0];
            const stats = statsDoc.data() as AdminStats;
            callback(stats);
          } else {
            // If no stats document exists, calculate from other collections
            const stats = await this.calculateStats();
            callback(stats);
          }
        },
        (error) => {
          console.error('Error fetching admin stats:', error);
          // Fallback to calculated stats
          this.calculateStats().then(callback);
        }
      );

      this.statsSubscriptions.set('stats', unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error getting real-time stats:', error);
      throw error;
    }
  }

  // Calculate stats from various collections
  private async calculateStats(): Promise<AdminStats> {
    try {
      const { db } = checkFirebase();
      // Get users count
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;
      const activeUsers = usersSnapshot.docs.filter(doc => doc.data().isActive).length;

      // Get products count
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const totalProducts = productsSnapshot.size;
      const activeProducts = productsSnapshot.docs.filter(doc => doc.data().isActive).length;

      // Get orders count and revenue
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const totalOrders = ordersSnapshot.size;
      const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => {
        const order = doc.data() as Order;
        return sum + (order.totalAmount || 0);
      }, 0);

      // Get certifications count
      const certificationsSnapshot = await getDocs(collection(db, 'certifications'));
      const totalCertifications = certificationsSnapshot.size;
      const pendingCertifications = certificationsSnapshot.docs.filter(
        doc => doc.data().status === 'pending'
      ).length;

      // Get media count
      const mediaSnapshot = await getDocs(collection(db, 'media'));
      const totalVideos = mediaSnapshot.docs.filter(doc => doc.data().type === 'video').length;
      const totalImages = mediaSnapshot.docs.filter(doc => doc.data().type === 'image').length;

      return {
        totalUsers,
        activeUsers,
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue,
        totalCertifications,
        pendingCertifications,
        totalVideos,
        totalImages
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalProducts: 0,
        activeProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalCertifications: 0,
        pendingCertifications: 0,
        totalVideos: 0,
        totalImages: 0
      };
    }
  }

  // Get real-time recent activity
  async getRecentActivity(callback: (activities: Activity[]) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const q = query(
        collection(db, 'admin_activity'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Activity[];
        callback(activities);
      });

      this.statsSubscriptions.set('activity', unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  }

  // Get users with real-time updates
  async getUsers(callback: (users: User[]) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const q = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        callback(users);
      });

      this.statsSubscriptions.set('users', unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Get products with real-time updates
  async getProducts(callback: (products: Product[]) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        callback(products);
      });

      this.statsSubscriptions.set('products', unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  // Get orders with real-time updates
  async getOrders(callback: (orders: Order[]) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const q = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        callback(orders);
      });

      this.statsSubscriptions.set('orders', unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  // Get certifications with real-time updates
  async getCertifications(callback: (certifications: Certification[]) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const q = query(
        collection(db, 'certifications'),
        orderBy('submittedAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const certifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Certification[];
        callback(certifications);
      });

      this.statsSubscriptions.set('certifications', unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error getting certifications:', error);
      throw error;
    }
  }

  // Get media files from Firebase Storage
  async getMediaFiles(): Promise<MediaFile[]> {
    try {
      const { db, storage } = checkFirebase();
      const mediaRef = ref(storage, 'media');
      const result = await listAll(mediaRef);
      
      const mediaFiles: MediaFile[] = [];
      
      for (const itemRef of result.items) {
        const url = await getDownloadURL(itemRef);
        const metadata = await getDoc(doc(db, 'media_metadata', itemRef.name));
        
        mediaFiles.push({
          id: itemRef.name,
          name: itemRef.name,
          url,
          type: metadata.exists() ? metadata.data()?.type || 'image' : 'image',
          size: metadata.exists() ? metadata.data()?.size || 0 : 0,
          uploadedAt: metadata.exists() ? metadata.data()?.uploadedAt || new Date() : new Date(),
          uploadedBy: metadata.exists() ? metadata.data()?.uploadedBy || 'Unknown' : 'Unknown',
          category: metadata.exists() ? metadata.data()?.category : undefined
        });
      }
      
      return mediaFiles.sort((a, b) => {
         const dateA = a.uploadedAt instanceof Timestamp ? a.uploadedAt.toDate() : a.uploadedAt;
         const dateB = b.uploadedAt instanceof Timestamp ? b.uploadedAt.toDate() : b.uploadedAt;
         return dateB.getTime() - dateA.getTime();
       });
    } catch (error) {
      console.error('Error fetching media files:', error);
      return [];
    }
  }

  // Update user status
  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    try {
      const { db } = checkFirebase();
      await updateDoc(doc(db, 'users', userId), {
        isActive,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Update product status
  async updateProductStatus(productId: string, isActive: boolean): Promise<void> {
    try {
      const { db } = checkFirebase();
      await updateDoc(doc(db, 'products', productId), {
        isActive,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating product status:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const { db } = checkFirebase();
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Review certification
  async reviewCertification(
    certificationId: string, 
    status: 'approved' | 'rejected', 
    reviewerId: string,
    reviewerName: string,
    notes?: string
  ): Promise<void> {
    try {
      const { db } = checkFirebase();
      await updateDoc(doc(db, 'certifications', certificationId), {
        status,
        reviewedAt: new Date(),
        reviewerId,
        reviewerName,
        notes
      });
    } catch (error) {
      console.error('Error reviewing certification:', error);
      throw error;
    }
  }

  async uploadMediaFile(file: File, category: string): Promise<MediaFile> {
    try {
      const { db, storage } = checkFirebase();
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `media/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const metaRef = doc(db, 'media_metadata', fileName);
      const mediaData = {
        name: file.name,
        url,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        size: file.size,
        uploadedAt: serverTimestamp(),
        uploadedBy: 'admin', // TODO: use real user
        category
      };
      await setDoc(metaRef, mediaData);
      await addDoc(collection(db, 'media'), mediaData);
      return { id: fileName, ...mediaData } as unknown as MediaFile;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }
  async deleteMediaFile(id: string): Promise<void> {
    try {
      const { db, storage } = checkFirebase();
      const storageRef = ref(storage, `media/${id}`);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'media_metadata', id));
      // Optionally, delete from 'media' collection as well
      // (requires knowing the doc id, which may differ from file name)
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }

  // Get a single product by ID
  async getProduct(productId: string): Promise<Product | null> {
    try {
      const { db } = checkFirebase();
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Update product data
  async updateProduct(productId: string, data: Partial<Product>): Promise<void> {
    try {
      const { db } = checkFirebase();
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Upload product image
  async uploadProductImage(productId: string, file: File): Promise<{ url: string; name: string }> {
    try {
      const { db, storage } = checkFirebase();
      const fileName = `${productId}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `products/${productId}/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      return { url, name: fileName };
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  }

  // Clean up subscriptions
  cleanup(): void {
    this.statsSubscriptions.forEach(unsubscribe => unsubscribe());
    this.statsSubscriptions.clear();
  }
}

export const adminService = new AdminService(); 