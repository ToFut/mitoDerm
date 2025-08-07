'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiCalendar, FiClock, FiMapPin, FiUsers, FiStar, FiHeart, FiShare2,
  FiEye, FiTrendingUp, FiZap, FiAward, FiTarget, FiGift, FiMic,
  FiVideo, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize,
  FiChevronDown, FiChevronUp, FiX, FiFilter, FiGrid, FiList,
  FiSearch, FiBookmark, FiTag, FiDollarSign, FiArrowRight,
  FiCheckCircle, FiCpu, FiLayers, FiMonitor, FiWifi,
  FiCoffee, FiShield, FiPackage, FiHeadphones, FiCamera
} from 'react-icons/fi';
import styles from './EventsEnhanced.module.scss';
import { Event } from '@/lib/services/eventService';
import { eventService } from '@/lib/services/eventService';

interface EventsEnhancedProps {
  initialEvents?: Event[];
}

const EventsEnhanced = ({ initialEvents = [] }: EventsEnhancedProps) => {
  const t = useTranslations();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Video player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Filter and view states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Interactive states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [quickViewEvent, setQuickViewEvent] = useState<Event | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  
  // Animation refs
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Mock upcoming events data
  useEffect(() => {
    if (events.length === 0) {
      setIsLoading(true);
      // Simulate API call with mock data
      setTimeout(() => {
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Advanced Dermatology Masterclass',
            titleTranslations: {
              en: 'Advanced Dermatology Masterclass',
              he: 'מאסטרקלאס דרמטולוגיה מתקדמת',
              ru: 'Мастер-класс по продвинутой дерматологии'
            },
            description: 'Join leading dermatologists for an intensive 8-hour masterclass covering the latest advances in aesthetic medicine, skin treatments, and professional techniques.',
            descriptionTranslations: {
              en: 'Join leading dermatologists for an intensive 8-hour masterclass covering the latest advances in aesthetic medicine, skin treatments, and professional techniques.',
              he: 'הצטרפו לדרמטולוגים מובילים למאסטרקלאס אינטנסיבי של 8 שעות המכסה את ההתקדמויות האחרונות ברפואה אסתטית.',
              ru: 'Присоединяйтесь к ведущим дерматологам на интенсивном 8-часовом мастер-классе.'
            },
            shortDescription: 'Intensive 8-hour masterclass for professionals',
            type: 'training',
            category: 'Professional Development',
            startDate: '2024-03-15T09:00:00Z',
            endDate: '2024-03-15T17:00:00Z',
            timezone: 'Asia/Jerusalem',
            location: {
              type: 'physical',
              venue: 'Tel Aviv Medical Center',
              address: {
                firstName: '',
                lastName: '',
                address1: 'Conference Hall A, 3rd Floor',
                city: 'Tel Aviv',
                state: 'Tel Aviv District',
                zipCode: '12345',
                country: 'Israel'
              }
            },
            capacity: 150,
            registeredCount: 127,
            waitlistCount: 8,
            price: 350,
            partnerPrice: 280,
            currency: 'USD',
            requiresCertification: true,
            certificationLevel: 'advanced',
            status: 'published',
            visibility: 'public',
            images: ['/images/events/dermatology-masterclass.jpg'],
            videos: ['/videos/eventIntroVideo.webm'],
            speakers: [
              {
                id: '1',
                name: 'Dr. Sarah Cohen',
                title: 'Lead Dermatologist',
                company: 'MitoDerm Institute',
                bio: 'Renowned expert in cosmetic dermatology with over 15 years of experience.',
                avatar: '/images/speakers/dr-cohen.jpg'
              }
            ],
            agenda: [
              {
                id: '1',
                title: 'Opening Keynote: Future of Dermatology',
                startTime: '09:00',
                endTime: '10:00',
                speaker: 'Dr. Sarah Cohen',
                type: 'presentation'
              }
            ],
            tags: ['Professional', 'Certification', 'Advanced'],
            registrationSettings: {
              isOpen: true,
              requiresApproval: false,
              waitlistEnabled: true
            },
            analytics: {
              views: 1250,
              registrations: 127,
              attendance: 0,
              completionRate: 0,
              averageRating: 4.8,
              revenue: 35700
            },
            createdBy: 'admin',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-20T15:30:00Z',
            feedback: []
          },
          {
            id: '2',
            title: 'Skincare Innovation Summit 2024',
            titleTranslations: {
              en: 'Skincare Innovation Summit 2024',
              he: 'פסגת חדשנות בטיפוח עור 2024',
              ru: 'Саммит инноваций в уходе за кожей 2024'
            },
            description: 'Discover the future of skincare with AI-powered treatments, breakthrough ingredients, and revolutionary technologies.',
            descriptionTranslations: {
              en: 'Discover the future of skincare with AI-powered treatments, breakthrough ingredients, and revolutionary technologies.',
              he: 'גלו את העתיד של טיפוח העור עם טיפולים מבוססי AI, מרכיבים פורצי דרך וטכנולוגיות מהפכניות.',
              ru: 'Откройте будущее ухода за кожей с помощью AI-процедур, прорывных ингредиентов и революционных технологий.'
            },
            shortDescription: 'AI-powered skincare innovations and breakthrough technologies',
            type: 'conference',
            category: 'Innovation',
            startDate: '2024-04-20T08:00:00Z',
            endDate: '2024-04-22T18:00:00Z',
            timezone: 'Asia/Jerusalem',
            location: {
              type: 'hybrid',
              venue: 'David InterContinental Tel Aviv',
              virtualLink: 'https://mitoderm.com/live/summit2024',
              address: {
                firstName: '',
                lastName: '',
                address1: '12 Kaufmann Street',
                city: 'Tel Aviv',
                state: 'Tel Aviv District',
                zipCode: '68012',
                country: 'Israel'
              }
            },
            capacity: 500,
            registeredCount: 342,
            waitlistCount: 25,
            price: 599,
            partnerPrice: 449,
            currency: 'USD',
            requiresCertification: false,
            status: 'published',
            visibility: 'public',
            images: ['/images/events/innovation-summit.jpg'],
            speakers: [
              {
                id: '2',
                name: 'Dr. Michael Chen',
                title: 'AI Research Director',
                company: 'Tech Skin Labs',
                bio: 'Leading researcher in AI applications for dermatology and personalized skincare.',
                avatar: '/images/speakers/dr-chen.jpg'
              }
            ],
            agenda: [],
            tags: ['Innovation', 'AI', 'Technology', 'Summit'],
            registrationSettings: {
              isOpen: true,
              requiresApproval: false,
              waitlistEnabled: true
            },
            analytics: {
              views: 2850,
              registrations: 342,
              attendance: 0,
              completionRate: 0,
              averageRating: 4.9,
              revenue: 154590
            },
            createdBy: 'admin',
            createdAt: '2024-01-10T10:00:00Z',
            updatedAt: '2024-01-25T15:30:00Z',
            feedback: []
          }
        ];
        setEvents(mockEvents);
        setIsLoading(false);
      }, 1000);
    }
  }, [events.length]);

  // Filter events
  useEffect(() => {
    let filtered = events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
      
      // Date filtering
      const now = new Date();
      const eventDate = new Date(event.startDate);
      const matchesDate = dateFilter === 'all' || 
        (dateFilter === 'upcoming' && eventDate > now) ||
        (dateFilter === 'past' && eventDate < now);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesDate;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popularity':
          return b.analytics.registrations - a.analytics.registrations;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, priceRange, sortBy, dateFilter]);

  // Video controls
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(events.map(e => e.category).filter(Boolean)));
    return ['all', ...cats];
  }, [events]);

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const EventCard = ({ event }: { event: Event }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`${styles.eventCard} ${viewMode === 'list' ? styles.listView : ''}`}
      onMouseEnter={() => setHoveredEvent(event.id!)}
      onMouseLeave={() => setHoveredEvent(null)}
    >
      <div className={styles.cardInner}>
        {/* Event Image/Video */}
        <div className={styles.imageContainer}>
          <Link href={`/event`}>
            <Image
              src={event.images?.[0] || '/images/placeholder-event.jpg'}
              alt={event.title}
              width={400}
              height={250}
              className={styles.eventImage}
            />
          </Link>
          
          {/* Event Type Badge */}
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles[event.type]}`}>
              {event.type === 'training' && <FiTarget />}
              {event.type === 'conference' && <FiMic />}
              {event.type === 'webinar' && <FiVideo />}
              {event.type === 'workshop' && <FiCpu />}
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            {event.location.type === 'virtual' && (
              <span className={styles.badge}>
                <FiMonitor /> Virtual
              </span>
            )}
            {event.location.type === 'hybrid' && (
              <span className={styles.badge}>
                <FiLayers /> Hybrid
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div 
            className={styles.quickActions}
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredEvent === event.id ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(event.id!)}
              className={`${styles.actionBtn} ${favorites.includes(event.id!) ? styles.active : ''}`}
            >
              <FiHeart />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuickViewEvent(event)}
              className={styles.actionBtn}
            >
              <FiEye />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={styles.actionBtn}
            >
              <FiShare2 />
            </motion.button>
          </motion.div>
        </div>

        {/* Event Info */}
        <div className={styles.eventInfo}>
          <div className={styles.eventMeta}>
            <div className={styles.dateTime}>
              <FiCalendar />
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
            </div>
            <div className={styles.location}>
              <FiMapPin />
              <span>{event.location.venue}</span>
            </div>
          </div>

          <Link href={`/event`}>
            <h3 className={styles.eventTitle}>{event.title}</h3>
          </Link>
          
          <p className={styles.eventDescription}>{event.shortDescription || event.description}</p>
          
          <div className={styles.speakers}>
            {event.speakers.slice(0, 2).map(speaker => (
              <div key={speaker.id} className={styles.speakerTag}>
                <Image
                  src={speaker.avatar || '/images/placeholder-speaker.jpg'}
                  alt={speaker.name}
                  width={24}
                  height={24}
                  className={styles.speakerAvatar}
                />
                <span>{speaker.name}</span>
              </div>
            ))}
            {event.speakers.length > 2 && (
              <span className={styles.moreSpeakers}>+{event.speakers.length - 2} more</span>
            )}
          </div>

          <div className={styles.eventFooter}>
            <div className={styles.priceSection}>
              <span className={styles.price}>${event.price}</span>
              {event.partnerPrice && event.partnerPrice < event.price && (
                <span className={styles.partnerPrice}>Partner: ${event.partnerPrice}</span>
              )}
            </div>
            
            <div className={styles.capacity}>
              <FiUsers />
              <span>{event.registeredCount}/{event.capacity}</span>
            </div>
          </div>

          <div className={styles.tags}>
            {event.tags.slice(0, 3).map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <motion.div
            className={styles.loadingSpinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiCalendar />
          </motion.div>
          <h2>Loading Professional Events...</h2>
          <p>Discovering the latest training and conferences</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Video Hero Section */}
      <motion.section 
        className={styles.videoHeroSection}
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.heroVideo}
            autoPlay
            muted={isVideoMuted}
            loop
            playsInline
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          >
            <source src="/videos/eventIntroVideo.webm" type="video/webm" />
            <source src="/videos/eventIntroVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className={styles.videoOverlay} />
          
          <div className={styles.videoControls}>
            <button onClick={toggleVideoPlay} className={styles.playButton}>
              {isVideoPlaying ? <FiPause /> : <FiPlay />}
            </button>
            <button onClick={toggleVideoMute} className={styles.muteButton}>
              {isVideoMuted ? <FiVolumeX /> : <FiVolume2 />}
            </button>
          </div>
        </div>
        
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className={styles.heroTitle}>
              Professional
              <span className={styles.gradientText}> Events & Training</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Join leading experts in advanced dermatology, aesthetic medicine, and skincare innovation. 
              Elevate your skills with hands-on training, cutting-edge research, and networking opportunities.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{events.length}+</span>
                <span className={styles.statLabel}>Events</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Professionals</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4.9</span>
                <span className={styles.statLabel}>Rating</span>
              </div>
            </div>

            <div className={styles.heroActions}>
              <Link href="#upcoming-events" className={styles.primaryCTA}>
                <FiCalendar />
                View Upcoming Events
              </Link>
              <button className={styles.secondaryCTA}>
                <FiPlay />
                Watch Introduction
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Navigation */}
      <motion.section 
        className={styles.quickNav}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className={styles.navItems}>
          <a href="#upcoming-events" className={styles.navItem}>
            <FiCalendar />
            <span>Upcoming Events</span>
          </a>
          <a href="#training" className={styles.navItem}>
            <FiTarget />
            <span>Training Programs</span>
          </a>
          <a href="#conferences" className={styles.navItem}>
            <FiMic />
            <span>Conferences</span>
          </a>
          <a href="#webinars" className={styles.navItem}>
            <FiVideo />
            <span>Webinars</span>
          </a>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section 
        className={styles.filtersSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        id="upcoming-events"
      >
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search events, topics, speakers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className={styles.clearSearch}>
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterControls}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
          >
            <FiFilter />
            Filters
            <FiChevronDown className={`${styles.chevron} ${showFilters ? styles.rotated : ''}`} />
          </button>

          <div className={styles.quickFilters}>
            <button
              onClick={() => setDateFilter('upcoming')}
              className={`${styles.quickFilter} ${dateFilter === 'upcoming' ? styles.active : ''}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`${styles.quickFilter} ${dateFilter === 'all' ? styles.active : ''}`}
            >
              All Events
            </button>
          </div>

          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
            >
              <FiList />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={styles.expandedFilters}
            >
              <div className={styles.filterGrid}>
                <div className={styles.filterGroup}>
                  <label>Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Price Range</label>
                  <div className={styles.priceRange}>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                    <span>${priceRange[0]} - ${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.resultsInfo}>
          <span>{filteredEvents.length} events found</span>
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setDateFilter('upcoming');
                setPriceRange([0, 1000]);
              }}
              className={styles.clearAll}
            >
              Clear All
            </button>
          )}
        </div>
      </motion.section>

      {/* Events Grid */}
      <motion.section className={styles.eventsSection}>
        {filteredEvents.length === 0 ? (
          <motion.div 
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiCalendar className={styles.emptyIcon} />
            <h3>No events found</h3>
            <p>Try adjusting your search criteria or check back later for new events.</p>
          </motion.div>
        ) : (
          <motion.div 
            className={`${styles.eventsGrid} ${viewMode === 'list' ? styles.listMode : ''}`}
            layout
          >
            <AnimatePresence>
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setQuickViewEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={styles.quickViewModal}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setQuickViewEvent(null)}
                className={styles.closeModal}
              >
                <FiX />
              </button>
              
              <div className={styles.modalContent}>
                <div className={styles.modalImage}>
                  <Image
                    src={quickViewEvent.images?.[0] || '/images/placeholder-event.jpg'}
                    alt={quickViewEvent.title}
                    width={400}
                    height={250}
                  />
                </div>
                
                <div className={styles.modalInfo}>
                  <h3>{quickViewEvent.title}</h3>
                  <p>{quickViewEvent.description}</p>
                  
                  <div className={styles.modalMeta}>
                    <div className={styles.modalDate}>
                      <FiCalendar />
                      <span>{new Date(quickViewEvent.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.modalLocation}>
                      <FiMapPin />
                      <span>{quickViewEvent.location.venue}</span>
                    </div>
                  </div>
                  
                  <div className={styles.modalPrice}>
                    ${quickViewEvent.price}
                  </div>
                  
                  <Link
                    href={`/event`}
                    className={styles.viewDetailsBtn}
                  >
                    View Full Details & Register
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventsEnhanced;