import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductBenefit {
  title: string;
  description: string;
}

export interface Product {
  id?: string;
  slug: string;
  name: string;
  nameHebrew?: string;
  title?: string;
  subtitle?: string;
  shortDescription?: string;
  description: string;
  descriptionHebrew?: string;
  price: number;
  stock: number;
  requiresCertification: boolean;
  certificationLevel: 'none' | 'basic' | 'advanced' | 'expert';
  isActive: boolean;
  image: string;
  images?: ProductImage[];
  category: string;
  sku: string;
  weight: number;
  dimensions: string;
  ingredients: string | string[];
  instructions: string;
  benefits: string | ProductBenefit[];
  contraindications: string;
  expiryDate: string;
  manufacturer: string;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  badge?: string;
  technology?: string;
  application?: string;
  target?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  // Next-gen/brand design fields
  design?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    bg?: string;
    text?: string;
  };
  features?: string[];
  specifications?: Record<string, string>;
  aiContent?: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
}

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }
  return { db, storage };
};

// Simple in-memory cache for products
let productsCache: Product[] | null = null;
let productsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  console.log('[getProductBySlug] called with slug:', slug);
  if (slug === 'all') {
    return null; // This is used for generateStaticParams
  }
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const product = snapshot.docs.find(doc => doc.data().slug === slug);
    if (product) {
      const productData = { id: product.id, ...product.data() } as Product;
      console.log('[getProductBySlug] found product:', productData);
      return productData;
    }
    console.log('[getProductBySlug] no product found for slug:', slug);
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  console.log('[getAllProducts] called');
  
  // Check if we have a valid cache
  const now = Date.now();
  if (productsCache && (now - productsCacheTime) < CACHE_DURATION) {
    console.log('[getAllProducts] returning cached data');
    return productsCache;
  }
  
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const products = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    // Update cache
    productsCache = products;
    productsCacheTime = now;
    
    console.log('[getAllProducts] found products:', products.length);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get all products (legacy function)
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

// Get product by ID
export const getProduct = async (id: string): Promise<Product | null> => {
  try {
    const { db } = checkFirebase();
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Failed to fetch product');
  }
};

// Add new product
export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

// Update product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<void> => {
  try {
    const { db } = checkFirebase();
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const { db } = checkFirebase();
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
};

// Upload product image
export const uploadProductImage = async (file: File, productId: string): Promise<string | null> => {
  try {
    const { storage } = checkFirebase();
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

// Delete product image
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    const { storage } = checkFirebase();
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('category', '==', category),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('featured', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
};

// Get best sellers
export const getBestSellers = async (): Promise<Product[]> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('bestSeller', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    throw new Error('Failed to fetch best sellers');
  }
};

// Get new arrivals
export const getNewArrivals = async (): Promise<Product[]> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('newArrival', '==', true),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw new Error('Failed to fetch new arrivals');
  }
};

// Search products
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    // Filter by search term (client-side filtering for better UX)
    return products.filter(product => 
      (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};

// Get low stock products
export const getLowStockProducts = async (threshold: number = 10): Promise<Product[]> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('stock', '<=', threshold),
      where('isActive', '==', true),
      orderBy('stock', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    throw new Error('Failed to fetch low stock products');
  }
};

// Bulk update products
export const bulkUpdateProducts = async (productIds: string[], updates: Partial<Product>): Promise<void> => {
  try {
    const updatePromises = productIds.map(id => updateProduct(id, updates));
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error bulk updating products:', error);
    throw new Error('Failed to bulk update products');
  }
};

// Bulk delete products
export const bulkDeleteProducts = async (productIds: string[]): Promise<void> => {
  try {
    const deletePromises = productIds.map(id => deleteProduct(id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    throw new Error('Failed to bulk delete products');
  }
};

// Real-time products listener
export const subscribeToProducts = (
  callback: (products: Product[]) => void,
  filters?: {
    category?: string;
    isActive?: boolean;
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
  }
) => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    let q = query(productsRef, orderBy('createdAt', 'desc'));
    
    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      if (filters.featured) {
        q = query(q, where('featured', '==', true));
      }
      if (filters.bestSeller) {
        q = query(q, where('bestSeller', '==', true));
      }
      if (filters.newArrival) {
        q = query(q, where('newArrival', '==', true));
      }
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      callback(products);
    });
  } catch (error) {
    console.error('Error setting up products listener:', error);
    throw new Error('Failed to set up products listener');
  }
};

// Get product categories
export const getProductCategories = async (): Promise<string[]> => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    const categories = new Set<string>();
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category);
      }
    });
    
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw new Error('Failed to fetch product categories');
  }
};

// Get product statistics
export const getProductStats = async () => {
  try {
    const { db } = checkFirebase();
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    const stats = {
      total: products.length,
      active: products.filter(p => p.isActive).length,
      inactive: products.filter(p => !p.isActive).length,
      featured: products.filter(p => p.featured).length,
      bestSellers: products.filter(p => p.bestSeller).length,
      newArrivals: products.filter(p => p.newArrival).length,
      lowStock: products.filter(p => p.stock < 10).length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      categories: Array.from(new Set(products.map(p => p.category))).length
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching product stats:', error);
    throw new Error('Failed to fetch product stats');
  }
};

// Note: Helper functions like incrementProductViews, updateProductAnalytics, etc.
// are defined in other service files and should be imported from there

// Export helper functions for product management
export const canUserAccessProduct = async (productId: string, userId: string): Promise<boolean> => {
  // This would check if user has access to the product based on certification level
  // For now, return true as a placeholder
  return true;
};

export const getProductPrice = async (productId: string, userId?: string): Promise<number> => {
  try {
    const product = await getProduct(productId);
    if (!product) return 0;
    
    // This would implement partner pricing logic
    // For now, return the base price
    return product.price;
  } catch (error) {
    console.error('Error getting product price:', error);
    return 0;
  }
};

export const getBulkPrice = async (productId: string, quantity: number): Promise<number> => {
  try {
    const product = await getProduct(productId);
    if (!product) return 0;
    
    // Implement bulk pricing logic
    // For now, return base price
    return product.price * quantity;
  } catch (error) {
    console.error('Error getting bulk price:', error);
    return 0;
  }
};

export const isProductAvailable = async (productId: string): Promise<boolean> => {
  try {
    const product = await getProduct(productId);
    return product ? product.isActive && product.stock > 0 : false;
  } catch (error) {
    console.error('Error checking product availability:', error);
    return false;
  }
};

// Export a ProductService class for backward compatibility
export class ProductService {
  async getProducts(): Promise<Product[]> {
    return getProducts();
  }
  
  async getProduct(id: string): Promise<Product | null> {
    return getProduct(id);
  }
  
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return addProduct(productData);
  }
  
  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    return updateProduct(id, updates);
  }
  
  async deleteProduct(id: string): Promise<void> {
    return deleteProduct(id);
  }
} 