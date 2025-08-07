import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Brand {
  id: string;
  name: string;
  nameHebrew: string;
  description: string;
  descriptionHebrew: string;
  logo?: string;
  category: 'clinic' | 'home' | 'professional';
  technology: string;
  featured: boolean;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
  slug: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  nameHebrew: string;
  description: string;
  descriptionHebrew: string;
  brandId: string;
  brandName: string;
  category: 'clinic' | 'home' | 'professional';
  technology: string;
  price: number;
  images: string[];
  isActive: boolean;
  featured: boolean;
  createdAt: any;
  updatedAt: any;
  slug: string;
  specifications?: {
    size?: string;
    ingredients?: string[];
    usage?: string;
    benefits?: string[];
  };
}

export interface MegaMenuData {
  featured: Product[];
  categories: {
    title: string;
    titleHebrew: string;
    items: Product[];
  }[];
  technologies: {
    name: string;
    nameHebrew: string;
    icon: string;
    url: string;
  }[];
  brands: Brand[];
}

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }
  return { db };
};

class BrandService {
  // Get all brands
  async getBrands(): Promise<Brand[]> {
    try {
      const { db } = checkFirebase();
      const brandsRef = collection(db, 'brands');
      const q = query(brandsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const brands: Brand[] = [];
      for (const doc of querySnapshot.docs) {
        const brandData = doc.data();
        const products = await this.getProductsByBrand(doc.id);
        brands.push({
          id: doc.id,
          ...brandData,
          products
        } as Brand);
      }
      
      return brands;
    } catch (error) {
      console.error('Error getting brands:', error);
      return [];
    }
  }

  // Get brand by ID
  async getBrand(brandId: string): Promise<Brand | null> {
    try {
      const { db } = checkFirebase();
      const brandRef = doc(db, 'brands', brandId);
      const brandSnap = await getDoc(brandRef);
      
      if (brandSnap.exists()) {
        const brandData = brandSnap.data();
        const products = await this.getProductsByBrand(brandId);
        return {
          id: brandSnap.id,
          ...brandData,
          products
        } as Brand;
      }
      return null;
    } catch (error) {
      console.error('Error getting brand:', error);
      return null;
    }
  }

  // Get products by brand
  async getProductsByBrand(brandId: string): Promise<Product[]> {
    try {
      const { db } = checkFirebase();
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef, 
        where('brandId', '==', brandId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error getting products by brand:', error);
      return [];
    }
  }

  // Get all products
  async getProducts(): Promise<Product[]> {
    try {
      const { db } = checkFirebase();
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
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
      console.error('Error getting featured products:', error);
      return [];
    }
  }

  // Get products by category
  async getProductsByCategory(category: 'clinic' | 'home' | 'professional'): Promise<Product[]> {
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
      console.error('Error getting products by category:', error);
      return [];
    }
  }

  // Create new brand
  async createBrand(brandData: Omit<Brand, 'id' | 'createdAt' | 'updatedAt' | 'products'>): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      const brandsRef = collection(db, 'brands');
      const docRef = await addDoc(brandsRef, {
        ...brandData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating brand:', error);
      return null;
    }
  }

  // Create new product
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }

  // Update brand
  async updateBrand(brandId: string, updates: Partial<Brand>): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const brandRef = doc(db, 'brands', brandId);
      await updateDoc(brandRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating brand:', error);
      return false;
    }
  }

  // Update product
  async updateProduct(productId: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  }

  // Delete brand
  async deleteBrand(brandId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const brandRef = doc(db, 'brands', brandId);
      await deleteDoc(brandRef);
      return true;
    } catch (error) {
      console.error('Error deleting brand:', error);
      return false;
    }
  }

  // Delete product
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Generate mega menu data
  async getMegaMenuData(): Promise<MegaMenuData> {
    try {
      const { db } = checkFirebase();
      const [brands, featuredProducts, clinicProducts, homeProducts, professionalProducts] = await Promise.all([
        this.getBrands(),
        this.getFeaturedProducts(),
        this.getProductsByCategory('clinic'),
        this.getProductsByCategory('home'),
        this.getProductsByCategory('professional')
      ]);

      // Get unique technologies from brands
      const technologies = brands.reduce((acc, brand) => {
        if (!acc.find(tech => tech.name === brand.technology)) {
          acc.push({
            name: brand.technology,
            nameHebrew: brand.technology, // You can add Hebrew translations
            icon: this.getTechnologyIcon(brand.technology),
            url: `/products?technology=${brand.technology}`
          });
        }
        return acc;
      }, [] as { name: string; nameHebrew: string; icon: string; url: string }[]);

      return {
        featured: featuredProducts.slice(0, 4),
        categories: [
          {
            title: 'Clinic Products',
            titleHebrew: 'מוצרי קליניקה',
            items: clinicProducts.slice(0, 6)
          },
          {
            title: 'Home Products',
            titleHebrew: 'מוצרי בית',
            items: homeProducts.slice(0, 6)
          }
        ],
        technologies,
        brands
      };
    } catch (error) {
      console.error('Error generating mega menu data:', error);
      return {
        featured: [],
        categories: [],
        technologies: [],
        brands: []
      };
    }
  }

  // Get technology icon
  private getTechnologyIcon(technology: string): string {
    const iconMap: { [key: string]: string } = {
      'Exosomes': 'FiZap',
      'PDRN': 'FiLayers',
      'Peptides': 'FiActivity',
      'Stem Cells': 'FiTarget',
      'Growth Factors': 'FiTrendingUp',
      'Hyaluronic Acid': 'FiDroplet',
      'Retinol': 'FiStar',
      'Vitamin C': 'FiSun'
    };
    return iconMap[technology] || 'FiPackage';
  }

  // Generate slug from name
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

export const brandService = new BrandService(); 