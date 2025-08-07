import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// In-memory cache for gallery images
let galleryCache: { images: string[], count: number } | null = null;
let cacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (galleryCache && (now - cacheTime) < CACHE_DURATION) {
      const response = NextResponse.json(galleryCache);
      response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600');
      response.headers.set('X-Cache', 'HIT');
      return response;
    }

    const imageDirectory = path.join(process.cwd(), '/public/images/beforeAfter');
    
    // Use faster file reading method
    const imageFilenames = await fs.readdir(imageDirectory);
    
    // Filter for image files only
    const imageFiles = imageFilenames.filter(filename => 
      /\.(png|jpg|jpeg|gif|webp)$/i.test(filename)
    );
    
    // Sort files numerically (1.1.png, 2.1.png, etc.)
    const sortedFiles = imageFiles.sort((a, b) => {
      const numA = parseInt(a.split('.')[0]);
      const numB = parseInt(b.split('.')[0]);
      return numA - numB;
    });

    const result = { 
      images: sortedFiles,
      count: sortedFiles.length 
    };

    // Update cache
    galleryCache = result;
    cacheTime = now;

    const response = NextResponse.json(result);

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600'); // Cache for 10 minutes
    response.headers.set('ETag', `"${sortedFiles.length}-${cacheTime}"`);
    response.headers.set('X-Cache', 'MISS');

    return response;
  } catch (error) {
    console.error('Error reading gallery directory:', error);
    return NextResponse.json(
      { error: 'Failed to load gallery images' }, 
      { status: 500 }
    );
  }
} 