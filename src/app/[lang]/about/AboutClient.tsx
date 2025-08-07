'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiTarget, FiAward, FiTrendingUp, FiGlobe, FiHeart, FiShield, FiZap, FiChevronRight, FiLinkedin, FiMail, FiPlay } from 'react-icons/fi';
import styles from './about.module.scss';

// Enhanced Timeline Component
const Timeline = ({ t }: { t: any }) => {
  const [activeYear, setActiveYear] = useState(0);
  
  const milestones = useMemo(() => [
    {
      year: "2018",
      title: t('timeline.2018.title'),
      description: t('timeline.2018.description'),
      icon: FiZap,
      color: "#ffd700"
    },
    {
      year: "2020",
      title: t('timeline.2020.title'),
      description: t('timeline.2020.description'),
      icon: FiTarget,
      color: "#dfba74"
    },
    {
      year: "2022",
      title: t('timeline.2022.title'),
      description: t('timeline.2022.description'),
      icon: FiGlobe,
      color: "#be800c"
    },
    {
      year: "2024",
      title: t('timeline.2024.title'),
      description: t('timeline.2024.description'),
      icon: FiAward,
      color: "#ffd700"
    }
  ], [t]);

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <h2>{t('timeline.title')}</h2>
        <p>{t('timeline.subtitle')}</p>
      </div>
      
      <div className={styles.timelineContainer}>
        <div className={styles.timelineLine}></div>
        
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className={`${styles.timelineItem} ${activeYear === index ? styles.active : ''}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            onHoverStart={() => setActiveYear(index)}
          >
            <div className={styles.timelineIcon} style={{ backgroundColor: milestone.color }}>
              <milestone.icon />
            </div>
            
            <div className={styles.timelineContent}>
              <div className={styles.timelineYear}>{milestone.year}</div>
              <h3>{milestone.title}</h3>
              <p>{milestone.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Team Component
const TeamSection = ({ t }: { t: any }) => {
  const teamMembers = [
    {
      name: "Dr. David Levy",
      position: "CEO & Founder",
      image: "/images/team/david-levy.svg",
      bio: "Expert in medical aesthetics with over 15 years of experience",
      linkedin: "#",
      email: "david@mitoderm.com"
    },
    {
      name: "Rachel Green",
      position: "VP Research & Development",
      image: "/images/team/rachel-green.svg",
      bio: "PhD in Biotechnology, leading research and development of innovative technologies",
      linkedin: "#",
      email: "rachel@mitoderm.com"
    },
    {
      name: "Sarah Cohen",
      position: "Marketing & Sales Director",
      image: "/images/team/sarah-cohen.svg",
      bio: "Leading international marketing and sales strategy",
      linkedin: "#",
      email: "sarah@mitoderm.com"
    }
  ];

  return (
    <div className={styles.teamSection}>
      <div className={styles.sectionHeader}>
        <h2>Our Leading Team</h2>
        <p>Leading experts in medical aesthetics and biotechnology</p>
      </div>
      
      <div className={styles.teamGrid}>
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className={styles.teamCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <div className={styles.memberImage}>
              <img src={member.image} alt={member.name} />
              <div className={styles.memberOverlay}>
                <div className={styles.socialLinks}>
                  <a href={member.linkedin} aria-label="LinkedIn">
                    <FiLinkedin />
                  </a>
                  <a href={`mailto:${member.email}`} aria-label="Email">
                    <FiMail />
                  </a>
                </div>
              </div>
            </div>
            
            <div className={styles.memberInfo}>
              <h3>{member.name}</h3>
              <p className={styles.position}>{member.position}</p>
              <p className={styles.bio}>{member.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Values Component
const ValuesSection = ({ t }: { t: any }) => {
  const values = useMemo(() => [
    {
      icon: FiHeart,
      title: t('values.commitment.title'),
      description: t('values.commitment.description'),
      color: "#ff6b6b"
    },
    {
      icon: FiShield,
      title: t('values.safety.title'),
      description: t('values.safety.description'),
      color: "#4ecdc4"
    },
    {
      icon: FiZap,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
      color: "#ffd700"
    },
    {
      icon: FiUsers,
      title: t('values.partnership.title'),
      description: t('values.partnership.description'),
      color: "#be800c"
    }
  ], [t]);

  return (
    <div className={styles.valuesSection}>
      <div className={styles.sectionHeader}>
        <h2>{t('values.title')}</h2>
        <p>{t('values.subtitle')}</p>
      </div>
      
      <div className={styles.valuesGrid}>
        {values.map((value, index) => (
          <motion.div
            key={index}
            className={styles.valueCard}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={styles.valueIcon} style={{ backgroundColor: value.color }}>
              <value.icon />
            </div>
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Statistics Component
const StatisticsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const stats = [
    { number: "2000+", label: "Aesthetics Professionals", icon: FiUsers },
    { number: "4", label: "Active Countries", icon: FiGlobe },
    { number: "20B", label: "Synthetic Exosomes", icon: FiZap },
    { number: "98%", label: "Satisfaction Rate", icon: FiTrendingUp }
  ];

  return (
    <motion.div 
      className={styles.statisticsSection}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onAnimationComplete={() => setIsVisible(true)}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={styles.statItem}
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className={styles.statIcon}>
              <stat.icon />
            </div>
            <div className={styles.statNumber}>{stat.number}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function AboutClient() {
  const t = useTranslations('about');
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState('story');

  const sections = useMemo(() => [
    { id: 'story', label: t('sections.story'), icon: FiPlay },
    { id: 'team', label: t('sections.team'), icon: FiUsers },
    { id: 'values', label: t('sections.values'), icon: FiHeart },
    { id: 'timeline', label: t('sections.timeline'), icon: FiTrendingUp }
  ], [t]);

  return (
    <div className={styles.aboutPage}>
      {/* Animated Background */}
      <div className={styles.backgroundElements}>
        <motion.div 
          className={styles.floatingShape1}
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={styles.floatingShape2}
          animate={{ 
            y: [0, 20, 0],
            x: [0, 15, 0]
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
      
      <div className={styles.aboutContent}>
        {/* Enhanced Hero Section */}
        <motion.div 
          className={styles.heroSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.gradientTitle}>
            {t('hero.title')}
          </h1>
          <p className={styles.heroDescription}>
            {t('hero.description')}
          </p>
          
          <StatisticsSection />
        </motion.div>

        {/* Enhanced Navigation */}
        <div className={styles.sectionNavigation}>
          {sections.map((section) => (
            <motion.button
              key={section.id}
              className={`${styles.navButton} ${activeSection === section.id ? styles.active : ''}`}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <section.icon />
              <span>{section.label}</span>
              <FiChevronRight className={styles.navArrow} />
            </motion.button>
          ))}
        </div>

        {/* Dynamic Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            className={styles.sectionContent}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {activeSection === 'story' && (
              <div className={styles.storySection}>
                <h2>{t('sections.story')}</h2>
                <div className={styles.storyContent}>
                  <div className={styles.storyText}>
                    <p>
                      MitoDerm was founded in 2018 with a clear vision: to revolutionize the field of medical aesthetics 
                      through innovative and advanced technologies. We specialize in developing and manufacturing synthetic exosomes 
                      with PDRN polynucleotides, providing exceptional results from the first treatment.
                    </p>
                    <p>
                      Our company leads the field in Israel and is expanding to international markets, while maintaining 
                      the highest standards of quality and safety. We are proud to work with over 2000 
                      aesthetics professionals worldwide.
                    </p>
                  </div>
                  <div className={styles.storyImage}>
                    <img src="/images/about-story.svg" alt="Our Story" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'team' && <TeamSection t={t} />}
            {activeSection === 'values' && <ValuesSection t={t} />}
            {activeSection === 'timeline' && <Timeline t={t} />}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced CTA Section */}
        <motion.div 
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ready to Join Us?</h2>
          <p>Discover how MitoDerm can take your clinic to the next level</p>
          <div className={styles.ctaButtons}>
            <motion.button 
              className={styles.primaryCTA}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us Now
            </motion.button>
            <motion.button 
              className={styles.secondaryCTA}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book a Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 