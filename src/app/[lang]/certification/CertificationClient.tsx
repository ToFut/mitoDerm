'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAward, FiUsers, FiCalendar, FiMapPin, FiClock, FiCheckCircle, 
  FiStar, FiTrendingUp, FiBookOpen, FiVideo, FiFileText, FiGift,
  FiArrowRight, FiArrowLeft, FiExternalLink, FiDownload, FiShare2
} from 'react-icons/fi';
import { useOptimizedIntersectionObserver } from '@/utils/hooks/useOptimizedIntersectionObserver';
import styles from './certification.module.scss';

export default function CertificationClient() {
  const t = useTranslations('certification');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('meetings');
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null);

  // Intersection observer for animations
  const { targetRef: heroRef, isIntersecting: heroVisible } = useOptimizedIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  const { targetRef: statsRef, isIntersecting: statsVisible } = useOptimizedIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true
  });

  const meetings = [
    {
      id: 1,
      title: "מפגש היכרות - ראשון לציון",
      date: "15 במרץ 2025",
      time: "19:00-22:00",
      location: "מרכז הכנסים ראשון לציון",
      address: "רחוב הרצל 123, ראשון לציון",
      spots: 25,
      available: 8,
      price: 150,
      features: ["הדגמות מעשיות", "כיבוד קל", "מתנות", "הגרלות"]
    },
    {
      id: 2,
      title: "מפגש היכרות - רמת גן",
      date: "22 במרץ 2025",
      time: "19:00-22:00",
      location: "מרכז העסקים רמת גן",
      address: "רחוב ביאליק 45, רמת גן",
      spots: 30,
      available: 15,
      price: 150,
      features: ["הדגמות מעשיות", "כיבוד קל", "מתנות", "הגרלות"]
    },
    {
      id: 3,
      title: "מפגש היכרות - תל אביב",
      date: "29 במרץ 2025",
      time: "19:00-22:00",
      location: "מרכז הכנסים תל אביב",
      address: "רחוב דיזנגוף 100, תל אביב",
      spots: 35,
      available: 20,
      price: 150,
      features: ["הדגמות מעשיות", "כיבוד קל", "מתנות", "הגרלות"]
    }
  ];

  const benefits = [
    {
      icon: FiStar,
      title: "ידע מקצועי מתקדם",
      description: "גישה לטכנולוגיות החדשות ביותר בתחום הטיפול בפצעים",
      color: "#ff6b6b"
    },
    {
      icon: FiTrendingUp,
      title: "הזדמנויות עסקיות",
      description: "הרחבת שירותי הקליניקה והגדלת הרווחים",
      color: "#4ecdc4"
    },
    {
      icon: FiAward,
      title: "הסמכה מקצועית",
      description: "תעודה מוכרת המאפשרת שימוש במוצרי MitoDerm",
      color: "#45b7d1"
    },
    {
      icon: FiUsers,
      title: "קהילה מקצועית",
      description: "הצטרפות לקהילת מקצוענים מובילים בתחום",
      color: "#96ceb4"
    }
  ];

  const requirements = [
    {
      title: "דרישות בסיסיות",
      items: [
        "רישיון מקצועי תקף",
        "ניסיון של לפחות שנתיים בתחום",
        "מכתב המלצה ממעסיק או לקוח",
        "תעודת זהות תקפה"
      ]
    },
    {
      title: "מסמכים נדרשים",
      items: [
        "טופס הרשמה מלא",
        "צילום רישיון מקצועי",
        "צילום תעודת זהות",
        "מכתב המלצה",
        "תשלום דמי השתתפות"
      ]
    },
    {
      title: "תהליך ההרשמה",
      items: [
        "מילוי טופס הרשמה אונליין",
        "העלאת המסמכים הנדרשים",
        "אישור ראשוני תוך 48 שעות",
        "תשלום דמי השתתפות",
        "קבלת אישור סופי עם פרטי המפגש"
      ]
    }
  ];

  return (
    <div className={styles.certificationPage}>
      {/* Animated Background */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
      </div>
      
      {/* Glass Background */}
      <div className={styles.glassBg}></div>
      
      <div className={styles.certificationContent}>
        {/* Enhanced Hero Section */}
        <motion.section 
          ref={heroRef}
          className={styles.heroSection}
          initial={{ opacity: 0, y: 50 }}
          animate={heroVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.gradientTitle}>{t('hero.title')}</h1>
          <p className={styles.heroDescription}>
            {t('hero.description')}
          </p>
          
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <FiUsers />
              <span>500+ {t('stats.professionals')}</span>
            </div>
            <div className={styles.statItem}>
              <FiAward />
              <span>95% {t('stats.successRate')}</span>
            </div>
            <div className={styles.statItem}>
              <FiStar />
              <span>4.9/5 {t('stats.rating')}</span>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Tab Navigation */}
        <section className={styles.tabSection}>
          <div className={styles.tabNavigation}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'meetings' ? styles.active : ''}`}
              onClick={() => setActiveTab('meetings')}
            >
              <FiCalendar />
              {t('tabs.meetings')}
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'benefits' ? styles.active : ''}`}
              onClick={() => setActiveTab('benefits')}
            >
              <FiTrendingUp />
              {t('tabs.benefits')}
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'requirements' ? styles.active : ''}`}
              onClick={() => setActiveTab('requirements')}
            >
              <FiFileText />
              {t('tabs.requirements')}
            </button>
          </div>
        </section>

        {/* Enhanced Tab Content */}
        <section className={styles.tabContent}>
          <AnimatePresence mode="wait">
            {activeTab === 'meetings' && (
              <motion.div 
                key="meetings"
                className={styles.meetingsInfo}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.infoCard}>
                  <h3>תוכן המפגשים</h3>
                  <div className={styles.contentSections}>
                    <div className={styles.section}>
                      <h4>ערך מקצועי</h4>
                      <ul>
                        <li>הדגמות מעשיות מפורטות</li>
                        <li>ידע מקצועי חדיש</li>
                        <li>פרוטוקולים מתקדמים מ-2025</li>
                        <li>מחקרים ונתונים מתורגמים לעברית</li>
                      </ul>
                    </div>
                    
                    <div className={styles.section}>
                      <h4>הכשרה עסקית</h4>
                      <ul>
                        <li>איך למכור את הטיפולים החדשים</li>
                        <li>איך לתמחר נכון ולהשיג רווחיות מקסימלית</li>
                        <li>בניית תוכנית עסקית לשילוב המוצרים</li>
                        <li>טיפים לשיווק וקידום הקליניקה</li>
                      </ul>
                    </div>
                    
                    <div className={styles.section}>
                      <h4>חוויה נוספת</h4>
                      <ul>
                        <li>כיבוד קל</li>
                        <li>אווירה כיפית ונעימה</li>
                        <li>אווירה אינטימית ובוטיקית</li>
                        <li>מתנות והפתעות לכל המשתתפות</li>
                        <li>הגרלות מרגשות על מוצרים</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={styles.meetingsGrid}>
                  <h3>מפגשים קרובים</h3>
                  <div className={styles.meetingsList}>
                    {meetings.map((meeting, index) => (
                      <motion.div
                        key={meeting.id}
                        className={`${styles.meetingCard} ${selectedMeeting === meeting.id ? styles.selected : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedMeeting(meeting.id)}
                      >
                        <div className={styles.meetingHeader}>
                          <h4>{meeting.title}</h4>
                          <div className={styles.meetingMeta}>
                            <span className={styles.date}>
                              <FiCalendar />
                              {meeting.date}
                            </span>
                            <span className={styles.time}>
                              <FiClock />
                              {meeting.time}
                            </span>
                          </div>
                        </div>
                        
                        <div className={styles.meetingLocation}>
                          <FiMapPin />
                          <div>
                            <strong>{meeting.location}</strong>
                            <span>{meeting.address}</span>
                          </div>
                        </div>
                        
                        <div className={styles.meetingStats}>
                          <div className={styles.stat}>
                            <span className={styles.label}>מקומות זמינים:</span>
                            <span className={styles.value}>{meeting.available}/{meeting.spots}</span>
                          </div>
                          <div className={styles.stat}>
                            <span className={styles.label}>מחיר:</span>
                            <span className={styles.price}>₪{meeting.price}</span>
                          </div>
                        </div>
                        
                        <div className={styles.meetingFeatures}>
                          {meeting.features.map((feature, idx) => (
                            <span key={idx} className={styles.feature}>
                              <FiCheckCircle />
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <div className={styles.meetingActions}>
                          <button className={styles.primaryButton}>
                            <FiExternalLink />
                            הרשמה למפגש
                          </button>
                          <button className={styles.secondaryButton}>
                            <FiShare2 />
                            שתף
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3>פרטים לוגיסטיים</h3>
                  <div className={styles.logisticsInfo}>
                    <div className={styles.logisticsItem}>
                      <h4>עלות השתתפות</h4>
                      <p><strong>150 ש"ח</strong> דמי השתתפות (דמי רצינות)</p>
                      <p>הדמי רצינות מתקזזים במלואם בעת רכישה</p>
                    </div>
                    
                    <div className={styles.logisticsItem}>
                      <h4>מיקומים</h4>
                      <ul>
                        <li>ראשון לציון</li>
                        <li>רמת גן</li>
                        <li>תל אביב</li>
                      </ul>
                      <p>מיקום מדויק ישלח בהתאם לתאריך הנבחר</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'benefits' && (
              <motion.div 
                key="benefits"
                className={styles.benefitsInfo}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.section 
                  ref={statsRef}
                  className={styles.benefitsSection}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3>יתרונות ההסמכה</h3>
                  <div className={styles.benefitsGrid}>
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={benefit.title}
                        className={styles.benefitCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={statsVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className={styles.benefitIcon} style={{ backgroundColor: benefit.color }}>
                          <benefit.icon />
                        </div>
                        <h4>{benefit.title}</h4>
                        <p>{benefit.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                <div className={styles.additionalBenefits}>
                  <h3>יתרונות נוספים</h3>
                  <div className={styles.benefitsList}>
                    <div className={styles.benefitItem}>
                      <FiVideo />
                      <div>
                        <h4>גישה לתוכן דיגיטלי</h4>
                        <p>סרטוני הדרכה, מצגות ומסמכים מקצועיים</p>
                      </div>
                    </div>
                    <div className={styles.benefitItem}>
                      <FiBookOpen />
                      <div>
                        <h4>חומרי לימוד מתקדמים</h4>
                        <p>ספרות מקצועית ומחקרים עדכניים</p>
                      </div>
                    </div>
                    <div className={styles.benefitItem}>
                      <FiGift />
                      <div>
                        <h4>מוצרי דוגמה</h4>
                        <p>קבלת מוצרי דוגמה לבדיקה וניסוי</p>
                      </div>
                    </div>
                    <div className={styles.benefitItem}>
                      <FiUsers />
                      <div>
                        <h4>תמיכה מקצועית</h4>
                        <p>ליווי אישי ותמיכה טכנית מתמשכת</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'requirements' && (
              <motion.div 
                key="requirements"
                className={styles.requirementsInfo}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.requirementsGrid}>
                  {requirements.map((requirement, index) => (
                    <motion.div
                      key={requirement.title}
                      className={styles.requirementCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <h3>{requirement.title}</h3>
                      <ul>
                        {requirement.items.map((item, idx) => (
                          <li key={idx}>
                            <FiCheckCircle />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className={styles.registrationInfo}>
                  <h3>תהליך ההרשמה</h3>
                  <div className={styles.registrationSteps}>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepContent}>
                        <h4>מילוי טופס הרשמה</h4>
                        <p>מלאו את הטופס המקוון עם כל הפרטים הנדרשים</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepContent}>
                        <h4>העלאת מסמכים</h4>
                        <p>העלו את כל המסמכים הנדרשים בפורמט דיגיטלי</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepContent}>
                        <h4>אישור ראשוני</h4>
                        <p>קבלו אישור ראשוני תוך 48 שעות ממועד ההרשמה</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>4</div>
                      <div className={styles.stepContent}>
                        <h4>תשלום דמי השתתפות</h4>
                        <p>שלמו את דמי ההשתתפות בסך 150 ש"ח</p>
                      </div>
                    </div>
                    <div className={styles.step}>
                      <div className={styles.stepNumber}>5</div>
                      <div className={styles.stepContent}>
                        <h4>אישור סופי</h4>
                        <p>קבלו אישור סופי עם פרטי המפגש והמיקום המדויק</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.ctaSection}>
                  <h3>מוכנים להתחיל?</h3>
                  <p>הצטרפו למאות מקצוענים שכבר השתתפו במפגשי ההכשרה שלנו</p>
                  <div className={styles.ctaButtons}>
                    <button className={styles.primaryButton}>
                      <FiArrowRight />
                      הרשמה למפגש הבא
                    </button>
                    <button className={styles.secondaryButton}>
                      <FiDownload />
                      הורדת חוברת מידע
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
