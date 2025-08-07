"use client";

import { FC, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './EventAgenda.module.scss';

const EventAgenda: FC = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('morning');

  const agendaData = {
    morning: [
      {
        time: '09:00 - 09:30',
        title: 'Registration & Welcome Coffee',
        description: 'Check-in and networking with fellow professionals',
        speaker: 'Event Team',
        type: 'break'
      },
      {
        time: '09:30 - 10:00',
        title: 'Opening Ceremony',
        description: 'Welcome address and event overview',
        speaker: 'Dr. Sarah Cohen',
        type: 'presentation'
      },
      {
        time: '10:00 - 11:30',
        title: 'Introduction to Exosome Technology',
        description: 'Fundamentals of synthetic exosomes and their applications',
        speaker: 'Prof. David Levy',
        type: 'workshop'
      },
      {
        time: '11:30 - 12:00',
        title: 'Coffee Break',
        description: 'Networking and refreshments',
        speaker: '',
        type: 'break'
      }
    ],
    afternoon: [
      {
        time: '12:00 - 13:30',
        title: 'V-Tech System Deep Dive',
        description: 'Advanced applications and clinical protocols',
        speaker: 'Dr. Rachel Green',
        type: 'workshop'
      },
      {
        time: '13:30 - 14:30',
        title: 'Lunch & Networking',
        description: 'Professional networking and discussion',
        speaker: '',
        type: 'break'
      },
      {
        time: '14:30 - 16:00',
        title: 'Hands-on Practice Session',
        description: 'Practical training with V-Tech products',
        speaker: 'Expert Trainers',
        type: 'practice'
      },
      {
        time: '16:00 - 16:30',
        title: 'Afternoon Break',
        description: 'Refreshments and Q&A',
        speaker: '',
        type: 'break'
      }
    ],
    evening: [
      {
        time: '16:30 - 17:30',
        title: 'Case Studies & Best Practices',
        description: 'Real-world applications and success stories',
        speaker: 'Dr. Sarah Cohen',
        type: 'presentation'
      },
      {
        time: '17:30 - 18:00',
        title: 'Q&A Session',
        description: 'Open discussion and expert consultation',
        speaker: 'All Speakers',
        type: 'discussion'
      },
      {
        time: '18:00 - 18:30',
        title: 'Certification & Closing',
        description: 'Certificate distribution and closing remarks',
        speaker: 'Event Team',
        type: 'ceremony'
      }
    ]
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presentation': return '#ffd700';
      case 'workshop': return '#ffed4e';
      case 'practice': return '#be800c';
      case 'discussion': return '#dfba74';
      case 'ceremony': return '#ffd700';
      case 'break': return 'rgba(255, 255, 255, 0.3)';
      default: return '#ffd700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentation': return '🎤';
      case 'workshop': return '🔬';
      case 'practice': return '👐';
      case 'discussion': return '💬';
      case 'ceremony': return '🏆';
      case 'break': return '☕';
      default: return '📋';
    }
  };

  return (
    <section className={styles.agendaSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Event Agenda</h2>
          <p className={styles.sectionSubtitle}>
            A comprehensive day of learning, networking, and hands-on experience
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === 'morning' ? styles.active : ''}`}
            onClick={() => setActiveTab('morning')}
          >
            <span className={styles.tabIcon}>🌅</span>
            Morning Session
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'afternoon' ? styles.active : ''}`}
            onClick={() => setActiveTab('afternoon')}
          >
            <span className={styles.tabIcon}>☀️</span>
            Afternoon Session
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'evening' ? styles.active : ''}`}
            onClick={() => setActiveTab('evening')}
          >
            <span className={styles.tabIcon}>🌆</span>
            Evening Session
          </button>
        </div>

        {/* Agenda Timeline */}
        <div className={styles.agendaTimeline}>
          {agendaData[activeTab as keyof typeof agendaData].map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <div className={styles.timelineConnector}>
                <div 
                  className={styles.timelineDot}
                  style={{ backgroundColor: getTypeColor(item.type) }}
                >
                  <span className={styles.dotIcon}>{getTypeIcon(item.type)}</span>
                </div>
                {index < agendaData[activeTab as keyof typeof agendaData].length - 1 && (
                  <div className={styles.timelineLine}></div>
                )}
              </div>
              
              <div className={styles.timelineContent}>
                <div className={styles.timeSlot}>{item.time}</div>
                <div className={styles.contentCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.sessionTitle}>{item.title}</h3>
                    {item.speaker && (
                      <div className={styles.speakerInfo}>
                        <span className={styles.speakerIcon}>👤</span>
                        <span className={styles.speakerName}>{item.speaker}</span>
                      </div>
                    )}
                  </div>
                  <p className={styles.sessionDescription}>{item.description}</p>
                  <div 
                    className={styles.sessionType}
                    style={{ color: getTypeColor(item.type) }}
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Session Summary */}
        <div className={styles.sessionSummary}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Session Overview</h3>
            <div className={styles.summaryStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>8</div>
                <div className={styles.statLabel}>Hours</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>6</div>
                <div className={styles.statLabel}>Sessions</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>3</div>
                <div className={styles.statLabel}>Breaks</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>5</div>
                <div className={styles.statLabel}>Speakers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventAgenda; 