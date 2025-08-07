import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, EventRegistration, EventFeedback, EventType, EventStatus, EventVisibility } from '@/types';
import { userService } from './userService';

// Re-export Event type for convenience
export type { Event };

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }
  return { db };
};

class EventService {
  // Create new event
  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      
      const eventDoc = {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        registeredCount: 0,
        waitlistCount: 0,
        analytics: {
          views: 0,
          registrations: 0,
          attendance: 0,
          completionRate: 0,
          averageRating: 0,
          revenue: 0
        }
      };

      const docRef = await addDoc(collection(db, 'events'), eventDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  // Get event by ID
  async getEvent(eventId: string): Promise<Event | null> {
    try {
      const { db } = checkFirebase();
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      
      if (eventSnap.exists()) {
        return {
          id: eventSnap.id,
          ...eventSnap.data()
        } as Event;
      }
      return null;
    } catch (error) {
      console.error('Error getting event:', error);
      return null;
    }
  }

  // Get all events
  async getEvents(filters?: {
    type?: EventType;
    status?: EventStatus;
    visibility?: EventVisibility;
    upcoming?: boolean;
  }): Promise<Event[]> {
    try {
      const { db } = checkFirebase();
      const eventsRef = collection(db, 'events');
      let q = query(eventsRef, orderBy('startDate', 'asc'));

      // Apply filters
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.visibility) {
        q = query(q, where('visibility', '==', filters.visibility));
      }

      const querySnapshot = await getDocs(q);
      let events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];

      // Filter upcoming events
      if (filters?.upcoming) {
        const now = new Date().toISOString();
        events = events.filter(event => event.startDate > now);
      }

      return events;
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  // Update event
  async updateEvent(eventId: string, updates: Partial<Event>): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  }

  // Delete event
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  // Register for event
  async registerForEvent(
    eventId: string, 
    userId: string, 
    paymentAmount: number = 0,
    notes?: string
  ): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      
      // Check if user is already registered
      const existingRegistration = await this.getUserEventRegistration(eventId, userId);
      if (existingRegistration) {
        throw new Error('User already registered for this event');
      }

      // Get event details
      const event = await this.getEvent(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Check capacity
      const status = event.registeredCount >= event.capacity ? 'waitlist' : 'registered';

      const registrationDoc = {
        eventId,
        userId,
        status,
        registrationDate: new Date().toISOString(),
        paymentStatus: paymentAmount > 0 ? 'pending' : 'paid',
        paymentAmount,
        notes: notes || '',
        feedbackSubmitted: false
      };

      const docRef = await addDoc(collection(db, 'event_registrations'), registrationDoc);

      // Update event counts
      if (status === 'registered') {
        await this.updateEvent(eventId, {
          registeredCount: event.registeredCount + 1,
          analytics: {
            ...event.analytics,
            registrations: event.analytics.registrations + 1
          }
        });
      } else {
        await this.updateEvent(eventId, {
          waitlistCount: event.waitlistCount + 1
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error registering for event:', error);
      return null;
    }
  }

  // Cancel event registration
  async cancelEventRegistration(registrationId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const registrationRef = doc(db, 'event_registrations', registrationId);
      const registration = await getDoc(registrationRef);
      
      if (!registration.exists()) {
        return false;
      }

      const regData = registration.data() as EventRegistration;
      
      // Update registration status
      await updateDoc(registrationRef, {
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });

      // Update event counts
      const event = await this.getEvent(regData.eventId);
      if (event) {
        if (regData.status === 'registered') {
          await this.updateEvent(regData.eventId, {
            registeredCount: Math.max(0, event.registeredCount - 1)
          });
        } else if (regData.status === 'waitlist') {
          await this.updateEvent(regData.eventId, {
            waitlistCount: Math.max(0, event.waitlistCount - 1)
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Error cancelling event registration:', error);
      return false;
    }
  }

  // Get user's event registration
  async getUserEventRegistration(eventId: string, userId: string): Promise<EventRegistration | null> {
    try {
      const { db } = checkFirebase();
      const registrationsRef = collection(db, 'event_registrations');
      const q = query(
        registrationsRef,
        where('eventId', '==', eventId),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as EventRegistration;
      }
      return null;
    } catch (error) {
      console.error('Error getting user event registration:', error);
      return null;
    }
  }

  // Get event registrations
  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    try {
      const { db } = checkFirebase();
      const registrationsRef = collection(db, 'event_registrations');
      const q = query(
        registrationsRef,
        where('eventId', '==', eventId),
        orderBy('registrationDate', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EventRegistration[];
    } catch (error) {
      console.error('Error getting event registrations:', error);
      return [];
    }
  }

  // Get user's event registrations
  async getUserEventRegistrations(userId: string): Promise<EventRegistration[]> {
    try {
      const { db } = checkFirebase();
      const registrationsRef = collection(db, 'event_registrations');
      const q = query(
        registrationsRef,
        where('userId', '==', userId),
        orderBy('registrationDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EventRegistration[];
    } catch (error) {
      console.error('Error getting user event registrations:', error);
      return [];
    }
  }

  // Check in attendee
  async checkInAttendee(registrationId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const registrationRef = doc(db, 'event_registrations', registrationId);
      const registration = await getDoc(registrationRef);
      
      if (!registration.exists()) {
        return false;
      }

      await updateDoc(registrationRef, {
        status: 'attended',
        checkInTime: new Date().toISOString()
      });

      // Update user stats
      const regData = registration.data() as EventRegistration;
      await userService.incrementUserStat(regData.userId, 'eventsAttended');

      return true;
    } catch (error) {
      console.error('Error checking in attendee:', error);
      return false;
    }
  }

  // Submit event feedback
  async submitEventFeedback(
    eventId: string,
    userId: string,
    rating: number,
    comments: string,
    categories: Record<string, number>
  ): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      
      const feedbackDoc = {
        eventId,
        userId,
        rating,
        comments,
        categories,
        submittedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'event_feedback'), feedbackDoc);

      // Update registration to mark feedback as submitted
      const registration = await this.getUserEventRegistration(eventId, userId);
      if (registration) {
        const registrationRef = doc(db, 'event_registrations', registration.id);
        await updateDoc(registrationRef, {
          feedbackSubmitted: true
        });
      }

      // Update event analytics
      await this.updateEventAnalytics(eventId);

      return true;
    } catch (error) {
      console.error('Error submitting event feedback:', error);
      return false;
    }
  }

  // Get event feedback
  async getEventFeedback(eventId: string): Promise<EventFeedback[]> {
    try {
      const { db } = checkFirebase();
      const feedbackRef = collection(db, 'event_feedback');
      const q = query(
        feedbackRef,
        where('eventId', '==', eventId),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EventFeedback[];
    } catch (error) {
      console.error('Error getting event feedback:', error);
      return [];
    }
  }

  // Update event analytics
  async updateEventAnalytics(eventId: string): Promise<boolean> {
    try {
      const event = await this.getEvent(eventId);
      if (!event) return false;

      const registrations = await this.getEventRegistrations(eventId);
      const feedback = await this.getEventFeedback(eventId);
      
      const attendedCount = registrations.filter(r => r.status === 'attended').length;
      const averageRating = feedback.length > 0 
        ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
        : 0;
      const revenue = registrations
        .filter(r => r.paymentStatus === 'paid')
        .reduce((sum, r) => sum + r.paymentAmount, 0);

      const analytics = {
        views: event.analytics.views, // This would be updated elsewhere
        registrations: registrations.length,
        attendance: attendedCount,
        completionRate: registrations.length > 0 ? (attendedCount / registrations.length) * 100 : 0,
        averageRating,
        revenue
      };

      await this.updateEvent(eventId, { analytics });
      return true;
    } catch (error) {
      console.error('Error updating event analytics:', error);
      return false;
    }
  }

  // Search events
  async searchEvents(searchTerm: string, filters?: {
    type?: EventType;
    upcoming?: boolean;
  }): Promise<Event[]> {
    try {
      const events = await this.getEvents(filters);
      
      if (!searchTerm) return events;

      const term = searchTerm.toLowerCase();
      return events.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.category.toLowerCase().includes(term) ||
        event.tags.some(tag => tag.toLowerCase().includes(term)) ||
        event.speakers.some(speaker => 
          speaker.name.toLowerCase().includes(term) ||
          speaker.company?.toLowerCase().includes(term)
        )
      );
    } catch (error) {
      console.error('Error searching events:', error);
      return [];
    }
  }

  // Get event statistics
  async getEventStats(): Promise<{
    totalEvents: number;
    upcomingEvents: number;
    totalRegistrations: number;
    totalRevenue: number;
    eventsByType: Record<EventType, number>;
    eventsByStatus: Record<EventStatus, number>;
    averageAttendance: number;
    averageRating: number;
  }> {
    try {
      const events = await this.getEvents();
      const now = new Date().toISOString();
      
      const stats = {
        totalEvents: events.length,
        upcomingEvents: events.filter(e => e.startDate > now).length,
        totalRegistrations: events.reduce((sum, e) => sum + e.registeredCount, 0),
        totalRevenue: events.reduce((sum, e) => sum + e.analytics.revenue, 0),
        eventsByType: {} as Record<EventType, number>,
        eventsByStatus: {} as Record<EventStatus, number>,
        averageAttendance: 0,
        averageRating: 0
      };

      // Count by type and status
      events.forEach(event => {
        stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
        stats.eventsByStatus[event.status] = (stats.eventsByStatus[event.status] || 0) + 1;
      });

      // Calculate averages
      const completedEvents = events.filter(e => e.status === 'completed');
      if (completedEvents.length > 0) {
        stats.averageAttendance = completedEvents.reduce((sum, e) => sum + e.analytics.attendance, 0) / completedEvents.length;
        stats.averageRating = completedEvents.reduce((sum, e) => sum + e.analytics.averageRating, 0) / completedEvents.length;
      }

      return stats;
    } catch (error) {
      console.error('Error getting event stats:', error);
      return {
        totalEvents: 0,
        upcomingEvents: 0,
        totalRegistrations: 0,
        totalRevenue: 0,
        eventsByType: {} as Record<EventType, number>,
        eventsByStatus: {} as Record<EventStatus, number>,
        averageAttendance: 0,
        averageRating: 0
      };
    }
  }

  // Real-time events listener
  subscribeToEvents(callback: (events: Event[]) => void): () => void {
    try {
      const { db } = checkFirebase();
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('startDate', 'asc'));

      return onSnapshot(q, (querySnapshot) => {
        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        callback(events);
      });
    } catch (error) {
      console.error('Error setting up events listener:', error);
      return () => {};
    }
  }
}

export const eventService = new EventService();

// Helper functions
export const getEventStatusColor = (status: EventStatus): string => {
  const colors = {
    draft: '#6b7280',
    published: '#10b981',
    cancelled: '#ef4444',
    completed: '#3b82f6'
  };
  return colors[status] || '#6b7280';
};

export const getEventTypeIcon = (type: EventType): string => {
  const icons = {
    workshop: '🛠️',
    webinar: '💻',
    conference: '🎯',
    training: '📚',
    product_launch: '🚀',
    networking: '🤝'
  };
  return icons[type] || '📅';
};

export const formatEventDate = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.toDateString() === end.toDateString()) {
    return `${start.toLocaleDateString()} ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`;
  } else {
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
};

export const isEventUpcoming = (startDate: string): boolean => {
  return new Date(startDate) > new Date();
};

export const canRegisterForEvent = (event: Event): boolean => {
  const now = new Date().toISOString();
  return event.status === 'published' && 
         event.registrationSettings.isOpen &&
         (!event.registrationSettings.closeDate || event.registrationSettings.closeDate > now) &&
         event.startDate > now;
};