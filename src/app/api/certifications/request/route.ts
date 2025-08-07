import { NextRequest, NextResponse } from 'next/server';
import { certificationService } from '@/lib/services/certificationService';
import { auth } from '@/lib/auth';
import { Session } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth() as Session | null;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      certificationLevel = 'basic',
      documents = [],
      userProfile = {}
    } = body;

    // Create certification request
    const certificationId = await certificationService.createCertificationRequest(
      session.user.email, // Using email as userId for now
      session.user.email,
      session.user.name || 'Unknown User',
      userProfile,
      certificationLevel,
      documents
    );

    if (!certificationId) {
      return NextResponse.json(
        { error: 'Failed to create certification request' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Certification request submitted successfully',
        certificationId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Certification request error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting certification request' },
      { status: 500 }
    );
  }
} 