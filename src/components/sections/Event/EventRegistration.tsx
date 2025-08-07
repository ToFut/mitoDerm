"use client";

import { FC, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './EventRegistration.module.scss';
import Button from '../../sharedUI/Button/Button';

const EventRegistration: FC = () => {
  const t = useTranslations();
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const basePrice = 299;
  const discount = isPromoApplied ? 0.1 : 0;
  const totalPrice = basePrice * selectedTickets * (1 - discount);

  const handlePromoApply = () => {
    if (promoCode.toLowerCase() === 'mitoderm2024') {
      setIsPromoApplied(true);
    }
  };

  const benefits = [
    'Full-day professional training',
    'Hands-on practice sessions',
    'Certificate of completion',
    'Networking opportunities',
    'Lunch and refreshments',
    'Exclusive product demonstrations',
    'Q&A with expert speakers',
    'Access to training materials'
  ];

  return (
    <section className={styles.registrationSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Register Now</h2>
          <p className={styles.sectionSubtitle}>
            Secure your spot for this exclusive professional training event
          </p>
        </div>

        <div className={styles.registrationContent}>
          {/* Pricing Card */}
          <div className={styles.pricingCard}>
            <div className={styles.cardHeader}>
              <div className={styles.priceBadge}>Early Bird</div>
              <h3 className={styles.priceTitle}>Professional Training</h3>
              <div className={styles.priceAmount}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{basePrice}</span>
                <span className={styles.period}>/person</span>
              </div>
              {isPromoApplied && (
                <div className={styles.discountApplied}>
                  <span className={styles.discountIcon}>🎉</span>
                  10% Discount Applied!
                </div>
              )}
            </div>

            <div className={styles.benefitsList}>
              <h4 className={styles.benefitsTitle}>What's Included:</h4>
              <ul className={styles.benefitsItems}>
                {benefits.map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    <span className={styles.benefitIcon}>✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.registrationForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Number of Tickets</label>
                <div className={styles.ticketSelector}>
                  <button
                    className={styles.ticketButton}
                    onClick={() => setSelectedTickets(Math.max(1, selectedTickets - 1))}
                    disabled={selectedTickets <= 1}
                  >
                    -
                  </button>
                  <span className={styles.ticketCount}>{selectedTickets}</span>
                  <button
                    className={styles.ticketButton}
                    onClick={() => setSelectedTickets(selectedTickets + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Promo Code</label>
                <div className={styles.promoInput}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className={styles.promoField}
                  />
                  <button
                    className={styles.promoButton}
                    onClick={handlePromoApply}
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </button>
                </div>
                {promoCode && !isPromoApplied && (
                  <div className={styles.promoError}>
                    Invalid promo code. Try "mitoderm2024"
                  </div>
                )}
              </div>

              <div className={styles.priceSummary}>
                <div className={styles.summaryRow}>
                  <span>Base Price:</span>
                  <span>${basePrice} × {selectedTickets}</span>
                </div>
                {isPromoApplied && (
                  <div className={styles.summaryRow}>
                    <span>Discount (10%):</span>
                    <span>-${(basePrice * selectedTickets * discount).toFixed(2)}</span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span className={styles.totalLabel}>Total:</span>
                  <span className={styles.totalAmount}>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button
                text="Reserve Your Seat"
                formPage="event"
              />
            </div>
          </div>

          {/* Registration Info */}
          <div className={styles.registrationInfo}>
            <div className={styles.infoCard}>
              <h4 className={styles.infoTitle}>Registration Details</h4>
              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📅</span>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Event Date</div>
                    <div className={styles.infoValue}>December 15, 2024</div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>⏰</span>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Time</div>
                    <div className={styles.infoValue}>9:00 AM - 5:00 PM</div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📍</span>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Location</div>
                    <div className={styles.infoValue}>Tel Aviv Convention Center</div>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>👥</span>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Capacity</div>
                    <div className={styles.infoValue}>150 Professionals</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.urgencyCard}>
              <div className={styles.urgencyIcon}>⚡</div>
              <h4 className={styles.urgencyTitle}>Limited Seats Available</h4>
              <p className={styles.urgencyText}>
                Only 37 seats remaining! Secure your spot before they're gone.
              </p>
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

export default EventRegistration; 