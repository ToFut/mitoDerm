'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiRefreshCw, FiHome, FiPackage, FiCalendar, FiMail } from 'react-icons/fi';
import { LuxuryButton } from '@/components/nextgen/LuxuryComponents';
import styles from './offline.module.scss';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Redirect to home when back online
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    
    try {
      const response = await fetch('/', { method: 'HEAD' });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.log('Still offline');
    }
  };

  const cachedPages = [
    { name: 'Home', icon: <FiHome />, path: '/' },
    { name: 'Products', icon: <FiPackage />, path: '/products' },
    { name: 'Events', icon: <FiCalendar />, path: '/events' },
    { name: 'Contact', icon: <FiMail />, path: '/contact' }
  ];

  return (
    <div className={styles.offlinePage}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Connection Status */}
          <motion.div
            className={`${styles.statusIndicator} ${isOnline ? styles.online : styles.offline}`}
            animate={{
              scale: isOnline ? [1, 1.1, 1] : 1,
              backgroundColor: isOnline ? '#10b981' : '#ef4444'
            }}
            transition={{ duration: 0.5 }}
          >
            <FiWifi className={styles.wifiIcon} />
          </motion.div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {isOnline ? 'Back Online!' : 'You\'re Offline'}
            </motion.h1>

            <motion.p
              className={styles.description}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isOnline
                ? 'Great! Your connection has been restored. Redirecting you now...'
                : 'Don\'t worry - you can still browse some of our content while offline.'
              }
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <LuxuryButton
                variant="primary"
                size="large"
                icon={<FiRefreshCw />}
                onClick={handleRetry}
                disabled={isOnline}
              >
                {isOnline ? 'Reconnecting...' : `Try Again ${retryCount > 0 ? `(${retryCount})` : ''}`}
              </LuxuryButton>
            </motion.div>

            {/* Offline Features */}
            {!isOnline && (
              <motion.div
                className={styles.offlineFeatures}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className={styles.featuresTitle}>Available Offline</h2>
                
                <div className={styles.cachedPages}>
                  {cachedPages.map((page, index) => (
                    <motion.a
                      key={page.path}
                      href={page.path}
                      className={styles.cachedPageCard}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.pageIcon}>
                        {page.icon}
                      </div>
                      <span className={styles.pageName}>{page.name}</span>
                    </motion.a>
                  ))}
                </div>

                <motion.div
                  className={styles.offlineInfo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <h3>What you can do offline:</h3>
                  <ul>
                    <li>Browse cached product information</li>
                    <li>Review event details you've previously viewed</li>
                    <li>Access company information and contact details</li>
                    <li>View your saved favorites and comparisons</li>
                  </ul>
                  
                  <p className={styles.syncNote}>
                    <strong>Note:</strong> Any actions you take offline will be synced automatically when you reconnect.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Connection Tips */}
          {!isOnline && (
            <motion.div
              className={styles.connectionTips}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3>Connection Troubleshooting</h3>
              <div className={styles.tips}>
                <div className={styles.tip}>
                  <strong>Check your WiFi:</strong> Make sure you're connected to a working network
                </div>
                <div className={styles.tip}>
                  <strong>Mobile data:</strong> Try switching between WiFi and mobile data
                </div>
                <div className={styles.tip}>
                  <strong>Airplane mode:</strong> Toggle airplane mode on and off to reset connections
                </div>
                <div className={styles.tip}>
                  <strong>Router:</strong> Try restarting your router if other devices aren't working
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Background Animation */}
        <div className={styles.backgroundAnimation}>
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className={styles.floatingElement}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}