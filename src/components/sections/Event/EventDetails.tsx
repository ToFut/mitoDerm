import { FC } from 'react';
import { useTranslations } from 'next-intl';
import styles from './EventDetails.module.scss';

const EventDetails: FC = () => {
  const t = useTranslations();

  const eventDetails = [
    {
      icon: '📅',
      title: 'Date & Time',
      content: 'December 15, 2024',
      subtitle: '9:00 AM - 5:00 PM',
      color: '#ffd700'
    },
    {
      icon: '📍',
      title: 'Location',
      content: 'Tel Aviv Convention Center',
      subtitle: 'Hall A, Floor 2',
      color: '#ffed4e'
    },
    {
      icon: '👥',
      title: 'Capacity',
      content: '150 Professionals',
      subtitle: 'Limited Seats Available',
      color: '#be800c'
    },
    {
      icon: '🎓',
      title: 'Certification',
      content: 'Professional Certificate',
      subtitle: 'CE Credits Available',
      color: '#dfba74'
    }
  ];

  const highlights = [
    'Advanced Exosome Technology Training',
    'Hands-on Practice Sessions',
    'Networking with Industry Leaders',
    'Latest Product Demonstrations',
    'Q&A with Expert Speakers',
    'Certificate of Completion'
  ];

  return (
    <section className={styles.eventDetailsSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Event Details</h2>
          <p className={styles.sectionSubtitle}>
            Join us for an exclusive professional training event featuring the latest in exosome technology
          </p>
        </div>

        {/* Event Details Grid */}
        <div className={styles.detailsGrid}>
          {eventDetails.map((detail, index) => (
            <div key={index} className={styles.detailCard}>
              <div className={styles.cardIcon} style={{ color: detail.color }}>
                {detail.icon}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{detail.title}</h3>
                <div className={styles.cardMainText}>{detail.content}</div>
                <div className={styles.cardSubtext}>{detail.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Event Highlights */}
        <div className={styles.highlightsSection}>
          <h3 className={styles.highlightsTitle}>What You'll Experience</h3>
          <div className={styles.highlightsGrid}>
            {highlights.map((highlight, index) => (
              <div key={index} className={styles.highlightItem}>
                <div className={styles.highlightIcon}>✓</div>
                <span className={styles.highlightText}>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Status */}
        <div className={styles.registrationStatus}>
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <div className={styles.statusIcon}>🎯</div>
              <div className={styles.statusInfo}>
                <h4 className={styles.statusTitle}>Registration Status</h4>
                <div className={styles.statusBadge}>Limited Seats</div>
              </div>
            </div>
            <div className={styles.statusProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: '75%' }}></div>
              </div>
              <div className={styles.progressText}>75% Full</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails; 