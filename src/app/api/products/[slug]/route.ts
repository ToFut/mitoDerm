import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/services/productService';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
} 