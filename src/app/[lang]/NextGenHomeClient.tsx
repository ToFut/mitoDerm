'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Float, Environment } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { LuxuryButton } from '@/components/nextgen/LuxuryComponents';
import styles from './nextgen-home.module.scss';

// Lazy load heavy components
const ParticleSystem = dynamic(() => import('@/components/effects/ParticleSystem'), { ssr: false });
const VirtualTour = dynamic(() => import('@/components/immersive/VirtualTour'), { ssr: false });
const ProductShowcase3D = dynamic(() => import('@/components/3d/ProductShowcase3D'), { ssr: false });
const AIPersonalizer = dynamic(() => import('@/components/ai/AIPersonalizer'), { ssr: false });

export default function NextGenHomeClient() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    // Preload critical assets
    const preloadAssets = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };
    preloadAssets();

    // Mouse tracking for advanced interactions
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isLoading) {
    return <LuxuryLoader />;
  }

  return (
    <div className={styles.nextGenHome} ref={containerRef}>
      {/* Immersive Hero Section */}
      <section className={styles.heroSection}>
        <motion.div 
          className={styles.heroBackground}
          style={{ y: backgroundY, scale: scaleProgress }}
        >
          <ParticleSystem count={500} />
          <div className={styles.gradientOverlay} />
        </motion.div>

        {/* 3D Scene */}
        <div className={styles.hero3D}>
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
              <Text3D
                font="/fonts/luxury-font.json"
                size={0.8}
                height={0.1}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
              >
                MITODERM
                <meshStandardMaterial 
                  color="#be800c"
                  metalness={0.8}
                  roughness={0.2}
                />
              </Text3D>
            </Float>
            <OrbitControls enableZoom={false} enablePan={false} />
            <Environment preset="studio" />
          </Canvas>
        </div>

        {/* Hero Content */}
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "backOut" }}
          >
            <span className={styles.titleLine1}>THE FUTURE OF</span>
            <span className={styles.titleLine2}>AESTHETIC MEDICINE</span>
            <span className={styles.titleLine3}>IS HERE</span>
          </motion.h1>

          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Revolutionary exosome technology meets luxury skincare innovation
          </motion.p>

          <motion.div 
            className={styles.heroCTAs}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <LuxuryButton 
              variant="primary" 
              size="large"
              onClick={() => setCurrentSection(1)}
            >
              <span>Discover Technology</span>
              <ArrowIcon />
            </LuxuryButton>
            
            <LuxuryButton 
              variant="glass" 
              size="large"
              onClick={() => {/* Open virtual tour */}}
            >
              <span>Virtual Tour</span>
              <VRIcon />
            </LuxuryButton>
          </motion.div>

          {/* Floating Stats */}
          <motion.div 
            className={styles.floatingStats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <FloatingStat number="20B" label="Synthetic Exosomes" delay={0} />
            <FloatingStat number="95%" label="Client Satisfaction" delay={0.2} />
            <FloatingStat number="50+" label="Countries" delay={0.4} />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className={styles.scrollWheel} />
        </motion.div>
      </section>

      {/* AI-Powered Personalization Section */}
      <section className={styles.aiSection}>
        <AIPersonalizer />
      </section>

      {/* Revolutionary Technology Showcase */}
      <section className={styles.technologySection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleAccent}>Revolutionary</span>
              <span className={styles.titleMain}>Technology</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Experience the future of aesthetic medicine with our breakthrough innovations
            </p>
          </motion.div>

          <div className={styles.technologyGrid}>
            <TechnologyCard
              title="Synthetic Exosomes"
              description="20 billion synthetic exosomes per treatment"
              icon={<ExosomeIcon />}
              color="gold"
              delay={0}
            />
            <TechnologyCard
              title="PDRN Technology"
              description="Advanced polynucleotide regeneration"
              icon={<DNAIcon />}
              color="rose"
              delay={0.2}
            />
            <TechnologyCard
              title="AI Customization"
              description="Personalized treatment protocols"
              icon={<AIIcon />}
              color="platinum"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Immersive Product Experience */}
      <section className={styles.productSection}>
        <ProductShowcase3D />
      </section>

      {/* Virtual Laboratory Tour */}
      <section className={styles.virtualTourSection}>
        <VirtualTour />
      </section>

      {/* Advanced Testimonials */}
      <section className={styles.testimonialsSection}>
        <VideoTestimonials />
      </section>

      {/* Next-Gen Contact */}
      <section className={styles.contactSection}>
        <HolographicContact />
      </section>
    </div>
  );
}

// Luxury Components
const LuxuryLoader = () => (
  <div className={styles.luxuryLoader}>
    <motion.div 
      className={styles.loaderRing}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className={styles.loaderGem} />
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Preparing luxury experience...
    </motion.p>
  </div>
);

// LuxuryButton is imported from @/components/nextgen/LuxuryComponents

const FloatingStat = ({ number, label, delay }) => (
  <motion.div
    className={styles.floatingStat}
    initial={{ opacity: 0, y: 100, rotateX: 90 }}
    animate={{ 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      rotateY: [0, 5, -5, 0]
    }}
    transition={{ 
      delay,
      duration: 1.2,
      rotateY: { duration: 4, repeat: Infinity }
    }}
    whileHover={{ scale: 1.1, z: 50 }}
  >
    <div className={styles.statNumber}>{number}</div>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statGlow} />
  </motion.div>
);

const TechnologyCard = ({ title, description, icon, color, delay }) => (
  <motion.div
    className={`${styles.technologyCard} ${styles[color]}`}
    initial={{ opacity: 0, y: 100, rotateY: 45 }}
    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8, ease: "backOut" }}
    whileHover={{ 
      rotateY: 10, 
      rotateX: 5, 
      scale: 1.05,
      transition: { duration: 0.3 }
    }}
  >
    <div className={styles.cardBackground} />
    <div className={styles.cardIcon}>{icon}</div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <p className={styles.cardDescription}>{description}</p>
    <div className={styles.cardGlow} />
  </motion.div>
);

// Icon Components (simplified)
const ArrowIcon = () => <svg>...</svg>;
const VRIcon = () => <svg>...</svg>;
const ExosomeIcon = () => <svg>...</svg>;
const DNAIcon = () => <svg>...</svg>;
const AIIcon = () => <svg>...</svg>;