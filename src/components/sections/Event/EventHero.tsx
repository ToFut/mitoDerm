import { FC } from 'react';
import { useTranslations } from 'next-intl';
import styles from './EventHero.module.scss';
import Button from '../../sharedUI/Button/Button';

const EventHero: FC = () => {
  const t = useTranslations();

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        {/* Main Title */}
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>
            <span className={styles.gradientText}>
              {t('event.hero.titleP1')}
            </span>
            <br />
            <span className={styles.highlightText}>
              {t('event.hero.titleP2')}
            </span>
            <br />
            <span className={styles.gradientText}>
              {t('event.hero.titleP3')}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          {t('event.hero.subtitle')}
        </p>

        {/* Event Stats */}
        <div className={styles.eventStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>150+</div>
            <div className={styles.statLabel}>Professionals</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>8</div>
            <div className={styles.statLabel}>Hours</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>5</div>
            <div className={styles.statLabel}>Speakers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>Limited</div>
            <div className={styles.statLabel}>Seats</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaContainer}>
          <Button 
            text={t('buttons.seat')}
            formPage="event"
            // Removed invalid className prop from Button
          />
          <button className={styles.secondaryCTA}>
            {t('buttons.learnMore')}
          </button>
        </div>

        {/* Event Badge */}
        <div className={styles.eventBadge}>
          <div className={styles.badgeIcon}>🎯</div>
          <div className={styles.badgeContent}>
            <div className={styles.badgeTitle}>Exclusive Event</div>
            <div className={styles.badgeSubtitle}>Professional Training</div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorativeElements}>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement2}></div>
        <div className={styles.floatingElement3}></div>
      </div>
    </section>
  );
};

export default EventHero; 