export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  type: 'conference' | 'workshop' | 'webinar' | 'product_launch' | 'training';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  
  // Date and Location
  startDate: Date;
  endDate: Date;
  timezone: string;
  location: {
    type: 'physical' | 'virtual' | 'hybrid';
    venue?: string;
    address?: string;
    city?: string;
    country?: string;
    virtualLink?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Event Details
  agenda: EventAgendaItem[];
  speakers: EventSpeaker[];
  pricing: EventPricing[];
  capacity: {
    total: number;
    reserved: number;
    available: number;
  };
  
  // Media
  coverImage: string;
  coverVideo?: string; // Main event video URL
  gallery: EventMedia[];
  videos: EventMedia[];
  
  // Registration
  registrationDeadline: Date;
  requiresApproval: boolean;
  allowWaitlist: boolean;
  
  // Targeting
  targetAudience: string[];
  tags: string[];
  categories: string[];
  
  // Administrative
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  organizer: EventOrganizer;
  
  // Features
  features: EventFeature[];
  requirements: string[];
  
  // SEO
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface EventAgendaItem {
  id: string;
  title: string;
  description?: string;
  startTime: string; // HH:MM format
  endTime: string;
  day: number; // Day of the event (1, 2, 3...)
  speaker?: string;
  location?: string;
  type: 'presentation' | 'workshop' | 'break' | 'networking' | 'demo';
  materials?: EventMaterial[];
}

export interface EventSpeaker {
  id: string;
  name: string;
  title: string;
  company?: string;
  bio: string;
  avatar: string;
  expertise: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  sessions: string[]; // agenda item IDs
}

export interface EventPricing {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  available: number;
  earlyBird?: {
    price: number;
    deadline: Date;
  };
  isDefault: boolean;
}

export interface EventMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  order: number;
}

export interface EventOrganizer {
  name: string;
  email: string;
  phone?: string;
  company: string;
  website?: string;
}

export interface EventFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  included: boolean;
}

export interface EventMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'image';
  url: string;
  description?: string;
  downloadable: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string;
  attendeeInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    title?: string;
    dietary?: string;
    accessibility?: string;
  };
  pricingId: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  registrationDate: Date;
  approvalNotes?: string;
  paymentId?: string;
  invitationCode?: string;
  
  // Admin fields
  reviewedBy?: string;
  reviewedAt?: Date;
  internalNotes?: string;
}

export interface EventInvitation {
  id: string;
  eventId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  invitationType: 'personal' | 'bulk' | 'vip';
  status: 'sent' | 'opened' | 'registered' | 'declined';
  sentAt: Date;
  openedAt?: Date;
  respondedAt?: Date;
  invitationCode: string;
  customMessage?: string;
  
  // Tracking
  emailOpened: boolean;
  linkClicked: boolean;
  registrationCompleted: boolean;
}

export interface EventStats {
  eventId: string;
  totalViews: number;
  uniqueVisitors: number;
  registrations: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  invitations: {
    sent: number;
    opened: number;
    registered: number;
  };
  revenue: {
    total: number;
    paid: number;
    pending: number;
  };
  geography: {
    country: string;
    count: number;
  }[];
  referrals: {
    source: string;
    count: number;
  }[];
}