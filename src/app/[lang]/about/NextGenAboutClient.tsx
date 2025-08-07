'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Text3D, Sphere, MeshDistortMaterial } from '@react-three/drei';
import dynamic from 'next/dynamic';
import styles from './nextgen-about.module.scss';

// Advanced Components
const InteractiveTimeline = dynamic(() => import('@/components/timeline/InteractiveTimeline'), { ssr: false });
const TeamHologram = dynamic(() => import('@/components/3d/TeamHologram'), { ssr: false });
const CompanyDNA = dynamic(() => import('@/components/3d/CompanyDNA'), { ssr: false });
const VirtualOffice = dynamic(() => import('@/components/vr/VirtualOffice'), { ssr: false });

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  model3D?: string;
  specialties: string[];
  achievements: Achievement[];
  personalityType: 'visionary' | 'innovator' | 'strategist' | 'researcher';
}

interface Achievement {
  title: string;
  year: number;
  description: string;
  impact: string;
}

export default function NextGenAboutClient() {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.5]);

  const sections = [
    { id: 'story', title: 'Our Story', component: StorySection },
    { id: 'dna', title: 'Company DNA', component: DNASection },
    { id: 'team', title: 'Visionary Team', component: TeamSection },
    { id: 'innovation', title: 'Innovation Lab', component: InnovationSection },
    { id: 'future', title: 'Future Vision', component: FutureSection }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrolled / maxScroll;
      
      setCurrentSection(Math.floor(progress * sections.length));
      setTimelineProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  return (
    <div className={styles.nextGenAbout} ref={containerRef}>
      {/* Immersive Background */}
      <motion.div
        className={styles.cosmicBackground}
        style={{ y: parallaxY, scale: scaleProgress }}
      >
        <div className={styles.starField} />
        <div className={styles.nebula} />
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <CosmicBackground />
          <Environment preset="space" />
        </Canvas>
      </motion.div>

      {/* Navigation Portal */}
      <div className={styles.navigationPortal}>
        <motion.div
          className={styles.portalRing}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {sections.map((section, index) => (
            <NavigationNode
              key={section.id}
              section={section}
              index={index}
              active={currentSection === index}
              onClick={() => setCurrentSection(index)}
            />
          ))}
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <motion.h1
            className={styles.heroTitle}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: "backOut" }}
          >
            <span className={styles.titleLine1}>THE ARCHITECTS OF</span>
            <span className={styles.titleLine2}>AESTHETIC EVOLUTION</span>
          </motion.h1>

          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Where science meets luxury, innovation meets tradition, and dreams become reality
          </motion.p>

          {/* Floating Company Stats */}
          <motion.div
            className={styles.companyStats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <FloatingMetric value="2018" label="Founded" color="gold" />
            <FloatingMetric value="50+" label="Countries" color="rose" />
            <FloatingMetric value="1M+" label="Treatments" color="platinum" />
            <FloatingMetric value="99%" label="Satisfaction" color="gold" />
          </motion.div>

          {/* VR Toggle */}
          <motion.button
            className={styles.vrToggle}
            onClick={() => setIsVRMode(!isVRMode)}
            whileHover={{ scale: 1.1, rotateY: 180 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <VRIcon />
            <span>{isVRMode ? 'Exit VR Tour' : 'Enter VR Tour'}</span>
          </motion.button>
        </motion.div>
      </section>

      {/* Dynamic Content Sections */}
      <AnimatePresence mode="wait">
        {!isVRMode ? (
          <motion.div
            key="standard"
            className={styles.contentSections}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StorySection />
            <DNASection />
            <TeamSection selectedMember={selectedMember} onSelectMember={setSelectedMember} />
            <InnovationSection />
            <FutureSection />
          </motion.div>
        ) : (
          <motion.div
            key="vr"
            className={styles.vrMode}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <VirtualOffice />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className={styles.progressIndicator}>
        <motion.div
          className={styles.progressBar}
          style={{ scaleX: timelineProgress }}
        />
      </div>
    </div>
  );
}

// STORY SECTION
const StorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className={styles.storySection} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.storyContent}
          initial={{ opacity: 0, y: 100 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className={styles.storyText}>
            <h2 className={styles.sectionTitle}>Our Genesis</h2>
            <p className={styles.storyParagraph}>
              In 2018, a revolutionary vision emerged from the convergence of 
              cutting-edge science and aesthetic artistry. MitoDerm was born 
              not just as a company, but as a movement to redefine the very 
              essence of beauty and wellness.
            </p>
            <p className={styles.storyParagraph}>
              Our founders, driven by an unwavering commitment to excellence, 
              embarked on a journey to harness the power of synthetic exosomes 
              and advanced biotechnology to create solutions that transcend 
              traditional boundaries.
            </p>
          </div>

          <div className={styles.storyVisual}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
              <StoryVisualization />
              <Environment preset="studio" />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
            </Canvas>
          </div>
        </motion.div>

        {/* Interactive Timeline */}
        <motion.div
          className={styles.timelineContainer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <InteractiveTimeline />
        </motion.div>
      </div>
    </section>
  );
};

// DNA SECTION
const DNASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className={styles.dnaSection} ref={ref}>
      <div className={styles.container}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Company DNA
        </motion.h2>

        <div className={styles.dnaContainer}>
          <div className={styles.dnaVisualization}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <CompanyDNA />
              <Environment preset="warehouse" />
            </Canvas>
          </div>

          <motion.div
            className={styles.dnaTraits}
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <DNATrait
              title="Innovation"
              description="Pioneering breakthrough technologies"
              percentage={98}
              color="gold"
            />
            <DNATrait
              title="Excellence"
              description="Uncompromising quality standards"
              percentage={96}
              color="rose"
            />
            <DNATrait
              title="Integrity"
              description="Ethical practices and transparency"
              percentage={100}
              color="platinum"
            />
            <DNATrait
              title="Vision"
              description="Shaping the future of aesthetics"
              percentage={94}
              color="gold"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// TEAM SECTION
const TeamSection = ({ selectedMember, onSelectMember }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'אילונה שפקור',
      title: 'Visionary CEO',
      bio: 'Leading the revolution in aesthetic medicine with over 15 years of expertise',
      avatar: '/images/team/ilona-hologram.jpg',
      specialties: ['Medical Aesthetics', 'Business Strategy', 'Innovation Leadership'],
      achievements: [
        {
          title: 'Founded MitoDerm',
          year: 2018,
          description: 'Established the company with a revolutionary vision',
          impact: 'Global expansion across 50+ countries'
        }
      ],
      personalityType: 'visionary'
    },
    {
      id: '2',
      name: 'מאיה',
      title: 'Strategic COO',
      bio: 'Transforming business operations with pharmaceutical expertise and coaching mastery',
      avatar: '/images/team/maya-hologram.jpg',
      specialties: ['Operations Excellence', 'Business Coaching', 'Strategic Planning'],
      achievements: [
        {
          title: 'Operational Excellence Program',
          year: 2020,
          description: 'Implemented systems that increased efficiency by 300%',
          impact: 'Streamlined global operations'
        }
      ],
      personalityType: 'strategist'
    }
  ];

  return (
    <section className={styles.teamSection} ref={ref}>
      <div className={styles.container}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Visionary Leadership
        </motion.h2>

        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className={styles.teamMemberCard}
              initial={{ opacity: 0, y: 100, rotateY: 45 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ 
                rotateY: 10, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              onClick={() => onSelectMember(member)}
            >
              <div className={styles.memberHologram}>
                <TeamHologram member={member} />
              </div>

              <div className={styles.memberInfo}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberTitle}>{member.title}</p>
                <p className={styles.memberBio}>{member.bio}</p>

                <div className={styles.memberSpecialties}>
                  {member.specialties.map((specialty, idx) => (
                    <span key={idx} className={styles.specialtyTag}>
                      {specialty}
                    </span>
                  ))}
                </div>

                <motion.button
                  className={styles.viewProfileButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Holographic Profile
                </motion.button>
              </div>

              <div className={styles.personalityIndicator}>
                <PersonalityIcon type={member.personalityType} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Member Modal */}
      <AnimatePresence>
        {selectedMember && (
          <TeamMemberModal
            member={selectedMember}
            onClose={() => onSelectMember(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// Supporting Components
const FloatingMetric = ({ value, label, color }) => (
  <motion.div
    className={`${styles.floatingMetric} ${styles[color]}`}
    initial={{ opacity: 0, y: 100, rotateX: 90 }}
    animate={{ 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      rotateY: [0, 360]
    }}
    transition={{ 
      duration: 1.2,
      rotateY: { duration: 10, repeat: Infinity, ease: "linear" }
    }}
    whileHover={{ scale: 1.1, z: 50 }}
  >
    <div className={styles.metricValue}>{value}</div>
    <div className={styles.metricLabel}>{label}</div>
    <div className={styles.metricGlow} />
  </motion.div>
);

const NavigationNode = ({ section, index, active, onClick }) => {
  const angle = (index / 5) * 360;
  
  return (
    <motion.div
      className={`${styles.navigationNode} ${active ? styles.active : ''}`}
      style={{
        transform: `rotate(${angle}deg) translateX(120px) rotate(-${angle}deg)`
      }}
      whileHover={{ scale: 1.2 }}
      onClick={onClick}
    >
      <div className={styles.nodeIcon} />
      <span className={styles.nodeLabel}>{section.title}</span>
    </motion.div>
  );
};

const DNATrait = ({ title, description, percentage, color }) => (
  <motion.div
    className={styles.dnaTrait}
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className={styles.traitHeader}>
      <h4 className={styles.traitTitle}>{title}</h4>
      <span className={styles.traitPercentage}>{percentage}%</span>
    </div>
    <p className={styles.traitDescription}>{description}</p>
    <div className={styles.traitBar}>
      <motion.div
        className={`${styles.traitProgress} ${styles[color]}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
      />
    </div>
  </motion.div>
);

// 3D Visualization Components
const CosmicBackground = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2}>
        <MeshDistortMaterial
          color="#be800c"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const StoryVisualization = () => (
  <Float speed={2} rotationIntensity={1} floatIntensity={2}>
    <Text3D
      font="/fonts/luxury-font.json"
      size={0.5}
      height={0.1}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.02}
      bevelSize={0.02}
      bevelOffset={0}
      bevelSegments={5}
    >
      2018
      <meshStandardMaterial 
        color="#be800c"
        metalness={0.8}
        roughness={0.2}
        emissive="#be800c"
        emissiveIntensity={0.1}
      />
    </Text3D>
  </Float>
);

// Icon Components
const VRIcon = () => <svg>...</svg>;
const PersonalityIcon = ({ type }) => <svg>...</svg>;