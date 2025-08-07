import React from 'react';
import styles from './TrustBadges.module.scss';

const badges = [
  { icon: '✅', label: '100% Authentic' },
  { icon: '🚚', label: 'Free Shipping' },
  { icon: '💰', label: 'Money-back Guarantee' },
  { icon: '🔒', label: 'Secure Checkout' },
];

const TrustBadges: React.FC = () => (
  <div className={styles.trustBadges}>
    {badges.map((b, i) => (
      <div className={styles.badge} key={i}>
        <span className={styles.icon}>{b.icon}</span>
        <span className={styles.label}>{b.label}</span>
      </div>
    ))}
  </div>
);

export default TrustBadges; 