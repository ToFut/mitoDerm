'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiMapPin, 
  FiClock, 
  FiUsers, 
  FiStar,
  FiGlobe,
  FiVideo,
  FiMail,
  FiPhone,
  FiExternalLink,
  FiDownload,
  FiShare2,
  FiHeart,
  FiCheckCircle,
  FiAlertCircle,
  FiPlay,
  FiArrowLeft,
  FiFilter,
  FiList,
  FiBookmark,
  FiInfo
} from 'react-icons/fi';
import { Event } from '@/lib/types/event';
import { LuxuryButton, HolographicCard, LuxuryInput } from '@/components/nextgen/LuxuryComponents';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/sharedUI/Button/Button';
import styles from './event-detail.module.scss';

interface EventDetailClientProps {
  event: Event;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const [selectedPricing, setSelectedPricing] = useState(event.pricing.find(p => p.isDefault)?.id || event.pricing[0]?.id);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'speakers' | 'gallery'>('overview');
  const [savedEvent, setSavedEvent] = useState(false);

  const selectedPricingOption = event.pricing.find(p => p.id === selectedPricing);
  const isEarlyBird = selectedPricingOption?.earlyBird?.deadline ? new Date() <= selectedPricingOption.earlyBird.deadline : false;
  const displayPrice = isEarlyBird ? selectedPricingOption?.earlyBird?.price : selectedPricingOption?.price;

  const handleRegistration = async (formData: any) => {
    setIsRegistering(true);
    try {
      const response = await fetch('/api/events/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowRegistrationModal(false);
        
        // Show success message based on approval requirement
        if (event.requiresApproval) {
          alert('Registration submitted successfully! You will receive an email confirmation once approved.');
        } else {
          alert('Registration completed successfully! You will receive a confirmation email shortly.');
        }
      } else {
        alert(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please check your connection and try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const isEventSoldOut = event.capacity.available <= 0;
  const isRegistrationClosed = new Date() > event.registrationDeadline;

  return (
    <div className={styles.eventDetailPage}>
      {/* Simplified Background */}
      <div className={styles.eventBackground} />

      {/* Navigation */}
      <div className={styles.navigation}>
        <Link href="/events" className={styles.backButton}>
          <FiArrowLeft />
          <span>Back to Events</span>
        </Link>
        
        <div className={styles.navActions}>
          <motion.button
            className={`${styles.actionButton} ${savedEvent ? styles.saved : ''}`}
            onClick={() => setSavedEvent(!savedEvent)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiHeart />
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
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className={styles.eventType}>
              <FiStar />
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </div>

            <h1 className={styles.heroTitle}>{event.title}</h1>
            
            {event.subtitle && (
              <p className={styles.heroSubtitle}>{event.subtitle}</p>
            )}

            <div className={styles.heroDetails}>
              <div className={styles.heroDetail}>
                <FiCalendar />
                <span>{event.startDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className={styles.heroDetail}>
                <FiClock />
                <span>
                  {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className={styles.heroDetail}>
                {event.location.type === 'virtual' ? <FiVideo /> : <FiMapPin />}
                <span>
                  {event.location.type === 'virtual' 
                    ? 'Virtual Event' 
                    : `${event.location.venue}, ${event.location.city}`
                  }
                </span>
              </div>
              
              <div className={styles.heroDetail}>
                <FiUsers />
                <span>
                  {isEventSoldOut 
                    ? 'Sold Out' 
                    : `${event.capacity.available} spots available`
                  }
                </span>
              </div>
            </div>

            <div className={styles.heroCTA}>
              <div className={styles.primaryCTA}>
              {!isEventSoldOut && !isRegistrationClosed ? (
                  <LuxuryButton
                  variant="primary"
                    size="xlarge"
                  onClick={() => setShowRegistrationModal(true)}
                    glowEffect={true}
                  >
                    {isEarlyBird ? (
                      <>
                        <span className={styles.earlyBirdLabel}>Early Bird</span>
                        <span className={styles.priceMain}>${displayPrice}</span>
                        <span className={styles.priceOriginal}>${selectedPricingOption?.price}</span>
                      </>
                    ) : (
                      <>
                        <span>Reserve Your Seat</span>
                        <span className={styles.priceMain}>${displayPrice}</span>
                      </>
                    )}
                  </LuxuryButton>
                ) : (
                  <LuxuryButton
                  variant="secondary"
                    size="xlarge"
                  disabled={true}
                  >
                    {isEventSoldOut ? 'Sold Out' : 'Registration Closed'}
                  </LuxuryButton>
                )}
              </div>
              
              <div className={styles.secondaryActions}>
                <button className={styles.secondaryButton}>
                  <FiDownload />
                  Download Brochure
                </button>
                <button className={styles.secondaryButton}>
                  <FiShare2 />
                  Share Event
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className={styles.eventImageContainer}>
              <Image
                src={event.coverImage}
                alt={event.title}
                width={600}
                height={400}
                className={styles.eventImage}
                priority
              />
              {isEarlyBird && (
                <div className={styles.earlyBirdBadge}>
                  <FiStar />
                  <span>Early Bird Available</span>
                </div>
              )}
              <div className={styles.eventStats}>
                <div className={styles.stat}>
                  <FiUsers />
                  <span>{event.capacity.total - event.capacity.available} registered</span>
              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Navigation */}
      <section className={styles.contentNav}>
        <div className={styles.tabNavigation} role="tablist">
          {[
            { 
              id: 'overview', 
              label: 'Overview', 
              icon: FiGlobe,
              count: 1,
              hasContent: true
            },
            { 
              id: 'agenda', 
              label: 'Agenda', 
              icon: FiCalendar,
              count: event.agenda.length,
              hasContent: event.agenda.length > 0
            },
            { 
              id: 'speakers', 
              label: 'Speakers', 
              icon: FiUsers,
              count: event.speakers.length,
              hasContent: event.speakers.length > 0
            },
            { 
              id: 'gallery', 
              label: 'Gallery', 
              icon: FiStar,
              count: (event.gallery?.length || 0) + (event.videos?.length || 0),
              hasContent: (event.gallery?.length || 0) + (event.videos?.length || 0) > 0
            }
          ].map(tab => (
            <motion.button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''} ${!tab.hasContent ? styles.disabled : ''}`}
              onClick={() => tab.hasContent && setActiveTab(tab.id as any)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  tab.hasContent && setActiveTab(tab.id as any);
                }
              }}
              disabled={!tab.hasContent}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              whileHover={tab.hasContent ? { scale: 1.02 } : {}}
              whileTap={tab.hasContent ? { scale: 0.98 } : {}}
            >
              <tab.icon />
              <span className={styles.tabLabel}>{tab.label}</span>
              {tab.hasContent && tab.count > 0 && (
                <span className={styles.tabCount}>{tab.count}</span>
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          <div className={styles.mainContent}>
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={styles.overviewContent}
                  role="tabpanel"
                  id="overview-panel"
                  aria-labelledby="overview-tab"
                >
                  <div className={styles.description}>
                    <h2>About This Event</h2>
                    <div className={styles.descriptionContent}>
                      <p className={styles.mainDescription}>{event.description}</p>
                      
                      {/* Key Benefits Summary */}
                      <div className={styles.keyBenefits}>
                        <h3>Key Benefits</h3>
                        <div className={styles.benefitsGrid}>
                          <div className={styles.benefit}>
                            <FiStar />
                            <span>Professional Networking</span>
                          </div>
                          <div className={styles.benefit}>
                            <FiCheckCircle />
                            <span>Industry Insights</span>
                          </div>
                          <div className={styles.benefit}>
                            <FiUsers />
                            <span>Expert Knowledge</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Event Stats */}
                      <div className={styles.eventStats}>
                        <div className={styles.stat}>
                          <span className={styles.statNumber}>{event.capacity.total - event.capacity.available}</span>
                          <span className={styles.statLabel}>Already Registered</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statNumber}>{event.speakers?.length || 0}</span>
                          <span className={styles.statLabel}>Expert Speakers</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statNumber}>{Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60))}</span>
                          <span className={styles.statLabel}>Hours of Content</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {event.features.length > 0 && (
                    <div className={styles.features}>
                      <h3>What's Included</h3>
                      <div className={styles.featureGrid}>
                        {event.features.slice(0, 3).map(feature => (
                          <HolographicCard
                            key={feature.id}
                            glowColor="platinum"
                            className={styles.featureCard}
                            interactive={false}
                          >
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <h4>{feature.name}</h4>
                            <p>{feature.description}</p>
                          </HolographicCard>
                        ))}
                        {event.features.slice(3).map(feature => (
                          <div
                            key={feature.id}
                            className={styles.simpleFeatureCard}
                          >
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <h4>{feature.name}</h4>
                            <p>{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.requirements.length > 0 && (
                    <div className={styles.requirements}>
                      <h3>Requirements</h3>
                      <div className={styles.requirementsBadges}>
                        {event.requirements.map((req, index) => (
                          <motion.div
                            key={index}
                            className={styles.requirementBadge}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <FiCheckCircle className={styles.checkIcon} />
                            <span>{req}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'agenda' && (
                <motion.div
                  key="agenda"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={styles.agendaContent}
                  role="tabpanel"
                  id="agenda-panel"
                  aria-labelledby="agenda-tab"
                >
                  <div className={styles.sectionHeader}>
                    <h2>Event Agenda</h2>
                    
                    {/* Agenda Controls */}
                    <div className={styles.agendaControls}>
                      <div className={styles.agendaSummary}>
                        <span>{event.agenda.length} sessions</span>
                        <span>•</span>
                        <span>{event.startDate.toLocaleDateString()}</span>
                      </div>
                      
                      <div className={styles.agendaFilters}>
                        <button className={styles.filterButton}>
                          <FiFilter />
                          All Sessions
                        </button>
                        <button className={styles.viewToggle}>
                          <FiList />
                          Timeline View
                        </button>
                      </div>
                    </div>
                    
                    {/* Quick Navigation */}
                    <div className={styles.quickNav}>
                      <span>Jump to:</span>
                      {['Morning', 'Afternoon', 'Evening'].map(period => (
                        <button key={period} className={styles.quickNavButton}>
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {event.agenda.length > 0 ? (
                  <div className={styles.agendaTimeline}>
                    {event.agenda.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className={styles.agendaItem}
                          initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                          <div className={styles.timelineConnector} />
                          <div className={styles.agendaCard}>
                          <div className={styles.agendaTime}>
                            <FiClock />
                            <span>{item.startTime} - {item.endTime}</span>
                            <span className={styles.duration}>
                              45 min {/* You can calculate this dynamically */}
                            </span>
                          </div>
                          
                          <div className={styles.agendaDetails}>
                              <div className={styles.agendaHeader}>
                            <h4>{item.title}</h4>
                                <span className={`${styles.agendaType} ${styles[item.type?.toLowerCase()]}`}>
                                  {item.type}
                                </span>
                              </div>
                            <p>{item.description}</p>
                            {item.speaker && (
                              <div className={styles.agendaSpeaker}>
                                <FiUsers />
                                <span>{item.speaker}</span>
                                <button className={styles.speakerLink}>
                                  <FiInfo />
                                  View Profile
                                </button>
                              </div>
                            )}
                            
                            {/* Session Actions */}
                            <div className={styles.sessionActions}>
                              <button className={styles.addToCalendar}>
                                <FiCalendar />
                                Add to Calendar
                              </button>
                              <button className={styles.bookmarkSession}>
                                <FiBookmark />
                                Save
                              </button>
                            </div>
                          </div>
                          </div>
                      </motion.div>
                    ))}
                  </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <FiCalendar className={styles.emptyIcon} />
                      <h3>Agenda Coming Soon</h3>
                      <p>The detailed agenda will be available closer to the event date.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'speakers' && (
                <motion.div
                  key="speakers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={styles.speakersContent}
                  role="tabpanel"
                  id="speakers-panel"
                  aria-labelledby="speakers-tab"
                >
                  <div className={styles.sectionHeader}>
                    <h2>Meet Our Speakers</h2>
                    
                    <div className={styles.speakersControls}>
                      <div className={styles.speakersSummary}>
                        <span>{event.speakers.length} expert speakers</span>
                        <span>•</span>
                        <span>{event.speakers.filter(s => s.social?.linkedin).length} with profiles</span>
                      </div>
                      
                      {/* Speaker Filters */}
                      <div className={styles.speakerFilters}>
                        <button className={styles.filterButton}>
                          <FiFilter />
                          By Expertise
                        </button>
                        <button className={styles.filterButton}>
                          <FiUsers />
                          Keynote Speakers
                        </button>
                      </div>
                    </div>
                    
                    {/* Expertise Tags */}
                    <div className={styles.expertiseFilters}>
                      {['AI/ML', 'Business Strategy', 'Healthcare', 'Innovation'].map(tag => (
                        <button key={tag} className={styles.expertiseTag}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {event.speakers.length > 0 ? (
                  <div className={styles.speakersGrid}>
                    {event.speakers.map((speaker, index) => (
                      <motion.div
                        key={speaker.id}
                          initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={styles.speakerCardWrapper}
                      >
                          {index === 0 ? (
                            // First speaker gets HolographicCard treatment (keynote speaker)
                        <HolographicCard
                          glowColor="gold"
                          interactive={true}
                              className={styles.keynoteSpeakerCard}
                        >
                          <div className={styles.speakerAvatar}>
                            <Image
                              src={speaker.avatar}
                              alt={speaker.name}
                              width={120}
                              height={120}
                              className={styles.avatarImage}
                            />
                                <div className={styles.keynoteBadge}>
                                  <FiStar />
                                  <span>Keynote</span>
                                </div>
                          </div>
                          
                          <div className={styles.speakerInfo}>
                            <h3>{speaker.name}</h3>
                            <p className={styles.speakerTitle}>{speaker.title}</p>
                            <p className={styles.speakerCompany}>{speaker.company}</p>
                            <p className={styles.speakerBio}>{speaker.bio}</p>
                            
                            <div className={styles.speakerExpertise}>
                                  {speaker.expertise?.slice(0, 3).map(skill => (
                                <span key={skill} className={styles.expertiseTag}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                            
                            {speaker.social && (
                              <div className={styles.speakerSocial}>
                                {speaker.social.linkedin && (
                                  <a href={speaker.social.linkedin} target="_blank" rel="noopener noreferrer">
                                    <FiExternalLink />
                                  </a>
                                )}
                                {speaker.social.website && (
                                  <a href={speaker.social.website} target="_blank" rel="noopener noreferrer">
                                    <FiGlobe />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </HolographicCard>
                          ) : (
                            // Other speakers get enhanced cards
                            <motion.div 
                              className={styles.speakerCard}
                              whileHover={{ y: -5, scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className={styles.speakerAvatar}>
                                <Image
                                  src={speaker.avatar}
                                  alt={speaker.name}
                                  width={100}
                                  height={100}
                                  className={styles.avatarImage}
                                />
                                {speaker.expertise?.includes('Keynote') && (
                                  <div className={styles.speakerBadge}>
                                    <FiStar />
                                  </div>
                                )}
                              </div>
                              
                              <div className={styles.speakerInfo}>
                                <h3>{speaker.name}</h3>
                                <p className={styles.speakerTitle}>{speaker.title}</p>
                                <p className={styles.speakerCompany}>{speaker.company}</p>
                                
                                <div className={styles.speakerBioPreview}>
                                  <p>{speaker.bio?.slice(0, 100)}...</p>
                                  <button className={styles.readMoreButton}>
                                    <FiInfo />
                                    Read More
                                  </button>
                                </div>
                                
                                <div className={styles.speakerExpertise}>
                                  {speaker.expertise?.slice(0, 2).map(skill => (
                                    <span key={skill} className={styles.expertiseTag}>
                                      {skill}
                                    </span>
                                  ))}
                                  {(speaker.expertise?.length || 0) > 2 && (
                                    <span className={styles.moreExpertise}>
                                      +{(speaker.expertise?.length || 0) - 2} more
                                    </span>
                                  )}
                                </div>
                                
                                <div className={styles.speakerActions}>
                                  {speaker.social?.linkedin && (
                                    <a 
                                      href={speaker.social.linkedin} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={styles.socialButton}
                                    >
                                      <FiExternalLink />
                                      LinkedIn
                                    </a>
                                  )}
                                  <button className={styles.contactSpeaker}>
                                    <FiMail />
                                    Contact
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                      </motion.div>
                    ))}
                  </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <FiUsers className={styles.emptyIcon} />
                      <h3>Speakers Coming Soon</h3>
                      <p>We're finalizing our lineup of expert speakers. Check back soon!</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'gallery' && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={styles.galleryContent}
                  role="tabpanel"
                  id="gallery-panel"
                  aria-labelledby="gallery-tab"
                >
                  <div className={styles.sectionHeader}>
                    <h2>Event Gallery</h2>
                    
                    <div className={styles.galleryControls}>
                      <div className={styles.gallerySummary}>
                        <span>{event.videos?.length || 0} videos</span>
                        <span>•</span>
                        <span>{event.gallery?.length || 0} photos</span>
                        <span>•</span>
                        <span>{(event.videos?.length || 0) + (event.gallery?.length || 0)} total items</span>
                      </div>
                      
                      {/* Media Type Filters */}
                      <div className={styles.mediaFilters}>
                        <button className={styles.filterButton}>
                          <FiPlay />
                          Videos Only
                        </button>
                        <button className={styles.filterButton}>
                          <FiExternalLink />
                          Photos Only
                        </button>
                        <button className={styles.filterButton}>
                          <FiStar />
                          Featured Media
                        </button>
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className={styles.mediaStats}>
                      <div className={styles.mediaStat}>
                        <FiPlay />
                        <span>Total Video Duration: 12 min</span>
                      </div>
                      <div className={styles.mediaStat}>
                        <FiDownload />
                        <span>Available for Download</span>
                      </div>
                    </div>
                  </div>
                  
                  {(event.videos?.length > 0 || event.gallery?.length > 0) ? (
                    <>
                      {event.videos && event.videos.length > 0 && (
                    <div className={styles.videoSection}>
                      <h3>Preview Videos</h3>
                      <div className={styles.videoGrid}>
                            {event.videos.slice(0, 1).map(video => (
                              // First video gets special treatment
                          <HolographicCard
                            key={video.id}
                            glowColor="platinum"
                            interactive={true}
                                className={styles.featuredVideoCard}
                          >
                            <div className={styles.videoThumbnail}>
                              <Image
                                    src={video.thumbnail || '/images/placeholder.jpg'}
                                    alt={video.title || 'Video thumbnail'}
                                    width={400}
                                    height={250}
                                    className={styles.thumbnailImage}
                                  />
                                  <div className={styles.playButton}>
                                    <FiPlay />
                                  </div>
                                  <div className={styles.videoBadge}>Featured</div>
                                </div>
                                <div className={styles.videoInfo}>
                                  <h4>{video.title}</h4>
                                  {video.description && <p>{video.description}</p>}
                                </div>
                              </HolographicCard>
                            ))}
                            {event.videos.slice(1).map(video => (
                              // Other videos get regular treatment
                              <div key={video.id} className={styles.videoCard}>
                                <div className={styles.videoThumbnail}>
                                  <Image
                                    src={video.thumbnail || '/images/placeholder.jpg'}
                                    alt={video.title || 'Video thumbnail'}
                                width={300}
                                height={200}
                                className={styles.thumbnailImage}
                              />
                              <div className={styles.playButton}>
                                <FiPlay />
                              </div>
                            </div>
                            <h4>{video.title}</h4>
                              </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                      {event.gallery && event.gallery.length > 0 && (
                    <div className={styles.imageGallery}>
                      <h3>Photo Gallery</h3>
                      <div className={styles.galleryGrid}>
                                                {event.gallery.map((image, index) => (
                          <motion.div
                            key={index}
                            className={styles.galleryItem}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                              // TODO: Open lightbox
                            }}
                          >
                            <Image
                              src={typeof image === 'string' ? image : image.url || '/images/placeholder.jpg'}
                              alt={`Gallery image ${index + 1}`}
                              width={300}
                              height={200}
                              className={styles.galleryImage}
                            />
                            <div className={styles.imageOverlay}>
                              <div className={styles.imageActions}>
                                <button className={styles.viewButton}>
                                  <FiExternalLink />
                                  View Full Size
                                </button>
                                <button className={styles.downloadButton}>
                                  <FiDownload />
                                  Download
                                </button>
                                <button className={styles.shareButton}>
                                  <FiShare2 />
                                  Share
                                </button>
                              </div>
                              <div className={styles.imageInfo}>
                                <span className={styles.imageIndex}>{index + 1} of {event.gallery.length}</span>
                                <span className={styles.imageCategory}>Event Photos</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className={styles.emptyState}>
                      <FiStar className={styles.emptyIcon} />
                      <h3>Gallery Coming Soon</h3>
                      <p>Photos and videos from the event will be available here.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <HolographicCard
              glowColor="gold"
              className={styles.registrationCard}
              interactive={false}
            >
              <div className={styles.cardHeader}>
                <h3>Registration</h3>
                {!isEventSoldOut && !isRegistrationClosed && (
                  <div className={styles.availability}>
                    <FiUsers />
                    <span>{event.capacity.available} spots left</span>
                  </div>
                )}
              </div>
              
              <div className={styles.selectedPricingDisplay}>
                <div className={styles.pricingTier}>
                  <span className={styles.tierName}>
                    {selectedPricingOption?.name || 'Select Option'}
                  </span>
                  {isEarlyBird && (
                    <span className={styles.earlyBirdBadge}>
                      <FiStar />
                      Early Bird
                    </span>
                  )}
                </div>
                
                <div className={styles.priceDisplay}>
                  <div className={styles.currentPrice}>
                    <span className={styles.currency}>$</span>
                    <span className={styles.amount}>{displayPrice}</span>
                  </div>
                  {isEarlyBird && (
                    <div className={styles.originalPriceStriked}>
                      <span>Regular: ${selectedPricingOption?.price}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {event.pricing.length > 1 && (
                <div className={styles.pricingToggle}>
                  <label>Select Option:</label>
                  <div className={styles.pricingTabs}>
                {event.pricing.map(pricing => (
                      <button
                    key={pricing.id}
                        className={`${styles.pricingTab} ${selectedPricing === pricing.id ? styles.active : ''}`}
                    onClick={() => setSelectedPricing(pricing.id)}
                  >
                        <span className={styles.tabName}>{pricing.name}</span>
                        <span className={styles.tabPrice}>
                        ${pricing.earlyBird && new Date() <= pricing.earlyBird.deadline 
                          ? pricing.earlyBird.price 
                          : pricing.price
                        }
                        </span>
                      </button>
                    ))}
                      </div>
                    </div>
              )}
              
              <div className={styles.selectedFeatures}>
                <h4>What's Included</h4>
                <ul>
                  {selectedPricingOption?.features.slice(0, 4).map(feature => (
                        <li key={feature}>
                          <FiCheckCircle />
                      <span>{feature}</span>
                        </li>
                      ))}
                  {(selectedPricingOption?.features?.length || 0) > 4 && (
                        <li className={styles.moreFeatures}>
                      <FiCheckCircle />
                      <span>+{(selectedPricingOption?.features?.length || 0) - 4} more benefits</span>
                        </li>
                      )}
                    </ul>
              </div>

              {isRegistrationClosed && (
                <div className={styles.statusAlert}>
                  <FiAlertCircle />
                  <div>
                    <strong>Registration Closed</strong>
                    <span>Ended on {event.registrationDeadline.toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              
              {isEventSoldOut && (
                <div className={styles.statusAlert}>
                  <FiAlertCircle />
                  <div>
                    <strong>Event Sold Out</strong>
                    <span>All {event.capacity.total} spots are taken</span>
                  </div>
                </div>
              )}

              <div className={styles.registrationActions}>
                <LuxuryButton
                  variant={isEventSoldOut || isRegistrationClosed ? "secondary" : "primary"}
                  size="large"
                  onClick={() => !isEventSoldOut && !isRegistrationClosed && setShowRegistrationModal(true)}
                  disabled={isEventSoldOut || isRegistrationClosed}
                  glowEffect={!isEventSoldOut && !isRegistrationClosed}
                >
                  {isEventSoldOut ? 'Sold Out' : isRegistrationClosed ? 'Registration Closed' : `Register Now - $${displayPrice}`}
                </LuxuryButton>
                
                <div className={styles.secondaryActions}>
                  <button className={styles.linkButton}>
                    <FiMail />
                    Contact Organizer
                  </button>
              </div>
            </div>
            </HolographicCard>

            <HolographicCard
              glowColor="platinum"
              className={styles.organizerCard}
            >
              <h3>Event Organizer</h3>
              <div className={styles.organizerInfo}>
                <h4>{event.organizer.name}</h4>
                <p>{event.organizer.company}</p>
                
                <div className={styles.organizerContact}>
                  <div className={styles.contactItem}>
                    <FiMail />
                    <a href={`mailto:${event.organizer.email}`}>{event.organizer.email}</a>
                  </div>
                  
                  {event.organizer.phone && (
                    <div className={styles.contactItem}>
                      <FiPhone />
                      <a href={`tel:${event.organizer.phone}`}>{event.organizer.phone}</a>
                    </div>
                  )}
                  
                  {event.organizer.website && (
                    <div className={styles.contactItem}>
                      <FiGlobe />
                      <a href={event.organizer.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </HolographicCard>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegistrationModal && (
          <RegistrationModal
            event={event}
            selectedPricing={selectedPricingOption}
            onClose={() => setShowRegistrationModal(false)}
            onSubmit={handleRegistration}
            isLoading={isRegistering}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Multi-Step Registration Modal Component
interface RegistrationModalProps {
  event: Event;
  selectedPricing: any;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  selectedPricing,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Step 2: Professional Info
    company: '',
    title: '',
    industry: '',
    // Step 3: Event Info
    dietaryRestrictions: '',
    specialRequests: '',
    marketingConsent: false,
    // Validation
    errors: {} as Record<string, string>
  });

  const totalSteps = 3;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }
    
    setFormData(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
    onSubmit({
      ...formData,
      eventId: event.id,
      pricingId: selectedPricing?.id,
      totalAmount: selectedPricing?.price
    });
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  const stepTitles = [
    'Personal Information',
    'Professional Details', 
    'Event Preferences'
  ];

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
          <h2>Register for {event.title}</h2>
            <p className={styles.stepIndicator}>
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </p>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className={styles.stepNumbers}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`${styles.stepNumber} ${
                  i + 1 <= currentStep ? styles.completed : styles.upcoming
                }`}
              >
                {i + 1 <= currentStep ? <FiCheckCircle /> : i + 1}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.registrationForm}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={styles.formStep}
              >
                <div className={styles.stepHeader}>
                  <FiUsers className={styles.stepIcon} />
                  <h3>Personal Information</h3>
                  <p>Tell us about yourself</p>
                </div>

          <div className={styles.formGrid}>
                  <LuxuryInput
                    label="First Name"
                type="text"
                value={formData.firstName}
                    onChange={(value) => updateFormData('firstName', value)}
                    error={formData.errors.firstName}
                    icon={<FiUsers />}
              />

                  <LuxuryInput
                    label="Last Name"
                type="text"
                value={formData.lastName}
                    onChange={(value) => updateFormData('lastName', value)}
                    error={formData.errors.lastName}
                    icon={<FiUsers />}
              />

                  <LuxuryInput
                    label="Email Address"
                type="email"
                value={formData.email}
                    onChange={(value) => updateFormData('email', value)}
                    error={formData.errors.email}
                    icon={<FiMail />}
                  />

                  <LuxuryInput
                    label="Phone Number"
                    type="text"
                value={formData.phone}
                    onChange={(value) => updateFormData('phone', value)}
                    icon={<FiPhone />}
                    voiceInput={true}
              />
            </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={styles.formStep}
              >
                <div className={styles.stepHeader}>
                  <FiGlobe className={styles.stepIcon} />
                  <h3>Professional Details</h3>
                  <p>Help us understand your background</p>
                </div>

                <div className={styles.formGrid}>
                  <LuxuryInput
                    label="Company Name"
                type="text"
                value={formData.company}
                    onChange={(value) => updateFormData('company', value)}
                    icon={<FiGlobe />}
              />

                  <LuxuryInput
                    label="Job Title"
                type="text"
                value={formData.title}
                    onChange={(value) => updateFormData('title', value)}
                    icon={<FiUsers />}
                  />

                  <LuxuryInput
                    label="Industry"
                    type="text"
                    value={formData.industry}
                    onChange={(value) => updateFormData('industry', value)}
                    icon={<FiGlobe />}
              />
            </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={styles.formStep}
              >
                <div className={styles.stepHeader}>
                  <FiStar className={styles.stepIcon} />
                  <h3>Event Preferences</h3>
                  <p>Final details for your registration</p>
          </div>

                <div className={styles.formColumn}>
                  <LuxuryInput
                    label="Dietary Restrictions"
                    type="text"
                    value={formData.dietaryRestrictions}
                    onChange={(value) => updateFormData('dietaryRestrictions', value)}
                    placeholder="Any dietary requirements or allergies"
                  />

                  <LuxuryInput
                    label="Special Requests"
                    type="text"
              value={formData.specialRequests}
                    onChange={(value) => updateFormData('specialRequests', value)}
                    placeholder="Accessibility needs, questions, etc."
                  />

                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.marketingConsent}
                        onChange={(e) => updateFormData('marketingConsent', e.target.checked)}
                      />
                      <span className={styles.checkmark}></span>
                      I'd like to receive updates about future events
                    </label>
                  </div>
          </div>

                <HolographicCard
                  glowColor="gold"
                  className={styles.registrationSummary}
                  interactive={false}
                >
                  <h4>Registration Summary</h4>
                  <div className={styles.summaryDetails}>
            <div className={styles.summaryItem}>
                      <span>Event:</span>
                      <span>{event.title}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span>Date:</span>
                      <span>{event.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span>Option:</span>
              <span>{selectedPricing?.name}</span>
            </div>
            <div className={styles.summaryTotal}>
                      <span>Total:</span>
                      <span className={styles.totalAmount}>${selectedPricing?.price}</span>
            </div>
          </div>
                </HolographicCard>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.modalActions}>
            <div className={styles.navigationButtons}>
              {currentStep > 1 && (
            <LuxuryButton
              variant="glass"
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  <FiArrowLeft />
                  Previous
                </LuxuryButton>
              )}
              
              <LuxuryButton
                variant="glass"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </LuxuryButton>
            </div>
            
            <div className={styles.primaryAction}>
              {currentStep < totalSteps ? (
                <LuxuryButton
              variant="primary"
                  onClick={handleNext}
                  disabled={isLoading}
                  glowEffect={true}
                >
                  Continue
                  <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
                </LuxuryButton>
              ) : (
                <LuxuryButton
                  variant="primary"
                  onClick={() => handleSubmit({} as React.FormEvent)}
                  disabled={isLoading}
              loading={isLoading}
                  glowEffect={true}
                >
                  {event.requiresApproval ? 'Submit for Approval' : 'Complete Registration'}
                </LuxuryButton>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};