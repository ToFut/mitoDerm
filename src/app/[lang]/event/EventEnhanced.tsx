'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { 
  FiCalendar, FiClock, FiMapPin, FiUsers, FiStar, FiPlay, 
  FiShare2, FiHeart, FiBookmark, FiArrowRight, FiCheckCircle,
  FiTrendingUp, FiAward, FiMic, FiVideo, FiCoffee, FiWifi,
  FiParking, FiShield, FiGift, FiZap, FiTarget, FiEye,
  FiChevronDown, FiChevronUp, FiPhone, FiMail, FiGlobe,
  FiLinkedin, FiTwitter, FiInstagram, FiDownload
} from 'react-icons/fi';
import styles from './EventEnhanced.module.scss';
import Button from '@/components/sharedUI/Button/Button';
import { Event, EventSpeaker, EventAgendaItem } from '@/types';
import { eventService } from '@/lib/services/eventService';

// Mock event data - this should come from API/admin
const mockEvent: Event = {
  id: '1',
  title: 'Advanced Cosmetic Dermatology',
  titleTranslations: {
    en: 'Advanced Cosmetic Dermatology',
    he: 'דרמטולוגיה קוסמטית מתקדמת',
    ru: 'Продвинутая косметическая дерматология'
  },
  description: 'Join leading dermatologists and cosmetic specialists for an intensive training session covering the latest advances in aesthetic medicine, skin treatments, and professional techniques.',
  descriptionTranslations: {
    en: 'Join leading dermatologists and cosmetic specialists for an intensive training session covering the latest advances in aesthetic medicine, skin treatments, and professional techniques.',
    he: 'הצטרפו לדרמטולוגים מובילים ומתמחים קוסמטיים למפגש הכשרה אינטנסיבי המכסה את ההתקדמויות האחרונות ברפואה אסתטית, טיפולי עור וטכניקות מקצועיות.',
    ru: 'Присоединяйтесь к ведущим дерматологам и косметическим специалистам на интенсивном тренинге, охватывающем последние достижения в эстетической медицине, процедурах по уходу за кожей и профессиональных техниках.'
  },
  shortDescription: 'Master the Latest Techniques & Technologies',
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
  waitlistCount: 0,
  price: 350,
  partnerPrice: 280,
  currency: 'USD',
  requiresCertification: false,
  status: 'published',
  visibility: 'public',
  images: [
    '/images/events/cosmetic-dermatology.jpg',
    '/images/events/venue1.jpg',
    '/images/events/venue2.jpg',
    '/images/events/training1.jpg'
  ],
  videos: [],
  documents: [],
  agenda: [
    {
      id: '1',
      title: 'Registration & Welcome Coffee',
      description: 'Network with fellow professionals',
      startTime: '09:00',
      endTime: '09:30',
      type: 'networking'
    },
    {
      id: '2',
      title: 'Opening Keynote: Future of Dermatology',
      description: 'Revolutionary approaches in modern skin care',
      startTime: '09:30',
      endTime: '10:30',
      speaker: 'Dr. Sarah Cohen',
      type: 'presentation'
    }
  ],
  speakers: [
    {
      id: '1',
      name: 'Dr. Sarah Cohen',
      title: 'Lead Dermatologist',
      company: 'MitoDerm Institute',
      bio: 'Dr. Cohen is a renowned expert in cosmetic dermatology with over 15 years of experience.',
      avatar: '/images/speakers/dr-cohen.jpg',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/dr-sarah-cohen',
        website: 'https://drcohen.com'
      }
    }
  ],
  sponsors: [],
  tags: ['Professional', 'Dermatology', 'Training', 'Certification'],
  registrationSettings: {
    isOpen: true,
    requiresApproval: false,
    waitlistEnabled: true
  },
  liveStreamUrl: '',
  recordingUrl: '',
  feedback: [],
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
  updatedAt: '2024-01-20T15:30:00Z'
};

const EventEnhanced = () => {
  const t = useTranslations();
  const [event] = useState<Event>(mockEvent);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedAgenda, setExpandedAgenda] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiEye },
    { id: 'agenda', label: 'Agenda', icon: FiCalendar },
    { id: 'speakers', label: 'Speakers', icon: FiMic },
    { id: 'venue', label: 'Venue', icon: FiMapPin }
  ];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: event.subtitle,
        url: window.location.href
      });
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className={styles.eventContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <motion.section 
        className={styles.heroSection}
        style={{ y: headerY, scale: heroScale, opacity: heroOpacity }}
      >
        <div className={styles.heroBackground}>
          <Image
            src={event.image}
            alt={event.title}
            fill
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.eventMeta}>
              <div className={styles.eventBadge}>
                <FiZap />
                <span>Live Event</span>
              </div>
              <div className={styles.eventDate}>
                <FiCalendar />
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <h1 className={styles.eventTitle}>
              {event.title}
            </h1>
            
            <p className={styles.eventSubtitle}>
              {event.shortDescription}
            </p>
            
            <div className={styles.eventStats}>
              <div className={styles.statItem}>
                <FiUsers className={styles.statIcon} />
                <span className={styles.statValue}>{event.registeredCount}</span>
                <span className={styles.statLabel}>Registered</span>
              </div>
              <div className={styles.statItem}>
                <FiClock className={styles.statIcon} />
                <span className={styles.statValue}>8 hours</span>
                <span className={styles.statLabel}>Duration</span>
              </div>
              <div className={styles.statItem}>
                <FiStar className={styles.statIcon} />
                <span className={styles.statValue}>{event.analytics.averageRating}</span>
                <span className={styles.statLabel}>Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className={styles.heroActions}>
          <Button 
            text="Register Now"
            formPage="event"
          />
          <motion.button 
            className={styles.actionButton}
            onClick={() => setIsBookmarked(!isBookmarked)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBookmark className={isBookmarked ? styles.bookmarked : ''} />
          </motion.button>
          <motion.button 
            className={styles.actionButton}
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiShare2 />
          </motion.button>
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <motion.div 
        className={styles.tabNavigation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <tab.icon />
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Content Sections */}
      <div className={styles.contentContainer}>
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              className={styles.tabContent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className={styles.overviewGrid}>
                {/* Event Details */}
                <div className={styles.eventDetails}>
                  <h3>Event Details</h3>
                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <FiCalendar className={styles.detailIcon} />
                      <div>
                        <span className={styles.detailLabel}>Date & Time</span>
                        <span className={styles.detailValue}>
                          {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <FiMapPin className={styles.detailIcon} />
                      <div>
                        <span className={styles.detailLabel}>Location</span>
                        <span className={styles.detailValue}>{event.location.venue}</span>
                        <span className={styles.detailSubtext}>{event.location.address?.address1}</span>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <FiUsers className={styles.detailIcon} />
                      <div>
                        <span className={styles.detailLabel}>Capacity</span>
                        <span className={styles.detailValue}>
                          {event.registeredCount} / {event.capacity} registered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className={styles.includesSection}>
                  <h3>What's Included</h3>
                  <div className={styles.includesList}>
                    <motion.div 
                      className={styles.includeItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0 * 0.1 }}
                    >
                      <FiCheckCircle className={styles.includeIcon} />
                      <span>Training Materials</span>
                    </motion.div>
                    <motion.div 
                      className={styles.includeItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 * 0.1 }}
                    >
                      <FiCheckCircle className={styles.includeIcon} />
                      <span>Professional Certificate</span>
                    </motion.div>
                    <motion.div 
                      className={styles.includeItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2 * 0.1 }}
                    >
                      <FiCheckCircle className={styles.includeIcon} />
                      <span>Event Recording Access</span>
                    </motion.div>
                    <motion.div 
                      className={styles.includeItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3 * 0.1 }}
                    >
                      <FiCheckCircle className={styles.includeIcon} />
                      <span>Networking Opportunities</span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className={styles.descriptionSection}>
                <h3>About This Event</h3>
                <p className={styles.description}>
                  {showFullDescription ? event.description : `${event.description.slice(0, 200)}...`}
                </p>
                <button 
                  className={styles.toggleButton}
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                  {showFullDescription ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              {/* Key Features */}
              <div className={styles.featuresSection}>
                <h3>Event Features</h3>
                <div className={styles.featuresGrid}>
                  <motion.div 
                    className={styles.featureCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={styles.featureIcon}>
                      <FiPlay />
                    </div>
                    <span className={styles.featureText}>Live Demonstrations</span>
                  </motion.div>
                  <motion.div 
                    className={styles.featureCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={styles.featureIcon}>
                      <FiTarget />
                    </div>
                    <span className={styles.featureText}>Hands-on Training</span>
                  </motion.div>
                  <motion.div 
                    className={styles.featureCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={styles.featureIcon}>
                      <FiAward />
                    </div>
                    <span className={styles.featureText}>Professional Certificate</span>
                  </motion.div>
                  <motion.div 
                    className={styles.featureCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={styles.featureIcon}>
                      <FiGift />
                    </div>
                    <span className={styles.featureText}>Materials Included</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Agenda Tab */}
          {activeTab === 'agenda' && (
            <motion.div
              key="agenda"
              className={styles.tabContent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className={styles.agendaHeader}>
                <h3>Event Schedule</h3>
                <p>Detailed timeline of sessions and activities</p>
              </div>
              
              <div className={styles.agendaList}>
                {event.agenda.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    className={styles.agendaItem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.agendaTime}>
                      <span className={styles.timeText}>{item.startTime}</span>
                      <span className={styles.duration}>
                        {item.endTime && `${Math.round((new Date(`1970-01-01T${item.endTime}:00Z`).getTime() - new Date(`1970-01-01T${item.startTime}:00Z`).getTime()) / (1000 * 60))}min`}
                      </span>
                    </div>
                    
                    <div className={styles.agendaContent}>
                      <div className={styles.agendaHeader}>
                        <h4 className={styles.agendaTitle}>{item.title}</h4>
                        <div className={styles.agendaType}>
                          {item.type === 'presentation' && <FiMic />}
                          {item.type === 'qa' && <FiVideo />}
                          {item.type === 'break' && <FiCoffee />}
                          {item.type === 'networking' && <FiUsers />}
                        </div>
                      </div>
                      
                      <p className={styles.agendaDescription}>{item.description}</p>
                      
                      {item.speaker && (
                        <div className={styles.agendaSpeaker}>
                          <div className={styles.speakerInfo}>
                            <span className={styles.speakerName}>{item.speaker}</span>
                            <span className={styles.speakerTitle}>Speaker</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Speakers Tab */}
          {activeTab === 'speakers' && (
            <motion.div
              key="speakers"
              className={styles.tabContent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className={styles.speakersHeader}>
                <h3>Featured Speakers</h3>
                <p>Learn from industry experts and thought leaders</p>
              </div>
              
              <div className={styles.speakersGrid}>
                {event.speakers.map((speaker, index) => (
                  <motion.div 
                    key={speaker.id}
                    className={styles.speakerCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <div className={styles.speakerImage}>
                      <Image
                        src={speaker.avatar || '/images/placeholder-speaker.jpg'}
                        alt={speaker.name}
                        width={200}
                        height={200}
                      />
                    </div>
                    
                    <div className={styles.speakerInfo}>
                      <h4 className={styles.speakerName}>{speaker.name}</h4>
                      <p className={styles.speakerTitle}>{speaker.title}</p>
                      <p className={styles.speakerCompany}>{speaker.company}</p>
                      
                      <div className={styles.speakerExpertise}>
                        <span className={styles.expertiseTag}>Dermatology</span>
                        <span className={styles.expertiseTag}>Laser Therapy</span>
                        <span className={styles.expertiseTag}>Anti-Aging</span>
                      </div>
                      
                      {speaker.socialLinks && (
                        <div className={styles.speakerSocial}>
                          {speaker.socialLinks.linkedin && <FiLinkedin />}
                          {speaker.socialLinks.twitter && <FiTwitter />}
                          {speaker.socialLinks.website && <FiGlobe />}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Venue Tab */}
          {activeTab === 'venue' && (
            <motion.div
              key="venue"
              className={styles.tabContent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className={styles.venueInfo}>
                <h3>Venue Information</h3>
                <div className={styles.venueDetails}>
                  <div className={styles.venueAddress}>
                    <FiMapPin />
                    <div>
                      <h4>{event.location.venue}</h4>
                      <p>{event.location.address?.address1}, {event.location.address?.city}</p>
                    </div>
                  </div>
                  
                  <div className={styles.venueFeatures}>
                    <div className={styles.venueFeature}>
                      <FiWifi />
                      <span>Free WiFi</span>
                    </div>
                    <div className={styles.venueFeature}>
                      <FiParking />
                      <span>Parking Available</span>
                    </div>
                    <div className={styles.venueFeature}>
                      <FiCoffee />
                      <span>Catering Included</span>
                    </div>
                    <div className={styles.venueFeature}>
                      <FiShield />
                      <span>Accessible Venue</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Registration Bar */}
      <motion.div 
        className={styles.stickyBar}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className={styles.stickyContent}>
          <div className={styles.eventInfo}>
            <h4>{event.title}</h4>
            <div className={styles.eventMeta}>
              <span><FiCalendar /> {new Date(event.startDate).toLocaleDateString()}</span>
              <span><FiMapPin /> {event.location.venue}</span>
            </div>
          </div>
          <div className={styles.priceInfo}>
            <span className={styles.price}>${event.price}</span>
            <span className={styles.availability}>
              {event.capacity - event.registeredCount} spots left
            </span>
          </div>
          <Button text="Register Now" formPage="event" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventEnhanced;