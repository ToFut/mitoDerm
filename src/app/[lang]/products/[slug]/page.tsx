import { unstable_setRequestLocale } from 'next-intl/server';
import { getProductBySlug } from '@/lib/services/productService';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Helper function to serialize Firestore Timestamps
function serializeProduct(product: any) {
  if (!product) return null;
  
  return {
    ...product,
    createdAt: product.createdAt?.toDate?.() ? product.createdAt.toDate().toISOString() : product.createdAt,
    updatedAt: product.updatedAt?.toDate?.() ? product.updatedAt.toDate().toISOString() : product.updatedAt,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { lang, slug } = await params;
  unstable_setRequestLocale(lang);
  
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }
  
  // Serialize the product to remove Firestore Timestamps
  const serializedProduct = serializeProduct(product);
  
  return <ProductDetailClient product={serializedProduct} />;
} 