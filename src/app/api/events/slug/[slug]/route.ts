import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../lib/firebaseAdmin';

// GET /api/events/slug/[slug] - Fetch event by slug for public pages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const eventsSnapshot = await db.collection('events')
      .where('slug', '==', slug)
      .where('status', '==', 'published') // Only return published events
      .limit(1)
      .get();
    
    if (eventsSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const eventDoc = eventsSnapshot.docs[0];
    const eventData = eventDoc.data();
    const event = {
      id: eventDoc.id,
      ...eventData,
      // Convert Firestore timestamps to ISO strings
      startDate: eventData?.startDate?.toDate?.() ? eventData.startDate.toDate().toISOString() : eventData?.startDate,
      endDate: eventData?.endDate?.toDate?.() ? eventData.endDate.toDate().toISOString() : eventData?.endDate,
      registrationDeadline: eventData?.registrationDeadline?.toDate?.() ? eventData.registrationDeadline.toDate().toISOString() : eventData?.registrationDeadline,
      createdAt: eventData?.createdAt?.toDate?.() ? eventData.createdAt.toDate().toISOString() : eventData?.createdAt,
      updatedAt: eventData?.updatedAt?.toDate?.() ? eventData.updatedAt.toDate().toISOString() : eventData?.updatedAt,
    };

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}