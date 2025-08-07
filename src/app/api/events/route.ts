import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/firebaseAdmin';
import { Event } from '@/lib/types/event';

// GET /api/events - Fetch all events
export async function GET(request: NextRequest) {
  try {
    // Check if Firebase is properly configured
    if (!db) {
      console.warn('Firebase not configured, returning mock data');
      
      // Return mock data for development
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Advanced Exosome Therapy Workshop',
          subtitle: 'Revolutionary Aesthetic Medicine Techniques',
          description: 'Learn the latest advances in exosome therapy for aesthetic medicine. This comprehensive workshop covers theory, practical applications, and hands-on training.',
          type: 'workshop',
          status: 'published',
          startDate: new Date('2024-03-15T09:00:00'),
          endDate: new Date('2024-03-15T17:00:00'),
          timezone: 'Asia/Jerusalem',
          location: {
            type: 'physical',
            venue: 'MitoDerm Training Center',
            address: 'Tel Aviv Convention Center',
            city: 'Tel Aviv',
            country: 'Israel'
          },
          capacity: {
            total: 50,
            reserved: 23,
            available: 27
          },
          coverImage: '/images/events/workshop-hero.jpg',
          registrationDeadline: new Date('2024-03-10T23:59:59'),
          requiresApproval: true,
          allowWaitlist: true,
          targetAudience: ['Dermatologists', 'Aesthetic Practitioners', 'Medical Students'],
          tags: ['workshop', 'training', 'exosomes'],
          categories: ['professional-development'],
          createdBy: 'admin',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15'),
          organizer: {
            name: 'Dr. Sarah Cohen',
            email: 'events@mitoderm.com',
            company: 'MitoDerm',
            phone: '+972-3-1234567'
          },
          agenda: [],
          speakers: [],
          pricing: [
            {
              id: '1',
              name: 'Early Bird',
              price: 299,
              currency: 'USD',
              description: 'Special early registration price',
              features: ['Full day workshop', 'Lunch included', 'Certificate'],
              available: 50,
              earlyBird: {
                price: 249,
                deadline: new Date('2024-03-01')
              },
              isDefault: true
            }
          ],
          gallery: [],
          videos: [],
          features: [],
          requirements: [],
          slug: 'advanced-exosome-therapy-workshop'
        },
        {
          id: '2',
          title: 'Future of Aesthetic Medicine Conference',
          subtitle: 'Innovation, Technology, and Patient Care',
          description: 'Join leading experts for a virtual conference exploring the latest innovations in aesthetic medicine, emerging technologies, and best practices for patient care.',
          type: 'conference',
          status: 'published',
          startDate: new Date('2024-04-20T10:00:00'),
          endDate: new Date('2024-04-20T16:00:00'),
          timezone: 'UTC',
          location: {
            type: 'virtual',
            virtualLink: 'https://zoom.us/webinar/123456789'
          },
          capacity: {
            total: 500,
            reserved: 156,
            available: 344
          },
          coverImage: '/images/events/conference-hero.jpg',
          registrationDeadline: new Date('2024-04-18T23:59:59'),
          requiresApproval: false,
          allowWaitlist: false,
          targetAudience: ['Healthcare Professionals', 'Researchers', 'Industry Leaders'],
          tags: ['conference', 'virtual', 'innovation', 'technology'],
          categories: ['industry-trends'],
          createdBy: 'admin',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-15'),
          organizer: {
            name: 'MitoDerm Events Team',
            email: 'events@mitoderm.com',
            company: 'MitoDerm',
            website: 'https://mitoderm.com'
          },
          agenda: [],
          speakers: [],
          pricing: [
            {
              id: '1',
              name: 'Free Access',
              price: 0,
              currency: 'USD',
              description: 'Complete conference access at no cost',
              features: [
                'Live conference access',
                'Q&A participation',
                'Digital materials',
                'Recording access (7 days)'
              ],
              available: 500,
              isDefault: true
            }
          ],
          gallery: [],
          videos: [],
          features: [],
          requirements: [],
          slug: 'future-aesthetic-medicine-conference'
        }
      ];

      const { searchParams } = new URL(request.url);
      const upcoming = searchParams.get('upcoming');
      
      let events = mockEvents;
      
      // Filter upcoming events if requested
      if (upcoming === 'true') {
        const now = new Date();
        events = events.filter(event => new Date(event.startDate) > now);
      }

      return NextResponse.json({ 
        success: true, 
        events,
        count: events.length,
        note: 'Using mock data - Firebase not configured'
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const upcoming = searchParams.get('upcoming');

    let events = [];
    
    try {
      const eventsRef = db.collection('events');
      let query = eventsRef;
      
      // Check if we have filters that would require composite index
      const hasFilters = (status && status !== 'all') || 
                        (type && type !== 'all') || 
                        (location && location !== 'all');

      // Apply filters first, then order conditionally
      if (status && status !== 'all') {
        query = query.where('status', '==', status);
      }
      if (type && type !== 'all') {
        query = query.where('type', '==', type);
      }
      if (location && location !== 'all') {
        query = query.where('location.type', '==', location);
      }
      
      // Only add orderBy if no filters to avoid composite index requirement
      if (!hasFilters) {
        query = query.orderBy('createdAt', 'desc');
      }

      const snapshot = await query.get();
      events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to ISO strings
        startDate: doc.data().startDate?.toDate?.() ? doc.data().startDate.toDate().toISOString() : doc.data().startDate,
        endDate: doc.data().endDate?.toDate?.() ? doc.data().endDate.toDate().toISOString() : doc.data().endDate,
        registrationDeadline: doc.data().registrationDeadline?.toDate?.() ? doc.data().registrationDeadline.toDate().toISOString() : doc.data().registrationDeadline,
        createdAt: doc.data().createdAt?.toDate?.() ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() ? doc.data().updatedAt.toDate().toISOString() : doc.data().updatedAt,
      }));

      // Client-side sorting when we couldn't sort in Firestore
      if (hasFilters) {
        events.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime(); // Descending order
        });
      }
      
    } catch (error) {
      console.error('Error fetching events from Firebase:', error);
      
      // Return mock data as fallback
      events = [
        {
          id: 'mock-event-1',
          title: 'Mock Workshop - Firebase Index Required',
          subtitle: 'Please create Firebase composite indexes',
          description: 'This is mock data shown because Firebase requires composite indexes for filtered queries.',
          type: type || 'workshop',
          status: status || 'published',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
          timezone: 'Asia/Jerusalem',
          location: {
            type: location || 'physical',
            venue: 'Mock Venue',
            city: 'Tel Aviv',
            country: 'Israel'
          },
          capacity: {
            total: 50,
            reserved: 10,
            available: 40
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    // Filter upcoming events if requested
    if (upcoming === 'true') {
      const now = new Date();
      events = events.filter(event => new Date(event.startDate) > now);
    }

    return NextResponse.json({ 
      success: true, 
      events,
      count: events.length 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is properly configured
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Firebase not configured - cannot create events in development mode' },
        { status: 503 }
      );
    }

    const eventData = await request.json();
    
    // Validate required fields
    if (!eventData.title || !eventData.type || !eventData.startDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, type, startDate' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = eventData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if slug already exists
    const existingEvent = await db.collection('events').where('slug', '==', slug).get();
    if (!existingEvent.empty) {
      return NextResponse.json(
        { success: false, error: 'Event with this title already exists' },
        { status: 400 }
      );
    }

    // Prepare event data with defaults
    const newEvent: Omit<Event, 'id'> = {
      title: eventData.title,
      subtitle: eventData.subtitle || '',
      description: eventData.description || '',
      type: eventData.type,
      status: eventData.status || 'draft',
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate || eventData.startDate),
      timezone: eventData.timezone || 'UTC',
      location: eventData.location || {
        type: 'physical',
        venue: '',
        address: '',
        city: '',
        country: ''
      },
      capacity: eventData.capacity || {
        total: 50,
        reserved: 0,
        available: 50
      },
      coverImage: eventData.coverImage || '/images/events/default-cover.jpg',
      registrationDeadline: new Date(eventData.registrationDeadline || eventData.startDate),
      requiresApproval: eventData.requiresApproval ?? true,
      allowWaitlist: eventData.allowWaitlist ?? true,
      targetAudience: eventData.targetAudience || [],
      tags: eventData.tags || [],
      categories: eventData.categories || [],
      createdBy: eventData.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      organizer: eventData.organizer || {
        name: 'MitoDerm',
        email: 'events@mitoderm.com',
        company: 'MitoDerm'
      },
      agenda: eventData.agenda || [],
      speakers: eventData.speakers || [],
      pricing: eventData.pricing || [{
        id: '1',
        name: 'Standard Registration',
        price: 0,
        currency: 'USD',
        description: 'Free access to the event',
        features: ['Event access', 'Materials'],
        available: 50,
        isDefault: true
      }],
      gallery: eventData.gallery || [],
      videos: eventData.videos || [],
      features: eventData.features || [],
      requirements: eventData.requirements || [],
      slug
    };

    // Add to Firestore
    const docRef = await db.collection('events').add(newEvent);
    
    return NextResponse.json({ 
      success: true, 
      event: { id: docRef.id, ...newEvent },
      message: 'Event created successfully' 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}