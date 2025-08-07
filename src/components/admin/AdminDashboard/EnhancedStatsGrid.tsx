'use client';

import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiPackage, 
  FiCalendar, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiAward,
  FiEye,
  FiHeart,
  FiPercent,
  FiClock
} from 'react-icons/fi';
import { HolographicCard } from '@/components/nextgen/LuxuryComponents';
import styles from './AdminDashboard.module.scss';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalEvents: number;
  totalCertifications: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgSessionDuration: string;
  userGrowth: number;
  productViews: number;
  eventRegistrations: number;
  systemHealth: number;
}

interface EnhancedStatsGridProps {
  stats: DashboardStats;
  loading: boolean;
}

const EnhancedStatsGrid: React.FC<EnhancedStatsGridProps> = ({ stats, loading }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: formatNumber(stats.totalUsers),
      change: stats.userGrowth,
      changeText: `+${stats.userGrowth}% this month`,
      icon: <FiUsers />,
      color: 'blue',
      subtitle: `${stats.activeUsers} active users`
    },
    {
      title: 'Products',
      value: formatNumber(stats.totalProducts),
      change: 12,
      changeText: '+12% from last month',
      icon: <FiPackage />,
      color: 'green',
      subtitle: `${formatNumber(stats.productViews)} total views`
    },
    {
      title: 'Events',
      value: formatNumber(stats.totalEvents),
      change: 8,
      changeText: '+8% this quarter',
      icon: <FiCalendar />,
      color: 'purple',
      subtitle: `${stats.eventRegistrations} registrations`
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      change: 22,
      changeText: '+22% from last month',
      icon: <FiDollarSign />,
      color: 'gold',
      subtitle: 'Monthly recurring revenue'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: 0.5,
      changeText: '+0.5% improvement',
      icon: <FiPercent />,
      color: 'rose',
      subtitle: 'Visitor to customer'
    },
    {
      title: 'Certifications',
      value: formatNumber(stats.totalCertifications),
      change: 15,
      changeText: '+15% completions',
      icon: <FiAward />,
      color: 'platinum',
      subtitle: 'Professional certifications'
    },
    {
      title: 'Avg. Session',
      value: stats.avgSessionDuration,
      change: 12,
      changeText: '+12% engagement',
      icon: <FiClock />,
      color: 'blue',
      subtitle: 'User session duration'
    },
    {
      title: 'System Health',
      value: `${Math.round(stats.systemHealth)}%`,
      change: stats.systemHealth > 95 ? 2 : -1,
      changeText: stats.systemHealth > 95 ? 'Excellent' : 'Needs attention',
      icon: <FiActivity />,
      color: stats.systemHealth > 95 ? 'green' : 'rose',
      subtitle: 'Overall system status'
    }
  ];

  if (loading) {
    return (
      <div className={styles.statsGrid}>
        {Array.from({ length: 8 }).map((_, index) => (
          <HolographicCard key={index} glowColor="platinum" className={styles.statsCard}>
            <div className={styles.cardLoading}>
              <div className={styles.loadingSkeleton} />
              <div className={styles.loadingSkeleton} />
              <div className={styles.loadingSkeleton} />
            </div>
          </HolographicCard>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.statsGrid}>
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <HolographicCard 
            glowColor={card.color as any} 
            className={styles.enhancedStatsCard}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                {card.icon}
              </div>
              <div className={styles.cardChange}>
                {card.change > 0 ? (
                  <FiTrendingUp className={styles.trendUp} />
                ) : (
                  <FiTrendingDown className={styles.trendDown} />
                )}
                <span className={card.change > 0 ? styles.changePositive : styles.changeNegative}>
                  {card.change > 0 ? '+' : ''}{card.change}%
                </span>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div className={styles.cardValue}>{card.value}</div>
              <p className={styles.cardSubtitle}>{card.subtitle}</p>
              <div className={styles.cardChangeText}>{card.changeText}</div>
            </div>
            
            <div className={styles.cardProgress}>
              <div 
                className={styles.progressBar} 
                style={{ 
                  width: `${Math.min(100, Math.abs(card.change) * 5)}%`,
                  background: card.change > 0 ? '#00FF88' : '#FF6B6B'
                }} 
              />
            </div>
          </HolographicCard>
        </motion.div>
      ))}
    </div>
  );
};

export default EnhancedStatsGrid;