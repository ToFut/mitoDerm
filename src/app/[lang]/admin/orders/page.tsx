"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiDollarSign,
  FiTruck,
  FiClock,
  FiUser,
  FiMapPin,
  FiEdit,
  FiEye,
  FiTrash2,
  FiPlus,
  FiDownload,
  FiUpload,
  FiCpu,
  FiTrendingUp,
  FiActivity,
  FiBarChart2,
  FiTarget,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPackage,
  FiCreditCard,
  FiMoreHorizontal,
  FiRefreshCw,
  FiFilter,
  FiCalendar,
  FiMail,
  FiPhone,
  FiGlobe,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";
import { orderService, getOrderStatusColor, getPaymentStatusColor, formatOrderNumber } from "@/lib/services/orderService";
import {
  AdminPageContainer,
  AdminHeader,
  AdminStats,
  AdminFilters,
  AdminTable,
  AdminCard
} from "@/components/admin/shared";

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    image?: string;
    sku?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentId?: string;
  trackingNumber?: string;
  notes?: string;
  orderDate: string;
  updatedAt: string;
  customerNotes?: string;
  adminNotes?: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersThisMonth: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  ordersByStatus: Record<string, number>;
  ordersByPaymentStatus: Record<string, number>;
  revenueGrowth: number;
  orderGrowth: number;
}

interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export default function AdminOrdersPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("orderDate");
  
  // Statistics and AI
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersThisMonth: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
    ordersByStatus: {},
    ordersByPaymentStatus: {},
    revenueGrowth: 0,
    orderGrowth: 0
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  // Add keyframes for spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Real-time data fetching with Firebase
  useEffect(() => {
    const unsubscribe = orderService.subscribeToOrders((ordersData) => {
      setOrders(ordersData);
      setLoading(false);
      calculateStats(ordersData);
      generateAIInsights(ordersData);
    });

    return () => unsubscribe();
  }, []);

  // Calculate comprehensive statistics
  const calculateStats = useCallback((ordersData: Order[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
    const completedOrders = ordersData.filter(o => o.status === 'delivered').length;
    const cancelledOrders = ordersData.filter(o => o.status === 'cancelled').length;
    const refundedOrders = ordersData.filter(o => o.status === 'refunded').length;
    
    const totalRevenue = ordersData.reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = ordersData.length > 0 ? totalRevenue / ordersData.length : 0;
    
    const ordersThisMonth = ordersData.filter(o => 
      new Date(o.orderDate) >= thisMonth
    ).length;
    
    const ordersLastMonth = ordersData.filter(o => {
      const orderDate = new Date(o.orderDate);
      return orderDate >= lastMonth && orderDate < thisMonth;
    }).length;
    
    const revenueThisMonth = ordersData
      .filter(o => new Date(o.orderDate) >= thisMonth)
      .reduce((sum, o) => sum + o.total, 0);
    
    const revenueLastMonth = ordersData
      .filter(o => {
        const orderDate = new Date(o.orderDate);
        return orderDate >= lastMonth && orderDate < thisMonth;
      })
      .reduce((sum, o) => sum + o.total, 0);
    
    // Status breakdown
    const ordersByStatus = ordersData.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Payment status breakdown
    const ordersByPaymentStatus = ordersData.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const revenueGrowth = revenueLastMonth > 0 
      ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
      : 0;
    
    const orderGrowth = ordersLastMonth > 0 
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100 
      : 0;
    
    setStats({
      totalOrders: ordersData.length,
      pendingOrders,
      totalRevenue,
      averageOrderValue,
      ordersThisMonth,
      completedOrders,
      cancelledOrders,
      refundedOrders,
      ordersByStatus,
      ordersByPaymentStatus,
      revenueGrowth,
      orderGrowth
    });
  }, []);

  // Advanced AI insights generation
  const generateAIInsights = useCallback((ordersData: Order[]) => {
    const insights: AIInsight[] = [];
    
    // High number of pending orders
    const pendingCount = ordersData.filter(o => o.status === 'pending').length;
    if (pendingCount > 10) {
      insights.push({
        id: 'pending-orders-alert',
        type: 'warning',
        title: 'High Number of Pending Orders',
        description: `${pendingCount} orders are pending and need attention`,
        recommendation: 'Review and process pending orders to improve customer satisfaction and cash flow',
        confidence: 0.98,
        priority: 'high',
        actionable: true
      });
    }
    
    // Failed payments analysis
    const failedPayments = ordersData.filter(o => o.paymentStatus === 'failed').length;
    if (failedPayments > 0) {
      insights.push({
        id: 'payment-failures',
        type: 'danger',
        title: 'Payment Failures Detected',
        description: `${failedPayments} orders have failed payments`,
        recommendation: 'Follow up with customers on failed payments and review payment gateway settings',
        confidence: 0.95,
        priority: 'high',
        actionable: true
      });
    }
    
    // Revenue growth analysis
    if (stats.revenueGrowth > 20) {
      insights.push({
        id: 'revenue-growth',
        type: 'success',
        title: 'Strong Revenue Growth',
        description: `Revenue increased by ${stats.revenueGrowth.toFixed(1)}% this month`,
        recommendation: 'Capitalize on growth momentum with marketing campaigns and inventory scaling',
        confidence: 0.92,
        priority: 'medium',
        actionable: true
      });
    } else if (stats.revenueGrowth < -10) {
      insights.push({
        id: 'revenue-decline',
        type: 'warning',
        title: 'Revenue Decline Detected',
        description: `Revenue decreased by ${Math.abs(stats.revenueGrowth).toFixed(1)}% this month`,
        recommendation: 'Investigate decline causes and implement retention strategies',
        confidence: 0.89,
        priority: 'high',
        actionable: true
      });
    }
    
    // High value orders analysis
    const highValueOrders = ordersData.filter(o => o.total > stats.averageOrderValue * 2);
    if (highValueOrders.length > 0) {
      insights.push({
        id: 'high-value-customers',
        type: 'success',
        title: 'High-Value Customers Identified',
        description: `${highValueOrders.length} orders are above 2x average order value`,
        recommendation: 'Create VIP program and personalized experiences for high-value customers',
        confidence: 0.85,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Shipping delays analysis
    const oldPendingOrders = ordersData.filter(o => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(o.orderDate).getTime()) / (1000 * 60 * 60 * 24));
      return o.status === 'pending' && daysDiff > 3;
    });
    
    if (oldPendingOrders.length > 0) {
      insights.push({
        id: 'shipping-delays',
        type: 'warning',
        title: 'Potential Shipping Delays',
        description: `${oldPendingOrders.length} orders are pending for more than 3 days`,
        recommendation: 'Review fulfillment process and communicate delays to customers proactively',
        confidence: 0.87,
        priority: 'medium',
        actionable: true
      });
    }
    
    setAiInsights(insights.slice(0, 5));
  }, [stats.revenueGrowth, stats.averageOrderValue]);

  // Event handlers
  const handleCreateOrder = () => {
    router.push('/admin/orders/new');
  };

  const handleViewOrder = (order: Order) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleEditOrder = (order: Order) => {
    router.push(`/admin/orders/${order.id}/edit`);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const success = await orderService.updateOrderStatus(orderId, newStatus);
    if (!success) {
      setError("Failed to update order status");
    }
  };

  const handleAddTracking = async (orderId: string, trackingNumber: string) => {
    const success = await orderService.addTrackingNumber(orderId, trackingNumber);
    if (!success) {
      setError("Failed to add tracking number");
    }
  };

  const handleBulkAction = async (action: string, orderIds: string[]) => {
    try {
      switch (action) {
        case "confirm":
          await Promise.all(orderIds.map(id => orderService.updateOrderStatus(id, 'confirmed')));
          break;
        case "process":
          await Promise.all(orderIds.map(id => orderService.updateOrderStatus(id, 'processing')));
          break;
        case "ship":
          await Promise.all(orderIds.map(id => orderService.updateOrderStatus(id, 'shipped')));
          break;
        case "cancel":
          if (confirm(`Are you sure you want to cancel ${orderIds.length} order(s)?`)) {
            await Promise.all(orderIds.map(id => orderService.updateOrderStatus(id, 'cancelled')));
          }
          break;
        case "export":
          handleExportOrders(orderIds);
          break;
      }
      setSelectedOrders([]);
    } catch (err) {
      setError(`Failed to perform bulk action: ${action}`);
    }
  };

  const handleExportOrders = (orderIds?: string[]) => {
    const ordersToExport = orderIds 
      ? orders.filter(o => orderIds.includes(o.id))
      : filteredOrders;
      
    const csv = [
      ["Order Number", "Customer", "Status", "Payment Status", "Total", "Order Date", "Items", "Shipping Address"].join(","),
      ...ordersToExport.map(order => [
        order.orderNumber,
        `"${order.shippingAddress.firstName} ${order.shippingAddress.lastName}"`,
        order.status,
        order.paymentStatus,
        `$${order.total.toFixed(2)}`,
        new Date(order.orderDate).toLocaleDateString(),
        order.items.length,
        `"${order.shippingAddress.address1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.shippingAddress.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      const matchesPaymentStatus = filterPaymentStatus === "all" || order.paymentStatus === filterPaymentStatus;
      
      let matchesDateRange = true;
      if (dateRange !== "all") {
        const orderDate = new Date(order.orderDate);
        const now = new Date();
        
        switch (dateRange) {
          case "today":
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            matchesDateRange = orderDate >= today;
            break;
          case "this_week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDateRange = orderDate >= weekAgo;
            break;
          case "this_month":
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchesDateRange = orderDate >= thisMonth;
            break;
          case "last_3_months":
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            matchesDateRange = orderDate >= threeMonthsAgo;
            break;
        }
      }
      
      let matchesPriceRange = true;
      if (priceRange !== "all") {
        switch (priceRange) {
          case "under_100":
            matchesPriceRange = order.total < 100;
            break;
          case "100_500":
            matchesPriceRange = order.total >= 100 && order.total <= 500;
            break;
          case "over_500":
            matchesPriceRange = order.total > 500;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDateRange && matchesPriceRange;
    });

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "orderNumber":
          return a.orderNumber.localeCompare(b.orderNumber);
        case "customer":
          const nameA = `${a.shippingAddress.firstName} ${a.shippingAddress.lastName}`;
          const nameB = `${b.shippingAddress.firstName} ${b.shippingAddress.lastName}`;
          return nameA.localeCompare(nameB);
        case "total":
          return b.total - a.total;
        case "status":
          return a.status.localeCompare(b.status);
        case "orderDate":
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [orders, searchTerm, filterStatus, filterPaymentStatus, dateRange, priceRange, sortBy]);

  // Component configuration
  const headerActions = [
    {
      label: "AI Order Insights",
      icon: <FiCpu />,
      onClick: () => console.log('AI insights'),
      variant: "ai" as const
    },
    {
      label: "Export Orders",
      icon: <FiDownload />,
      onClick: () => handleExportOrders(),
      variant: "secondary" as const
    },
    {
      label: "Import Orders",
      icon: <FiUpload />,
      onClick: () => console.log('Import orders'),
      variant: "secondary" as const
    },
    {
      label: "Create Order",
      icon: <FiPlus />,
      onClick: handleCreateOrder,
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: <FiShoppingBag />,
      color: "primary" as const,
      change: { value: stats.orderGrowth, type: stats.orderGrowth >= 0 ? "increase" as const : "decrease" as const, period: "this month" },
      description: "All time orders"
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: <FiClock />,
      color: "warning" as const,
      change: { value: 5, type: "decrease" as const, period: "this week" },
      description: "Need processing"
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "success" as const,
      change: { value: Math.abs(stats.revenueGrowth), type: stats.revenueGrowth >= 0 ? "increase" as const : "decrease" as const, period: "this month" },
      description: "All time sales"
    },
    {
      label: "Average Order Value",
      value: `$${stats.averageOrderValue.toFixed(2)}`,
      icon: <FiTarget />,
      color: "info" as const,
      change: { value: 8.5, type: "increase" as const, period: "last month" },
      description: "Per order average"
    },
    {
      label: "Completed Orders",
      value: stats.completedOrders,
      icon: <FiCheckCircle />,
      color: "success" as const,
      change: { value: 12, type: "increase" as const, period: "this month" },
      description: "Successfully delivered"
    },
    {
      label: "Cancelled Orders",
      value: stats.cancelledOrders,
      icon: <FiXCircle />,
      color: "danger" as const,
      change: { value: 2, type: "decrease" as const, period: "this month" },
      description: "Order cancellations"
    },
    {
      label: "Orders This Month",
      value: stats.ordersThisMonth,
      icon: <FiCalendar />,
      color: "info" as const,
      change: { value: stats.orderGrowth, type: stats.orderGrowth >= 0 ? "increase" as const : "decrease" as const, period: "vs last month" },
      description: "Current month sales"
    },
    {
      label: "Refunded Orders",
      value: stats.refundedOrders,
      icon: <FiRefreshCw />,
      color: "secondary" as const,
      change: { value: 1, type: "increase" as const, period: "this month" },
      description: "Customer refunds"
    }
  ];

  const filterConfigs = [
    {
      key: "status",
      label: "Order Status",
      type: "select" as const,
      options: [
        { label: "All Status", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Refunded", value: "refunded" }
      ]
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      type: "select" as const,
      options: [
        { label: "All Payments", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
        { label: "Partially Refunded", value: "partially_refunded" }
      ]
    },
    {
      key: "dateRange",
      label: "Date Range",
      type: "select" as const,
      options: [
        { label: "All Time", value: "all" },
        { label: "Today", value: "today" },
        { label: "This Week", value: "this_week" },
        { label: "This Month", value: "this_month" },
        { label: "Last 3 Months", value: "last_3_months" }
      ]
    },
    {
      key: "priceRange",
      label: "Order Value",
      type: "select" as const,
      options: [
        { label: "All Values", value: "all" },
        { label: "Under $100", value: "under_100" },
        { label: "$100 - $500", value: "100_500" },
        { label: "Over $500", value: "over_500" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Order Date", value: "orderDate" },
        { label: "Order Number", value: "orderNumber" },
        { label: "Customer Name", value: "customer" },
        { label: "Order Total", value: "total" },
        { label: "Status", value: "status" }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const color = getOrderStatusColor(status as any);
    return (
      <span style={{
        padding: "0.25rem 0.75rem",
        borderRadius: "6px",
        background: `${color}20`,
        color: color,
        fontSize: "0.75rem",
        fontWeight: "500",
        textTransform: "capitalize"
      }}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const color = getPaymentStatusColor(paymentStatus as any);
    return (
      <span style={{
        padding: "0.25rem 0.5rem",
        borderRadius: "4px",
        background: `${color}20`,
        color: color,
        fontSize: "0.7rem",
        textTransform: "capitalize"
      }}>
        {paymentStatus.replace('_', ' ')}
      </span>
    );
  };

  const tableColumns = [
    {
      key: "orderNumber",
      label: "Order",
      sortable: true,
      render: (value: string, row: Order) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <strong style={{
            color: "rgba(255, 255, 255, 0.95)",
            fontSize: "0.9rem"
          }}>
            {formatOrderNumber(value)}
          </strong>
          <small style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.8rem"
          }}>
            {new Date(row.orderDate).toLocaleDateString()}
          </small>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            {getStatusBadge(row.status)}
          </div>
        </div>
      )
    },
    {
      key: "shippingAddress",
      label: "Customer",
      render: (address: Order['shippingAddress'], row: Order) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <strong style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.85rem" }}>
            {address.firstName} {address.lastName}
          </strong>
          {address.email && (
            <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <FiMail size={10} />
              {address.email}
            </small>
          )}
          <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <FiMapPin size={10} />
            {address.city}, {address.country}
          </small>
          {address.phone && (
            <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <FiPhone size={10} />
              {address.phone}
            </small>
          )}
        </div>
      )
    },
    {
      key: "items",
      label: "Items",
      render: (items: Order['items']) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiPackage size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          {items.slice(0, 2).map((item, index) => (
            <small key={index} style={{ 
              color: "rgba(255, 255, 255, 0.6)", 
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "150px"
            }}>
              {item.quantity}x {item.productName}
            </small>
          ))}
          {items.length > 2 && (
            <small style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.7rem" }}>
              +{items.length - 2} more
            </small>
          )}
        </div>
      )
    },
    {
      key: "total",
      label: "Payment",
      sortable: true,
      render: (total: number, row: Order) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
          <span style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: "600",
            fontSize: "0.9rem"
          }}>
            ${total.toFixed(2)}
          </span>
          {getPaymentBadge(row.paymentStatus)}
          {row.paymentMethod && (
            <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <FiCreditCard size={10} />
              {row.paymentMethod}
            </small>
          )}
        </div>
      )
    },
    {
      key: "fulfillment",
      label: "Fulfillment",
      render: (value: any, row: Order) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {row.trackingNumber ? (
            <small style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <FiTruck size={12} />
              {row.trackingNumber}
            </small>
          ) : (
            <small style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.8rem" }}>
              No tracking
            </small>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <FiMapPin size={10} />
            <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
              {row.shippingAddress.address1}
            </small>
          </div>
          {row.notes && (
            <small style={{ 
              color: "rgba(255, 255, 255, 0.5)", 
              fontSize: "0.7rem",
              fontStyle: "italic",
              maxWidth: "120px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              "{row.notes}"
            </small>
          )}
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: "View Order",
      icon: <FiEye />,
      onClick: (order: Order) => handleViewOrder(order),
      variant: "secondary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (order: Order) => handleEditOrder(order),
      variant: "primary" as const
    },
    {
      label: "Mark as Shipped",
      icon: <FiTruck />,
      onClick: (order: Order) => handleUpdateOrderStatus(order.id, 'shipped'),
      variant: "info" as const,
      show: (order: Order) => order.status === 'processing'
    },
    {
      label: "Mark as Delivered",
      icon: <FiCheckCircle />,
      onClick: (order: Order) => handleUpdateOrderStatus(order.id, 'delivered'),
      variant: "success" as const,
      show: (order: Order) => order.status === 'shipped'
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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading orders...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader
        title="Order Management"
        subtitle="Track and fulfill customer orders with comprehensive analytics and automated workflows"
        actions={headerActions}
        breadcrumb={["Admin", "Orders"]}
      />

      <AdminStats stats={statsData} columns={8} />

      {/* AI Insights Panel */}
      {aiInsights.length > 0 && (
        <AdminCard variant="gradient" padding="large">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <FiCpu style={{ color: "var(--colorPrimary)" }} size={24} />
            <h3 style={{ color: "rgba(255, 255, 255, 0.95)", margin: 0 }}>AI Order Insights</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                style={{
                  padding: "1rem",
                  background: `rgba(${insight.type === 'success' ? '16, 185, 129' : insight.type === 'warning' ? '245, 158, 11' : insight.type === 'danger' ? '239, 68, 68' : '59, 130, 246'}, 0.1)`,
                  border: `1px solid rgba(${insight.type === 'success' ? '16, 185, 129' : insight.type === 'warning' ? '245, 158, 11' : insight.type === 'danger' ? '239, 68, 68' : '59, 130, 246'}, 0.2)`,
                  borderRadius: "8px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ color: "rgba(255, 255, 255, 0.9)", margin: 0, fontSize: "0.9rem" }}>
                    {insight.title}
                  </h4>
                  <span style={{
                    fontSize: "0.7rem",
                    color: "rgba(255, 255, 255, 0.6)",
                    background: "rgba(255, 255, 255, 0.1)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px"
                  }}>
                    {Math.round(insight.confidence * 100)}%
                  </span>
                </div>
                <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem", margin: "0 0 0.75rem 0" }}>
                  {insight.description}
                </p>
                <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.75rem", margin: 0 }}>
                  <strong>Recommendation:</strong> {insight.recommendation}
                </p>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={{
          status: filterStatus,
          paymentStatus: filterPaymentStatus,
          dateRange: dateRange,
          priceRange: priceRange,
          sortBy: sortBy
        }}
        onFilterChange={(key, value) => {
          switch (key) {
            case 'status': setFilterStatus(value); break;
            case 'paymentStatus': setFilterPaymentStatus(value); break;
            case 'dateRange': setDateRange(value); break;
            case 'priceRange': setPriceRange(value); break;
            case 'sortBy': setSortBy(value); break;
          }
        }}
        onClearFilters={() => {
          setFilterStatus('all');
          setFilterPaymentStatus('all');
          setDateRange('all');
          setPriceRange('all');
          setSortBy('orderDate');
        }}
        placeholder="Search by order number, customer name, email, or product..."
        aiSuggestions={[
          "High value pending orders",
          "Failed payment orders",
          "Orders shipped this week",
          "Customer repeat purchases",
          "International orders"
        ]}
      />

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
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
              {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleBulkAction('confirm', selectedOrders)}
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
                Confirm
              </button>
              <button
                onClick={() => handleBulkAction('process', selectedOrders)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(139, 92, 246, 0.2)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "6px",
                  color: "#8b5cf6",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                Process
              </button>
              <button
                onClick={() => handleBulkAction('ship', selectedOrders)}
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
                Ship
              </button>
              <button
                onClick={() => handleBulkAction('export', selectedOrders)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(107, 114, 128, 0.2)",
                  border: "1px solid rgba(107, 114, 128, 0.3)",
                  borderRadius: "6px",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                Export
              </button>
              <button
                onClick={() => handleBulkAction('cancel', selectedOrders)}
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
                Cancel
              </button>
            </div>
          </div>
        </AdminCard>
      )}

      <AdminTable
        columns={tableColumns}
        data={filteredOrders}
        actions={tableActions}
        selectable={true}
        selectedRows={selectedOrders}
        onRowSelect={setSelectedOrders}
        loading={loading}
        emptyMessage="No orders found. Your first customer orders will appear here!"
      />

      {error && (
        <AdminCard variant="gradient" style={{ marginTop: "1rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            color: "var(--colorSecondary)"
          }}>
            <FiAlertCircle />
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