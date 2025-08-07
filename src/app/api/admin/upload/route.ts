import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Admin users list - in production, this should be in a database
const ADMIN_USERS = [
  'admin@mitoderm.com',
  'shiri@mitoderm.com',
  'segev@futurixs.com',
  'ilona@mitoderm.co.il'
];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request });
    
    if (!token?.email || !ADMIN_USERS.includes(token.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'video' or 'image'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid video file type' }, { status: 400 });
    }
    
    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 });
    }

    // Validate file size (max 100MB for videos, 10MB for images)
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${type}_${timestamp}.${extension}`;

    // In a real application, you would upload to a cloud storage service
    // For now, we'll just return a success response with the filename
    const uploadUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      filename,
      url: uploadUrl,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
} 