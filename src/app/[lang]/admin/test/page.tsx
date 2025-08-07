'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../admin.module.scss';
import AdminTestSuite from '@/components/admin/AdminTestSuite/AdminTestSuite';

export default function AdminTestPage() {
  const t = useTranslations('admin');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.glassBg} />
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.gradientTitle}>Admin Test Suite</h1>
            <p className={styles.dashboardDescription}>
              Comprehensive testing for all admin functionality including database, storage, and UI components
            </p>
          </div>
        </div>
        
        <AdminTestSuite />
      </div>
    </div>
  );
} 