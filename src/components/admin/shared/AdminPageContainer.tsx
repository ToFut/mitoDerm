'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './AdminPageContainer.module.scss';

interface AdminPageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function AdminPageContainer({ children, className }: AdminPageContainerProps) {
  return (
    <div className={`${styles.adminPageContainer} ${className || ''}`}>
      <div className={styles.glassBg} />
      <div className={styles.gradientOverlay} />
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}