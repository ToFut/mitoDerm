import { NextRequest, NextResponse } from 'next/server';
import { uploadMedia } from '@/lib/services/mediaService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Validate that files are present
    const files = formData.getAll('files') as File[];
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Get category from form data
    const category = formData.get('category') as string || 'education';

    // Validate file types
    const allowedTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        );
      }

      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 100MB` },
          { status: 400 }
        );
      }
    }

    // Upload files with category
    const uploadedItems = await uploadMedia(formData);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedItems.length} files to category: ${category}`,
      files: uploadedItems,
      category: category
    });

  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media files' },
      { status: 500 }
    );
  }
} 