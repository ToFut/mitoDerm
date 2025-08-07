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
  createdAt?: any;
  updatedAt?: any;
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
} 