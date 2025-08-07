"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { 
  FiAward, 
  FiLock, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiUser,
  FiArrowRight
} from 'react-icons/fi';
import { userService } from '@/lib/services/userService';
import CertificationRequest from './CertificationRequest';
import styles from './CertificationGuard.module.scss';

interface CertificationGuardProps {
  children: React.ReactNode;
  requireCertification?: boolean;
  showCertificationStatus?: boolean;
}

export default function CertificationGuard({ 
  children, 
  requireCertification = false,
  showCertificationStatus = false 
}: CertificationGuardProps) {
  const { data: session } = useSession();
  const t = useTranslations("certification");
  const [isCertified, setIsCertified] = useState<boolean | null>(null);
  const [certificationStatus, setCertificationStatus] = useState<string>('none');
  const [loading, setLoading] = useState(true);
  const [showCertificationRequest, setShowCertificationRequest] = useState(false);

  useEffect(() => {
    const checkCertificationStatus = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const user = await userService.getUser(session.user.email);
        if (user) {
          const status = user.profile?.certificationStatus || 'none';
          setCertificationStatus(status);
          setIsCertified(status === 'approved');
        }
      } catch (error) {
        console.error('Error checking certification status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkCertificationStatus();
  }, [session]);

  const getStatusInfo = () => {
    switch (certificationStatus) {
      case 'approved':
        return {
          icon: <FiCheckCircle />,
          title: 'Certified Professional',
          description: 'You are a certified professional with full access to all features.',
          color: 'success',
          showRequest: false
        };
      case 'pending':
        return {
          icon: <FiClock />,
          title: 'Certification Pending',
          description: 'Your certification request is under review. You will be notified once approved.',
          color: 'warning',
          showRequest: false
        };
      case 'rejected':
        return {
          icon: <FiXCircle />,
          title: 'Certification Rejected',
          description: 'Your certification request was not approved. You can apply again.',
          color: 'error',
          showRequest: true
        };
      default:
        return {
          icon: <FiUser />,
          title: 'Not Certified',
          description: 'Become a certified professional to access premium features and products.',
          color: 'info',
          showRequest: true
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Checking certification status...</p>
      </div>
    );
  }

  // If certification is required and user is not certified
  if (requireCertification && !isCertified) {
    return (
      <div className={styles.certificationRequired}>
        <div className={styles.certificationCard}>
          <div className={styles.certificationIcon}>
            <FiLock />
          </div>
          <h2>Certification Required</h2>
          <p>This feature requires professional certification. Please complete the certification process to continue.</p>
          
          <div className={styles.certificationStatus}>
            <div className={`${styles.statusBadge} ${styles[statusInfo.color]}`}>
              {statusInfo.icon}
              <span>{statusInfo.title}</span>
            </div>
            <p>{statusInfo.description}</p>
          </div>

          {statusInfo.showRequest && (
            <button
              onClick={() => setShowCertificationRequest(true)}
              className={styles.requestButton}
            >
              <FiAward />
              Request Certification
            </button>
          )}

          {certificationStatus === 'pending' && (
            <div className={styles.pendingInfo}>
              <p>Your application is being reviewed. This typically takes 2-3 business days.</p>
              <p>You will receive an email notification once your certification is approved.</p>
            </div>
          )}
        </div>

        {showCertificationRequest && (
          <div className={styles.certificationModal}>
            <div className={styles.modalContent}>
              <button
                onClick={() => setShowCertificationRequest(false)}
                className={styles.closeButton}
              >
                ×
              </button>
              <CertificationRequest
                onSuccess={() => {
                  setShowCertificationRequest(false);
                  // Refresh certification status
                  window.location.reload();
                }}
                onError={(error) => {
                  console.error('Certification request error:', error);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // If showing certification status but not requiring it
  if (showCertificationStatus && session?.user) {
    return (
      <div className={styles.certificationWrapper}>
        <div className={styles.certificationBanner}>
          <div className={`${styles.statusBadge} ${styles[statusInfo.color]}`}>
            {statusInfo.icon}
            <span>{statusInfo.title}</span>
          </div>
          {statusInfo.showRequest && (
            <button
              onClick={() => setShowCertificationRequest(true)}
              className={styles.requestButton}
            >
              <FiArrowRight />
              Get Certified
            </button>
          )}
        </div>

        {children}

        {showCertificationRequest && (
          <div className={styles.certificationModal}>
            <div className={styles.modalContent}>
              <button
                onClick={() => setShowCertificationRequest(false)}
                className={styles.closeButton}
              >
                ×
              </button>
              <CertificationRequest
                onSuccess={() => {
                  setShowCertificationRequest(false);
                  window.location.reload();
                }}
                onError={(error) => {
                  console.error('Certification request error:', error);
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: show children
  return <>{children}</>;
} 