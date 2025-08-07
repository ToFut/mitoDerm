"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShoppingCart,
  FiDollarSign,
  FiActivity,
  FiStar,
  FiHeart,
  FiMessageCircle,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiUpload,
  FiPlus,
  FiFilter,
  FiSearch,
  FiCpu,
  FiTrendingUp,
  FiAward,
  FiTag,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiSend,
  FiGift,
  FiZap,
  FiBarChart2
} from "react-icons/fi";
import { 
  AdminPageContainer, 
  AdminHeader, 
  AdminStats, 
  AdminFilters, 
  AdminTable, 
  AdminCard 
} from "@/components/admin/shared";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'vip' | 'blocked';
  segment: 'new' | 'regular' | 'loyal' | 'vip' | 'at_risk' | 'churned';
  tags: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  demographics?: {
    age?: number;
    gender?: string;
    occupation?: string;
    interests?: string[];
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
    firstOrderDate?: string;
    loyaltyPoints: number;
    referrals: number;
  };
  engagement: {
    emailOpens: number;
    emailClicks: number;
    lastVisit?: string;
    pageViews: number;
    favoriteProducts: string[];
    wishlist: string[];
    reviews: number;
    rating: number;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingConsent: boolean;
    preferredLanguage: string;
    preferredCategories: string[];
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Interaction {
  id: string;
  customerId: string;
  type: 'email' | 'phone' | 'chat' | 'order' | 'review' | 'support';
  subject: string;
  content: string;
  status: 'pending' | 'completed' | 'follow_up';
  date: string;
  agent?: string;
}

export default function AdminCustomersPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSegment, setFilterSegment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("lastActivity");
  
  // Statistics
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    vipCustomers: 0,
    newCustomers: 0,
    totalRevenue: 0,
    averageLifetimeValue: 0,
    retentionRate: 0,
    churnRate: 0,
    segmentDistribution: {} as Record<string, number>,
  });

  // AI Insights
  const [aiInsights, setAiInsights] = useState<{
    recommendations: string[];
    riskCustomers: Customer[];
    opportunities: { customer: Customer; opportunity: string; value: number }[];
    segmentationSuggestions: { customerId: string; currentSegment: string; suggestedSegment: string; reason: string }[];
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
      @keyframes slideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Load customers data
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      
      // Simulate loading customers
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock customers
      const mockCustomers: Customer[] = Array.from({ length: 50 }, (_, i) => ({
        id: `customer-${i + 1}`,
        firstName: ['Sarah', 'David', 'Rachel', 'Michael', 'Emma', 'John', 'Lisa', 'Robert'][i % 8],
        lastName: ['Cohen', 'Levy', 'Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson'][i % 8],
        email: `customer${i + 1}@example.com`,
        phone: `+972-5${Math.floor(Math.random() * 10000000)}`,
        avatar: undefined,
        status: ['active', 'active', 'vip', 'active', 'inactive'][i % 5] as Customer['status'],
        segment: ['new', 'regular', 'loyal', 'vip', 'at_risk', 'regular'][i % 6] as Customer['segment'],
        tags: i % 3 === 0 ? ['professional', 'bulk-buyer'] : i % 2 === 0 ? ['online-shopper'] : ['clinic-owner'],
        address: {
          city: ['Tel Aviv', 'Jerusalem', 'Haifa', 'Netanya', 'Herzliya'][i % 5],
          country: 'Israel'
        },
        demographics: {
          age: 25 + Math.floor(Math.random() * 40),
          gender: i % 2 === 0 ? 'female' : 'male',
          interests: ['skincare', 'anti-aging', 'professional treatments']
        },
        stats: {
          totalOrders: Math.floor(Math.random() * 50) + 1,
          totalSpent: Math.floor(Math.random() * 10000) + 500,
          averageOrderValue: Math.floor(Math.random() * 300) + 50,
          lastOrderDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          firstOrderDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          loyaltyPoints: Math.floor(Math.random() * 5000),
          referrals: Math.floor(Math.random() * 10)
        },
        engagement: {
          emailOpens: Math.floor(Math.random() * 100),
          emailClicks: Math.floor(Math.random() * 50),
          lastVisit: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          pageViews: Math.floor(Math.random() * 500),
          favoriteProducts: [],
          wishlist: [],
          reviews: Math.floor(Math.random() * 20),
          rating: 3.5 + Math.random() * 1.5
        },
        preferences: {
          emailNotifications: Math.random() > 0.3,
          smsNotifications: Math.random() > 0.5,
          marketingConsent: Math.random() > 0.4,
          preferredLanguage: i % 3 === 0 ? 'he' : 'en',
          preferredCategories: ['clinic', 'professional']
        },
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));

      setCustomers(mockCustomers);
      calculateStats(mockCustomers);
      generateAIInsights(mockCustomers);
      
    } catch (err) {
      setError('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = useCallback((customersData: Customer[]) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const activeCustomers = customersData.filter(c => 
      c.stats.lastOrderDate && new Date(c.stats.lastOrderDate) > thirtyDaysAgo
    ).length;
    
    const vipCustomers = customersData.filter(c => c.status === 'vip').length;
    const newCustomers = customersData.filter(c => c.segment === 'new').length;
    
    const totalRevenue = customersData.reduce((sum, c) => sum + c.stats.totalSpent, 0);
    const averageLifetimeValue = totalRevenue / customersData.length;
    
    const retentionRate = (activeCustomers / customersData.length) * 100;
    const churnRate = 100 - retentionRate;
    
    const segmentDistribution = customersData.reduce((acc, c) => {
      acc[c.segment] = (acc[c.segment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setStats({
      totalCustomers: customersData.length,
      activeCustomers,
      vipCustomers,
      newCustomers,
      totalRevenue,
      averageLifetimeValue,
      retentionRate,
      churnRate,
      segmentDistribution,
    });
  }, []);

  // Generate AI insights
  const generateAIInsights = useCallback((customersData: Customer[]) => {
    // Identify at-risk customers
    const riskCustomers = customersData.filter(c => {
      const lastOrder = c.stats.lastOrderDate ? new Date(c.stats.lastOrderDate) : null;
      const daysSinceLastOrder = lastOrder ? 
        (Date.now() - lastOrder.getTime()) / (1000 * 60 * 60 * 24) : Infinity;
      return daysSinceLastOrder > 60 && c.segment !== 'churned';
    }).slice(0, 5);

    // Identify opportunities
    const opportunities = customersData
      .filter(c => c.stats.totalOrders > 5 && c.segment !== 'vip')
      .slice(0, 5)
      .map(c => ({
        customer: c,
        opportunity: 'Upgrade to VIP',
        value: c.stats.averageOrderValue * 12
      }));

    // Segmentation suggestions
    const segmentationSuggestions = customersData
      .filter(c => {
        if (c.stats.totalSpent > 5000 && c.segment !== 'vip') return true;
        if (c.stats.totalOrders > 10 && c.segment === 'regular') return true;
        return false;
      })
      .slice(0, 5)
      .map(c => ({
        customerId: c.id,
        currentSegment: c.segment,
        suggestedSegment: c.stats.totalSpent > 5000 ? 'vip' : 'loyal',
        reason: c.stats.totalSpent > 5000 ? 
          `High lifetime value: $${c.stats.totalSpent}` : 
          `Frequent buyer: ${c.stats.totalOrders} orders`
      }));

    setAiInsights({
      recommendations: [
        'Send win-back campaign to 12 at-risk customers',
        'Create VIP tier benefits to increase retention',
        'Launch referral program - 8 customers have high referral potential',
        'Personalize email campaigns based on purchase history'
      ],
      riskCustomers,
      opportunities,
      segmentationSuggestions
    });
  }, []);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm);
      
      const matchesSegment = filterSegment === "all" || customer.segment === filterSegment;
      const matchesStatus = filterStatus === "all" || customer.status === filterStatus;
      
      let matchesValue = true;
      if (filterValue === "high") {
        matchesValue = customer.stats.totalSpent > 5000;
      } else if (filterValue === "medium") {
        matchesValue = customer.stats.totalSpent >= 1000 && customer.stats.totalSpent <= 5000;
      } else if (filterValue === "low") {
        matchesValue = customer.stats.totalSpent < 1000;
      }
      
      return matchesSearch && matchesSegment && matchesStatus && matchesValue;
    });

    // Sort customers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "lastActivity":
          return new Date(b.stats.lastOrderDate || 0).getTime() - new Date(a.stats.lastOrderDate || 0).getTime();
        case "totalSpent":
          return b.stats.totalSpent - a.stats.totalSpent;
        case "orders":
          return b.stats.totalOrders - a.stats.totalOrders;
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [customers, searchTerm, filterSegment, filterStatus, filterValue, sortBy]);

  // Event handlers
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    // Open edit modal
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      calculateStats(customers.filter(c => c.id !== customerId));
    }
  };

  const handleSendMessage = (customer: Customer, type: 'email' | 'sms') => {
    console.log(`Sending ${type} to ${customer.email}`);
    // Implement message sending
  };

  const handleBulkAction = async (action: string, customerIds: string[]) => {
    try {
      switch (action) {
        case 'email':
          console.log(`Sending email to ${customerIds.length} customers`);
          break;
        case 'sms':
          console.log(`Sending SMS to ${customerIds.length} customers`);
          break;
        case 'tag':
          // Add tags to selected customers
          break;
        case 'segment':
          // Update segment for selected customers
          break;
        case 'delete':
          if (confirm(`Delete ${customerIds.length} customers?`)) {
            setCustomers(prev => prev.filter(c => !customerIds.includes(c.id)));
          }
          break;
      }
      setSelectedCustomers([]);
    } catch (err) {
      setError(`Failed to perform bulk action: ${action}`);
    }
  };

  const handleExportCustomers = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Segment', 'Total Spent', 'Orders', 'Last Order', 'Status'].join(','),
      ...filteredCustomers.map(customer => [
        `"${customer.firstName} ${customer.lastName}"`,
        customer.email,
        customer.phone || '',
        customer.segment,
        customer.stats.totalSpent,
        customer.stats.totalOrders,
        customer.stats.lastOrderDate || '',
        customer.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Component configuration
  const headerActions = [
    {
      label: "AI Insights",
      icon: <FiCpu />,
      onClick: () => console.log('AI insights'),
      variant: "ai" as const
    },
    {
      label: "Export Customers",
      icon: <FiDownload />,
      onClick: handleExportCustomers,
      variant: "secondary" as const
    },
    {
      label: "Add Customer",
      icon: <FiPlus />,
      onClick: () => setShowCustomerModal(true),
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: <FiUsers />,
      color: "primary" as const,
      change: { value: 12, type: "increase" as const, period: "last month" },
      description: "Registered customers"
    },
    {
      label: "Active Customers",
      value: stats.activeCustomers,
      icon: <FiActivity />,
      color: "success" as const,
      change: { value: 8, type: "increase" as const, period: "last 30 days" },
      description: "Ordered recently"
    },
    {
      label: "VIP Customers",
      value: stats.vipCustomers,
      icon: <FiAward />,
      color: "warning" as const,
      change: { value: 3, type: "increase" as const, period: "last month" },
      description: "Premium tier"
    },
    {
      label: "Lifetime Value",
      value: `$${stats.averageLifetimeValue.toFixed(0)}`,
      icon: <FiDollarSign />,
      color: "info" as const,
      change: { value: 15, type: "increase" as const, period: "last quarter" },
      description: "Average CLV"
    },
    {
      label: "Retention Rate",
      value: `${stats.retentionRate.toFixed(1)}%`,
      icon: <FiHeart />,
      color: "secondary" as const,
      change: { value: 2.3, type: "increase" as const, period: "last month" },
      description: "Customer retention"
    },
    {
      label: "Total Revenue",
      value: `$${(stats.totalRevenue / 1000).toFixed(1)}K`,
      icon: <FiTrendingUp />,
      color: "success" as const,
      change: { value: 23, type: "increase" as const, period: "last month" },
      description: "From all customers"
    }
  ];

  const filterConfigs = [
    {
      key: "segment",
      label: "Segment",
      type: "select" as const,
      options: [
        { label: "All Segments", value: "all" },
        { label: "New", value: "new" },
        { label: "Regular", value: "regular" },
        { label: "Loyal", value: "loyal" },
        { label: "VIP", value: "vip" },
        { label: "At Risk", value: "at_risk" },
        { label: "Churned", value: "churned" }
      ]
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "VIP", value: "vip" },
        { label: "Blocked", value: "blocked" }
      ]
    },
    {
      key: "value",
      label: "Customer Value",
      type: "select" as const,
      options: [
        { label: "All Values", value: "all" },
        { label: "High Value (>$5000)", value: "high" },
        { label: "Medium Value ($1000-$5000)", value: "medium" },
        { label: "Low Value (<$1000)", value: "low" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Last Activity", value: "lastActivity" },
        { label: "Name", value: "name" },
        { label: "Total Spent", value: "totalSpent" },
        { label: "Orders", value: "orders" },
        { label: "Join Date", value: "createdAt" }
      ]
    }
  ];

  const getSegmentBadge = (segment: Customer['segment']) => {
    const colors = {
      new: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
      regular: { bg: "rgba(107, 114, 128, 0.2)", color: "#6b7280" },
      loyal: { bg: "rgba(16, 185, 129, 0.2)", color: "#10b981" },
      vip: { bg: "rgba(245, 158, 11, 0.2)", color: "#f59e0b" },
      at_risk: { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444" },
      churned: { bg: "rgba(31, 41, 55, 0.3)", color: "#9ca3af" }
    };
    
    return (
      <span style={{
        padding: "0.25rem 0.75rem",
        borderRadius: "6px",
        background: colors[segment].bg,
        color: colors[segment].color,
        fontSize: "0.75rem",
        fontWeight: "500",
        textTransform: "capitalize"
      }}>
        {segment.replace('_', ' ')}
      </span>
    );
  };

  const tableColumns = [
    { 
      key: "customer", 
      label: "Customer", 
      sortable: true, 
      render: (_: any, row: Customer) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--colorPrimary), var(--colorSecondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "600",
            fontSize: "0.9rem"
          }}>
            {row.firstName[0]}{row.lastName[0]}
          </div>
          <div>
            <strong style={{ color: "rgba(255, 255, 255, 0.95)", display: "block" }}>
              {row.firstName} {row.lastName}
            </strong>
            <small style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              {row.email}
            </small>
            <div style={{ marginTop: "0.25rem" }}>
              {getSegmentBadge(row.segment)}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: "stats", 
      label: "Customer Stats", 
      render: (stats: Customer['stats']) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiShoppingCart size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.8)" }}>
              {stats.totalOrders} orders
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiDollarSign size={12} />
            <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "600" }}>
              ${stats.totalSpent.toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiGift size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {stats.loyaltyPoints} pts
            </span>
          </div>
        </div>
      )
    },
    { 
      key: "engagement", 
      label: "Engagement", 
      render: (engagement: Customer['engagement'], row: Customer) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiStar size={12} color="#f59e0b" />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.8)" }}>
              {engagement.rating.toFixed(1)} ({engagement.reviews} reviews)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiMail size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {((engagement.emailClicks / Math.max(engagement.emailOpens, 1)) * 100).toFixed(0)}% CTR
            </span>
          </div>
          {row.stats.lastOrderDate && (
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
              Last order: {new Date(row.stats.lastOrderDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    { 
      key: "location", 
      label: "Location", 
      render: (_: any, row: Customer) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(255, 255, 255, 0.8)" }}>
          <FiMapPin size={14} />
          <span style={{ fontSize: "0.85rem" }}>
            {row.address?.city || 'Unknown'}, {row.address?.country || 'Unknown'}
          </span>
        </div>
      )
    },
    { 
      key: "tags", 
      label: "Tags", 
      render: (_: any, row: Customer) => (
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
          {row.tags.map((tag, i) => (
            <span 
              key={i}
              style={{
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                background: "rgba(190, 128, 12, 0.2)",
                color: "var(--colorPrimary)",
                fontSize: "0.7rem"
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: "View Profile",
      icon: <FiEye />,
      onClick: (customer: Customer) => handleViewCustomer(customer),
      variant: "secondary" as const
    },
    {
      label: "Send Email",
      icon: <FiMail />,
      onClick: (customer: Customer) => handleSendMessage(customer, 'email'),
      variant: "primary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (customer: Customer) => handleEditCustomer(customer),
      variant: "secondary" as const
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (customer: Customer) => handleDeleteCustomer(customer.id),
      variant: "danger" as const
    }
  ];

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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading customers...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader 
        title="Customer Relationship Management"
        subtitle="Manage customer relationships, track engagement, and drive retention with AI-powered insights"
        actions={headerActions}
        breadcrumb={["Admin", "Customers"]}
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
                AI-Powered Customer Insights
              </h3>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "1.5rem",
                marginBottom: "1rem"
              }}>
                {/* Recommendations */}
                <div>
                  <h4 style={{ 
                    color: "#10b981", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem" 
                  }}>
                    <FiZap style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                    Recommendations
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

                {/* At Risk Customers */}
                <div>
                  <h4 style={{ 
                    color: "#ef4444", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem" 
                  }}>
                    <FiAlertTriangle style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                    At Risk Customers
                  </h4>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                    {aiInsights.riskCustomers.length} customers need attention
                    <div style={{ marginTop: "0.5rem" }}>
                      {aiInsights.riskCustomers.slice(0, 3).map((c, i) => (
                        <div key={i} style={{ marginBottom: "0.25rem" }}>
                          • {c.firstName} {c.lastName}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Opportunities */}
                <div>
                  <h4 style={{ 
                    color: "#f59e0b", 
                    fontSize: "0.9rem", 
                    marginBottom: "0.5rem" 
                  }}>
                    <FiTrendingUp style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                    Opportunities
                  </h4>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                    {aiInsights.opportunities.length} upsell opportunities
                    <div style={{ marginTop: "0.5rem" }}>
                      Total potential: ${aiInsights.opportunities
                        .reduce((sum, o) => sum + o.value, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Segmentation Suggestions */}
              {aiInsights.segmentationSuggestions.length > 0 && (
                <div style={{ 
                  padding: "1rem", 
                  background: "rgba(255, 255, 255, 0.05)", 
                  borderRadius: "8px",
                  marginTop: "1rem"
                }}>
                  <h4 style={{ 
                    fontSize: "0.9rem", 
                    marginBottom: "0.75rem",
                    color: "rgba(255, 255, 255, 0.9)"
                  }}>
                    Suggested Segment Changes
                  </h4>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {aiInsights.segmentationSuggestions.slice(0, 3).map((suggestion, i) => (
                      <div 
                        key={i}
                        style={{
                          padding: "0.5rem",
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "6px",
                          fontSize: "0.8rem"
                        }}
                      >
                        <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                          {suggestion.currentSegment}
                        </span>
                        <span style={{ margin: "0 0.5rem", color: "rgba(255, 255, 255, 0.4)" }}>→</span>
                        <span style={{ color: "#10b981", fontWeight: "600" }}>
                          {suggestion.suggestedSegment}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AdminCard>
      )}

      <AdminStats stats={statsData} columns={6} />

      <AdminFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={{ 
          segment: filterSegment, 
          status: filterStatus, 
          value: filterValue,
          sortBy: sortBy 
        }}
        onFilterChange={(key, value) => {
          switch (key) {
            case 'segment': setFilterSegment(value); break;
            case 'status': setFilterStatus(value); break;
            case 'value': setFilterValue(value); break;
            case 'sortBy': setSortBy(value); break;
          }
        }}
        onClearFilters={() => {
          setFilterSegment('all');
          setFilterStatus('all');
          setFilterValue('all');
          setSortBy('lastActivity');
        }}
        placeholder="Search by name, email, or phone..."
        aiSuggestions={[
          "VIP customers",
          "At-risk customers",
          "High-value customers",
          "Recent purchasers"
        ]}
      />

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
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
              {selectedCustomers.length} customer{selectedCustomers.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => handleBulkAction('email', selectedCustomers)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(59, 130, 246, 0.2)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "6px",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                <FiMail style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Send Email
              </button>
              <button 
                onClick={() => handleBulkAction('sms', selectedCustomers)}
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
                <FiMessageCircle style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Send SMS
              </button>
              <button 
                onClick={() => handleBulkAction('tag', selectedCustomers)}
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
                <FiTag style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Add Tag
              </button>
              <button 
                onClick={() => handleBulkAction('delete', selectedCustomers)}
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
                <FiTrash2 style={{ marginRight: "0.5rem", verticalAlign: "middle" }} />
                Delete
              </button>
            </div>
          </div>
        </AdminCard>
      )}

      <AdminTable 
        columns={tableColumns}
        data={filteredCustomers}
        actions={tableActions}
        selectable={true}
        selectedRows={selectedCustomers}
        onRowSelect={setSelectedCustomers}
        loading={loading}
        emptyMessage="No customers found. Start building your customer base!"
      />

      {/* Segment Distribution */}
      <AdminCard variant="gradient" padding="large">
        <h3 style={{ margin: "0 0 1.5rem 0", color: "rgba(255, 255, 255, 0.95)" }}>
          Customer Segment Distribution
        </h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {Object.entries(stats.segmentDistribution).map(([segment, count]) => (
            <div 
              key={segment}
              style={{
                flex: "1 1 150px",
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                {count}
              </div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)", marginTop: "0.25rem" }}>
                {segment.replace('_', ' ')}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", marginTop: "0.25rem" }}>
                {((count / stats.totalCustomers) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {error && (
        <AdminCard variant="gradient">
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