import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      video: ['video/mp4', 'video/webm', 'video/mov']
    };

    if (type === 'image' && !allowedTypes.image.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 });
    }

    if (type === 'video' && !allowedTypes.video.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid video file type' }, { status: 400 });
    }

    // Validate file size (50MB max for videos, 10MB for images)
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name);
    const filename = `${type}_${timestamp}_${randomString}${extension}`;

    // Create upload directory structure
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type === 'video' ? 'videos' : 'images');
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    
    // Write file to disk
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${type === 'video' ? 'videos' : 'images'}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}