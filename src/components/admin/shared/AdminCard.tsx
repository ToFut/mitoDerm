'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './AdminCard.module.scss';

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'glass' | 'gradient';
  onClick?: () => void;
}

export default function AdminCard({ 
  children, 
  className, 
  hover = true, 
  padding = 'medium',
  variant = 'default',
  onClick 
}: AdminCardProps) {
  return (
    <motion.div
      className={`${styles.adminCard} ${styles[padding]} ${styles[variant]} ${className || ''} ${onClick ? styles.clickable : ''}`}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}