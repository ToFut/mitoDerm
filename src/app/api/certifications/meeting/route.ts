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
      certificationId,
      meetingDate,
      meetingType,
      meetingLink,
      meetingLocation,
      notes
    } = body;

    if (!certificationId || !meetingDate || !meetingType) {
      return NextResponse.json(
        { error: 'Certification ID, meeting date, and meeting type are required' },
        { status: 400 }
      );
    }

    // Schedule meeting
    const meetingId = await certificationService.scheduleMeeting(
      certificationId,
      new Date(meetingDate),
      meetingType,
      meetingLink,
      meetingLocation,
      notes
    );

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Failed to schedule meeting' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Meeting scheduled successfully',
        meetingId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Meeting scheduling error:', error);
    return NextResponse.json(
      { error: 'An error occurred while scheduling meeting' },
      { status: 500 }
    );
  }
} 