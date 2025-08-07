import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/services/productService';

export async function GET() {
  const products = await getAllProducts();
  const slugs = products.map(p => ({ id: p.id, slug: p.slug, name: p.name }));
  return NextResponse.json(slugs);
} 