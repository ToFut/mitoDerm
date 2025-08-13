'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiUsers, 
  FiArrowRight,
  FiStar,
  FiGlobe,
  FiVideo,
  FiFilter,
  FiSearch,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX
} from 'react-icons/fi';
import { Event } from '@/lib/types/event';
import Link from 'next/link';
import Button from '@/components/sharedUI/Button/Button';
import styles from './events.module.scss';

export default function EventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'conference' | 'workshop' | 'webinar'>('all');
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'physical' | 'virtual' | 'hybrid'>('all');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Fetch all published events (both upcoming and past)
      const response = await fetch('/api/events?status=published');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch events');
      }

      // Convert date strings back to Date objects
      const events = data.events.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        registrationDeadline: new Date(event.registrationDeadline),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }));

      setEvents(events);
      
      // Set featured event (first event with a video, or first event)
      const eventWithVideo = events.find((event: Event) => event.coverVideo);
      setFeaturedEvent(eventWithVideo || events[0] || null);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Fallback to mock data for development
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Advanced Exosome Therapy Workshop',
          subtitle: 'Revolutionary Aesthetic Medicine Techniques',
          description: 'Join us for a comprehensive workshop on the latest advances in exosome therapy for aesthetic medicine. Learn cutting-edge techniques, participate in hands-on training, and network with leading professionals in the field.',
          type: 'workshop',
          status: 'published',
          startDate: new Date('2024-03-15T09:00:00'),
          endDate: new Date('2024-03-15T17:00:00'),
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
            reserved: 23,
            available: 27
          },
          coverImage: '/images/events/workshop-hero.jpg',
          coverVideo: '/videos/eventIntroVideo.webm', // Mock video
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
              title: 'Coffee Break',
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
              title: 'Lead Researcher',
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
                deadline: new Date('2024-03-01')
              },
              isDefault: true
            },
            {
              id: '2',
              name: 'VIP Experience',
              price: 499,
              currency: 'USD',
              description: 'Premium package with exclusive benefits',
              features: [
                'Everything in Standard',
                'Private consultation with speaker',
                'Exclusive materials kit',
                'Priority seating',
                'One-on-one Q&A session'
              ],
              available: 10,
              isDefault: false
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
            },
            {
              id: '3',
              name: 'Networking',
              description: 'Connect with peers and professionals',
              icon: '🤝',
              included: true
            }
          ],
          requirements: [
            'Medical background or relevant experience',
            'Basic understanding of aesthetic procedures',
            'Professional liability insurance recommended'
          ],
          slug: 'advanced-exosome-therapy-workshop'
        }
      ];
      
      setEvents(mockEvents);
      setFeaturedEvent(mockEvents[0]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || event.location.type === selectedLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const upcomingEvents = filteredEvents.filter(event => 
    new Date(event.startDate) > new Date() && event.status === 'published'
  );

  const pastEvents = filteredEvents.filter(event => 
    new Date(event.startDate) <= new Date() && event.status === 'published'
  );

  const handleVideoPlay = () => {
    setVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setVideoPlaying(false);
  };

  const toggleMute = () => {
    setVideoMuted(!videoMuted);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className={styles.eventsPage}>
      {/* Background Effects */}
      <div className={styles.cosmicBackground}>
        <div className={styles.starField} />
        <div className={styles.nebula} />
      </div>

      {/* Hero Video Section */}
      {featuredEvent?.coverVideo && (
        <section className={styles.heroVideoSection}>
          <motion.div
            className={styles.videoContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className={styles.videoWrapper}>
              <video
                src={featuredEvent.coverVideo}
                className={styles.heroVideo}
                poster={featuredEvent.coverImage}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                muted={videoMuted}
                loop
              />
              
              <div className={styles.videoOverlay}>
                <div className={styles.videoContent}>
                  <motion.div
                    className={styles.eventType}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FiStar />
                    Featured Event
                  </motion.div>

                  <motion.h1
                    className={styles.heroTitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {featuredEvent.title}
                  </motion.h1>

                  <motion.p
                    className={styles.heroSubtitle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {featuredEvent.subtitle}
                  </motion.p>

                  <motion.div
                    className={styles.heroDetails}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className={styles.heroDetail}>
                      <FiCalendar />
                      <span>{featuredEvent.startDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}</span>
                    </div>
                    
                    <div className={styles.heroDetail}>
                      <FiClock />
                      <span>{featuredEvent.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <div className={styles.heroDetail}>
                      {featuredEvent.location.type === 'virtual' ? <FiVideo /> : <FiMapPin />}
                      <span>
                        {featuredEvent.location.type === 'virtual' ? 'Virtual Event' : featuredEvent.location.venue}
                      </span>
                    </div>
                    
                    <div className={styles.heroDetail}>
                      <FiUsers />
                      <span>{featuredEvent.capacity.available} spots available</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className={styles.heroCTA}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Link href={`/events/${featuredEvent.slug}`}>
                      <Button
                        variant="primary"
                        size="large"
                        text="Reserve Your Seat"
                      />
                    </Link>
                    
                    <Link href={`/events/${featuredEvent.slug}`}>
                      <Button
                        variant="secondary"
                        size="medium"
                        text="Learn More"
                      />
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Video Controls */}
              <div className={styles.videoControls}>
                <button
                  className={styles.videoControl}
                  onClick={toggleMute}
                  aria-label={videoMuted ? 'Unmute' : 'Mute'}
                >
                  {videoMuted ? <FiVolumeX /> : <FiVolume2 />}
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Search and Filters */}
      <section className={styles.filtersSection}>
        <motion.div
          className={styles.filtersContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className={styles.filterSelect}
            >
              <option value="all">All Types</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="webinar">Webinar</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <FiGlobe className={styles.filterIcon} />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as any)}
              className={styles.filterSelect}
            >
              <option value="all">All Locations</option>
              <option value="physical">In-Person</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </motion.div>
      </section>

      {/* Upcoming Events */}
      <section className={styles.eventsSection}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <p className={styles.sectionSubtitle}>
            Join us for cutting-edge training and networking opportunities
          </p>
        </motion.div>

        <div className={styles.eventsGrid}>
          <AnimatePresence>
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className={styles.eventCard}>
                  <div className={styles.eventCardContent}>
                    <div className={styles.eventCardHeader}>
                      <div className={styles.eventTypeTag}>
                        {event.type}
                      </div>
                      
                      <div className={styles.eventLocationTag}>
                        {event.location.type === 'virtual' ? <FiVideo /> : <FiMapPin />}
                        {event.location.type}
                      </div>
                    </div>

                    <h3 className={styles.eventCardTitle}>{event.title}</h3>
                    
                    {event.subtitle && (
                      <p className={styles.eventCardSubtitle}>{event.subtitle}</p>
                    )}

                    <div className={styles.eventCardDetails}>
                      <div className={styles.eventDetail}>
                        <FiCalendar />
                        <span>{event.startDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}</span>
                      </div>
                      
                      <div className={styles.eventDetail}>
                        <FiClock />
                        <span>{event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className={styles.eventDetail}>
                        <FiUsers />
                        <span>{event.capacity.available} available</span>
                      </div>
                    </div>

                    <div className={styles.eventCardActions}>
                      <Link href={`/events/${event.slug}`}>
                        <Button
                          variant="primary"
                          size="medium"
                          text="Learn More"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {upcomingEvents.length === 0 && (
          <motion.div
            className={styles.noEventsMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>No upcoming events found</h3>
            <p>
              {searchTerm || selectedType !== 'all' || selectedLocation !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Check back soon for upcoming events!'}
            </p>
          </motion.div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className={styles.pastEventsSection}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className={styles.sectionTitle}>Past Events</h2>
            <p className={styles.sectionSubtitle}>
              Relive the highlights from our previous successful events
            </p>
          </motion.div>

          <div className={styles.pastEventsGrid}>
            <AnimatePresence>
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className={styles.pastEventCard}>
                    <div className={styles.pastEventImage}>
                      <img 
                        src={event.coverImage} 
                        alt={event.title}
                        className={styles.eventImage}
                      />
                      {event.coverVideo && (
                        <div className={styles.videoIndicator}>
                          <FiVideo />
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.pastEventContent}>
                      <div className={styles.pastEventHeader}>
                        <div className={styles.eventTypeTag}>
                          {event.type}
                        </div>
                        <div className={styles.eventDate}>
                          {event.startDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
                        </div>
                      </div>

                      <h3 className={styles.pastEventTitle}>{event.title}</h3>
                      
                      {event.subtitle && (
                        <p className={styles.pastEventSubtitle}>{event.subtitle}</p>
                      )}

                      <div className={styles.pastEventStats}>
                        <div className={styles.stat}>
                          <FiUsers />
                          <span>{event.capacity.total} attendees</span>
                        </div>
                        <div className={styles.stat}>
                          <FiMapPin />
                          <span>{event.location.type}</span>
                        </div>
                      </div>

                      <div className={styles.pastEventActions}>
                        <Link href={`/events/${event.slug}`}>
                          <Button
                            variant="secondary"
                            size="small"
                            text="View Details"
                          />
                        </Link>
                        {event.coverVideo && (
                          <button className={styles.watchVideoButton}>
                            <FiPlay />
                            Watch Video
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className={styles.ctaTitle}>Stay Updated</h2>
          <p className={styles.ctaDescription}>
            Get notified about new events, training opportunities, and exclusive workshops
          </p>
          
          <Button
            variant="primary"
            size="large"
            text="Subscribe to Updates"
          />
        </motion.div>
      </section>
    </div>
  );
}