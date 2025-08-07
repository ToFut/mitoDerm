"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiUsers,
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiCalendar,
  FiClock,
  FiTarget,
  FiAward,
  FiZap,
  FiCpu,
  FiDownload,
  FiRefreshCw,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiShoppingBag,
  FiHeart,
  FiStar,
  FiMapPin,
  FiSmartphone,
  FiMonitor,
  FiGlobe,
  FiAlertTriangle
} from "react-icons/fi";
import { 
  AdminPageContainer, 
  AdminHeader, 
  AdminStats, 
  AdminCard 
} from "@/components/admin/shared";

interface MetricData {
  label: string;
  value: number;
  previousValue: number;
  dates: string[];
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

interface KPI {
  name: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  target?: number;
  achievement?: number;
}

export default function AdminAnalyticsPage() {
  const t = useTranslations("admin");
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [refreshing, setRefreshing] = useState(false);
  
  // Analytics Data
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData | null>(null);
  const [userActivityData, setUserActivityData] = useState<ChartData | null>(null);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<any[]>([]);
  const [geographicData, setGeographicData] = useState<any[]>([]);
  
  // Statistics
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    customerRetention: 0,
    monthlyGrowth: 0,
    yearlyGrowth: 0,
  });

  // AI Insights
  const [aiInsights, setAiInsights] = useState<{
    trends: string[];
    opportunities: string[];
    warnings: string[];
    predictions: {
      metric: string;
      prediction: string;
      confidence: number;
    }[];
  } | null>(null);

  // Add keyframes for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes growWidth {
        from { width: 0; }
        to { width: var(--target-width); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Simulate loading analytics data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock KPIs
      const mockKPIs: KPI[] = [
        {
          name: 'Revenue',
          value: '$125,420',
          change: 23.5,
          changeType: 'increase',
          target: 150000,
          achievement: 83.6
        },
        {
          name: 'Orders',
          value: '1,842',
          change: 15.3,
          changeType: 'increase',
          target: 2000,
          achievement: 92.1
        },
        {
          name: 'Conversion Rate',
          value: '3.8%',
          change: 0.5,
          changeType: 'increase',
          target: 4.5,
          achievement: 84.4
        },
        {
          name: 'Avg Order Value',
          value: '$68',
          change: 5.2,
          changeType: 'increase',
          target: 75,
          achievement: 90.7
        },
        {
          name: 'Customer Retention',
          value: '78%',
          change: 2.1,
          changeType: 'increase',
          target: 85,
          achievement: 91.8
        },
        {
          name: 'Cart Abandonment',
          value: '62%',
          change: 3.2,
          changeType: 'decrease',
          target: 55,
          achievement: 88.7
        }
      ];
      setKpis(mockKPIs);

      // Generate revenue chart data
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
      const labels = Array.from({ length: Math.min(days, 30) }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (Math.min(days, 30) - i - 1));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      const revenueChart: ChartData = {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: labels.map(() => Math.floor(Math.random() * 10000) + 2000),
            backgroundColor: 'rgba(190, 128, 12, 0.2)',
            borderColor: 'var(--colorPrimary)'
          },
          {
            label: 'Orders',
            data: labels.map(() => Math.floor(Math.random() * 100) + 20),
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6'
          }
        ]
      };
      setRevenueData(revenueChart);

      // Generate user activity data
      const activityChart: ChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Page Views',
            data: [4200, 3800, 4500, 5200, 4800, 6200, 5800],
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: '#10b981'
          },
          {
            label: 'Sessions',
            data: [1200, 1100, 1350, 1500, 1400, 1800, 1650],
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            borderColor: '#f59e0b'
          }
        ]
      };
      setUserActivityData(activityChart);

      // Generate product performance data
      const products = [
        { name: 'Exosome Serum Pro', sales: 342, revenue: 23940, growth: 15.2, rating: 4.8 },
        { name: 'PDRN Repair Complex', sales: 286, revenue: 20020, growth: 12.5, rating: 4.7 },
        { name: 'Peptide Lift Cream', sales: 215, revenue: 15050, growth: -5.3, rating: 4.5 },
        { name: 'Stem Cell Activator', sales: 198, revenue: 13860, growth: 8.7, rating: 4.9 },
        { name: 'Growth Factor Mask', sales: 176, revenue: 12320, growth: 22.1, rating: 4.6 }
      ];
      setProductPerformance(products);

      // Generate top performers
      const performers = [
        { type: 'brand', name: 'MitoDerm Pro', metric: '$45,230', change: 18.5 },
        { type: 'category', name: 'Professional', metric: '$38,150', change: 15.2 },
        { type: 'customer', name: 'Clinic Group A', metric: '$12,450', change: 25.3 },
        { type: 'region', name: 'Tel Aviv', metric: '$28,320', change: 12.8 }
      ];
      setTopPerformers(performers);

      // Generate traffic sources
      const traffic = [
        { source: 'Organic Search', visits: 12450, percentage: 38.2, conversion: 4.2 },
        { source: 'Direct', visits: 8320, percentage: 25.6, conversion: 5.1 },
        { source: 'Social Media', visits: 6180, percentage: 19.0, conversion: 2.8 },
        { source: 'Email', visits: 3250, percentage: 10.0, conversion: 6.7 },
        { source: 'Referral', visits: 2350, percentage: 7.2, conversion: 3.9 }
      ];
      setTrafficSources(traffic);

      // Generate device breakdown
      const devices = [
        { device: 'Desktop', users: 15420, percentage: 48.5 },
        { device: 'Mobile', users: 12860, percentage: 40.5 },
        { device: 'Tablet', users: 3490, percentage: 11.0 }
      ];
      setDeviceBreakdown(devices);

      // Generate geographic data
      const geographic = [
        { country: 'Israel', users: 18520, revenue: 78450, conversion: 4.2 },
        { country: 'United States', users: 6420, revenue: 32180, conversion: 3.8 },
        { country: 'United Kingdom', users: 3180, revenue: 15230, conversion: 3.5 },
        { country: 'Germany', users: 2450, revenue: 11820, conversion: 3.2 },
        { country: 'France', users: 1980, revenue: 8950, conversion: 3.0 }
      ];
      setGeographicData(geographic);

      // Calculate statistics
      setStats({
        totalRevenue: 125420,
        totalOrders: 1842,
        totalCustomers: 3256,
        averageOrderValue: 68,
        conversionRate: 3.8,
        customerRetention: 78,
        monthlyGrowth: 23.5,
        yearlyGrowth: 142.3,
      });

      // Generate AI insights
      generateAIInsights();
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = () => {
    setAiInsights({
      trends: [
        'Revenue increased 23.5% compared to last period',
        'Mobile traffic growing faster than desktop (15% vs 8%)',
        'Professional category showing strongest growth momentum',
        'Customer retention improved by 2.1 percentage points'
      ],
      opportunities: [
        'Email marketing shows highest conversion rate (6.7%) - consider increasing investment',
        'Weekend traffic peaks suggest opportunity for targeted campaigns',
        'Cart abandonment rate can be reduced with exit-intent popups',
        'Cross-selling potential identified in Peptide products category'
      ],
      warnings: [
        'Peptide Lift Cream showing -5.3% growth - needs attention',
        'Bounce rate increased on mobile devices',
        'Customer acquisition cost trending upward',
        'Inventory turnover slowing for certain SKUs'
      ],
      predictions: [
        {
          metric: 'Q4 Revenue',
          prediction: '$380,000 - $420,000',
          confidence: 0.82
        },
        {
          metric: 'December Orders',
          prediction: '2,450 - 2,680',
          confidence: 0.78
        },
        {
          metric: 'Year-end Customers',
          prediction: '4,200 - 4,500',
          confidence: 0.85
        }
      ]
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const handleExport = () => {
    // Export analytics data
    const data = {
      dateRange,
      kpis,
      stats,
      productPerformance,
      trafficSources,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Component configuration
  const headerActions = [
    {
      label: "AI Predictions",
      icon: <FiCpu />,
      onClick: () => console.log('AI predictions'),
      variant: "ai" as const
    },
    {
      label: "Export Report",
      icon: <FiDownload />,
      onClick: handleExport,
      variant: "secondary" as const
    },
    {
      label: "Refresh",
      icon: <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />,
      onClick: handleRefresh,
      variant: "primary" as const
    }
  ];

  const statsData = kpis.map(kpi => ({
    label: kpi.name,
    value: kpi.value,
    icon: kpi.name === 'Revenue' ? <FiDollarSign /> :
          kpi.name === 'Orders' ? <FiShoppingCart /> :
          kpi.name === 'Conversion Rate' ? <FiTarget /> :
          kpi.name === 'Avg Order Value' ? <FiShoppingBag /> :
          kpi.name === 'Customer Retention' ? <FiHeart /> :
          <FiActivity />,
    color: kpi.changeType === 'increase' ? "success" : "warning" as const,
    change: {
      value: Math.abs(kpi.change),
      type: kpi.changeType,
      period: "vs last period"
    },
    description: kpi.target ? `Target: ${kpi.achievement?.toFixed(1)}%` : undefined
  }));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <AdminPageContainer>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            border: "3px solid rgba(255, 255, 255, 0.1)",
            borderTop: "3px solid var(--colorPrimary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading analytics data...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader 
        title="Analytics Dashboard"
        subtitle="Comprehensive business intelligence and performance metrics with AI-powered insights"
        actions={headerActions}
        breadcrumb={["Admin", "Analytics"]}
      />

      {/* Date Range Selector */}
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "2rem",
        background: "rgba(255, 255, 255, 0.05)",
        padding: "0.5rem",
        borderRadius: "8px",
        width: "fit-content"
      }}>
        {(['7d', '30d', '90d', '1y'] as const).map(range => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              background: dateRange === range ? "var(--colorPrimary)" : "transparent",
              border: "none",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {range === '7d' ? 'Last 7 Days' :
             range === '30d' ? 'Last 30 Days' :
             range === '90d' ? 'Last 90 Days' :
             'Last Year'}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <AdminStats stats={statsData as any} columns={6} />

      {/* AI Insights */}
      {aiInsights && (
        <AdminCard 
          variant="gradient" 
          padding="large"
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--colorPrimary), var(--colorSecondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <FiCpu size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "rgba(255, 255, 255, 0.95)" }}>
                AI-Powered Insights
              </h3>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
                gap: "1.5rem" 
              }}>
                {/* Trends */}
                <div>
                  <h4 style={{ 
                    color: "#10b981", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <FiTrendingUp size={16} /> Key Trends
                  </h4>
                  <ul style={{ 
                    listStyle: "none", 
                    padding: 0, 
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.8)"
                  }}>
                    {aiInsights.trends.map((trend, i) => (
                      <li key={i} style={{ marginBottom: "0.5rem" }}>• {trend}</li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div>
                  <h4 style={{ 
                    color: "#f59e0b", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <FiZap size={16} /> Opportunities
                  </h4>
                  <ul style={{ 
                    listStyle: "none", 
                    padding: 0, 
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.8)"
                  }}>
                    {aiInsights.opportunities.map((opp, i) => (
                      <li key={i} style={{ marginBottom: "0.5rem" }}>• {opp}</li>
                    ))}
                  </ul>
                </div>

                {/* Warnings */}
                <div>
                  <h4 style={{ 
                    color: "#ef4444", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <FiAlertTriangle size={16} /> Attention Needed
                  </h4>
                  <ul style={{ 
                    listStyle: "none", 
                    padding: 0, 
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.8)"
                  }}>
                    {aiInsights.warnings.map((warning, i) => (
                      <li key={i} style={{ marginBottom: "0.5rem" }}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Predictions */}
              <div style={{ marginTop: "1.5rem" }}>
                <h4 style={{ 
                  color: "rgba(255, 255, 255, 0.9)", 
                  fontSize: "0.9rem", 
                  marginBottom: "0.75rem" 
                }}>
                  Predictions
                </h4>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {aiInsights.predictions.map((pred, i) => (
                    <div 
                      key={i}
                      style={{
                        padding: "0.75rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.1)"
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.25rem" }}>
                        {pred.metric}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                        {pred.prediction}
                      </div>
                      <div style={{ 
                        fontSize: "0.7rem", 
                        color: "#10b981", 
                        marginTop: "0.25rem" 
                      }}>
                        {Math.round(pred.confidence * 100)}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Charts Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", 
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {/* Revenue Chart */}
        <AdminCard variant="gradient" padding="large">
          <h3 style={{ margin: "0 0 1.5rem 0", color: "rgba(255, 255, 255, 0.95)" }}>
            Revenue & Orders Trend
          </h3>
          <div style={{ height: "300px", position: "relative" }}>
            {/* Placeholder for chart - would use Chart.js or similar */}
            <div style={{
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <FiBarChart2 size={48} color="rgba(255, 255, 255, 0.2)" />
            </div>
          </div>
        </AdminCard>

        {/* User Activity Chart */}
        <AdminCard variant="gradient" padding="large">
          <h3 style={{ margin: "0 0 1.5rem 0", color: "rgba(255, 255, 255, 0.95)" }}>
            User Activity Pattern
          </h3>
          <div style={{ height: "300px", position: "relative" }}>
            {/* Placeholder for chart */}
            <div style={{
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <FiActivity size={48} color="rgba(255, 255, 255, 0.2)" />
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Performance Tables */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        {/* Top Products */}
        <AdminCard variant="gradient" padding="medium">
          <h3 style={{ margin: "0 0 1rem 0", color: "rgba(255, 255, 255, 0.95)", fontSize: "1.1rem" }}>
            Top Products
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>Product</th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>Sales</th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>Revenue</th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>Growth</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.map((product, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.9)" }}>
                      {product.name}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                      {product.sales}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", fontWeight: "600", color: "#10b981" }}>
                      ${product.revenue.toLocaleString()}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem" }}>
                      <span style={{ 
                        color: product.growth >= 0 ? "#10b981" : "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "0.25rem"
                      }}>
                        {product.growth >= 0 ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                        {Math.abs(product.growth)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        {/* Traffic Sources */}
        <AdminCard variant="gradient" padding="medium">
          <h3 style={{ margin: "0 0 1rem 0", color: "rgba(255, 255, 255, 0.95)", fontSize: "1.1rem" }}>
            Traffic Sources
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>Source</th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>Visits</th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>Share</th>
                  <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>Conv.</th>
                </tr>
              </thead>
              <tbody>
                {trafficSources.map((source, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.9)" }}>
                      {source.source}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                      {formatNumber(source.visits)}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <div style={{
                          width: "40px",
                          height: "4px",
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "2px",
                          overflow: "hidden"
                        }}>
                          <div style={{
                            width: `${source.percentage}%`,
                            height: "100%",
                            background: "var(--colorPrimary)",
                            borderRadius: "2px"
                          }} />
                        </div>
                        {source.percentage}%
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: "#10b981" }}>
                      {source.conversion}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      {/* Geographic & Device Stats */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "1.5rem" 
      }}>
        {/* Geographic Distribution */}
        <AdminCard variant="gradient" padding="medium">
          <h3 style={{ margin: "0 0 1rem 0", color: "rgba(255, 255, 255, 0.95)", fontSize: "1.1rem" }}>
            <FiGlobe style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
            Geographic Distribution
          </h3>
          <div>
            {geographicData.map((country, i) => (
              <div key={i} style={{ 
                padding: "0.75rem 0", 
                borderBottom: i < geographicData.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.9)" }}>
                    {country.country}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#10b981" }}>
                    ${formatNumber(country.revenue)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  <span><FiUsers size={12} style={{ marginRight: "0.25rem" }} />{formatNumber(country.users)} users</span>
                  <span><FiTarget size={12} style={{ marginRight: "0.25rem" }} />{country.conversion}% conv</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Device Breakdown */}
        <AdminCard variant="gradient" padding="medium">
          <h3 style={{ margin: "0 0 1rem 0", color: "rgba(255, 255, 255, 0.95)", fontSize: "1.1rem" }}>
            Device Breakdown
          </h3>
          <div>
            {deviceBreakdown.map((device, i) => (
              <div key={i} style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ 
                    fontSize: "0.85rem", 
                    color: "rgba(255, 255, 255, 0.9)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    {device.device === 'Desktop' ? <FiMonitor size={14} /> :
                     device.device === 'Mobile' ? <FiSmartphone size={14} /> :
                     <FiMonitor size={14} />}
                    {device.device}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                    {formatNumber(device.users)} ({device.percentage}%)
                  </span>
                </div>
                <div style={{
                  width: "100%",
                  height: "8px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${device.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{
                      height: "100%",
                      background: device.device === 'Desktop' ? "#3b82f6" :
                                 device.device === 'Mobile' ? "#10b981" :
                                 "#f59e0b",
                      borderRadius: "4px"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Top Performers */}
        <AdminCard variant="gradient" padding="medium">
          <h3 style={{ margin: "0 0 1rem 0", color: "rgba(255, 255, 255, 0.95)", fontSize: "1.1rem" }}>
            <FiAward style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
            Top Performers
          </h3>
          <div>
            {topPerformers.map((performer, i) => (
              <div key={i} style={{ 
                padding: "0.75rem 0", 
                borderBottom: i < topPerformers.length - 1 ? "1px solid rgba(255, 255, 255, 0.05)" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.9)", marginBottom: "0.25rem" }}>
                    {performer.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", textTransform: "capitalize" }}>
                    {performer.type}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                    {performer.metric}
                  </div>
                  <div style={{ 
                    fontSize: "0.75rem", 
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "0.25rem"
                  }}>
                    <FiArrowUp size={10} />
                    {performer.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Business Metrics Summary */}
      <AdminCard variant="gradient" padding="large" style={{ marginTop: "2rem" }}>
        <h3 style={{ margin: "0 0 1.5rem 0", color: "rgba(255, 255, 255, 0.95)" }}>
          Business Performance Summary
        </h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "2rem" 
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.5rem" }}>
              Total Revenue
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.25rem" }}>
              +{stats.monthlyGrowth}% this month
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.5rem" }}>
              Total Orders
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
              {stats.totalOrders.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "0.25rem" }}>
              Avg: {Math.floor(stats.totalOrders / 30)}/day
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.5rem" }}>
              Active Customers
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
              {stats.totalCustomers.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "0.25rem" }}>
              {stats.customerRetention}% retention
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.5rem" }}>
              Conversion Rate
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
              {stats.conversionRate}%
            </div>
            <div style={{ fontSize: "0.8rem", color: "#f59e0b", marginTop: "0.25rem" }}>
              Industry avg: 2.8%
            </div>
          </div>
        </div>
      </AdminCard>
    </AdminPageContainer>
  );
}