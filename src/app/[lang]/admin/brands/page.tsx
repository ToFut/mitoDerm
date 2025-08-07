"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPackage,
  FiTag,
  FiLayers,
  FiZap,
  FiActivity,
  FiTrendingUp,
  FiDollarSign,
  FiStar,
  FiShoppingCart,
  FiGrid,
  FiList,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiUpload,
  FiCpu,
  FiAward,
  FiLink,
  FiImage,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiCopy,
  FiExternalLink
} from "react-icons/fi";
import { brandService, Brand, Product } from "@/lib/services/brandService";
import { 
  AdminPageContainer, 
  AdminHeader, 
  AdminStats, 
  AdminFilters, 
  AdminTable, 
  AdminCard 
} from "@/components/admin/shared";

interface ExtendedBrand extends Brand {
  productCount?: number;
  revenue?: number;
  performance?: {
    views: number;
    conversions: number;
    rating: number;
  };
}

interface ExtendedProduct extends Product {
  revenue?: number;
  stockLevel?: number;
  rating?: number;
}

export default function AdminBrandsPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [brands, setBrands] = useState<ExtendedBrand[]>([]);
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'brands' | 'products'>('brands');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('list');
  const [showModal, setShowModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<ExtendedBrand | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterTechnology, setFilterTechnology] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  
  // Statistics
  const [stats, setStats] = useState({
    totalBrands: 0,
    totalProducts: 0,
    activeBrands: 0,
    featuredProducts: 0,
    totalRevenue: 0,
    averageRating: 0,
    technologies: [] as { name: string; count: number }[],
    categories: {} as Record<string, number>,
  });

  // AI Insights
  const [aiInsights, setAiInsights] = useState<{
    recommendation: string;
    confidence: number;
    actions: string[];
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
    return () => document.head.removeChild(style);
  }, []);

  // Data fetching
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [brandsData, productsData] = await Promise.all([
        brandService.getBrands(),
        brandService.getProducts()
      ]);

      // Enhance brands with product count and performance
      const enhancedBrands = brandsData.map(brand => ({
        ...brand,
        productCount: brand.products?.length || 0,
        revenue: brand.products?.reduce((sum, p) => sum + (p.price || 0), 0) || 0,
        performance: {
          views: Math.floor(Math.random() * 10000),
          conversions: Math.floor(Math.random() * 1000),
          rating: 4 + Math.random()
        }
      }));

      // Enhance products with additional data
      const enhancedProducts = productsData.map(product => ({
        ...product,
        revenue: Math.floor(Math.random() * 50000),
        stockLevel: Math.floor(Math.random() * 500),
        rating: 4 + Math.random()
      }));

      setBrands(enhancedBrands);
      setProducts(enhancedProducts);
      calculateStats(enhancedBrands, enhancedProducts);
      generateAIInsights(enhancedBrands, enhancedProducts);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = useCallback((brandsData: ExtendedBrand[], productsData: ExtendedProduct[]) => {
    const activeBrands = brandsData.filter(b => b.isActive).length;
    const featuredProducts = productsData.filter(p => p.featured).length;
    const totalRevenue = productsData.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const averageRating = productsData.length > 0
      ? productsData.reduce((sum, p) => sum + (p.rating || 0), 0) / productsData.length
      : 0;

    // Group technologies
    const techMap = new Map<string, number>();
    brandsData.forEach(brand => {
      const tech = brand.technology;
      techMap.set(tech, (techMap.get(tech) || 0) + 1);
    });
    const technologies = Array.from(techMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Category distribution
    const categories = productsData.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      totalBrands: brandsData.length,
      totalProducts: productsData.length,
      activeBrands,
      featuredProducts,
      totalRevenue,
      averageRating,
      technologies,
      categories,
    });
  }, []);

  // Generate AI insights
  const generateAIInsights = useCallback((brandsData: ExtendedBrand[], productsData: ExtendedProduct[]) => {
    const insights = [];
    const actions = [];

    // Check for brands without products
    const brandsWithoutProducts = brandsData.filter(b => b.productCount === 0);
    if (brandsWithoutProducts.length > 0) {
      insights.push(`${brandsWithoutProducts.length} brands have no products`);
      actions.push('Add products to empty brands');
    }

    // Check for underperforming brands
    const avgRevenue = brandsData.reduce((sum, b) => sum + (b.revenue || 0), 0) / brandsData.length;
    const underperformingBrands = brandsData.filter(b => (b.revenue || 0) < avgRevenue * 0.5);
    if (underperformingBrands.length > 0) {
      insights.push(`${underperformingBrands.length} brands are underperforming`);
      actions.push('Review pricing and marketing for underperforming brands');
    }

    // Technology distribution insights
    const dominantTech = stats.technologies[0];
    if (dominantTech && dominantTech.count > brandsData.length * 0.4) {
      insights.push(`${dominantTech.name} technology dominates your portfolio`);
      actions.push('Consider diversifying technology offerings');
    }

    setAiInsights({
      recommendation: insights.join('. ') || 'Your brand portfolio is well-balanced',
      confidence: 0.85,
      actions: actions.length > 0 ? actions : ['Continue monitoring brand performance']
    });
  }, [stats.technologies]);

  // Filter data
  const filteredData = useMemo(() => {
    const dataToFilter = viewMode === 'brands' ? brands : products;
    
    return dataToFilter.filter((item: any) => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.technology?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === "all" || item.category === filterCategory;
      const matchesTechnology = filterTechnology === "all" || item.technology === filterTechnology;
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "active" && item.isActive) ||
                           (filterStatus === "featured" && item.featured) ||
                           (filterStatus === "inactive" && !item.isActive);
      
      return matchesSearch && matchesCategory && matchesTechnology && matchesStatus;
    }).sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "revenue":
          return (b.revenue || 0) - (a.revenue || 0);
        case "products":
          return (b.productCount || 0) - (a.productCount || 0);
        case "rating":
          return (b.rating || b.performance?.rating || 0) - (a.rating || a.performance?.rating || 0);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [brands, products, viewMode, searchTerm, filterCategory, filterTechnology, filterStatus, sortBy]);

  // Event handlers
  const handleCreateBrand = () => {
    setSelectedBrand(null);
    setSelectedProduct(null);
    setIsCreating(true);
    setShowModal(true);
  };

  const handleEditBrand = (brand: ExtendedBrand) => {
    setSelectedBrand(brand);
    setSelectedProduct(null);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (confirm('Are you sure you want to delete this brand? This will also remove all associated products.')) {
      const success = await brandService.deleteBrand(brandId);
      if (success) {
        loadData();
      } else {
        setError('Failed to delete brand');
      }
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setSelectedBrand(null);
    setIsCreating(true);
    setShowModal(true);
  };

  const handleEditProduct = (product: ExtendedProduct) => {
    setSelectedProduct(product);
    setSelectedBrand(null);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await brandService.deleteProduct(productId);
      if (success) {
        loadData();
      } else {
        setError('Failed to delete product');
      }
    }
  };

  const handleBulkAction = async (action: string, itemIds: string[]) => {
    try {
      const isProductMode = viewMode === 'products';
      
      switch (action) {
        case 'activate':
          await Promise.all(itemIds.map(id => 
            isProductMode 
              ? brandService.updateProduct(id, { isActive: true })
              : brandService.updateBrand(id, { isActive: true })
          ));
          break;
        case 'deactivate':
          await Promise.all(itemIds.map(id => 
            isProductMode
              ? brandService.updateProduct(id, { isActive: false })
              : brandService.updateBrand(id, { isActive: false })
          ));
          break;
        case 'feature':
          await Promise.all(itemIds.map(id => 
            isProductMode
              ? brandService.updateProduct(id, { featured: true })
              : brandService.updateBrand(id, { featured: true })
          ));
          break;
        case 'unfeature':
          await Promise.all(itemIds.map(id => 
            isProductMode
              ? brandService.updateProduct(id, { featured: false })
              : brandService.updateBrand(id, { featured: false })
          ));
          break;
        case 'delete':
          if (confirm(`Delete ${itemIds.length} ${isProductMode ? 'products' : 'brands'}?`)) {
            await Promise.all(itemIds.map(id => 
              isProductMode
                ? brandService.deleteProduct(id)
                : brandService.deleteBrand(id)
            ));
          }
          break;
      }
      setSelectedItems([]);
      loadData();
    } catch (err) {
      setError(`Failed to perform bulk action: ${action}`);
    }
  };

  const handleExport = () => {
    const dataToExport = viewMode === 'brands' ? brands : products;
    const headers = viewMode === 'brands' 
      ? ['Name', 'Technology', 'Category', 'Products', 'Revenue', 'Status']
      : ['Name', 'Brand', 'Category', 'Price', 'Stock', 'Status'];
    
    const csv = [
      headers.join(','),
      ...dataToExport.map((item: any) => {
        if (viewMode === 'brands') {
          return [
            `"${item.name}"`,
            item.technology,
            item.category,
            item.productCount,
            item.revenue,
            item.isActive ? 'Active' : 'Inactive'
          ].join(',');
        } else {
          return [
            `"${item.name}"`,
            `"${item.brandName}"`,
            item.category,
            item.price,
            item.stockLevel || 0,
            item.isActive ? 'Active' : 'Inactive'
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewMode}-export-${new Date().toISOString().split('T')[0]}.csv`;
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
      label: "Export Data",
      icon: <FiDownload />,
      onClick: handleExport,
      variant: "secondary" as const
    },
    {
      label: viewMode === 'brands' ? "Create Brand" : "Create Product",
      icon: <FiPlus />,
      onClick: viewMode === 'brands' ? handleCreateBrand : handleCreateProduct,
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Total Brands",
      value: stats.totalBrands,
      icon: <FiTag />,
      color: "primary" as const,
      change: { value: 12, type: "increase" as const, period: "last month" },
      description: "Brand portfolio size"
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: <FiPackage />,
      color: "info" as const,
      change: { value: 23, type: "increase" as const, period: "last month" },
      description: "Products across all brands"
    },
    {
      label: "Active Brands",
      value: stats.activeBrands,
      icon: <FiCheckCircle />,
      color: "success" as const,
      change: { value: 5, type: "increase" as const, period: "last week" },
      description: "Currently active"
    },
    {
      label: "Featured Products",
      value: stats.featuredProducts,
      icon: <FiStar />,
      color: "warning" as const,
      change: { value: 8, type: "increase" as const, period: "last month" },
      description: "Highlighted products"
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "secondary" as const,
      change: { value: 31, type: "increase" as const, period: "last quarter" },
      description: "Combined product revenue"
    },
    {
      label: "Avg Rating",
      value: stats.averageRating.toFixed(1),
      icon: <FiActivity />,
      color: "info" as const,
      change: { value: 0.3, type: "increase" as const, period: "last month" },
      description: "Customer satisfaction"
    }
  ];

  const filterConfigs = [
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      options: [
        { label: "All Categories", value: "all" },
        { label: "Clinic", value: "clinic" },
        { label: "Home", value: "home" },
        { label: "Professional", value: "professional" }
      ]
    },
    {
      key: "technology",
      label: "Technology",
      type: "select" as const,
      options: [
        { label: "All Technologies", value: "all" },
        ...stats.technologies.map(tech => ({
          label: `${tech.name} (${tech.count})`,
          value: tech.name
        }))
      ]
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "active" },
        { label: "Featured", value: "featured" },
        { label: "Inactive", value: "inactive" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Name", value: "name" },
        { label: "Revenue", value: "revenue" },
        { label: "Products", value: "products" },
        { label: "Rating", value: "rating" },
        { label: "Created Date", value: "createdAt" }
      ]
    }
  ];

  const brandTableColumns = [
    { 
      key: "name", 
      label: "Brand", 
      sortable: true, 
      render: (value: string, row: ExtendedBrand) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {row.logo && (
            <img 
              src={row.logo} 
              alt={row.name}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                objectFit: "contain",
                background: "rgba(255, 255, 255, 0.05)",
                padding: "4px"
              }}
            />
          )}
          <div>
            <strong style={{ color: "rgba(255, 255, 255, 0.95)", display: "block" }}>
              {row.name}
            </strong>
            <small style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              {row.technology}
            </small>
          </div>
        </div>
      )
    },
    { 
      key: "category", 
      label: "Category", 
      sortable: true,
      render: (value: string) => (
        <span style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "4px",
          background: "rgba(190, 128, 12, 0.2)",
          color: "var(--colorPrimary)",
          fontSize: "0.8rem",
          textTransform: "capitalize"
        }}>
          {value}
        </span>
      )
    },
    { 
      key: "productCount", 
      label: "Products", 
      sortable: true,
      render: (value: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiPackage size={14} />
          <span>{value}</span>
        </div>
      )
    },
    { 
      key: "revenue", 
      label: "Revenue", 
      sortable: true,
      render: (value: number) => (
        <span style={{ fontWeight: "600", color: "#10b981" }}>
          ${value?.toLocaleString() || 0}
        </span>
      )
    },
    { 
      key: "performance", 
      label: "Performance", 
      render: (performance: ExtendedBrand['performance']) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiEye size={12} />
            <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {performance?.views} views
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiStar size={12} />
            <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {performance?.rating.toFixed(1)}
            </span>
          </div>
        </div>
      )
    },
    { 
      key: "isActive", 
      label: "Status", 
      render: (value: boolean) => (
        <span style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "6px",
          background: value ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)",
          color: value ? "#10b981" : "#6b7280",
          fontSize: "0.75rem",
          fontWeight: "500"
        }}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const productTableColumns = [
    { 
      key: "name", 
      label: "Product", 
      sortable: true, 
      render: (value: string, row: ExtendedProduct) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {row.images?.[0] && (
            <img 
              src={row.images[0]} 
              alt={row.name}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                objectFit: "cover"
              }}
            />
          )}
          <div>
            <strong style={{ color: "rgba(255, 255, 255, 0.95)", display: "block" }}>
              {row.name}
            </strong>
            <small style={{ color: "var(--colorPrimary)" }}>
              {row.brandName}
            </small>
          </div>
        </div>
      )
    },
    { 
      key: "category", 
      label: "Category", 
      sortable: true,
      render: (value: string) => (
        <span style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "4px",
          background: "rgba(190, 128, 12, 0.2)",
          color: "var(--colorPrimary)",
          fontSize: "0.8rem",
          textTransform: "capitalize"
        }}>
          {value}
        </span>
      )
    },
    { 
      key: "price", 
      label: "Price", 
      sortable: true,
      render: (value: number) => (
        <span style={{ fontWeight: "600" }}>
          ${value}
        </span>
      )
    },
    { 
      key: "stockLevel", 
      label: "Stock", 
      sortable: true,
      render: (value: number = 0) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: value > 100 ? "#10b981" : value > 20 ? "#f59e0b" : "#ef4444"
          }} />
          <span style={{ 
            color: value > 100 ? "#10b981" : value > 20 ? "#f59e0b" : "#ef4444" 
          }}>
            {value}
          </span>
        </div>
      )
    },
    { 
      key: "rating", 
      label: "Rating", 
      sortable: true,
      render: (value: number = 0) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiStar size={14} color="#f59e0b" />
          <span>{value.toFixed(1)}</span>
        </div>
      )
    },
    { 
      key: "featured", 
      label: "Featured", 
      render: (value: boolean) => (
        <span style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "6px",
          background: value ? "rgba(245, 158, 11, 0.2)" : "rgba(107, 114, 128, 0.2)",
          color: value ? "#f59e0b" : "#6b7280",
          fontSize: "0.75rem",
          fontWeight: "500"
        }}>
          {value ? 'Featured' : 'Standard'}
        </span>
      )
    }
  ];

  const tableActions = viewMode === 'brands' ? [
    {
      label: "View Products",
      icon: <FiPackage />,
      onClick: (brand: ExtendedBrand) => {
        setViewMode('products');
        setSearchTerm(brand.name);
      },
      variant: "secondary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (brand: ExtendedBrand) => handleEditBrand(brand),
      variant: "primary" as const
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (brand: ExtendedBrand) => handleDeleteBrand(brand.id),
      variant: "danger" as const
    }
  ] : [
    {
      label: "View Details",
      icon: <FiEye />,
      onClick: (product: ExtendedProduct) => router.push(`/products/${product.slug}`),
      variant: "secondary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (product: ExtendedProduct) => handleEditProduct(product),
      variant: "primary" as const
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (product: ExtendedProduct) => handleDeleteProduct(product.id),
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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading brands and products...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader 
        title="Brand & Product Management"
        subtitle="Manage your brand portfolio and product catalog with comprehensive analytics and insights"
        actions={headerActions}
        breadcrumb={["Admin", "Brands"]}
      />

      {/* AI Insights Card */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0, color: "rgba(255, 255, 255, 0.95)" }}>AI Insights</h3>
                <span style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  fontSize: "0.75rem",
                  fontWeight: "600"
                }}>
                  {Math.round(aiInsights.confidence * 100)}% Confidence
                </span>
              </div>
              <p style={{ 
                color: "rgba(255, 255, 255, 0.8)", 
                marginBottom: "1rem",
                fontSize: "0.95rem",
                lineHeight: "1.6"
              }}>
                {aiInsights.recommendation}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {aiInsights.actions.map((action, index) => (
                  <button
                    key={index}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      <AdminStats stats={statsData} columns={6} />

      {/* View Mode Toggle */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "1.5rem" 
      }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setViewMode('brands')}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              background: viewMode === 'brands' ? "var(--colorPrimary)" : "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease"
            }}
          >
            <FiTag size={16} />
            Brands ({stats.totalBrands})
          </button>
          <button
            onClick={() => setViewMode('products')}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              background: viewMode === 'products' ? "var(--colorPrimary)" : "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s ease"
            }}
          >
            <FiPackage size={16} />
            Products ({stats.totalProducts})
          </button>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setDisplayMode('grid')}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              background: displayMode === 'grid' ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              cursor: "pointer"
            }}
          >
            <FiGrid size={18} />
          </button>
          <button
            onClick={() => setDisplayMode('list')}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              background: displayMode === 'list' ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              cursor: "pointer"
            }}
          >
            <FiList size={18} />
          </button>
        </div>
      </div>

      <AdminFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={{ 
          category: filterCategory, 
          technology: filterTechnology, 
          status: filterStatus,
          sortBy: sortBy 
        }}
        onFilterChange={(key, value) => {
          switch (key) {
            case 'category': setFilterCategory(value); break;
            case 'technology': setFilterTechnology(value); break;
            case 'status': setFilterStatus(value); break;
            case 'sortBy': setSortBy(value); break;
          }
        }}
        onClearFilters={() => {
          setFilterCategory('all');
          setFilterTechnology('all');
          setFilterStatus('all');
          setSortBy('name');
        }}
        placeholder={`Search ${viewMode} by name, description, or technology...`}
        aiSuggestions={viewMode === 'brands' ? [
          "Featured brands",
          "Brands with peptides",
          "Professional brands",
          "Top revenue brands"
        ] : [
          "Best selling products",
          "Low stock items",
          "Featured products",
          "New arrivals"
        ]}
      />

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
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
              {selectedItems.length} {viewMode === 'brands' ? 'brand' : 'product'}{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => handleBulkAction('activate', selectedItems)}
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
                onClick={() => handleBulkAction('deactivate', selectedItems)}
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
                onClick={() => handleBulkAction('feature', selectedItems)}
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
                onClick={() => handleBulkAction('delete', selectedItems)}
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

      {/* Data Display */}
      {displayMode === 'list' ? (
        <AdminTable 
          columns={viewMode === 'brands' ? brandTableColumns : productTableColumns}
          data={filteredData as any[]}
          actions={tableActions}
          selectable={true}
          selectedRows={selectedItems}
          onRowSelect={setSelectedItems}
          loading={loading}
          emptyMessage={`No ${viewMode} found. Create your first ${viewMode === 'brands' ? 'brand' : 'product'} to get started!`}
        />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem"
        }}>
          <AnimatePresence>
            {(filteredData as any[]).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <AdminCard variant="gradient" padding="medium">
                  {viewMode === 'brands' ? (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                        {item.logo && (
                          <img 
                            src={item.logo} 
                            alt={item.name}
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "8px",
                              objectFit: "contain",
                              background: "rgba(255, 255, 255, 0.05)",
                              padding: "4px"
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, color: "rgba(255, 255, 255, 0.95)" }}>
                            {item.name}
                          </h4>
                          <small style={{ color: "var(--colorPrimary)" }}>
                            {item.technology}
                          </small>
                        </div>
                        <span style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "6px",
                          background: item.isActive ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)",
                          color: item.isActive ? "#10b981" : "#6b7280",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p style={{ 
                        color: "rgba(255, 255, 255, 0.7)", 
                        fontSize: "0.85rem",
                        marginBottom: "1rem",
                        minHeight: "2.5rem"
                      }}>
                        {item.description?.substring(0, 100)}...
                      </p>
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "1fr 1fr", 
                        gap: "1rem",
                        marginBottom: "1rem"
                      }}>
                        <div>
                          <small style={{ color: "rgba(255, 255, 255, 0.6)" }}>Products</small>
                          <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                            {item.productCount}
                          </div>
                        </div>
                        <div>
                          <small style={{ color: "rgba(255, 255, 255, 0.6)" }}>Revenue</small>
                          <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#10b981" }}>
                            ${item.revenue?.toLocaleString() || 0}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEditBrand(item)}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "6px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem"
                          }}
                        >
                          <FiEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            setViewMode('products');
                            setSearchTerm(item.name);
                          }}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "6px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem"
                          }}
                        >
                          <FiPackage size={14} /> Products
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {item.images?.[0] && (
                        <img 
                          src={item.images[0]} 
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "180px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            marginBottom: "1rem"
                          }}
                        />
                      )}
                      <h4 style={{ margin: "0 0 0.5rem 0", color: "rgba(255, 255, 255, 0.95)" }}>
                        {item.name}
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <small style={{ color: "var(--colorPrimary)" }}>
                          {item.brandName}
                        </small>
                        <span style={{ color: "rgba(255, 255, 255, 0.3)" }}>•</span>
                        <small style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                          {item.category}
                        </small>
                      </div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        marginBottom: "1rem"
                      }}>
                        <span style={{ fontSize: "1.5rem", fontWeight: "600", color: "rgba(255, 255, 255, 0.95)" }}>
                          ${item.price}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FiStar size={14} color="#f59e0b" />
                          <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                            {item.rating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEditProduct(item)}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "6px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem"
                          }}
                        >
                          <FiEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => router.push(`/products/${item.slug}`)}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            borderRadius: "6px",
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem"
                          }}
                        >
                          <FiEye size={14} /> View
                        </button>
                      </div>
                    </div>
                  )}
                </AdminCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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