import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/services/productService';

// In-memory cache for products
let productsCache: any = null;
let productsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check cache first
    const now = Date.now();
    if (productsCache && (now - productsCacheTime) < CACHE_DURATION) {
      const response = NextResponse.json(productsCache);
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
      response.headers.set('X-Cache', 'HIT');
      return response;
    }

    const products = await getAllProducts();
    
    // Update cache
    productsCache = products;
    productsCacheTime = now;
    
    const response = NextResponse.json(products);
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300'); // Cache for 5 minutes
    response.headers.set('ETag', `"${products.length}-${productsCacheTime}"`);
    response.headers.set('X-Cache', 'MISS');
    
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
} 