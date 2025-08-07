'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiSave, 
  FiCalendar, 
  FiMapPin, 
  FiUsers, 
  FiDollarSign,
  FiImage,
  FiVideo,
  FiFileText,
  FiSettings,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiTrash2,
  FiGlobe,
  FiClock,
  FiStar,
  FiTag,
  FiAward,
  FiMail,
  FiPhone,
  FiExternalLink,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiInfo,
  FiPlay,
  FiPause,
  FiStopCircle,
  FiHome,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import { LuxuryButton, HolographicCard, LuxuryInput } from '@/components/nextgen/LuxuryComponents';
import { Event } from '@/lib/types/event';
import styles from './enhanced-event-modal.module.scss';

interface EnhancedEventModalProps {
  event: Event | null;
  onClose: () => void;
  onSave: (event: Event) => void;
}

export default function EnhancedEventModal({ event, onClose, onSave }: EnhancedEventModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    title: event?.title || '',
    subtitle: event?.subtitle || '',
    description: event?.description || '',
    type: event?.type || 'workshop',
    status: event?.status || 'draft',
    
    // Date & Time
    startDate: event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
    startTime: event?.startDate ? new Date(event.startDate).toTimeString().slice(0, 5) : '09:00',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    endTime: event?.endDate ? new Date(event.endDate).toTimeString().slice(0, 5) : '17:00',
    timezone: event?.timezone || 'Asia/Jerusalem',
    
    // Location
    locationType: event?.location?.type || 'physical',
    venue: event?.location?.venue || '',
    address: event?.location?.address || '',
    city: event?.location?.city || '',
    country: event?.location?.country || 'Israel',
    
    // Capacity & Pricing
    totalCapacity: event?.capacity?.total || 50,
    pricing: event?.pricing || [
      { id: '1', name: 'Early Bird', price: 299, isDefault: true },
      { id: '2', name: 'Regular', price: 399, isDefault: false }
    ],
    
    // Features & Requirements
    features: event?.features || [],
    requirements: event?.requirements || [],
    
    // Registration Settings
    registrationDeadline: event?.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : '',
    requiresApproval: event?.requiresApproval || false,
    
    // Organizer
    organizerName: event?.organizer?.name || '',
    organizerEmail: event?.organizer?.email || '',
    organizerCompany: event?.organizer?.company || 'MitoDerm',
    organizerPhone: event?.organizer?.phone || '',
    organizerWebsite: event?.organizer?.website || '',
    
    // Media
    coverImage: event?.coverImage || '',
    gallery: event?.gallery || [],
    videos: event?.videos || [],
    coverVideo: event?.coverVideo || '',
    
    // Content
    speakers: event?.speakers || [],
    agenda: event?.agenda || [],
    
    // Validation
    errors: {} as Record<string, string>
  });

  const totalSteps = 6;
  const stepTitles = [
    'Event Basics',
    'Schedule & Venue',
    'Pricing & Capacity',
    'Features & Content',
    'Organizer Info',
    'Review & Launch'
  ];

  const stepIcons = [
    <FiFileText key="basic" />,
    <FiCalendar key="date" />,
    <FiDollarSign key="pricing" />,
    <FiStar key="content" />,
    <FiUsers key="organizer" />,
    <FiZap key="review" />
  ];

  const stepColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ];

  // Validation functions
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim()) newErrors.title = 'Event title is required';
        if (!formData.description.trim()) newErrors.description = 'Event description is required';
        if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
        break;
        
      case 2: // Date & Location
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        if (formData.startDate && formData.status === 'published') {
          const startDate = new Date(formData.startDate);
          const now = new Date();
          if (startDate <= now) {
            newErrors.startDate = 'Published events must have a future start date';
          }
        }
        if (formData.locationType === 'physical') {
          if (!formData.venue.trim()) newErrors.venue = 'Venue is required for physical events';
          if (!formData.city.trim()) newErrors.city = 'City is required for physical events';
        }
        break;
        
      case 3: // Capacity & Pricing
        if (formData.totalCapacity < 1) newErrors.totalCapacity = 'Capacity must be at least 1';
        if (formData.pricing.length === 0) newErrors.pricing = 'At least one pricing option is required';
        if (formData.pricing.some(p => p.price <= 0)) newErrors.pricing = 'All prices must be greater than 0';
        break;
        
      case 4: // Content & Features
        if (formData.features.length === 0) newErrors.features = 'At least one feature is required';
        break;
        
      case 5: // Organizer Details
        if (!formData.organizerName.trim()) newErrors.organizerName = 'Organizer name is required';
        if (!formData.organizerEmail.trim()) newErrors.organizerEmail = 'Organizer email is required';
        if (formData.organizerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizerEmail)) {
          newErrors.organizerEmail = 'Please enter a valid email address';
        }
        break;
    }
    
    setFormData(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      const eventData: Event = {
        id: event?.id || `event_${Date.now()}`,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        startDate: new Date(`${formData.startDate}T${formData.startTime}`),
        endDate: new Date(`${formData.endDate}T${formData.endTime}`),
        timezone: formData.timezone,
        location: {
          type: formData.locationType as 'physical' | 'virtual',
          venue: formData.venue,
          address: formData.address,
          city: formData.city,
          country: formData.country
        },
        capacity: {
          total: formData.totalCapacity,
          reserved: 0,
          available: formData.totalCapacity
        },
        pricing: formData.pricing.map(p => ({
          ...p,
          currency: 'USD',
          description: p.name,
          features: [],
          available: 100
        })),
        features: formData.features.map(f => ({
          ...f,
          included: true
        })),
        requirements: formData.requirements,
        registrationDeadline: new Date(formData.registrationDeadline),
        requiresApproval: formData.requiresApproval,
        organizer: {
          name: formData.organizerName,
          email: formData.organizerEmail,
          company: formData.organizerCompany,
          phone: formData.organizerPhone,
          website: formData.organizerWebsite
        },
        coverImage: formData.coverImage,
        gallery: formData.gallery,
        videos: formData.videos,
        speakers: formData.speakers,
        agenda: formData.agenda,
        createdAt: event?.createdAt || new Date(),
        updatedAt: new Date(),
        createdBy: event?.createdBy || 'admin',
        slug: event?.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        allowWaitlist: false,
        targetAudience: [],
        tags: [],
        categories: [],
        coverVideo: formData.coverVideo
      };
      
      onSave(eventData);
    } catch (error) {
      console.error('Failed to save event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  const addPricingOption = () => {
    const newId = `pricing_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      pricing: [...prev.pricing, { id: newId, name: '', price: 0, isDefault: false }]
    }));
  };

  const removePricingOption = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.filter(p => p.id !== id)
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { id: `feature_${Date.now()}`, name: '', description: '', icon: '⭐', included: true }]
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          updateFormData('coverVideo', reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.eventCreatorPage}>
      {/* Background with animated gradients */}
      <div className={styles.backgroundGradient}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>
      </div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button onClick={onClose} className={styles.backButton}>
              <FiArrowLeft />
              <span>Back to Events</span>
            </button>
            <div className={styles.headerTitle}>
              <h1>{event ? 'Edit Event' : 'Create New Event'}</h1>
              <p>Design your perfect event experience</p>
            </div>
          </div>
          
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <FiTrendingUp />
              <span>Step {currentStep} of {totalSteps}</span>
            </div>
            <div className={styles.statItem}>
              <FiZap />
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ background: stepColors[currentStep - 1] }}
          />
        </div>
        
        <div className={styles.stepNavigation}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <motion.button
              key={i + 1}
              className={`${styles.stepButton} ${currentStep === i + 1 ? styles.active : ''} ${i + 1 < currentStep ? styles.completed : ''}`}
              onClick={() => i + 1 <= currentStep && setCurrentStep(i + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: currentStep === i + 1 ? stepColors[i] : 'transparent'
              }}
            >
              <div className={styles.stepIcon}>
                {i + 1 < currentStep ? <FiCheck /> : stepIcons[i]}
              </div>
              <span className={styles.stepLabel}>{stepTitles[i]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className={styles.stepContent}
              >
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon} style={{ background: stepColors[0] }}>
                    {stepIcons[0]}
                  </div>
                  <div>
                    <h2>Event Basics</h2>
                    <p>Start with the fundamental details of your event</p>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Event Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        placeholder="Enter your event title"
                        className={styles.modernInput}
                      />
                      {formData.errors.title && (
                        <span className={styles.errorText}>{formData.errors.title}</span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label>Subtitle</label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => updateFormData('subtitle', e.target.value)}
                        placeholder="Optional subtitle"
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label>Event Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => updateFormData('type', e.target.value)}
                        className={styles.modernSelect}
                      >
                        <option value="workshop">Workshop</option>
                        <option value="conference">Conference</option>
                        <option value="webinar">Webinar</option>
                        <option value="training">Training</option>
                        <option value="seminar">Seminar</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label>Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => updateFormData('status', e.target.value)}
                        className={styles.modernSelect}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <small className={styles.fieldNote}>
                        💡 Set to "Published" to make this event visible to users
                      </small>
                    </div>

                    <div className={styles.formField}>
                      <label>Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Describe your event in detail..."
                        className={styles.modernTextarea}
                        rows={6}
                      />
                      {formData.errors.description && (
                        <span className={styles.errorText}>{formData.errors.description}</span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label>Event Introduction Video</label>
                      <div className={styles.videoUploadSection}>
                        {formData.coverVideo ? (
                          <div className={styles.videoPreview}>
                            <video 
                              src={formData.coverVideo} 
                              controls 
                              className={styles.videoPlayer}
                            />
                            <button
                              type="button"
                              onClick={() => updateFormData('coverVideo', '')}
                              className={styles.removeVideoButton}
                            >
                              <FiTrash2 />
                              Remove Video
                            </button>
                          </div>
                        ) : (
                          <div className={styles.videoUploadArea}>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoUpload}
                              className={styles.videoInput}
                              id="video-upload"
                            />
                            <label htmlFor="video-upload" className={styles.videoUploadLabel}>
                              <FiUpload />
                              <span>Upload Event Video</span>
                              <small>MP4, WebM, or MOV up to 100MB</small>
                            </label>
                          </div>
                        )}
                      </div>
                      <small className={styles.fieldNote}>
                        🎥 Upload a video to help users understand what the event is about
                      </small>
                      <small className={styles.fieldNote}>
                        💡 Tip: Videos with the "event" tag will appear on the events page
                      </small>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className={styles.stepContent}
              >
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon} style={{ background: stepColors[1] }}>
                    {stepIcons[1]}
                  </div>
                  <div>
                    <h2>Schedule & Venue</h2>
                    <p>Set the time and location for your event</p>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.sectionTitle}>
                    <FiCalendar />
                    <h3>Event Schedule</h3>
                  </div>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Start Date *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateFormData('startDate', e.target.value)}
                        className={styles.modernInput}
                      />
                      {formData.errors.startDate && (
                        <span className={styles.errorText}>{formData.errors.startDate}</span>
                      )}
                      <small className={styles.fieldNote}>
                        📅 Use a future date for upcoming events to appear on the user page
                      </small>
                    </div>

                    <div className={styles.formField}>
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => updateFormData('startTime', e.target.value)}
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label>End Date *</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateFormData('endDate', e.target.value)}
                        className={styles.modernInput}
                      />
                      {formData.errors.endDate && (
                        <span className={styles.errorText}>{formData.errors.endDate}</span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label>End Time</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => updateFormData('endTime', e.target.value)}
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label>Timezone</label>
                      <select
                        value={formData.timezone}
                        onChange={(e) => updateFormData('timezone', e.target.value)}
                        className={styles.modernSelect}
                      >
                        <option value="Asia/Jerusalem">Asia/Jerusalem</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.sectionTitle}>
                    <FiMapPin />
                    <h3>Event Location</h3>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Location Type</label>
                      <select
                        value={formData.locationType}
                        onChange={(e) => updateFormData('locationType', e.target.value)}
                        className={styles.modernSelect}
                      >
                        <option value="physical">Physical Location</option>
                        <option value="virtual">Virtual Event</option>
                        <option value="hybrid">Hybrid Event</option>
                      </select>
                    </div>

                    {formData.locationType !== 'virtual' && (
                      <>
                        <div className={styles.formField}>
                          <label>Venue *</label>
                          <input
                            type="text"
                            value={formData.venue}
                            onChange={(e) => updateFormData('venue', e.target.value)}
                            placeholder="Enter venue name"
                            className={styles.modernInput}
                          />
                          {formData.errors.venue && (
                            <span className={styles.errorText}>{formData.errors.venue}</span>
                          )}
                        </div>

                        <div className={styles.formField}>
                          <label>Address</label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => updateFormData('address', e.target.value)}
                            placeholder="Enter full address"
                            className={styles.modernInput}
                          />
                        </div>

                        <div className={styles.formField}>
                          <label>City *</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            placeholder="Enter city"
                            className={styles.modernInput}
                          />
                          {formData.errors.city && (
                            <span className={styles.errorText}>{formData.errors.city}</span>
                          )}
                        </div>

                        <div className={styles.formField}>
                          <label>Country</label>
                          <select
                            value={formData.country}
                            onChange={(e) => updateFormData('country', e.target.value)}
                            className={styles.modernSelect}
                          >
                            <option value="Israel">Israel</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className={styles.stepContent}
              >
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon} style={{ background: stepColors[2] }}>
                    {stepIcons[2]}
                  </div>
                  <div>
                    <h2>Pricing & Capacity</h2>
                    <p>Set your event capacity and pricing structure</p>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.sectionTitle}>
                    <FiUsers />
                    <h3>Event Capacity</h3>
                  </div>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Total Capacity *</label>
                      <input
                        type="number"
                        value={formData.totalCapacity}
                        onChange={(e) => updateFormData('totalCapacity', parseInt(e.target.value) || 0)}
                        placeholder="Enter capacity"
                        className={styles.modernInput}
                      />
                      {formData.errors.totalCapacity && (
                        <span className={styles.errorText}>{formData.errors.totalCapacity}</span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label>Registration Deadline</label>
                      <input
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => updateFormData('registrationDeadline', e.target.value)}
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.requiresApproval}
                          onChange={(e) => updateFormData('requiresApproval', e.target.checked)}
                          className={styles.modernCheckbox}
                        />
                        <span>Requires manual approval</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.sectionTitle}>
                    <FiDollarSign />
                    <h3>Pricing Options</h3>
                    <button onClick={addPricingOption} className={styles.addButton}>
                      <FiPlus />
                      Add Option
                    </button>
                  </div>

                  {formData.errors.pricing && (
                    <span className={styles.errorText}>{formData.errors.pricing}</span>
                  )}

                  <div className={styles.pricingOptions}>
                    {formData.pricing.map((option, index) => (
                      <div key={option.id} className={styles.pricingCard}>
                        <div className={styles.pricingInputs}>
                          <div className={styles.formField}>
                            <label>Option Name</label>
                            <input
                              type="text"
                              value={option.name}
                              onChange={(e) => {
                                const newPricing = [...formData.pricing];
                                newPricing[index].name = e.target.value;
                                updateFormData('pricing', newPricing);
                              }}
                              placeholder="e.g., Early Bird, Regular"
                              className={styles.modernInput}
                            />
                          </div>
                          
                          <div className={styles.formField}>
                            <label>Price ($)</label>
                            <input
                              type="number"
                              value={option.price}
                              onChange={(e) => {
                                const newPricing = [...formData.pricing];
                                newPricing[index].price = parseFloat(e.target.value) || 0;
                                updateFormData('pricing', newPricing);
                              }}
                              placeholder="0.00"
                              className={styles.modernInput}
                            />
                          </div>
                          
                          <div className={styles.pricingActions}>
                            <label className={styles.radioLabel}>
                              <input
                                type="radio"
                                name="defaultPricing"
                                checked={option.isDefault}
                                onChange={() => {
                                  const newPricing = formData.pricing.map((p, i) => ({
                                    ...p,
                                    isDefault: i === index
                                  }));
                                  updateFormData('pricing', newPricing);
                                }}
                                className={styles.modernRadio}
                              />
                              <span>Default</span>
                            </label>
                            
                            {formData.pricing.length > 1 && (
                              <button
                                onClick={() => removePricingOption(option.id)}
                                className={styles.removeButton}
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className={styles.stepContent}
              >
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon} style={{ background: stepColors[3] }}>
                    {stepIcons[3]}
                  </div>
                  <div>
                    <h2>Features & Content</h2>
                    <p>Define what's included in your event</p>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.sectionTitle}>
                    <FiStar />
                    <h3>Event Features</h3>
                    <button onClick={addFeature} className={styles.addButton}>
                      <FiPlus />
                      Add Feature
                    </button>
                  </div>

                  {formData.errors.features && (
                    <span className={styles.errorText}>{formData.errors.features}</span>
                  )}

                  <div className={styles.featuresList}>
                    {formData.features.map((feature, index) => (
                      <div key={index} className={styles.featureCard}>
                        <div className={styles.featureInputs}>
                          <div className={styles.formField}>
                            <label>Icon</label>
                            <input
                              type="text"
                              value={feature.icon}
                              onChange={(e) => {
                                const newFeatures = [...formData.features];
                                newFeatures[index].icon = e.target.value;
                                updateFormData('features', newFeatures);
                              }}
                              placeholder="⭐"
                              className={styles.iconInput}
                            />
                          </div>
                          
                          <div className={styles.formField}>
                            <label>Feature Name</label>
                            <input
                              type="text"
                              value={feature.name}
                              onChange={(e) => {
                                const newFeatures = [...formData.features];
                                newFeatures[index].name = e.target.value;
                                updateFormData('features', newFeatures);
                              }}
                              placeholder="e.g., Certificate, Materials"
                              className={styles.modernInput}
                            />
                          </div>
                          
                          <div className={styles.formField}>
                            <label>Description</label>
                            <input
                              type="text"
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...formData.features];
                                newFeatures[index].description = e.target.value;
                                updateFormData('features', newFeatures);
                              }}
                              placeholder="Brief description"
                              className={styles.modernInput}
                            />
                          </div>
                          
                          <button
                            onClick={() => removeFeature(index)}
                            className={styles.removeButton}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.sectionTitle}>
                    <FiInfo />
                    <h3>Requirements</h3>
                  </div>
                  
                  <div className={styles.formField}>
                    <label>Event Requirements</label>
                    <textarea
                      value={formData.requirements.join('\n')}
                      onChange={(e) => updateFormData('requirements', e.target.value.split('\n').filter(r => r.trim()))}
                      placeholder="Enter requirements (one per line)..."
                      className={styles.modernTextarea}
                      rows={4}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className={styles.stepContent}
              >
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon} style={{ background: stepColors[4] }}>
                    {stepIcons[4]}
                  </div>
                  <div>
                    <h2>Organizer Information</h2>
                    <p>Tell attendees who's organizing this event</p>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Organizer Name *</label>
                      <input
                        type="text"
                        value={formData.organizerName}
                        onChange={(e) => updateFormData('organizerName', e.target.value)}
                        placeholder="Enter organizer name"
                        className={styles.modernInput}
                      />
                      {formData.errors.organizerName && (
                        <span className={styles.errorText}>{formData.errors.organizerName}</span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label>Organizer Email *</label>
                      <input
                        type="email"
                        value={formData.organizerEmail}
                        onChange={(e) => updateFormData('organizerEmail', e.target.value)}
                        placeholder="Enter organizer email"
                        className={styles.modernInput}
                      />
                      {formData.errors.organizerEmail && (
                        <span className={styles.errorText}>{formData.errors.organizerEmail}</span>
                      )}
                    </div>

                    <div className={styles.formField}>
                      <label>Company</label>
                      <input
                        type="text"
                        value={formData.organizerCompany}
                        onChange={(e) => updateFormData('organizerCompany', e.target.value)}
                        placeholder="Enter company name"
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label>Phone</label>
                      <input
                        type="text"
                        value={formData.organizerPhone}
                        onChange={(e) => updateFormData('organizerPhone', e.target.value)}
                        placeholder="Enter phone number"
                        className={styles.modernInput}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label>Website</label>
                      <input
                        type="text"
                        value={formData.organizerWebsite}
                        onChange={(e) => updateFormData('organizerWebsite', e.target.value)}
                        placeholder="Enter website URL"
                        className={styles.modernInput}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className={styles.stepContent}
              >
                <div className={styles.stepHeader}>
                  <div className={styles.stepIcon} style={{ background: stepColors[5] }}>
                    {stepIcons[5]}
                  </div>
                  <div>
                    <h2>Review & Launch</h2>
                    <p>Review your event details before publishing</p>
                  </div>
                </div>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewGrid}>
                    <div className={styles.reviewCard}>
                      <h4>Event Details</h4>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Title:</span>
                        <span className={styles.reviewValue}>{formData.title}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Type:</span>
                        <span className={styles.reviewValue}>{formData.type}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Status:</span>
                        <span className={styles.reviewValue}>{formData.status}</span>
                      </div>
                    </div>

                    <div className={styles.reviewCard}>
                      <h4>Schedule</h4>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Start:</span>
                        <span className={styles.reviewValue}>
                          {formData.startDate} at {formData.startTime}
                        </span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>End:</span>
                        <span className={styles.reviewValue}>
                          {formData.endDate} at {formData.endTime}
                        </span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Timezone:</span>
                        <span className={styles.reviewValue}>{formData.timezone}</span>
                      </div>
                    </div>

                    <div className={styles.reviewCard}>
                      <h4>Location</h4>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Type:</span>
                        <span className={styles.reviewValue}>{formData.locationType}</span>
                      </div>
                      {formData.locationType !== 'virtual' && (
                        <>
                          <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>Venue:</span>
                            <span className={styles.reviewValue}>{formData.venue}</span>
                          </div>
                          <div className={styles.reviewItem}>
                            <span className={styles.reviewLabel}>City:</span>
                            <span className={styles.reviewValue}>{formData.city}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className={styles.reviewCard}>
                      <h4>Capacity & Pricing</h4>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Capacity:</span>
                        <span className={styles.reviewValue}>{formData.totalCapacity}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Pricing Options:</span>
                        <span className={styles.reviewValue}>{formData.pricing.length}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Requires Approval:</span>
                        <span className={styles.reviewValue}>
                          {formData.requiresApproval ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.pageFooter}>
        <div className={styles.footerActions}>
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              disabled={isSubmitting}
              className={styles.secondaryButton}
            >
              <FiArrowLeft />
              Previous
            </button>
          )}
          
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
        
        <div className={styles.primaryAction}>
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={styles.primaryButton}
              style={{ background: stepColors[currentStep - 1] }}
            >
              Continue
              <FiArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className={styles.primaryButton}
              style={{ background: stepColors[currentStep - 1] }}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner}></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave />
                  {event ? 'Update Event' : 'Create Event'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}