import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebaseAdmin';
import { Event } from '@/lib/types/event';

// GET /api/events/[id] - Fetch single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const eventDoc = await db.collection('events').doc(id).get();
    
    if (!eventDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

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
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventData = await request.json();
    
    // Check if event exists
    const eventDoc = await db.collection('events').doc(id).get();
    if (!eventDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Update slug if title changed
    let updateData = { ...eventData };
    if (eventData.title) {
      const newSlug = eventData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      // Check if new slug conflicts with existing events (excluding current)
      const existingEvent = await db.collection('events')
        .where('slug', '==', newSlug)
        .get();
      
      const hasConflict = existingEvent.docs.some(doc => doc.id !== id);
      if (hasConflict) {
        return NextResponse.json(
          { success: false, error: 'Event with this title already exists' },
          { status: 400 }
        );
      }
      
      updateData.slug = newSlug;
    }

    // Convert date strings to Date objects for Firestore
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.registrationDeadline) updateData.registrationDeadline = new Date(updateData.registrationDeadline);
    
    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date();

    // Update in Firestore
    await db.collection('events').doc(id).update(updateData);
    
    // Fetch updated event
    const updatedDoc = await db.collection('events').doc(id).get();
    const updatedData = updatedDoc.data();
    const updatedEvent = {
      id: updatedDoc.id,
      ...updatedData,
      // Convert timestamps back to ISO strings for response
      startDate: updatedData?.startDate?.toDate?.() ? updatedData.startDate.toDate().toISOString() : updatedData?.startDate,
      endDate: updatedData?.endDate?.toDate?.() ? updatedData.endDate.toDate().toISOString() : updatedData?.endDate,
      registrationDeadline: updatedData?.registrationDeadline?.toDate?.() ? updatedData.registrationDeadline.toDate().toISOString() : updatedData?.registrationDeadline,
      createdAt: updatedData?.createdAt?.toDate?.() ? updatedData.createdAt.toDate().toISOString() : updatedData?.createdAt,
      updatedAt: updatedData?.updatedAt?.toDate?.() ? updatedData.updatedAt.toDate().toISOString() : updatedData?.updatedAt,
    };
    
    return NextResponse.json({ 
      success: true, 
      event: updatedEvent,
      message: 'Event updated successfully' 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if event exists
    const eventDoc = await db.collection('events').doc(id).get();
    if (!eventDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if there are any registrations for this event
    const registrationsSnapshot = await db.collection('eventRegistrations')
      .where('eventId', '==', id)
      .get();

    if (!registrationsSnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete event with existing registrations' },
        { status: 400 }
      );
    }

    // Delete the event
    await db.collection('events').doc(id).delete();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}