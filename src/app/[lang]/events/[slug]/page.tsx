import { unstable_setRequestLocale } from 'next-intl/server';
import EventDetailClient from './EventDetailClient';

// Fetch event by slug from API
async function getEventBySlug(slug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3020';
    const response = await fetch(`${baseUrl}/api/events/slug/${slug}`, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      console.error('Failed to fetch event:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('API error:', data.error);
      return null;
    }
    
    // Convert date strings back to Date objects
    const event = {
      ...data.event,
      startDate: new Date(data.event.startDate),
      endDate: new Date(data.event.endDate),
      registrationDeadline: new Date(data.event.registrationDeadline),
      createdAt: new Date(data.event.createdAt),
      updatedAt: new Date(data.event.updatedAt),
    };
    
    return event;
  } catch (error) {
    console.error('Error fetching event:', error);
    // Return a simplified mock event for development
    return {
      id: '1',
      title: 'Advanced Exosome Therapy Workshop',
      subtitle: 'Revolutionary Aesthetic Medicine Techniques',
      description: 'Join us for a comprehensive workshop on the latest advances in exosome therapy for aesthetic medicine.',
      type: 'workshop' as const,
      status: 'published' as const,
      startDate: new Date('2024-03-15T09:00:00'),
      endDate: new Date('2024-03-15T17:00:00'),
      timezone: 'Asia/Jerusalem',
      location: {
        type: 'physical' as const,
        venue: 'MitoDerm Training Center',
        address: 'Tel Aviv Convention Center, Hall A',
        city: 'Tel Aviv',
        country: 'Israel',
        coordinates: { lat: 32.0853, lng: 34.7818 }
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
      tags: ['workshop', 'training', 'exosomes', 'hands-on'],
      categories: ['professional-development'],
      createdBy: 'admin',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      organizer: {
        name: 'Dr. Sarah Cohen',
        email: 'events@mitoderm.com',
        company: 'MitoDerm',
        phone: '+972-3-1234567',
        website: 'https://mitoderm.com'
      },
      agenda: [],
      speakers: [],
      pricing: [
        {
          id: '1',
          name: 'Standard Registration',
          price: 299,
          currency: 'USD',
          description: 'Full workshop access with materials',
          features: ['Full day workshop access', 'All training materials', 'Certificate of completion'],
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
    };
  }
}

export default async function EventDetailPage(props: { 
  params: Promise<{ lang: string; slug: string }> 
}) {
  const params = await props.params;
  unstable_setRequestLocale(params.lang);
  
  const event = await getEventBySlug(params.slug);
  
  if (!event) {
    return <div>Event not found</div>;
  }
  
  return <EventDetailClient event={event} />;
}