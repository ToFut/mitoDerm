"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiEdit,
  FiEye,
  FiStar,
  FiToggleLeft,
  FiToggleRight,
  FiZap,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiTarget,
  FiFilter,
  FiSearch,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiTag,
  FiPlus,
  FiTrash2,
  FiCopy,
  FiTrendingDown,
  FiActivity,
  FiShoppingCart,
  FiCpu,
  FiLayers,
  FiMoreHorizontal,
  FiXCircle
} from "react-icons/fi";
import { Product, subscribeToProducts } from "@/lib/services/productService";
import {
  AdminPageContainer,
  AdminHeader,
  AdminStats,
  AdminFilters,
  AdminTable,
  AdminCard
} from "@/components/admin/shared";

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  totalInventoryValue: number;
  lowStockCount: number;
  averagePrice: number;
  featuredCount: number;
  revenueGrowth: number;
  conversionRate: number;
  categoryBreakdown: Record<string, number>;
  stockDistribution: Record<string, number>;
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

export default function AdminProductsPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [stockLevel, setStockLevel] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>("name");
  
  // AI and Analytics
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalInventoryValue: 0,
    lowStockCount: 0,
    averagePrice: 0,
    featuredCount: 0,
    revenueGrowth: 0,
    conversionRate: 0,
    categoryBreakdown: {},
    stockDistribution: {}
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
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Real-time data fetching with Firebase
  useEffect(() => {
    const unsubscribe = subscribeToProducts((productsData) => {
      setProducts(productsData);
      setLoading(false);
      calculateStats(productsData);
      generateAIInsights(productsData);
    });

    return () => unsubscribe();
  }, []);

  // Calculate comprehensive statistics
  const calculateStats = useCallback((productsData: Product[]) => {
    const totalValue = productsData.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const averagePrice = productsData.length > 0 ? productsData.reduce((sum, p) => sum + p.price, 0) / productsData.length : 0;
    const lowStockCount = productsData.filter(p => p.stock < 10).length; // Using 10 as default threshold
    const activeProducts = productsData.filter(p => p.isActive).length;
    const featuredCount = productsData.filter(p => p.featured).length;
    
    // Category breakdown
    const categoryBreakdown = productsData.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Stock distribution
    const stockDistribution = {
      'Low': productsData.filter(p => p.stock < 10).length,
      'Medium': productsData.filter(p => p.stock >= 10 && p.stock < 50).length,
      'High': productsData.filter(p => p.stock >= 50).length,
      'Out of Stock': productsData.filter(p => p.stock === 0).length
    };
    
    setStats({
      totalProducts: productsData.length,
      activeProducts,
      totalInventoryValue: totalValue,
      lowStockCount,
      averagePrice,
      featuredCount,
      revenueGrowth: 12.8, // This would come from analytics in real implementation
      conversionRate: 3.4, // This would come from analytics
      categoryBreakdown,
      stockDistribution
    });
  }, []);

  // Advanced AI insights generation
  const generateAIInsights = useCallback((productsData: Product[]) => {
    const insights: AIInsight[] = [];
    
    // Stock analysis
    const lowStockProducts = productsData.filter(p => p.stock < 10);
    if (lowStockProducts.length > 0) {
      insights.push({
        id: 'low-stock-alert',
        type: 'warning',
        title: 'Critical Stock Levels',
        description: `${lowStockProducts.length} products are below 10 units in stock`,
        recommendation: `Prioritize restocking: ${lowStockProducts.slice(0, 3).map(p => p.name).join(', ')}`,
        confidence: 0.98,
        priority: 'high',
        actionable: true
      });
    }
    
    // Revenue optimization
    const highPerformers = productsData.filter(p => p.price > stats.averagePrice * 1.5);
    if (highPerformers.length > 0) {
      insights.push({
        id: 'revenue-optimization',
        type: 'success',
        title: 'Premium Products Identified',
        description: `${highPerformers.length} products are priced above average`,
        recommendation: 'Consider expanding inventory and creating product variants for premium products',
        confidence: 0.89,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Category analysis
    const categoryPerformance = Object.entries(stats.categoryBreakdown)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
    
    if (categoryPerformance.length > 0) {
      const topCategory = categoryPerformance[0];
      insights.push({
        id: 'category-analysis',
        type: 'info',
        title: 'Category Performance',
        description: `${topCategory.category} category has the most products (${topCategory.count} items)`,
        recommendation: 'Focus marketing efforts on top-performing categories',
        confidence: 0.85,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Inventory distribution
    const overstockedProducts = productsData.filter(p => p.stock > 100);
    if (overstockedProducts.length > 0) {
      insights.push({
        id: 'inventory-optimization',
        type: 'warning',
        title: 'High Inventory Items',
        description: `${overstockedProducts.length} products have high inventory levels (>100 units)`,
        recommendation: 'Consider promotional campaigns or bundle deals to move excess inventory',
        confidence: 0.82,
        priority: 'low',
        actionable: true
      });
    }
    
    // Featured products analysis
    const featuredProducts = productsData.filter(p => p.featured);
    if (featuredProducts.length > 0) {
      insights.push({
        id: 'featured-insights',
        type: 'info',
        title: 'Featured Products Impact',
        description: `${featuredProducts.length} products are currently featured`,
        recommendation: 'Monitor performance of featured products and rotate selection regularly',
        confidence: 0.91,
        priority: 'medium',
        actionable: true
      });
    }
    
    setAiInsights(insights.slice(0, 5)); // Limit to top 5 insights
  }, [stats.averagePrice, stats.categoryBreakdown]);


  // Event handlers
  const handleCreateProduct = () => {
    router.push('/admin/products/new');
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleViewProduct = (product: Product) => {
    window.open(`/products/${product.slug}`, '_blank');
  };

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { updateProduct } = await import('@/lib/services/productService');
      await updateProduct(productId, { isActive: !currentStatus });
    } catch (err) {
      setError("Failed to update product status");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        const { deleteProduct } = await import('@/lib/services/productService');
        await deleteProduct(productId);
      } catch (err) {
        setError("Failed to delete product");
      }
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    const { id, createdAt, updatedAt, ...productData } = product;
    const duplicatedProduct = {
      ...productData,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy-${Date.now()}`,
      isActive: false
    };

    try {
      const { addProduct } = await import('@/lib/services/productService');
      await addProduct(duplicatedProduct);
    } catch (err) {
      setError("Failed to duplicate product");
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (product.category || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === "all" || product.category === filterCategory;
      const matchesStatus = filterStatus === "all" ||
                          (filterStatus === "active" && product.isActive) ||
                          (filterStatus === "inactive" && !product.isActive);
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      const matchesStock = stockLevel === "all" ||
                         (stockLevel === "low" && product.stock < 10) ||
                         (stockLevel === "medium" && product.stock >= 10 && product.stock < 50) ||
                         (stockLevel === "high" && product.stock >= 50) ||
                         (stockLevel === "out" && product.stock === 0);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "stock-high":
          return b.stock - a.stock;
        case "stock-low":
          return a.stock - b.stock;
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, filterCategory, filterStatus, priceRange, stockLevel, sortBy]);

  const handleBulkAction = async (action: string, productIds: string[]) => {
    try {
      const { updateProduct, deleteProduct, bulkUpdateProducts, bulkDeleteProducts } = await import('@/lib/services/productService');
      
      switch (action) {
        case "activate":
          await bulkUpdateProducts(productIds, { isActive: true });
          break;
        case "deactivate":
          await bulkUpdateProducts(productIds, { isActive: false });
          break;
        case "feature":
          await bulkUpdateProducts(productIds, { featured: true });
          break;
        case "unfeature":
          await bulkUpdateProducts(productIds, { featured: false });
          break;
        case "delete":
          if (confirm(`Are you sure you want to delete ${productIds.length} product(s)? This action cannot be undone.`)) {
            await bulkDeleteProducts(productIds);
          }
          break;
      }
      setSelectedProducts([]);
    } catch (err) {
      setError(`Failed to perform bulk action: ${action}`);
    }
  };

  const handleExportProducts = () => {
    const csv = [
      ["Name", "Category", "Price", "Stock", "Status", "SKU", "Weight", "Featured"].join(","),
      ...filteredProducts.map(product => [
        `"${product.name}"`,
        product.category,
        product.price,
        product.stock,
        product.isActive ? 'Active' : 'Inactive',
        product.sku,
        product.weight,
        product.featured ? 'Yes' : 'No'
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Component configuration
  const headerActions = [
    {
      label: "AI Product Insights",
      icon: <FiCpu />,
      onClick: () => console.log('AI insights'),
      variant: "ai" as const
    },
    {
      label: "Export Products",
      icon: <FiDownload />,
      onClick: handleExportProducts,
      variant: "secondary" as const
    },
    {
      label: "Import Products",
      icon: <FiUpload />,
      onClick: () => console.log('Import products'),
      variant: "secondary" as const
    },
    {
      label: "Add Product",
      icon: <FiPlus />,
      onClick: handleCreateProduct,
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: <FiPackage />,
      color: "primary" as const,
      change: { value: 8, type: "increase" as const, period: "this month" },
      description: "All products in catalog"
    },
    {
      label: "Active Products",
      value: stats.activeProducts,
      icon: <FiCheckCircle />,
      color: "success" as const,
      change: { value: 12, type: "increase" as const, period: "this month" },
      description: "Currently available"
    },
    {
      label: "Inventory Value",
      value: `$${stats.totalInventoryValue.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "warning" as const,
      change: { value: 15.2, type: "increase" as const, period: "last month" },
      description: "Total stock value"
    },
    {
      label: "Low Stock Items",
      value: stats.lowStockCount,
      icon: <FiAlertCircle />,
      color: "danger" as const,
      change: { value: 2, type: "decrease" as const, period: "this week" },
      description: "Need restocking"
    },
    {
      label: "Average Price",
      value: `$${stats.averagePrice.toFixed(2)}`,
      icon: <FiTag />,
      color: "info" as const,
      change: { value: 3.8, type: "increase" as const, period: "last quarter" },
      description: "Per product"
    },
    {
      label: "Featured Products",
      value: stats.featuredCount,
      icon: <FiStar />,
      color: "secondary" as const,
      change: { value: 2, type: "increase" as const, period: "this week" },
      description: "Highlighted items"
    },
    {
      label: "Revenue Growth",
      value: `${stats.revenueGrowth}%`,
      icon: <FiTrendingUp />,
      color: "success" as const,
      change: { value: 4.2, type: "increase" as const, period: "monthly" },
      description: "Performance trend"
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: <FiTarget />,
      color: "info" as const,
      change: { value: 0.3, type: "increase" as const, period: "last month" },
      description: "View to purchase"
    }
  ];

  const filterConfigs = [
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      options: [
        { label: "All Categories", value: "all" },
        ...categories.map(cat => ({ label: cat, value: cat }))
      ]
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ]
    },
    {
      key: "stockLevel",
      label: "Stock Level",
      type: "select" as const,
      options: [
        { label: "All Stock Levels", value: "all" },
        { label: "Low Stock", value: "low" },
        { label: "Medium Stock", value: "medium" },
        { label: "High Stock", value: "high" },
        { label: "Out of Stock", value: "out" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Name", value: "name" },
        { label: "Price: High to Low", value: "price-high" },
        { label: "Price: Low to High", value: "price-low" },
        { label: "Stock: High to Low", value: "stock-high" },
        { label: "Stock: Low to High", value: "stock-low" },
        { label: "Featured First", value: "featured" },
      ]
    }
  ];

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { color: "#ef4444", text: "Out of Stock" };
    if (product.stock < 10) return { color: "#f59e0b", text: "Low Stock" };
    return { color: "#10b981", text: "In Stock" };
  };

  const tableColumns = [
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (value: any, row: Product) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                objectFit: "cover"
              }}
            />
          ) : (
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FiPackage size={20} color="rgba(255, 255, 255, 0.6)" />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <strong style={{
              color: "rgba(255, 255, 255, 0.95)",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px"
            }}>
              {row.name}
            </strong>
            <small style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.8rem"
            }}>
              {row.category}
            </small>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              <span style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                background: row.isActive ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)",
                color: row.isActive ? "#10b981" : "#6b7280",
                fontSize: "0.7rem",
                textTransform: "capitalize"
              }}>
                {row.isActive ? 'Active' : 'Inactive'}
              </span>
              {row.featured && (
                <span style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  background: "rgba(245, 158, 11, 0.2)",
                  color: "#f59e0b",
                  fontSize: "0.7rem"
                }}>
                  Featured
                </span>
              )}
              {row.bestSeller && (
                <span style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  background: "rgba(59, 130, 246, 0.2)",
                  color: "#3b82f6",
                  fontSize: "0.7rem"
                }}>
                  Best Seller
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (price: number, row: Product) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "600", fontSize: "0.9rem" }}>
            ${price}
          </span>
          {row.badge && (
            <small style={{ color: "#10b981", fontSize: "0.75rem" }}>
              {row.badge}
            </small>
          )}
        </div>
      )
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (stock: number, row: Product) => {
        const status = getStockStatus(row);
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "600" }}>
                {stock}
              </span>
              <span style={{ color: status.color, fontSize: "0.75rem" }}>
                {status.text}
              </span>
            </div>
            <div style={{
              width: "60px",
              height: "4px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "2px",
              marginTop: "0.25rem",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${Math.min((stock / 100) * 100, 100)}%`,
                height: "100%",
                background: status.color,
                borderRadius: "2px",
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>
        );
      }
    },
    {
      key: "performance",
      label: "Performance",
      render: (value: any, row: Product) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiPackage size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {row.sku}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiTag size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {row.weight}g
            </span>
          </div>
          {row.rating && row.rating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiStar size={12} />
              <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
                {row.rating.toFixed(1)} ({row.reviewCount || 0})
              </span>
            </div>
          )}
          {row.soldCount && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiShoppingCart size={12} />
              <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
                {row.soldCount} sold
              </span>
            </div>
          )}
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: "View Product",
      icon: <FiEye />,
      onClick: (product: Product) => handleViewProduct(product),
      variant: "secondary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (product: Product) => handleEditProduct(product),
      variant: "primary" as const
    },
    {
      label: "Duplicate",
      icon: <FiCopy />,
      onClick: (product: Product) => handleDuplicateProduct(product),
      variant: "secondary" as const
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (product: Product) => handleDeleteProduct(product.id),
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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading products...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader
        title="Product Management"
        subtitle="Manage your product catalog with advanced inventory tracking, AI-powered insights, and comprehensive analytics"
        actions={headerActions}
        breadcrumb={["Admin", "Products"]}
      />

      <AdminStats stats={statsData} columns={8} />

      {/* AI Insights Panel */}
      {aiInsights.length > 0 && (
        <AdminCard variant="gradient" padding="large">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <FiCpu style={{ color: "var(--colorPrimary)" }} size={24} />
            <h3 style={{ color: "rgba(255, 255, 255, 0.95)", margin: 0 }}>AI Product Insights</h3>
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
          category: filterCategory,
          status: filterStatus,
          stockLevel: stockLevel,
          sortBy: sortBy
        }}
        onFilterChange={(key, value) => {
          switch (key) {
            case 'category': setFilterCategory(value); break;
            case 'status': setFilterStatus(value); break;
            case 'stockLevel': setStockLevel(value); break;
            case 'sortBy': setSortBy(value); break;
          }
        }}
        onClearFilters={() => {
          setFilterCategory('all');
          setFilterStatus('all');
          setStockLevel('all');
          setSortBy('name');
        }}
        placeholder="Search products by name, description, tags, or category..."
        aiSuggestions={[
          "Best selling skincare products",
          "Low stock moisturizers",
          "High revenue serums",
          "New product launches",
          "Featured anti-aging products"
        ]}
      />
      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
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
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleBulkAction('activate', selectedProducts)}
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
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate', selectedProducts)}
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
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('feature', selectedProducts)}
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
                Feature
              </button>
              <button
                onClick={() => handleBulkAction('delete', selectedProducts)}
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
        data={filteredProducts}
        actions={tableActions}
        selectable={true}
        selectedRows={selectedProducts}
        onRowSelect={setSelectedProducts}
        loading={loading}
        emptyMessage="No products found. Create your first product to get started!"
      />

      {error && (
        <AdminCard variant="gradient">
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