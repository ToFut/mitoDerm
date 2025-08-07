'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './nextgen-demo.module.scss';

interface DemoPage {
  id: string;
  title: string;
  description: string;
  path: string;
  preview: string;
  features: string[];
  status: 'ready' | 'beta' | 'concept';
}

const demoPages: DemoPage[] = [
  {
    id: 'homepage',
    title: 'Next-Gen Homepage',
    description: 'Revolutionary homepage with 3D hero, quantum effects, and AI personalization',
    path: '/nextgen-demo/homepage',
    preview: '🏠',
    features: ['3D Hero Section', 'Particle Systems', 'AI Personalization', 'Quantum Effects'],
    status: 'ready'
  },
  {
    id: 'products',
    title: 'AR/VR Products',
    description: 'Immersive product showcase with AR visualization and AI skin analysis',
    path: '/nextgen-demo/products',
    preview: '🧴',
    features: ['AR Product Views', '3D Models', 'AI Skin Analysis', 'Neural Networks'],
    status: 'ready'
  },
  {
    id: 'about',
    title: 'Interactive About',
    description: 'Immersive company story with 3D timeline and team holograms',
    path: '/nextgen-demo/about',
    preview: '🌟',
    features: ['3D Timeline', 'Team Holograms', 'VR Office Tour', 'Company DNA'],
    status: 'ready'
  },
  {
    id: 'admin',
    title: 'Quantum Dashboard',
    description: 'Futuristic admin panel with AI insights and holographic analytics',
    path: '/nextgen-demo/admin',
    preview: '📊',
    features: ['AI Insights', 'Voice Commands', 'Quantum Metrics', 'Predictive Analytics'],
    status: 'ready'
  },
  {
    id: 'components',
    title: 'Luxury Components',
    description: 'Next-generation UI component library with quantum effects',
    path: '/nextgen-demo/components',
    preview: '⚡',
    features: ['Quantum Buttons', 'Holographic Cards', 'Neural Inputs', 'Luxury Animations'],
    status: 'ready'
  }
];

export default function NextGenDemo() {
  const [selectedPage, setSelectedPage] = useState<DemoPage | null>(null);
  const [filter, setFilter] = useState<'all' | 'ready' | 'beta' | 'concept'>('all');

  const filteredPages = demoPages.filter(page => 
    filter === 'all' || page.status === filter
  );

  return (
    <div className={styles.nextGenDemo}>
      {/* Background Effects */}
      <div className={styles.cosmicBackground}>
        <div className={styles.starField} />
        <div className={styles.nebula} />
      </div>

      {/* Header */}
      <header className={styles.demoHeader}>
        <motion.div
          className={styles.headerContent}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className={styles.brandSection}>
            <h1 className={styles.brandTitle}>MITODERM</h1>
            <span className={styles.brandSubtitle}>Next-Generation Experience</span>
          </div>

          <nav className={styles.demoNavigation}>
            <Link href="/" className={styles.backButton}>
              ← Back to Main Site
            </Link>
          </nav>
        </motion.div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h2 className={styles.heroTitle}>
            <span className={styles.titleLine1}>EXPERIENCE THE</span>
            <span className={styles.titleLine2}>FUTURE OF BEAUTY</span>
          </h2>
          
          <p className={styles.heroSubtitle}>
            Explore our revolutionary next-generation interfaces featuring 3D visualizations, 
            AI-powered insights, and immersive user experiences
          </p>

          {/* Filter Controls */}
          <div className={styles.filterControls}>
            {(['all', 'ready', 'beta', 'concept'] as const).map(status => (
              <motion.button
                key={status}
                className={`${styles.filterButton} ${filter === status ? styles.active : ''}`}
                onClick={() => setFilter(status)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status === 'all' ? 'All Demos' : status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Demo Grid */}
      <section className={styles.demoGrid}>
        <div className={styles.gridContainer}>
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.id}
              className={styles.demoCard}
              initial={{ opacity: 0, y: 100, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ 
                rotateY: 5, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              onClick={() => setSelectedPage(page)}
            >
              <div className={styles.cardPreview}>
                <div className={styles.previewIcon}>{page.preview}</div>
                <div className={`${styles.statusBadge} ${styles[page.status]}`}>
                  {page.status.toUpperCase()}
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{page.title}</h3>
                <p className={styles.cardDescription}>{page.description}</p>

                <div className={styles.featuresList}>
                  {page.features.map((feature, idx) => (
                    <span key={idx} className={styles.featureTag}>
                      {feature}
                    </span>
                  ))}
                </div>

                <motion.div className={styles.cardActions}>
                  <Link href={page.path} className={styles.viewButton}>
                    <span>Experience Demo</span>
                    <span className={styles.buttonIcon}>→</span>
                  </Link>
                  
                  <motion.button
                    className={styles.infoButton}
                    whileHover={{ rotate: 180 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPage(page);
                    }}
                  >
                    ℹ️
                  </motion.button>
                </motion.div>
              </div>

              <div className={styles.cardGlow} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {selectedPage && (
          <motion.div
            className={styles.demoModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPage(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>{selectedPage.title}</h3>
                <motion.button
                  className={styles.closeButton}
                  onClick={() => setSelectedPage(null)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                >
                  ×
                </motion.button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.modalPreview}>
                  <div className={styles.previewLarge}>{selectedPage.preview}</div>
                </div>

                <div className={styles.modalInfo}>
                  <p className={styles.modalDescription}>{selectedPage.description}</p>
                  
                  <div className={styles.modalFeatures}>
                    <h4>Features</h4>
                    <ul>
                      {selectedPage.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.modalActions}>
                    <Link 
                      href={selectedPage.path} 
                      className={styles.launchButton}
                      onClick={() => setSelectedPage(null)}
                    >
                      Launch Experience
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={styles.demoFooter}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            🚀 Next-Generation MitoDerm Experience - Powered by AI, 3D, and Innovation
          </p>
          <div className={styles.techStack}>
            <span>Built with:</span>
            <span className={styles.techItem}>React</span>
            <span className={styles.techItem}>Three.js</span>
            <span className={styles.techItem}>Framer Motion</span>
            <span className={styles.techItem}>WebGL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}