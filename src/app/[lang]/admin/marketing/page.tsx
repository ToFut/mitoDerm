"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMail,
  FiMessageSquare,
  FiSmartphone,
  FiTarget,
  FiUsers,
  FiPercent,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiClock,
  FiPlay,
  FiPause,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiEye,
  FiSend,
  FiDownload,
  FiPlus,
  FiCpu,
  FiZap,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiAward,
  FiGift,
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiAlertTriangle,
  FiRefreshCw
} from "react-icons/fi";
import { 
  AdminPageContainer, 
  AdminHeader, 
  AdminStats, 
  AdminFilters, 
  AdminTable, 
  AdminCard 
} from "@/components/admin/shared";

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'push' | 'social' | 'multi_channel';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  objective: 'awareness' | 'engagement' | 'conversion' | 'retention' | 'win_back';
  audience: {
    segments: string[];
    filters: {
      age?: { min: number; max: number };
      location?: string[];
      purchaseHistory?: string;
      engagement?: string;
    };
    estimatedReach: number;
  };
  content: {
    subject?: string;
    preheader?: string;
    body: string;
    cta?: {
      text: string;
      url: string;
    };
    images?: string[];
    personalization?: boolean;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    sendTime?: string;
  };
  budget?: {
    total: number;
    spent: number;
    currency: string;
  };
  performance: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
    roi: number;
    unsubscribed: number;
  };
  abTest?: {
    enabled: boolean;
    variants: Array<{
      id: string;
      name: string;
      percentage: number;
      content: any;
      performance: any;
    }>;
    winner?: string;
  };
  automation?: {
    trigger: 'manual' | 'event' | 'date' | 'behavior';
    conditions?: any[];
    workflow?: any[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  type: Campaign['type'];
  thumbnail?: string;
  content: any;
  usage: number;
  rating: number;
}

export default function AdminMarketingPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [viewMode, setViewMode] = useState<'campaigns' | 'templates' | 'automation'>('campaigns');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterObjective, setFilterObjective] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  
  // Statistics
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalReach: 0,
    totalRevenue: 0,
    averageROI: 0,
    conversionRate: 0,
    emailPerformance: { open: 0, click: 0, conversion: 0 },
    topPerformingCampaign: null as Campaign | null,
  });

  // AI Insights
  const [aiInsights, setAiInsights] = useState<{
    recommendations: string[];
    predictions: { metric: string; value: string; confidence: number }[];
    optimization: { campaign: string; suggestion: string; impact: string }[];
    bestTimes: { day: string; time: string; engagement: number }[];
  } | null>(null);

  // Add keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(0.95); }
      }
      @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Load campaigns
  useEffect(() => {
    loadCampaigns();
    loadTemplates();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock campaigns
      const mockCampaigns: Campaign[] = [
        {
          id: 'camp-1',
          name: 'Holiday Season Sale 2024',
          description: 'End of year promotional campaign for all products',
          type: 'multi_channel',
          status: 'active',
          objective: 'conversion',
          audience: {
            segments: ['vip', 'loyal'],
            filters: { purchaseHistory: 'frequent' },
            estimatedReach: 5420
          },
          content: {
            subject: '🎁 Exclusive Holiday Offers Just for You!',
            body: 'Get up to 40% off on selected items',
            cta: { text: 'Shop Now', url: '/sale' },
            personalization: true
          },
          schedule: {
            startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            timezone: 'Asia/Jerusalem',
            frequency: 'daily',
            sendTime: '10:00'
          },
          budget: { total: 5000, spent: 2340, currency: 'USD' },
          performance: {
            sent: 5420,
            delivered: 5280,
            opened: 2640,
            clicked: 845,
            converted: 234,
            revenue: 18450,
            roi: 688,
            unsubscribed: 12
          },
          abTest: {
            enabled: true,
            variants: [
              { id: 'a', name: 'Variant A', percentage: 50, content: {}, performance: {} },
              { id: 'b', name: 'Variant B', percentage: 50, content: {}, performance: {} }
            ],
            winner: 'a'
          },
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin'
        },
        {
          id: 'camp-2',
          name: 'New Product Launch - Exosome Pro',
          description: 'Launch campaign for new Exosome product line',
          type: 'email',
          status: 'scheduled',
          objective: 'awareness',
          audience: {
            segments: ['professional', 'clinic'],
            filters: { location: ['Tel Aviv', 'Jerusalem'] },
            estimatedReach: 3200
          },
          content: {
            subject: 'Introducing Exosome Pro - Revolutionary Skincare',
            body: 'Be the first to experience our breakthrough technology',
            cta: { text: 'Learn More', url: '/products/exosome-pro' }
          },
          schedule: {
            startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            timezone: 'Asia/Jerusalem',
            frequency: 'once'
          },
          budget: { total: 3000, spent: 0, currency: 'USD' },
          performance: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            converted: 0,
            revenue: 0,
            roi: 0,
            unsubscribed: 0
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin'
        },
        {
          id: 'camp-3',
          name: 'Customer Win-Back Campaign',
          description: 'Re-engage inactive customers with special offers',
          type: 'email',
          status: 'completed',
          objective: 'win_back',
          audience: {
            segments: ['at_risk', 'churned'],
            filters: { engagement: 'inactive' },
            estimatedReach: 1850
          },
          content: {
            subject: 'We Miss You! Here\'s 25% Off',
            body: 'Come back and enjoy exclusive discounts',
            cta: { text: 'Claim Discount', url: '/comeback' }
          },
          schedule: {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            timezone: 'Asia/Jerusalem',
            frequency: 'once'
          },
          performance: {
            sent: 1850,
            delivered: 1780,
            opened: 534,
            clicked: 123,
            converted: 45,
            revenue: 3420,
            roi: 342,
            unsubscribed: 28
          },
          createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'admin'
        }
      ];

      setCampaigns(mockCampaigns);
      calculateStats(mockCampaigns);
      generateAIInsights(mockCampaigns);
      
    } catch (err) {
      setError('Failed to load campaigns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    // Generate mock templates
    const mockTemplates: Template[] = [
      {
        id: 'temp-1',
        name: 'Welcome Series',
        category: 'Onboarding',
        type: 'email',
        content: {},
        usage: 145,
        rating: 4.8
      },
      {
        id: 'temp-2',
        name: 'Product Launch',
        category: 'Promotional',
        type: 'multi_channel',
        content: {},
        usage: 89,
        rating: 4.6
      },
      {
        id: 'temp-3',
        name: 'Abandoned Cart',
        category: 'Retention',
        type: 'email',
        content: {},
        usage: 234,
        rating: 4.9
      }
    ];
    setTemplates(mockTemplates);
  };

  // Calculate statistics
  const calculateStats = useCallback((campaignsData: Campaign[]) => {
    const activeCampaigns = campaignsData.filter(c => c.status === 'active').length;
    const totalReach = campaignsData.reduce((sum, c) => sum + c.audience.estimatedReach, 0);
    const totalRevenue = campaignsData.reduce((sum, c) => sum + c.performance.revenue, 0);
    
    const campaignsWithROI = campaignsData.filter(c => c.performance.roi > 0);
    const averageROI = campaignsWithROI.length > 0
      ? campaignsWithROI.reduce((sum, c) => sum + c.performance.roi, 0) / campaignsWithROI.length
      : 0;
    
    const totalSent = campaignsData.reduce((sum, c) => sum + c.performance.sent, 0);
    const totalConverted = campaignsData.reduce((sum, c) => sum + c.performance.converted, 0);
    const conversionRate = totalSent > 0 ? (totalConverted / totalSent) * 100 : 0;
    
    const emailCampaigns = campaignsData.filter(c => c.type === 'email' && c.performance.sent > 0);
    const emailPerformance = {
      open: emailCampaigns.length > 0
        ? emailCampaigns.reduce((sum, c) => sum + (c.performance.opened / c.performance.sent) * 100, 0) / emailCampaigns.length
        : 0,
      click: emailCampaigns.length > 0
        ? emailCampaigns.reduce((sum, c) => sum + (c.performance.clicked / c.performance.opened) * 100, 0) / emailCampaigns.length
        : 0,
      conversion: conversionRate
    };
    
    const topPerformingCampaign = campaignsData.reduce((best, current) => 
      (!best || current.performance.roi > best.performance.roi) ? current : best, 
      null as Campaign | null
    );
    
    setStats({
      totalCampaigns: campaignsData.length,
      activeCampaigns,
      totalReach,
      totalRevenue,
      averageROI,
      conversionRate,
      emailPerformance,
      topPerformingCampaign,
    });
  }, []);

  // Generate AI insights
  const generateAIInsights = useCallback((campaignsData: Campaign[]) => {
    setAiInsights({
      recommendations: [
        'Schedule campaigns for Tuesday-Thursday for 23% higher open rates',
        'Segment VIP customers showing 3x higher conversion rates',
        'A/B test subject lines - emoji usage increases opens by 15%',
        'Multi-channel campaigns show 45% better ROI than single channel'
      ],
      predictions: [
        { metric: 'Next Month Revenue', value: '$42,500 - $48,000', confidence: 0.78 },
        { metric: 'Email Open Rate', value: '28-32%', confidence: 0.82 },
        { metric: 'Campaign ROI', value: '580-650%', confidence: 0.75 }
      ],
      optimization: [
        { 
          campaign: 'Holiday Season Sale', 
          suggestion: 'Increase budget by 20%', 
          impact: '+$8,500 revenue'
        },
        { 
          campaign: 'Win-Back Campaign', 
          suggestion: 'Add SMS channel', 
          impact: '+15% reach'
        }
      ],
      bestTimes: [
        { day: 'Tuesday', time: '10:00 AM', engagement: 32 },
        { day: 'Thursday', time: '2:00 PM', engagement: 28 },
        { day: 'Sunday', time: '7:00 PM', engagement: 25 }
      ]
    });
  }, []);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns.filter(campaign => {
      const matchesSearch = 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || campaign.status === filterStatus;
      const matchesType = filterType === "all" || campaign.type === filterType;
      const matchesObjective = filterObjective === "all" || campaign.objective === filterObjective;
      
      return matchesSearch && matchesStatus && matchesType && matchesObjective;
    });

    // Sort campaigns
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "performance":
          return b.performance.roi - a.performance.roi;
        case "reach":
          return b.audience.estimatedReach - a.audience.estimatedReach;
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [campaigns, searchTerm, filterStatus, filterType, filterObjective, sortBy]);

  // Event handlers
  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setShowCampaignModal(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignModal(true);
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const duplicated = {
      ...campaign,
      id: `camp-${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: 'draft' as Campaign['status'],
      performance: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0,
        roi: 0,
        unsubscribed: 0
      }
    };
    setCampaigns(prev => [...prev, duplicated]);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    }
  };

  const handlePauseCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: 'paused' as Campaign['status'] } : c
    ));
  };

  const handleResumeCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: 'active' as Campaign['status'] } : c
    ));
  };

  const handleBulkAction = (action: string, campaignIds: string[]) => {
    switch (action) {
      case 'pause':
        setCampaigns(prev => prev.map(c => 
          campaignIds.includes(c.id) ? { ...c, status: 'paused' as Campaign['status'] } : c
        ));
        break;
      case 'resume':
        setCampaigns(prev => prev.map(c => 
          campaignIds.includes(c.id) ? { ...c, status: 'active' as Campaign['status'] } : c
        ));
        break;
      case 'delete':
        if (confirm(`Delete ${campaignIds.length} campaigns?`)) {
          setCampaigns(prev => prev.filter(c => !campaignIds.includes(c.id)));
        }
        break;
    }
    setSelectedCampaigns([]);
  };

  const handleExportCampaigns = () => {
    const csv = [
      ['Name', 'Type', 'Status', 'Objective', 'Reach', 'Sent', 'Opens', 'Clicks', 'Conversions', 'Revenue', 'ROI'].join(','),
      ...filteredCampaigns.map(c => [
        `"${c.name}"`,
        c.type,
        c.status,
        c.objective,
        c.audience.estimatedReach,
        c.performance.sent,
        c.performance.opened,
        c.performance.clicked,
        c.performance.converted,
        c.performance.revenue,
        `${c.performance.roi}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaigns-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Component configuration
  const headerActions = [
    {
      label: "AI Assistant",
      icon: <FiCpu />,
      onClick: () => console.log('AI assistant'),
      variant: "ai" as const
    },
    {
      label: "Export Campaigns",
      icon: <FiDownload />,
      onClick: handleExportCampaigns,
      variant: "secondary" as const
    },
    {
      label: "Create Campaign",
      icon: <FiPlus />,
      onClick: handleCreateCampaign,
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Active Campaigns",
      value: stats.activeCampaigns,
      icon: <FiPlay />,
      color: "success" as const,
      change: { value: 3, type: "increase" as const, period: "this week" },
      description: "Currently running"
    },
    {
      label: "Total Reach",
      value: formatNumber(stats.totalReach),
      icon: <FiUsers />,
      color: "info" as const,
      change: { value: 15, type: "increase" as const, period: "last month" },
      description: "Audience size"
    },
    {
      label: "Campaign Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "warning" as const,
      change: { value: 28, type: "increase" as const, period: "last month" },
      description: "Generated revenue"
    },
    {
      label: "Average ROI",
      value: `${stats.averageROI.toFixed(0)}%`,
      icon: <FiTrendingUp />,
      color: "primary" as const,
      change: { value: 45, type: "increase" as const, period: "last quarter" },
      description: "Return on investment"
    },
    {
      label: "Email Open Rate",
      value: `${stats.emailPerformance.open.toFixed(1)}%`,
      icon: <FiMail />,
      color: "secondary" as const,
      change: { value: 2.3, type: "increase" as const, period: "last month" },
      description: "Email engagement"
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(2)}%`,
      icon: <FiTarget />,
      color: "success" as const,
      change: { value: 0.8, type: "increase" as const, period: "last month" },
      description: "Campaign conversions"
    }
  ];

  const filterConfigs = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All Status", value: "all" },
        { label: "Draft", value: "draft" },
        { label: "Scheduled", value: "scheduled" },
        { label: "Active", value: "active" },
        { label: "Paused", value: "paused" },
        { label: "Completed", value: "completed" }
      ]
    },
    {
      key: "type",
      label: "Channel",
      type: "select" as const,
      options: [
        { label: "All Channels", value: "all" },
        { label: "Email", value: "email" },
        { label: "SMS", value: "sms" },
        { label: "Push", value: "push" },
        { label: "Social", value: "social" },
        { label: "Multi-Channel", value: "multi_channel" }
      ]
    },
    {
      key: "objective",
      label: "Objective",
      type: "select" as const,
      options: [
        { label: "All Objectives", value: "all" },
        { label: "Awareness", value: "awareness" },
        { label: "Engagement", value: "engagement" },
        { label: "Conversion", value: "conversion" },
        { label: "Retention", value: "retention" },
        { label: "Win-Back", value: "win_back" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Created Date", value: "createdAt" },
        { label: "Name", value: "name" },
        { label: "Performance", value: "performance" },
        { label: "Reach", value: "reach" }
      ]
    }
  ];

  const getStatusBadge = (status: Campaign['status']) => {
    const colors = {
      draft: { bg: "rgba(107, 114, 128, 0.2)", color: "#6b7280" },
      scheduled: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
      active: { bg: "rgba(16, 185, 129, 0.2)", color: "#10b981" },
      paused: { bg: "rgba(245, 158, 11, 0.2)", color: "#f59e0b" },
      completed: { bg: "rgba(139, 92, 246, 0.2)", color: "#8b5cf6" },
      cancelled: { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }
    };
    
    return (
      <span style={{
        padding: "0.25rem 0.75rem",
        borderRadius: "6px",
        background: colors[status].bg,
        color: colors[status].color,
        fontSize: "0.75rem",
        fontWeight: "500",
        textTransform: "capitalize"
      }}>
        {status}
      </span>
    );
  };

  const tableColumns = [
    { 
      key: "name", 
      label: "Campaign", 
      sortable: true, 
      render: (value: string, row: Campaign) => (
        <div>
          <strong style={{ color: "rgba(255, 255, 255, 0.95)", display: "block", marginBottom: "0.25rem" }}>
            {row.name}
          </strong>
          <small style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            {row.description}
          </small>
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            {getStatusBadge(row.status)}
            <span style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
              background: "rgba(190, 128, 12, 0.2)",
              color: "var(--colorPrimary)",
              fontSize: "0.7rem",
              textTransform: "capitalize"
            }}>
              {row.type.replace('_', ' ')}
            </span>
          </div>
        </div>
      )
    },
    { 
      key: "audience", 
      label: "Audience", 
      render: (audience: Campaign['audience']) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <FiUsers size={14} />
            <span style={{ fontWeight: "600" }}>{formatNumber(audience.estimatedReach)}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
            {audience.segments.join(', ')}
          </div>
        </div>
      )
    },
    { 
      key: "performance", 
      label: "Performance", 
      render: (performance: Campaign['performance']) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem" }}>
            <span>📧 {formatNumber(performance.sent)}</span>
            <span>👁 {((performance.opened / Math.max(performance.sent, 1)) * 100).toFixed(0)}%</span>
            <span>🖱 {((performance.clicked / Math.max(performance.opened, 1)) * 100).toFixed(0)}%</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#10b981" }}>
              💰 ${formatNumber(performance.revenue)}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--colorPrimary)" }}>
              ROI: {performance.roi}%
            </span>
          </div>
        </div>
      )
    },
    { 
      key: "schedule", 
      label: "Schedule", 
      render: (schedule: Campaign['schedule'], row: Campaign) => (
        <div style={{ fontSize: "0.85rem" }}>
          <div style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            {new Date(schedule.startDate).toLocaleDateString()}
          </div>
          {schedule.endDate && (
            <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
              to {new Date(schedule.endDate).toLocaleDateString()}
            </div>
          )}
          {schedule.frequency && schedule.frequency !== 'once' && (
            <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
              {schedule.frequency}
            </div>
          )}
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: "View",
      icon: <FiEye />,
      onClick: (campaign: Campaign) => console.log('View', campaign),
      variant: "secondary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (campaign: Campaign) => handleEditCampaign(campaign),
      variant: "primary" as const
    },
    {
      label: "Duplicate",
      icon: <FiCopy />,
      onClick: (campaign: Campaign) => handleDuplicateCampaign(campaign),
      variant: "secondary" as const
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (campaign: Campaign) => handleDeleteCampaign(campaign.id),
      variant: "danger" as const
    }
  ];

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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading campaigns...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader 
        title="Marketing Campaign Management"
        subtitle="Create, manage, and optimize multi-channel marketing campaigns with AI-powered insights"
        actions={headerActions}
        breadcrumb={["Admin", "Marketing"]}
      />

      {/* AI Insights */}
      {aiInsights && (
        <AdminCard 
          variant="ai" 
          padding="large"
          style={{ marginBottom: "2rem" }}
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
                AI Marketing Assistant
              </h3>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "1.5rem" 
              }}>
                {/* Recommendations */}
                <div>
                  <h4 style={{ 
                    color: "#10b981", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem" 
                  }}>
                    <FiZap style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                    Smart Recommendations
                  </h4>
                  <ul style={{ 
                    listStyle: "none", 
                    padding: 0, 
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.8)"
                  }}>
                    {aiInsights.recommendations.map((rec, i) => (
                      <li key={i} style={{ marginBottom: "0.5rem" }}>• {rec}</li>
                    ))}
                  </ul>
                </div>

                {/* Best Send Times */}
                <div>
                  <h4 style={{ 
                    color: "#f59e0b", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem" 
                  }}>
                    <FiClock style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                    Optimal Send Times
                  </h4>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                    {aiInsights.bestTimes.map((time, i) => (
                      <div key={i} style={{ 
                        display: "flex", 
                        justifyContent: "space-between",
                        marginBottom: "0.25rem"
                      }}>
                        <span>{time.day} {time.time}</span>
                        <span style={{ color: "#10b981" }}>{time.engagement}% engagement</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Predictions */}
                <div>
                  <h4 style={{ 
                    color: "#3b82f6", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem" 
                  }}>
                    <FiBarChart2 style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                    Performance Predictions
                  </h4>
                  <div>
                    {aiInsights.predictions.map((pred, i) => (
                      <div key={i} style={{ 
                        marginBottom: "0.5rem",
                        padding: "0.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "6px"
                      }}>
                        <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
                          {pred.metric}
                        </div>
                        <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                          {pred.value}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#10b981" }}>
                          {Math.round(pred.confidence * 100)}% confidence
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      <AdminStats stats={statsData} columns={6} />

      {/* View Mode Tabs */}
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "1.5rem",
        background: "rgba(255, 255, 255, 0.05)",
        padding: "0.5rem",
        borderRadius: "8px",
        width: "fit-content"
      }}>
        <button
          onClick={() => setViewMode('campaigns')}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            background: viewMode === 'campaigns' ? "var(--colorPrimary)" : "transparent",
            border: "none",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Campaigns
        </button>
        <button
          onClick={() => setViewMode('templates')}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            background: viewMode === 'templates' ? "var(--colorPrimary)" : "transparent",
            border: "none",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Templates
        </button>
        <button
          onClick={() => setViewMode('automation')}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            background: viewMode === 'automation' ? "var(--colorPrimary)" : "transparent",
            border: "none",
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Automation
        </button>
      </div>

      {viewMode === 'campaigns' && (
        <>
          <AdminFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filterConfigs}
            activeFilters={{ 
              status: filterStatus, 
              type: filterType, 
              objective: filterObjective,
              sortBy: sortBy 
            }}
            onFilterChange={(key, value) => {
              switch (key) {
                case 'status': setFilterStatus(value); break;
                case 'type': setFilterType(value); break;
                case 'objective': setFilterObjective(value); break;
                case 'sortBy': setSortBy(value); break;
              }
            }}
            onClearFilters={() => {
              setFilterStatus('all');
              setFilterType('all');
              setFilterObjective('all');
              setSortBy('createdAt');
            }}
            placeholder="Search campaigns by name or description..."
            aiSuggestions={[
              "High ROI campaigns",
              "Active email campaigns",
              "Win-back campaigns",
              "Multi-channel campaigns"
            ]}
          />

          {/* Bulk Actions */}
          {selectedCampaigns.length > 0 && (
            <AdminCard variant="gradient" padding="medium">
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                gap: "1rem"
              }}>
                <span style={{ 
                  color: "rgba(255, 255, 255, 0.9)", 
                  fontWeight: "500" 
                }}>
                  {selectedCampaigns.length} campaign{selectedCampaigns.length !== 1 ? 's' : ''} selected
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button 
                    onClick={() => handleBulkAction('pause', selectedCampaigns)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(245, 158, 11, 0.2)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      borderRadius: "6px",
                      color: "#f59e0b",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Pause
                  </button>
                  <button 
                    onClick={() => handleBulkAction('resume', selectedCampaigns)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "6px",
                      color: "#10b981",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Resume
                  </button>
                  <button 
                    onClick={() => handleBulkAction('delete', selectedCampaigns)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "rgba(239, 68, 68, 0.2)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "6px",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </AdminCard>
          )}

          <AdminTable 
            columns={tableColumns}
            data={filteredCampaigns}
            actions={tableActions}
            selectable={true}
            selectedRows={selectedCampaigns}
            onRowSelect={setSelectedCampaigns}
            loading={loading}
            emptyMessage="No campaigns found. Create your first campaign to get started!"
          />

          {/* Top Performing Campaign */}
          {stats.topPerformingCampaign && (
            <AdminCard variant="gradient" padding="large" style={{ marginTop: "2rem" }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "rgba(255, 255, 255, 0.95)" }}>
                <FiAward style={{ marginRight: "0.5rem", verticalAlign: "middle", color: "#f59e0b" }} />
                Top Performing Campaign
              </h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
                gap: "1.5rem" 
              }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>Campaign</div>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                    {stats.topPerformingCampaign.name}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>ROI</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#10b981" }}>
                    {stats.topPerformingCampaign.performance.roi}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>Revenue</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                    ${stats.topPerformingCampaign.performance.revenue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>Conversions</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                    {stats.topPerformingCampaign.performance.converted}
                  </div>
                </div>
              </div>
            </AdminCard>
          )}
        </>
      )}

      {viewMode === 'templates' && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "1.5rem" 
        }}>
          {templates.map((template, i) => (
            <AdminCard key={template.id} variant="gradient" padding="medium">
              <div style={{ 
                height: "120px", 
                background: "rgba(255, 255, 255, 0.05)", 
                borderRadius: "8px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiMail size={32} color="rgba(255, 255, 255, 0.3)" />
              </div>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "rgba(255, 255, 255, 0.95)" }}>
                {template.name}
              </h4>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  {template.category}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <FiStar size={12} color="#f59e0b" />
                  <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                    {template.rating}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  Used {template.usage} times
                </span>
                <button style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}>
                  Use Template
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {viewMode === 'automation' && (
        <AdminCard variant="gradient" padding="large">
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <FiZap size={48} color="var(--colorPrimary)" style={{ marginBottom: "1rem" }} />
            <h3 style={{ color: "rgba(255, 255, 255, 0.95)", marginBottom: "0.5rem" }}>
              Marketing Automation
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", maxWidth: "500px", margin: "0 auto" }}>
              Set up automated workflows to engage customers at the right time with personalized messages
            </p>
            <button style={{
              marginTop: "1.5rem",
              padding: "0.75rem 2rem",
              background: "var(--colorPrimary)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer"
            }}>
              Create Automation Workflow
            </button>
          </div>
        </AdminCard>
      )}

      {error && (
        <AdminCard variant="gradient" style={{ marginTop: "1rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1rem", 
            color: "var(--colorSecondary)" 
          }}>
            <FiAlertTriangle />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "var(--colorSecondary)",
                cursor: "pointer"
              }}
            >
              <FiXCircle />
            </button>
          </div>
        </AdminCard>
      )}
    </AdminPageContainer>
  );
}