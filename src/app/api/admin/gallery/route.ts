import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Mock database - in production, use a real database
let galleryItems: any[] = [
  {
    id: '1',
    title: 'Facial Rejuvenation',
    description: 'Advanced exosome treatment for skin texture improvement',
    category: 'face',
    beforeImage: '/images/beforeAfter/1.1.png',
    afterImage: '/images/beforeAfter/2.1.png',
    treatment: 'V-Tech Serum + Gel Mask',
    duration: '3 sessions',
    results: '90% improvement in skin texture',
    isActive: true,
    order: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Acne Scar Treatment',
    description: 'Significant reduction in post-acne scarring',
    category: 'acne',
    beforeImage: '/images/beforeAfter/3.png',
    afterImage: '/images/beforeAfter/4.1.png',
    treatment: 'V-Tech Serum',
    duration: '5 sessions',
    results: '85% scar reduction',
    isActive: true,
    order: 2,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'Anti-Aging Results',
    description: 'Visible improvement in skin firmness and elasticity',
    category: 'anti-aging',
    beforeImage: '/images/beforeAfter/5.1.png',
    afterImage: '/images/beforeAfter/6.1.png',
    treatment: 'V-Tech Complete Kit',
    duration: '4 sessions',
    results: '3x increase in collagen production',
    isActive: true,
    order: 3,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const id = searchParams.get('id');

    if (id) {
      const item = galleryItems.find(item => item.id === id);
      if (!item) {
        return NextResponse.json(
          { error: 'Gallery item not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ item });
    }

    let filteredItems = galleryItems;
    
    if (category !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    // Sort by order
    filteredItems.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      items: filteredItems,
      total: filteredItems.length
    });
  } catch (error) {
    console.error('Error loading gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to load gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const newItem = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      beforeImage: formData.get('beforeImage') as string,
      afterImage: formData.get('afterImage') as string,
      treatment: formData.get('treatment') as string,
      duration: formData.get('duration') as string,
      results: formData.get('results') as string,
      isActive: formData.get('isActive') === 'true',
      order: galleryItems.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    galleryItems.push(newItem);

    return NextResponse.json({
      success: true,
      item: newItem
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    const itemIndex = galleryItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    const updatedItem = {
      ...galleryItems[itemIndex],
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      beforeImage: formData.get('beforeImage') as string,
      afterImage: formData.get('afterImage') as string,
      treatment: formData.get('treatment') as string,
      duration: formData.get('duration') as string,
      results: formData.get('results') as string,
      isActive: formData.get('isActive') === 'true',
      updatedAt: new Date()
    };

    galleryItems[itemIndex] = updatedItem;

    return NextResponse.json({
      success: true,
      item: updatedItem
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'No gallery item ID provided' },
        { status: 400 }
      );
    }

    const itemIndex = galleryItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    galleryItems.splice(itemIndex, 1);

    // Reorder remaining items
    galleryItems.forEach((item, index) => {
      item.order = index + 1;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
} 