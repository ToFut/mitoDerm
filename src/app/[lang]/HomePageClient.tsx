'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Intro from '@/components/sections/Intro/Intro';
import HowCanBeUsed from '@/components/sections/HowCanBeUsed/HowCanBeUsed';
import Gallery from '@/components/sections/Gallery/Gallery';
import styles from './home.module.scss';

// Enhanced loading components
const LoadingSkeleton = ({ height = '400px' }: { height?: string }) => (
  <div className={styles.skeleton} style={{ height }}>
    <div className={styles.shimmer}></div>
  </div>
);

// Optimized dynamic imports with better loading states
const Solution = dynamic(
  () => import('@/components/sections/Solution/Solution'),
  {
    ssr: false,
    loading: () => <LoadingSkeleton height="600px" />
  }
);

const Mission = dynamic(
  () => import('@/components/sections/Mission/Mission'), 
  {
    ssr: false,
    loading: () => <LoadingSkeleton height="500px" />
  }
);

const CenterList = dynamic(
  () => import('@/components/sections/CenterList/CenterList'),
  {
    ssr: false,
    loading: () => <LoadingSkeleton height="400px" />
  }
);

const Faq = dynamic(
  () => import('@/components/sections/Faq/Faq'), 
  {
    ssr: false,
    loading: () => <LoadingSkeleton height="500px" />
  }
);

const Contact = dynamic(
  () => import('@/components/sections/Contact/Contact'), 
  {
    ssr: false,
    loading: () => <LoadingSkeleton height="400px" />
  }
);

const Chevron = dynamic(
  () => import('@/components/sections/Chevron/Chevron'),
  {
    loading: () => <LoadingSkeleton height="300px" />
  }
);

const Synergy = dynamic(
  () => import('@/components/sections/Synergy/Synergy'),
  {
    loading: () => <LoadingSkeleton height="400px" />
  }
);

// Enhanced Hero CTA Component
const HeroCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.heroCTA}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className={styles.ctaContent}>
            <h2>התחל את המסע שלך עם טכנולוגיית האקסוזומים</h2>
            <p>הצטרף לאלפי מקצועני אסתטיקה שכבר משתמשים בפתרונות המתקדמים שלנו</p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryCTA}>התחל עכשיו</button>
              <button className={styles.secondaryCTA}>צפה בהדגמה</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Social Proof Component
const SocialProof = () => (
  <motion.section 
    className={styles.socialProof}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    <div className={styles.proofStats}>
      <div className={styles.proofItem}>
        <span className={styles.proofNumber}>2000+</span>
        <span className={styles.proofLabel}>מקצועני אסתטיקה</span>
      </div>
      <div className={styles.proofItem}>
        <span className={styles.proofNumber}>50,000+</span>
        <span className={styles.proofLabel}>טיפולים בוצעו</span>
      </div>
      <div className={styles.proofItem}>
        <span className={styles.proofNumber}>98%</span>
        <span className={styles.proofLabel}>שביעות רצון</span>
      </div>
    </div>
  </motion.section>
);

export default function HomePageClient() {
  // Performance tracking reference
  const performanceRef = { current: null };

  return (
    <main id='mainpage' className={styles.homePage}>
      {/* Enhanced structured content with better loading */}
      <Suspense fallback={<LoadingSkeleton height="100vh" />}>
        <Intro />
        <HeroCTA />
        <SocialProof />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Chevron />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Synergy />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <HowCanBeUsed />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Solution />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Gallery />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Mission />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <CenterList />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Faq />
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <Contact />
      </Suspense>

      {/* Performance tracking reference */}
      <div ref={performanceRef as React.RefObject<HTMLDivElement>} className={styles.performanceTracker} />
    </main>
  );
} 