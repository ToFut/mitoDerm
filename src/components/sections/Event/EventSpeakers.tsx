import { FC } from 'react';
import { useTranslations } from 'next-intl';
import styles from './EventSpeakers.module.scss';

const EventSpeakers: FC = () => {
  const t = useTranslations();

  const speakers = [
    {
      id: 1,
      name: 'Dr. Sarah Cohen',
      title: 'Chief Medical Officer',
      company: 'MitoDerm',
      expertise: 'Exosome Technology & Clinical Applications',
      image: '/images/team/sarah-cohen.svg',
      bio: 'Leading expert in exosome technology with over 15 years of experience in medical aesthetics and regenerative medicine.',
      sessions: ['Opening Ceremony', 'Case Studies & Best Practices'],
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#'
      }
    },
    {
      id: 2,
      name: 'Prof. David Levy',
      title: 'Research Director',
      company: 'VM Corporation',
      expertise: 'Synthetic Exosomes & Biomimetic Peptides',
      image: '/images/team/david-levy.svg',
      bio: 'Pioneering researcher in synthetic exosome development and biomimetic peptide technology for advanced skin regeneration.',
      sessions: ['Introduction to Exosome Technology'],
      social: {
        linkedin: '#',
        research: '#',
        publications: '#'
      }
    },
    {
      id: 3,
      name: 'Dr. Rachel Green',
      title: 'Clinical Specialist',
      company: 'Advanced Aesthetics Institute',
      expertise: 'V-Tech System & Clinical Protocols',
      image: '/images/team/rachel-green.svg',
      bio: 'Specialized in advanced aesthetic procedures and clinical implementation of cutting-edge technologies.',
      sessions: ['V-Tech System Deep Dive'],
      social: {
        linkedin: '#',
        instagram: '#',
        clinic: '#'
      }
    },
    {
      id: 4,
      name: 'Expert Trainers',
      title: 'Training Team',
      company: 'MitoDerm Academy',
      expertise: 'Hands-on Training & Practical Applications',
      image: '/images/team/trainers.svg',
      bio: 'Certified trainers with extensive experience in professional education and hands-on training sessions.',
      sessions: ['Hands-on Practice Session'],
      social: {
        linkedin: '#',
        academy: '#'
      }
    }
  ];

  return (
    <section className={styles.speakersSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Meet Our Speakers</h2>
          <p className={styles.sectionSubtitle}>
            Learn from industry leaders and experts in exosome technology and medical aesthetics
          </p>
        </div>

        {/* Speakers Grid */}
        <div className={styles.speakersGrid}>
          {speakers.map((speaker, index) => (
            <div key={speaker.id} className={styles.speakerCard}>
              <div className={styles.cardHeader}>
                <div className={styles.speakerImage}>
                  <img src={speaker.image} alt={speaker.name} />
                  <div className={styles.imageOverlay}></div>
                </div>
                <div className={styles.speakerInfo}>
                  <h3 className={styles.speakerName}>{speaker.name}</h3>
                  <div className={styles.speakerTitle}>{speaker.title}</div>
                  <div className={styles.speakerCompany}>{speaker.company}</div>
                  <div className={styles.speakerExpertise}>{speaker.expertise}</div>
                </div>
              </div>
              
              <div className={styles.cardBody}>
                <p className={styles.speakerBio}>{speaker.bio}</p>
                
                <div className={styles.sessionsList}>
                  <h4 className={styles.sessionsTitle}>Sessions:</h4>
                  <ul className={styles.sessionsItems}>
                    {speaker.sessions.map((session, sessionIndex) => (
                      <li key={sessionIndex} className={styles.sessionItem}>
                        <span className={styles.sessionIcon}>🎤</span>
                        {session}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className={styles.cardFooter}>
                <div className={styles.socialLinks}>
                  {Object.entries(speaker.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      className={styles.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={styles.socialIcon}>
                        {platform === 'linkedin' && '💼'}
                        {platform === 'twitter' && '🐦'}
                        {platform === 'instagram' && '📷'}
                        {platform === 'website' && '🌐'}
                        {platform === 'research' && '🔬'}
                        {platform === 'publications' && '📚'}
                        {platform === 'clinic' && '🏥'}
                        {platform === 'academy' && '🎓'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Speaker Highlight */}
        <div className={styles.featuredSpeaker}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredHeader}>
              <div className={styles.featuredBadge}>Featured Speaker</div>
              <h3 className={styles.featuredName}>Dr. Sarah Cohen</h3>
              <p className={styles.featuredTitle}>Chief Medical Officer at MitoDerm</p>
            </div>
            <div className={styles.featuredContent}>
              <p className={styles.featuredBio}>
                "Join us for an exclusive opportunity to learn from Dr. Sarah Cohen, 
                a leading expert in exosome technology with over 15 years of experience 
                in medical aesthetics and regenerative medicine."
              </p>
              <div className={styles.featuredStats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>15+</div>
                  <div className={styles.statLabel}>Years Experience</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>500+</div>
                  <div className={styles.statLabel}>Procedures</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>50+</div>
                  <div className={styles.statLabel}>Publications</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventSpeakers; 