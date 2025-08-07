'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import styles from './Mission.module.scss';

const Mission = () => {
  const t = useTranslations('dream');
  const [activeSection, setActiveSection] = useState('vision');

  const missionData = {
    vision: {
      title: 'Our Vision',
      description: 'Leading the future of medical aesthetics through innovative technology and scientific excellence.',
      icon: '🔬',
      color: '#dfba74'
    },
    mission: {
      title: 'Our Mission',
      description: 'Empowering professionals with cutting-edge exosome technology to deliver exceptional results.',
      icon: '💎',
      color: '#be800c'
    },
    values: {
      title: 'Our Values',
      description: 'Excellence, innovation, and patient-centered care drive everything we do.',
      icon: '✨',
      color: '#dfba74'
    }
  };

  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'MitoDerm established with a vision to revolutionize medical aesthetics'
    },
    {
      year: '2020',
      title: 'V-Tech Development',
      description: 'Breakthrough synthetic exosome technology developed in partnership with VM Corporation'
    },
    {
      year: '2022',
      title: 'Market Launch',
      description: 'V-Tech system launched in Israel with overwhelming professional adoption'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanding to international markets with proven clinical results'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Cohen',
      role: 'Chief Scientific Officer',
      expertise: 'Exosome Technology & Clinical Research',
      image: '/images/team/sarah-cohen.svg'
    },
    {
      name: 'Prof. David Levy',
      role: 'Research Director',
      expertise: 'Biomedical Engineering & Innovation',
      image: '/images/team/david-levy.svg'
    },
    {
      name: 'Dr. Rachel Green',
      role: 'Clinical Director',
      expertise: 'Medical Aesthetics & Patient Care',
      image: '/images/team/rachel-green.svg'
    }
  ];

  return (
    <div className={styles.missionPage}>
      <div className={styles.glassBg} />
      <div className={styles.pageContainer}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.gradientTitle}>
              {t('titleP1')} <span className={styles.highlight}>{t('titleP2')}</span>
            </h1>
            <p className={styles.heroSubtitle}>
              {t('textP1')} <span className={styles.highlight}>{t('textP2')}</span> {t('textP3')}
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>5+</span>
                <span className={styles.statLabel}>Years of Innovation</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>Professionals Trained</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>50+</span>
                <span className={styles.statLabel}>Clinical Studies</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.scienceIllustration}>
              <div className={styles.molecule}>
                <span>Exosomes</span>
              </div>
              <div className={styles.molecule}>
                <span>PDRN</span>
              </div>
              <div className={styles.molecule}>
                <span>Peptides</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Sections */}
        <div className={styles.missionSection}>
          <div className={styles.sectionTabs}>
            {Object.entries(missionData).map(([key, data]) => (
              <button
                key={key}
                className={`${styles.sectionTab} ${activeSection === key ? styles.active : ''}`}
                onClick={() => setActiveSection(key)}
                style={{ '--accent-color': data.color } as React.CSSProperties}
              >
                <span className={styles.tabIcon}>{data.icon}</span>
                {data.title}
              </button>
            ))}
          </div>

          <div className={styles.sectionContent}>
            {activeSection === 'vision' && (
              <div className={styles.contentCard}>
                <h2 className={styles.gradientSubTitle}>Our Vision</h2>
                <p className={styles.contentDescription}>
                  {t('textP4')} <span className={styles.highlight}>{t('textP5')}</span> {t('textP6')} {t('textP7')}
                </p>
                <div className={styles.visionGoals}>
                  <div className={styles.goal}>
                    <div className={styles.goalIcon}>🎯</div>
                    <h3>Innovation Leadership</h3>
                    <p>Pioneering the next generation of medical aesthetics technology</p>
                  </div>
                  <div className={styles.goal}>
                    <div className={styles.goalIcon}>🌍</div>
                    <h3>Global Impact</h3>
                    <p>Making advanced treatments accessible to professionals worldwide</p>
                  </div>
                  <div className={styles.goal}>
                    <div className={styles.goalIcon}>🔬</div>
                    <h3>Scientific Excellence</h3>
                    <p>Maintaining the highest standards in research and development</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'mission' && (
              <div className={styles.contentCard}>
                <h2 className={styles.gradientSubTitle}>Our Mission</h2>
                <p className={styles.contentDescription}>
                  We are committed to empowering medical professionals with cutting-edge exosome technology, 
                  enabling them to deliver exceptional results while advancing the field of medical aesthetics.
                </p>
                <div className={styles.missionObjectives}>
                  <div className={styles.objective}>
                    <h3>Professional Empowerment</h3>
                    <p>Providing comprehensive training and support to healthcare professionals</p>
                  </div>
                  <div className={styles.objective}>
                    <h3>Patient-Centered Care</h3>
                    <p>Ensuring optimal outcomes through personalized treatment approaches</p>
                  </div>
                  <div className={styles.objective}>
                    <h3>Continuous Innovation</h3>
                    <p>Advancing technology through ongoing research and development</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'values' && (
              <div className={styles.contentCard}>
                <h2 className={styles.gradientSubTitle}>Our Values</h2>
                <p className={styles.contentDescription}>
                  Our core values guide every decision we make and every action we take.
                </p>
                <div className={styles.valuesGrid}>
                  <div className={styles.value}>
                    <div className={styles.valueIcon}>💎</div>
                    <h3>Excellence</h3>
                    <p>We strive for excellence in everything we do, from product development to customer service</p>
                  </div>
                  <div className={styles.value}>
                    <div className={styles.valueIcon}>🔬</div>
                    <h3>Innovation</h3>
                    <p>Pushing boundaries and exploring new possibilities in medical aesthetics</p>
                  </div>
                  <div className={styles.value}>
                    <div className={styles.valueIcon}>🤝</div>
                    <h3>Collaboration</h3>
                    <p>Working together with professionals to achieve the best outcomes</p>
                  </div>
                  <div className={styles.value}>
                    <div className={styles.valueIcon}>🌱</div>
                    <h3>Sustainability</h3>
                    <p>Committed to environmentally responsible practices and long-term success</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        <div className={styles.timelineSection}>
          <h2 className={styles.gradientSubTitle}>Our Journey</h2>
          <div className={styles.timeline}>
            {milestones.map((milestone, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{milestone.year}</div>
                <div className={styles.timelineContent}>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className={styles.teamSection}>
          <h2 className={styles.gradientSubTitle}>Meet Our Leadership</h2>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamMember}>
                <div className={styles.memberImage}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className={styles.memberImg}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-team.svg';
                    }}
                  />
                </div>
                <div className={styles.memberInfo}>
                  <h3>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  <p className={styles.memberExpertise}>{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2>Join Our Mission</h2>
            <p>Be part of the future of medical aesthetics. Partner with MitoDerm to transform your practice.</p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryButton}>
                Partner With Us
              </button>
              <button className={styles.secondaryButton}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
