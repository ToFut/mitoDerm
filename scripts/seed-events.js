// Seed script to populate initial event data
// Usage: node scripts/seed-events.js

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

const sampleEvents = [
  {
    title: 'Advanced Exosome Therapy Workshop',
    subtitle: 'Revolutionary Aesthetic Medicine Techniques',
    description: 'Join us for a comprehensive workshop on the latest advances in exosome therapy for aesthetic medicine. Learn cutting-edge techniques, participate in hands-on training, and network with leading professionals in the field.',
    type: 'workshop',
    status: 'published',
    startDate: new Date('2024-04-15T09:00:00Z'),
    endDate: new Date('2024-04-15T17:00:00Z'),
    timezone: 'Asia/Jerusalem',
    location: {
      type: 'physical',
      venue: 'MitoDerm Training Center',
      address: 'Tel Aviv Convention Center, Hall A',
      city: 'Tel Aviv',
      country: 'Israel',
      coordinates: { lat: 32.0853, lng: 34.7818 }
    },
    capacity: {
      total: 50,
      reserved: 0,
      available: 50
    },
    coverImage: '/images/events/workshop-hero.jpg',
    registrationDeadline: new Date('2024-04-10T23:59:59Z'),
    requiresApproval: true,
    allowWaitlist: true,
    targetAudience: ['Dermatologists', 'Aesthetic Practitioners', 'Medical Students'],
    tags: ['workshop', 'training', 'exosomes', 'hands-on'],
    categories: ['professional-development'],
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    organizer: {
      name: 'Dr. Sarah Cohen',
      email: 'events@mitoderm.com',
      company: 'MitoDerm',
      phone: '+972-3-1234567',
      website: 'https://mitoderm.com'
    },
    agenda: [
      {
        id: '1',
        title: 'Introduction to Exosome Therapy',
        description: 'Understanding the science behind synthetic exosomes',
        startTime: '09:00',
        endTime: '10:30',
        day: 1,
        speaker: 'Dr. Sarah Cohen',
        type: 'presentation',
        materials: []
      },
      {
        id: '2',
        title: 'Coffee Break & Networking',
        description: 'Network with fellow practitioners',
        startTime: '10:30',
        endTime: '11:00',
        day: 1,
        type: 'break',
        materials: []
      },
      {
        id: '3',
        title: 'Hands-on Training Session',
        description: 'Practical application techniques',
        startTime: '11:00',
        endTime: '12:30',
        day: 1,
        speaker: 'Dr. Michael Johnson',
        type: 'workshop',
        materials: []
      }
    ],
    speakers: [
      {
        id: '1',
        name: 'Dr. Sarah Cohen',
        title: 'Lead Researcher & Clinical Director',
        company: 'MitoDerm',
        bio: 'Leading expert in exosome therapy with over 15 years of experience in aesthetic medicine.',
        avatar: '/images/speakers/sarah-cohen.jpg',
        expertise: ['Exosome Therapy', 'Aesthetic Medicine', 'Research'],
        social: {
          linkedin: 'https://linkedin.com/in/sarahcohen',
          website: 'https://mitoderm.com'
        },
        sessions: ['1']
      }
    ],
    pricing: [
      {
        id: '1',
        name: 'Standard Registration',
        price: 299,
        currency: 'USD',
        description: 'Full workshop access with materials',
        features: [
          'Full day workshop access',
          'All training materials',
          'Lunch and refreshments',
          'Certificate of completion',
          'Networking session'
        ],
        available: 50,
        earlyBird: {
          price: 249,
          deadline: new Date('2024-04-01T00:00:00Z')
        },
        isDefault: true
      }
    ],
    gallery: [],
    videos: [],
    features: [
      {
        id: '1',
        name: 'Hands-on Training',
        description: 'Practical experience with real equipment',
        icon: '🔬',
        included: true
      },
      {
        id: '2',
        name: 'Expert Speakers',
        description: 'Learn from industry leaders',
        icon: '👨‍⚕️',
        included: true
      }
    ],
    requirements: [
      'Medical background or relevant experience',
      'Basic understanding of aesthetic procedures'
    ],
    slug: 'advanced-exosome-therapy-workshop'
  },
  {
    title: 'Future of Aesthetic Medicine Conference',
    subtitle: 'Innovation, Technology, and Patient Care',
    description: 'Join leading experts for a virtual conference exploring the latest innovations in aesthetic medicine, emerging technologies, and best practices for patient care.',
    type: 'conference',
    status: 'published',
    startDate: new Date('2024-05-20T10:00:00Z'),
    endDate: new Date('2024-05-20T16:00:00Z'),
    timezone: 'UTC',
    location: {
      type: 'virtual',
      virtualLink: 'https://zoom.us/webinar/123456789'
    },
    capacity: {
      total: 500,
      reserved: 0,
      available: 500
    },
    coverImage: '/images/events/conference-hero.jpg',
    registrationDeadline: new Date('2024-05-18T23:59:59Z'),
    requiresApproval: false,
    allowWaitlist: false,
    targetAudience: ['Healthcare Professionals', 'Researchers', 'Industry Leaders'],
    tags: ['conference', 'virtual', 'innovation', 'technology'],
    categories: ['industry-trends'],
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
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

async function seedEvents() {
  try {
    console.log('Starting to seed events...');
    
    for (const eventData of sampleEvents) {
      // Check if event with this slug already exists
      const existingEvent = await db.collection('events').where('slug', '==', eventData.slug).get();
      
      if (!existingEvent.empty) {
        console.log(`Event '${eventData.title}' already exists, skipping...`);
        continue;
      }
      
      // Add event to Firestore
      const docRef = await db.collection('events').add(eventData);
      console.log(`Created event '${eventData.title}' with ID: ${docRef.id}`);
    }
    
    console.log('Events seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();