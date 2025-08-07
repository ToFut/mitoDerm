import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../lib/firebaseAdmin';

// PUT /api/events/registrations/[id] - Update registration status (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, rejectionReason } = await request.json();
    
    // Validate status
    if (!['approved', 'rejected', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be approved, rejected, or cancelled' },
        { status: 400 }
      );
    }

    // Check if registration exists
    const registrationDoc = await db.collection('eventRegistrations').doc(id).get();
    if (!registrationDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    const registrationData = registrationDoc.data();
    const oldStatus = registrationData?.status;

    // Update registration status
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    await db.collection('eventRegistrations').doc(id).update(updateData);

    // Update event capacity if status changed from pending to approved/rejected
    if (oldStatus === 'pending' && (status === 'approved' || status === 'rejected')) {
      const eventDoc = await db.collection('events').doc(registrationData?.eventId).get();
      if (eventDoc.exists) {
        const eventData = eventDoc.data();
        let capacityUpdate = {};

        if (status === 'rejected') {
          // Free up the reserved spot
          const newReserved = Math.max(0, (eventData?.capacity?.reserved || 0) - 1);
          const newAvailable = Math.min(
            eventData?.capacity?.total || 0,
            (eventData?.capacity?.available || 0) + 1
          );
          capacityUpdate = {
            'capacity.reserved': newReserved,
            'capacity.available': newAvailable
          };
        }
        // If approved, capacity stays the same (was already reserved)

        if (Object.keys(capacityUpdate).length > 0) {
          await db.collection('events').doc(registrationData?.eventId).update({
            ...capacityUpdate,
            updatedAt: new Date()
          });
        }
      }
    }

    // Fetch updated registration
    const updatedDoc = await db.collection('eventRegistrations').doc(id).get();
    const updatedData = updatedDoc.data();
    const updatedRegistration = {
      id: updatedDoc.id,
      ...updatedData,
      registrationDate: updatedData?.registrationDate?.toDate?.() 
        ? updatedData.registrationDate.toDate().toISOString() 
        : updatedData?.registrationDate,
    };

    return NextResponse.json({ 
      success: true, 
      registration: updatedRegistration,
      message: `Registration ${status} successfully` 
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/registrations/[id] - Delete registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if registration exists
    const registrationDoc = await db.collection('eventRegistrations').doc(id).get();
    if (!registrationDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    const registrationData = registrationDoc.data();

    // Update event capacity
    const eventDoc = await db.collection('events').doc(registrationData?.eventId).get();
    if (eventDoc.exists) {
      const eventData = eventDoc.data();
      const newReserved = Math.max(0, (eventData?.capacity?.reserved || 0) - 1);
      const newAvailable = Math.min(
        eventData?.capacity?.total || 0,
        (eventData?.capacity?.available || 0) + 1
      );

      await db.collection('events').doc(registrationData?.eventId).update({
        'capacity.reserved': newReserved,
        'capacity.available': newAvailable,
        updatedAt: new Date()
      });
    }

    // Delete the registration
    await db.collection('eventRegistrations').doc(id).delete();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Registration deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}