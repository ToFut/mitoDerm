'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './AdminHeader.module.scss';

interface ActionButton {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ai' | 'danger';
}

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ActionButton[];
  breadcrumb?: string[];
  className?: string;
}

export default function AdminHeader({ 
  title, 
  subtitle, 
  actions = [], 
  breadcrumb = [],
  className 
}: AdminHeaderProps) {
  return (
    <motion.div 
      className={`${styles.adminHeader} ${className || ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.headerContent}>
        {breadcrumb.length > 0 && (
          <nav className={styles.breadcrumb}>
            {breadcrumb.map((item, index) => (
              <span key={index} className={styles.breadcrumbItem}>
                {item}
                {index < breadcrumb.length - 1 && (
                  <span className={styles.breadcrumbSeparator}>/</span>
                )}
              </span>
            ))}
          </nav>
        )}
        
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      
      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <motion.button
              key={index}
              className={`${styles.actionButton} ${styles[action.variant || 'primary']}`}
              onClick={action.onClick}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className={styles.actionIcon}>{action.icon}</span>
              <span className={styles.actionLabel}>{action.label}</span>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}