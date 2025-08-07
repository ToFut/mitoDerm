'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiMessageCircle, FiSend, FiCheck, FiArrowRight, FiArrowLeft, FiUser, FiHelpCircle } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import { FaWhatsapp, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import styles from './contact.module.scss';

// Enhanced Multi-Step Form Component
const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: '',
    email: '',
    phone: '',
    // Step 2: Business Info
    businessName: '',
    businessType: '',
    experience: '',
    // Step 3: Inquiry Details
    inquiryType: '',
    message: '',
    preferredContact: 'email',
    // Step 4: Preferences
    newsletter: false,
    updates: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { id: 1, title: 'פרטים אישיים', icon: FiUser },
    { id: 2, title: 'פרטי עסק', icon: FaBuilding },
    { id: 3, title: 'פרטי פנייה', icon: FiHelpCircle },
    { id: 4, title: 'סיכום', icon: FiCheck }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'שם מלא נדרש';
      if (!formData.email.trim()) newErrors.email = 'כתובת אימייל נדרשת';
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'כתובת אימייל לא תקינה';
      if (!formData.phone.trim()) newErrors.phone = 'מספר טלפון נדרש';
    }
    
    if (step === 2) {
      if (!formData.businessName.trim()) newErrors.businessName = 'שם עסק נדרש';
      if (!formData.businessType) newErrors.businessType = 'סוג עסק נדרש';
    }
    
    if (step === 3) {
      if (!formData.inquiryType) newErrors.inquiryType = 'סוג פנייה נדרש';
      if (!formData.message.trim()) newErrors.message = 'הודעה נדרשת';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        className={styles.successMessage}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.successIcon}>
          <FiCheck />
        </div>
        <h3>תודה על פנייתכם!</h3>
        <p>נחזור אליכם בהקדם האפשרי</p>
        <button 
          onClick={() => {
            setIsSubmitted(false);
            setCurrentStep(1);
            setFormData({
              name: '', email: '', phone: '', businessName: '', 
              businessType: '', experience: '', inquiryType: '', 
              message: '', preferredContact: 'email', newsletter: false, updates: false
            });
          }}
          className={styles.resetButton}
        >
          שלח פנייה נוספת
        </button>
      </motion.div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.progressStep}>
            <motion.div 
              className={`${styles.stepCircle} ${currentStep >= step.id ? styles.active : ''}`}
              whileHover={{ scale: 1.1 }}
            >
              <step.icon />
            </motion.div>
            <span className={styles.stepTitle}>{step.title}</span>
            {index < steps.length - 1 && (
              <div className={`${styles.stepLine} ${currentStep > step.id ? styles.completed : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className={styles.formStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              <h3>פרטים אישיים</h3>
              <div className={styles.inputGroup}>
                <label>שם מלא *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? styles.error : ''}
                  placeholder="הכניסו את שמכם המלא"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label>כתובת אימייל *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? styles.error : ''}
                  placeholder="example@email.com"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label>מספר טלפון *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? styles.error : ''}
                  placeholder="050-123-4567"
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={styles.stepContent}>
              <h3>פרטי העסק</h3>
              <div className={styles.inputGroup}>
                <label>שם העסק *</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className={errors.businessName ? styles.error : ''}
                  placeholder="שם הקליניקה או העסק"
                />
                {errors.businessName && <span className={styles.errorText}>{errors.businessName}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label>סוג העסק *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className={errors.businessType ? styles.error : ''}
                >
                  <option value="">בחרו סוג עסק</option>
                  <option value="clinic">קליניקה אסתטית</option>
                  <option value="spa">ספא</option>
                  <option value="cosmetics">קוסמטיקאית עצמאית</option>
                  <option value="medical">מרפאה רפואית</option>
                  <option value="other">אחר</option>
                </select>
                {errors.businessType && <span className={styles.errorText}>{errors.businessType}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label>שנות ניסיון</label>
                <select
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                >
                  <option value="">בחרו שנות ניסיון</option>
                  <option value="0-2">0-2 שנים</option>
                  <option value="3-5">3-5 שנים</option>
                  <option value="6-10">6-10 שנים</option>
                  <option value="10+">מעל 10 שנים</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.stepContent}>
              <h3>פרטי הפנייה</h3>
              <div className={styles.inputGroup}>
                <label>סוג הפנייה *</label>
                <div className={styles.radioGroup}>
                  {[
                    { value: 'product', label: 'מידע על מוצרים' },
                    { value: 'training', label: 'הכשרות והדרכות' },
                    { value: 'partnership', label: 'שותפות עסקית' },
                    { value: 'support', label: 'תמיכה טכנית' },
                    { value: 'other', label: 'אחר' }
                  ].map((option) => (
                    <label key={option.value} className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="inquiryType"
                        value={option.value}
                        checked={formData.inquiryType === option.value}
                        onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.inquiryType && <span className={styles.errorText}>{errors.inquiryType}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label>הודעה *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={errors.message ? styles.error : ''}
                  placeholder="אנא פרטו את בקשתכם..."
                  rows="4"
                />
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </div>
              
              <div className={styles.inputGroup}>
                <label>דרך יצירת קשר מועדפת</label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                >
                  <option value="email">אימייל</option>
                  <option value="phone">טלפון</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className={styles.stepContent}>
              <h3>סיכום הפנייה</h3>
              <div className={styles.summary}>
                <div className={styles.summaryItem}>
                  <strong>שם:</strong> {formData.name}
                </div>
                <div className={styles.summaryItem}>
                  <strong>אימייל:</strong> {formData.email}
                </div>
                <div className={styles.summaryItem}>
                  <strong>עסק:</strong> {formData.businessName}
                </div>
                <div className={styles.summaryItem}>
                  <strong>סוג פנייה:</strong> {formData.inquiryType}
                </div>
              </div>
              
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                  />
                  <span>אני מעוניין לקבל עדכונים ופרסומות</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.updates}
                    onChange={(e) => handleInputChange('updates', e.target.checked)}
                  />
                  <span>אני מעוניין לקבל עדכונים על מוצרים חדשים</span>
                </label>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className={styles.formNavigation}>
        {currentStep > 1 && (
          <motion.button
            className={styles.prevButton}
            onClick={prevStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft />
            חזור
          </motion.button>
        )}
        
        {currentStep < 4 ? (
          <motion.button
            className={styles.nextButton}
            onClick={nextStep}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            המשך
            <FiArrowRight />
          </motion.button>
        ) : (
          <motion.button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? 'שולח...' : 'שלח פנייה'}
            <FiSend />
          </motion.button>
        )}
      </div>
    </div>
  );
};

// Enhanced Contact Methods Component
const ContactMethods = () => {
  const contactMethods = [
    {
      icon: FiPhone,
      title: 'טלפון',
      info: '054-762-1889',
      description: 'זמינים א-ה 9:00-18:00',
      action: 'tel:+972547621889',
      color: '#4CAF50'
    },
    {
      icon: FiMail,
      title: 'אימייל',
      info: 'info@mitoderm.com',
      description: 'נחזור תוך 24 שעות',
      action: 'mailto:info@mitoderm.com',
      color: '#2196F3'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      info: '054-762-1889',
      description: 'תמיכה מהירה',
      action: 'https://wa.me/972547621889',
      color: '#25D366'
    },
    {
      icon: FiMapPin,
      title: 'כתובת',
      info: 'רפאל איתן 38, רמת גן',
      description: 'קביעת פגישה בתיאום מראש',
      action: 'https://maps.google.com/?q=Rafael+Eitan+38+Ramat+Gan',
      color: '#FF5722'
    }
  ];

  return (
    <div className={styles.contactMethods}>
      <h2>דרכי יצירת קשר</h2>
      <div className={styles.methodsGrid}>
        {contactMethods.map((method, index) => (
          <motion.a
            key={index}
            href={method.action}
            className={styles.methodCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            target={method.action.startsWith('http') ? '_blank' : '_self'}
          >
            <div className={styles.methodIcon} style={{ backgroundColor: method.color }}>
              <method.icon />
            </div>
            <h3>{method.title}</h3>
            <p className={styles.methodInfo}>{method.info}</p>
            <p className={styles.methodDescription}>{method.description}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

// Enhanced Business Hours Component
const BusinessHours = () => {
  const hours = [
    { day: 'ראשון - חמישי', time: '9:00 - 18:00', isOpen: true },
    { day: 'שישי', time: 'בתיאום מראש', isOpen: false },
    { day: 'שבת', time: 'סגור', isOpen: false }
  ];

  return (
    <div className={styles.businessHours}>
      <h3>שעות פעילות</h3>
      <div className={styles.hoursList}>
        {hours.map((hour, index) => (
          <motion.div
            key={index}
            className={`${styles.hourItem} ${hour.isOpen ? styles.open : styles.closed}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <span className={styles.day}>{hour.day}</span>
            <span className={styles.time}>{hour.time}</span>
            <div className={`${styles.status} ${hour.isOpen ? styles.openStatus : styles.closedStatus}`}>
              {hour.isOpen ? 'פתוח' : 'סגור'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function ContactClient() {
  const [activeTab, setActiveTab] = useState('contact');

  const tabs = [
    { id: 'contact', label: 'צור קשר', icon: FiMail },
    { id: 'location', label: 'מיקום', icon: FiMapPin },
    { id: 'support', label: 'תמיכה', icon: FiMessageCircle }
  ];

  return (
    <div className={styles.contactPage}>
      {/* Animated Background */}
      <div className={styles.backgroundElements}>
        <motion.div 
          className={styles.floatingShape1}
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={styles.floatingShape2}
          animate={{ 
            y: [0, 20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className={styles.glassBg}></div>
      
      <div className={styles.contactContent}>
        {/* Enhanced Hero Section */}
        <motion.div 
          className={styles.heroSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.gradientTitle}>צרו קשר</h1>
          <p className={styles.heroDescription}>
            אנחנו כאן לעזור לכם בכל שאלה או בקשה. צרו קשר איתנו ונחזור אליכם בהקדם
          </p>
          
          <div className={styles.heroStats}>
            <motion.div 
              className={styles.stat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FiClock className={styles.statIcon} />
              <span className={styles.statNumber}>24/7</span>
              <span className={styles.statLabel}>תמיכה זמינה</span>
            </motion.div>
            <motion.div 
              className={styles.stat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FiMapPin className={styles.statIcon} />
              <span className={styles.statNumber}>4</span>
              <span className={styles.statLabel}>מדינות פעילות</span>
            </motion.div>
            <motion.div 
              className={styles.stat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <FiCheck className={styles.statIcon} />
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>שביעות רצון</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className={styles.tabContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'contact' && (
              <div className={styles.contactTab}>
                <div className={styles.contactGrid}>
                  <div className={styles.formSection}>
                    <MultiStepForm />
                  </div>
                  <div className={styles.infoSection}>
                    <ContactMethods />
                    <BusinessHours />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className={styles.locationTab}>
                <div className={styles.mapContainer}>
                  <div className={styles.mapPlaceholder}>
                    <FiMapPin />
                    <p>מפה אינטראקטיבית</p>
                    <small>רפאל איתן 38, רמת גן</small>
                  </div>
                </div>
                <div className={styles.locationInfo}>
                  <h3>מיקום המשרד</h3>
                  <p>רפאל איתן 38, רמת גן, 5590500</p>
                  <p>הגעה בתחבורה ציבורית או חניה בסביבה</p>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className={styles.supportTab}>
                <h3>מרכז תמיכה</h3>
                <div className={styles.supportOptions}>
                  <div className={styles.supportOption}>
                    <FiMessageCircle />
                    <h4>שאלות נפוצות</h4>
                    <p>מצאו תשובות לשאלות הנפוצות ביותר</p>
                  </div>
                  <div className={styles.supportOption}>
                    <FiPhone />
                    <h4>תמיכה טלפונית</h4>
                    <p>054-762-1889 - זמינים א-ה 9:00-18:00</p>
                  </div>
                  <div className={styles.supportOption}>
                    <FaWhatsapp />
                    <h4>WhatsApp</h4>
                    <p>תמיכה מהירה דרך WhatsApp</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Social Media Links */}
        <motion.div 
          className={styles.socialSection}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3>עקבו אחרינו</h3>
          <div className={styles.socialLinks}>
            {[
              { icon: FaFacebook, url: '#', color: '#1877F2' },
              { icon: FaInstagram, url: '#', color: '#E4405F' },
              { icon: FaLinkedin, url: '#', color: '#0A66C2' },
              { icon: FaWhatsapp, url: '#', color: '#25D366' }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                className={styles.socialLink}
                style={{ backgroundColor: social.color }}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <social.icon />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 