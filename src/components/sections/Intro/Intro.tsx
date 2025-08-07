'use client';
import { FC, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './Intro.module.scss';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiArrowRight, FiStar, FiUsers, FiTrendingUp } from 'react-icons/fi';
import DotPagination from '../../sharedUI/DotPagination/DotPagination';
import useAppStore from '@/store/store';

const Button = dynamic(() => import('@/components/sharedUI/Button/Button'), {
  ssr: false,
});

// Enhanced Hero Statistics Component
const HeroStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: FiUsers, number: "2000+", label: "מקצועני אסתטיקה", delay: 0.1 },
    { icon: FiStar, number: "20B", label: "אקסוזומים סינתטיים", delay: 0.2 },
    { icon: FiTrendingUp, number: "98%", label: "שביעות רצון", delay: 0.3 }
  ];

  return (
    <motion.div 
      className={styles.heroStats}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className={styles.statCard}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: stat.delay }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className={styles.statIcon}>
            <stat.icon />
          </div>
          <motion.span 
            className={styles.statNumber}
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: stat.delay + 0.2 }}
          >
            {stat.number}
          </motion.span>
          <span className={styles.statLabel}>{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Enhanced CTA Buttons Component
const CTAButtons = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <motion.div 
      className={styles.ctaButtons}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          text={t('buttons.intro')}
          formPage="main"
        />
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button 
          className={styles.secondaryCTA}
          onClick={() => window.location.href = `/${locale}/about`}
        >
          <FiPlay />
          {t('buttons.learnMore')}
        </button>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Video/Demo Component
const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div 
      className={styles.demoContainer}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1 }}
    >
      <div className={styles.videoWrapper}>
        <div className={styles.videoPlaceholder}>
          <motion.button
            className={styles.playButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(true)}
          >
            <FiPlay />
          </motion.button>
          <div className={styles.videoOverlay}>
            <h3>צפו בהדגמה</h3>
            <p>גלו את כוח הטכנולוגיה שלנו</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Intro: FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const { setIntroPage } = useAppStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroPage(0);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [setIntroPage]);

  return (
    <section className={styles.intro} ref={ref}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <motion.div 
          className={styles.floatingOrb1}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={styles.floatingOrb2}
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.textContent}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className={styles.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('intro.title')}
            </motion.h1>
            
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('intro.text')}
            </motion.p>
          </motion.div>

          <CTAButtons />
          <HeroStats />
        </div>
        
        <div className={styles.visualContent}>
          <motion.div 
            className={styles.heroImage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className={styles.imageContainer}>
              <Image
                src="/images/introBG.png"
                alt="MitoDerm Products"
                width={600}
                height={400}
                priority
                className={styles.productImage}
              />
              <div className={styles.imageGlow}></div>
            </div>
          </motion.div>
          
          <DemoVideo />
        </div>
      </div>
      
      <DotPagination count={2} intro={true} />
      
      {/* Trust Indicators */}
      <motion.div 
        className={styles.trustIndicators}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className={styles.trustBadges}>
          <div className={styles.trustBadge}>
            <span>ISO 13485</span>
          </div>
          <div className={styles.trustBadge}>
            <span>CE Marked</span>
          </div>
          <div className={styles.trustBadge}>
            <span>FDA Approved</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Intro;
