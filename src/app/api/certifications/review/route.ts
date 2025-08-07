import { NextRequest, NextResponse } from 'next/server';
import { certificationService } from '@/lib/services/certificationService';
import { getServerSession } from 'next-auth';
import authOptions from '@/pages/api/auth/[...nextauth]';
import { Session } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin (you can implement your own admin check)
    const adminEmails = ['admin@mitoderm.com', 'segev@mitoderm.com']; // Add your admin emails
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      certificationId,
      status,
      reviewNotes
    } = body;

    if (!certificationId || !status || !reviewNotes) {
      return NextResponse.json(
        { error: 'Certification ID, status, and review notes are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "approved" or "rejected"' },
        { status: 400 }
      );
    }

    // Review certification
    const success = await certificationService.reviewCertification(
      certificationId,
      status,
      session.user.email,
      session.user.name || 'Admin',
      reviewNotes
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to review certification' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Certification ${status} successfully`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Certification review error:', error);
    return NextResponse.json(
      { error: 'An error occurred while reviewing certification' },
      { status: 500 }
    );
  }
} 