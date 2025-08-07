import { FC } from 'react';
import { useTranslations } from 'next-intl';
import styles from './EventCTA.module.scss';
import Button from '../../sharedUI/Button/Button';

const EventCTA: FC = () => {
  const t = useTranslations();

  const urgencyFeatures = [
    {
      icon: '⚡',
      title: 'Limited Time',
      description: 'Early bird pricing ends soon'
    },
    {
      icon: '👥',
      title: 'Exclusive Access',
      description: 'Only 37 seats remaining'
    },
    {
      icon: '🎯',
      title: 'Expert Training',
      description: 'Learn from industry leaders'
    },
    {
      icon: '🏆',
      title: 'Certification',
      description: 'Get professional certification'
    }
  ];

  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        {/* Background Elements */}
        <div className={styles.backgroundElements}>
          <div className={styles.floatingElement}></div>
          <div className={styles.floatingElement2}></div>
          <div className={styles.floatingElement3}></div>
        </div>

        {/* Main CTA Content */}
        <div className={styles.ctaContent}>
          <div className={styles.ctaHeader}>
            <h2 className={styles.ctaTitle}>
                              Don&apos;t Miss This Exclusive Opportunity
            </h2>
            <p className={styles.ctaSubtitle}>
              Join medical professionals from across the country for this groundbreaking 
              training event on exosome technology and advanced aesthetic procedures.
            </p>
          </div>

          {/* Urgency Features */}
          <div className={styles.urgencyFeatures}>
            {urgencyFeatures.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureContent}>
                  <h4 className={styles.featureTitle}>{feature.title}</h4>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Registration Progress */}
          <div className={styles.registrationProgress}>
            <div className={styles.progressHeader}>
              <h3 className={styles.progressTitle}>Registration Status</h3>
              <div className={styles.progressBadge}>75% Full</div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '75%' }}></div>
            </div>
            <div className={styles.progressStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>113</div>
                <div className={styles.statLabel}>Registered</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>37</div>
                <div className={styles.statLabel}>Remaining</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>150</div>
                <div className={styles.statLabel}>Total Capacity</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Button
              text="Reserve Your Seat Now"
              formPage="event"
            />
            <button className={styles.secondaryButton}>
              Download Event Brochure
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🔒</span>
              <span className={styles.trustText}>Secure Registration</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>💰</span>
              <span className={styles.trustText}>Money-back Guarantee</span>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>📞</span>
              <span className={styles.trustText}>24/7 Support</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className={styles.countdownSection}>
            <h4 className={styles.countdownTitle}>Event Starts In:</h4>
            <div className={styles.countdownTimer}>
              <div className={styles.countdownItem}>
                <div className={styles.countdownNumber}>15</div>
                <div className={styles.countdownLabel}>Days</div>
              </div>
              <div className={styles.countdownSeparator}>:</div>
              <div className={styles.countdownItem}>
                <div className={styles.countdownNumber}>08</div>
                <div className={styles.countdownLabel}>Hours</div>
              </div>
              <div className={styles.countdownSeparator}>:</div>
              <div className={styles.countdownItem}>
                <div className={styles.countdownNumber}>32</div>
                <div className={styles.countdownLabel}>Minutes</div>
              </div>
              <div className={styles.countdownSeparator}>:</div>
              <div className={styles.countdownItem}>
                <div className={styles.countdownNumber}>45</div>
                <div className={styles.countdownLabel}>Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCTA; 