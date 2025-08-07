'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LuxuryButton, 
  HolographicCard, 
  LuxuryInput, 
  QuantumProgress, 
  FloatingNotification 
} from '@/components/nextgen/LuxuryComponents';
import styles from './components-demo.module.scss';

export default function ComponentsDemo() {
  const [inputValue, setInputValue] = useState('');
  const [progress, setProgress] = useState(65);
  const [showNotification, setShowNotification] = useState(false);

  const handleButtonClick = () => {
    setShowNotification(true);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  return (
    <div className={styles.componentsDemo}>
      {/* Background */}
      <div className={styles.quantumBackground}>
        <div className={styles.particleField} />
        <div className={styles.energyWaves} />
      </div>

      {/* Header */}
      <header className={styles.demoHeader}>
        <motion.div
          className={styles.headerContent}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>Luxury Component Library</h1>
          <p className={styles.subtitle}>Next-generation UI components with quantum effects</p>
        </motion.div>
      </header>

      {/* Components Showcase */}
      <main className={styles.showcaseGrid}>
        
        {/* Luxury Buttons */}
        <section className={styles.componentSection}>
          <h2 className={styles.sectionTitle}>Quantum Buttons</h2>
          <div className={styles.buttonGrid}>
            <LuxuryButton 
              variant="primary" 
              onClick={handleButtonClick}
              glowEffect={true}
            >
              Primary Action
            </LuxuryButton>
            
            <LuxuryButton 
              variant="secondary" 
              size="large"
              icon="⚡"
            >
              Secondary
            </LuxuryButton>
            
            <LuxuryButton 
              variant="glass" 
              size="medium"
            >
              Glass Morphism
            </LuxuryButton>
            
            <LuxuryButton 
              variant="holographic" 
              size="small"
            >
              Holographic
            </LuxuryButton>
            
            <LuxuryButton 
              variant="quantum" 
              size="xlarge"
              soundEffect={true}
            >
              Quantum Effect
            </LuxuryButton>
            
            <LuxuryButton 
              variant="primary"
              loading={true}
              disabled={false}
            >
              Loading
            </LuxuryButton>
          </div>
        </section>

        {/* Holographic Cards */}
        <section className={styles.componentSection}>
          <h2 className={styles.sectionTitle}>Holographic Cards</h2>
          <div className={styles.cardGrid}>
            <HolographicCard 
              glowColor="gold" 
              interactive={true}
              floating={true}
            >
              <div className={styles.cardContent}>
                <h3>Gold Luxury</h3>
                <p>Premium holographic card with interactive 3D effects</p>
                <div className={styles.cardMetrics}>
                  <span>✨ Interactive</span>
                  <span>🎯 Floating</span>
                </div>
              </div>
            </HolographicCard>

            <HolographicCard 
              glowColor="rose" 
              quantumEffect={true}
            >
              <div className={styles.cardContent}>
                <h3>Rose Quantum</h3>
                <p>Advanced card with quantum particle effects</p>
                <div className={styles.cardMetrics}>
                  <span>⚛️ Quantum</span>
                  <span>🌹 Rose Gold</span>
                </div>
              </div>
            </HolographicCard>

            <HolographicCard 
              glowColor="platinum" 
              interactive={true}
            >
              <div className={styles.cardContent}>
                <h3>Platinum Elite</h3>
                <p>Sophisticated platinum-themed card design</p>
                <div className={styles.cardMetrics}>
                  <span>💎 Platinum</span>
                  <span>👑 Elite</span>
                </div>
              </div>
            </HolographicCard>
          </div>
        </section>

        {/* Luxury Inputs */}
        <section className={styles.componentSection}>
          <h2 className={styles.sectionTitle}>Neural Inputs</h2>
          <div className={styles.inputGrid}>
            <LuxuryInput
              label="Standard Input"
              value={inputValue}
              onChange={setInputValue}
              placeholder="Enter your text..."
              icon="📝"
            />
            
            <LuxuryInput
              label="Email Address"
              type="email"
              value=""
              onChange={() => {}}
              placeholder="your@email.com"
              icon="📧"
              aiSuggestions={true}
            />
            
            <LuxuryInput
              label="Voice Command"
              value=""
              onChange={() => {}}
              placeholder="Speak your command..."
              icon="🎤"
              voiceInput={true}
            />
            
            <LuxuryInput
              label="Secure Password"
              type="password"
              value=""
              onChange={() => {}}
              placeholder="Enter password..."
              icon="🔒"
              error="Password must be at least 8 characters"
            />
          </div>
        </section>

        {/* Quantum Progress */}
        <section className={styles.componentSection}>
          <h2 className={styles.sectionTitle}>Quantum Progress</h2>
          <div className={styles.progressGrid}>
            <div className={styles.progressDemo}>
              <QuantumProgress
                progress={progress}
                label="AI Processing"
                animated={true}
                particleEffect={true}
              />
              <div className={styles.progressControls}>
                <button 
                  onClick={() => setProgress(Math.max(0, progress - 10))}
                  className={styles.controlButton}
                >
                  -10%
                </button>
                <button 
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                  className={styles.controlButton}
                >
                  +10%
                </button>
              </div>
            </div>

            <QuantumProgress
              progress={85}
              label="Neural Network Training"
              animated={true}
            />

            <QuantumProgress
              progress={42}
              label="Quantum Computation"
              particleEffect={true}
            />
          </div>
        </section>

        {/* Interactive Playground */}
        <section className={styles.componentSection}>
          <h2 className={styles.sectionTitle}>Interactive Playground</h2>
          <div className={styles.playground}>
            <div className={styles.playgroundControls}>
              <LuxuryButton 
                variant="quantum"
                onClick={() => setShowNotification(true)}
              >
                Show Notification
              </LuxuryButton>
              
              <LuxuryButton 
                variant="holographic"
                onClick={() => setProgress(Math.random() * 100)}
              >
                Random Progress
              </LuxuryButton>
            </div>

            <HolographicCard 
              glowColor="rainbow" 
              interactive={true}
              floating={true}
              quantumEffect={true}
            >
              <div className={styles.playgroundCard}>
                <h3>🌈 Rainbow Quantum Card</h3>
                <p>This card combines all effects: interactive 3D, floating animation, and quantum particles.</p>
                <LuxuryInput
                  label="Try Neural Input"
                  value={inputValue}
                  onChange={setInputValue}
                  voiceInput={true}
                  aiSuggestions={true}
                />
              </div>
            </HolographicCard>
          </div>
        </section>

        {/* Code Examples */}
        <section className={styles.componentSection}>
          <h2 className={styles.sectionTitle}>Implementation</h2>
          <div className={styles.codeExamples}>
            <HolographicCard glowColor="gold">
              <div className={styles.codeBlock}>
                <h4>Luxury Button Usage</h4>
                <pre className={styles.code}>
{`<LuxuryButton 
  variant="quantum"
  size="large"
  glowEffect={true}
  soundEffect={true}
  onClick={handleClick}
>
  Quantum Action
</LuxuryButton>`}
                </pre>
              </div>
            </HolographicCard>

            <HolographicCard glowColor="rose">
              <div className={styles.codeBlock}>
                <h4>Holographic Card Usage</h4>
                <pre className={styles.code}>
{`<HolographicCard
  glowColor="rose"
  interactive={true}
  floating={true}
  quantumEffect={true}
>
  Your content here
</HolographicCard>`}
                </pre>
              </div>
            </HolographicCard>
          </div>
        </section>
      </main>

      {/* Floating Notification */}
      {showNotification && (
        <FloatingNotification
          type="luxury"
          title="Quantum Success!"
          message="Component interaction completed successfully"
          onClose={handleNotificationClose}
          action={{
            label: "View Details",
            onClick: () => console.log("Action clicked!")
          }}
        />
      )}
    </div>
  );
}