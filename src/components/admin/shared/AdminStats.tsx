'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './AdminStats.module.scss';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  description?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

interface AdminStatsProps {
  stats: StatCard[];
  columns?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export default function AdminStats({ 
  stats, 
  columns = 4,
  className 
}: AdminStatsProps) {
  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      } else {
        return value.toString();
      }
    }
    return value;
  };

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase': return styles.positive;
      case 'decrease': return styles.negative;
      case 'neutral': return styles.neutral;
      default: return '';
    }
  };

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase': return '↗';
      case 'decrease': return '↘';
      case 'neutral': return '→';
      default: return '';
    }
  };

  return (
    <div 
      className={`${styles.adminStats} ${styles[`columns${columns}`]} ${className || ''}`}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className={`${styles.statCard} ${stat.color ? styles[stat.color] : styles.primary}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            transition: { duration: 0.2 }
          }}
        >
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              {stat.icon}
            </div>
            {stat.change && (
              <div className={`${styles.change} ${getChangeColor(stat.change.type)}`}>
                <span className={styles.changeIcon}>
                  {getChangeIcon(stat.change.type)}
                </span>
                <span className={styles.changeValue}>
                  {Math.abs(stat.change.value)}%
                </span>
              </div>
            )}
          </div>
          
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {formatValue(stat.value)}
            </div>
            <div className={styles.statLabel}>
              {stat.label}
            </div>
            {stat.description && (
              <div className={styles.statDescription}>
                {stat.description}
              </div>
            )}
            {stat.change?.period && (
              <div className={styles.changePeriod}>
                vs {stat.change.period}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}