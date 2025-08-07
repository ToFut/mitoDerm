'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import styles from './CertificationRequest.module.scss';

interface CertificationRequestProps {
  onClose: () => void;
}

export default function CertificationRequest({ onClose }: CertificationRequestProps) {
  const { data: session } = useSession();
  const t = useTranslations();
  const [requestType, setRequestType] = useState<'meeting' | 'certification' | 'custom'>('certification');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would send to your API
      const requestData = {
        userId: session.user.email,
        userName: session.user.name || 'Unknown',
        userEmail: session.user.email,
        requestType,
        message,
        requestedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h3>Request Submitted!</h3>
            <p>Your certification request has been submitted successfully. We'll review your request and get back to you within 24-48 hours.</p>
            <button onClick={onClose} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Request MitoDerm Certification</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.infoSection}>
            <h4>Why Get Certified?</h4>
            <ul>
              <li>Purchase products directly without meeting requirements</li>
              <li>Access to bulk pricing and special offers</li>
              <li>Priority customer support</li>
              <li>Exclusive training and resources</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className={styles.requestForm}>
            <div className={styles.formGroup}>
              <label>Request Type</label>
              <div className={styles.requestTypeOptions}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="requestType"
                    value="certification"
                    checked={requestType === 'certification'}
                    onChange={(e) => setRequestType(e.target.value as any)}
                  />
                  <span className={styles.radioLabel}>
                    <strong>Certification</strong>
                    <small>Become certified to purchase directly</small>
                  </span>
                </label>

                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="requestType"
                    value="meeting"
                    checked={requestType === 'meeting'}
                    onChange={(e) => setRequestType(e.target.value as any)}
                  />
                  <span className={styles.radioLabel}>
                    <strong>Schedule Meeting</strong>
                    <small>Meet with our team to discuss options</small>
                  </span>
                </label>

                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="requestType"
                    value="custom"
                    checked={requestType === 'custom'}
                    onChange={(e) => setRequestType(e.target.value as any)}
                  />
                  <span className={styles.radioLabel}>
                    <strong>Custom Request</strong>
                    <small>Special requirements or bulk orders</small>
                  </span>
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Tell us about yourself</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please include:&#10;- Your experience in cosmetic treatments&#10;- Current business/practice details&#10;- Why you're interested in V-Tech products&#10;- Any specific requirements or questions"
                rows={6}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 