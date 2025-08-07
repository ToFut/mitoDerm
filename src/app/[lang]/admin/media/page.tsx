"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiImage,
  FiVideo,
  FiFile,
  FiUpload,
  FiDownload,
  FiTrash2,
  FiEdit,
  FiEye,
  FiCopy,
  FiFolder,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiMoreHorizontal,
  FiCpu,
  FiHardDrive,
  FiBarChart2,
  FiTarget,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiZap,
  FiTrendingUp,
  FiActivity,
  FiClock,
  FiTag,
  FiLink,
  FiShare2,
  FiRefreshCw,
  FiPlus
} from "react-icons/fi";
import { 
  getMedia, 
  getMediaStats, 
  uploadMedia, 
  deleteMedia, 
  updateMedia, 
  bulkDeleteMedia,
  getStorageUsage,
  MediaItem 
} from "@/lib/services/mediaService";
import {
  AdminPageContainer,
  AdminHeader,
  AdminStats,
  AdminFilters,
  AdminTable,
  AdminCard
} from "@/components/admin/shared";

interface MediaStats {
  totalFiles: number;
  images: number;
  videos: number;
  documents: number;
  totalSize: number;
  storageUsed: number;
  storageLimit: number;
  uploadedThisMonth: number;
  averageFileSize: number;
  categoriesCount: number;
  recentUploads: number;
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

export default function AdminMediaPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [dragOver, setDragOver] = useState(false);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("uploadedAt");
  
  // Statistics and AI
  const [stats, setStats] = useState<MediaStats>({
    totalFiles: 0,
    images: 0,
    videos: 0,
    documents: 0,
    totalSize: 0,
    storageUsed: 0,
    storageLimit: 0,
    uploadedThisMonth: 0,
    averageFileSize: 0,
    categoriesCount: 0,
    recentUploads: 0
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  // Add keyframes for spinner animation
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Load media data
  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      const [mediaData, mediaStats, storageUsage] = await Promise.all([
        getMedia(),
        getMediaStats(),
        getStorageUsage()
      ]);
      
      setMedia(mediaData);
      calculateStats(mediaData, mediaStats, storageUsage);
      generateAIInsights(mediaData, mediaStats, storageUsage);
      setLoading(false);
    } catch (err) {
      setError("Failed to load media");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  // Calculate comprehensive statistics
  const calculateStats = useCallback((
    mediaData: MediaItem[], 
    mediaStats: any, 
    storageUsage: { used: number; total: number }
  ) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const uploadedThisMonth = mediaData.filter(m => 
      new Date(m.uploadedAt) >= thisMonth
    ).length;
    
    const recentUploads = mediaData.filter(m => {
      const uploadDate = new Date(m.uploadedAt);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return uploadDate >= weekAgo;
    }).length;
    
    const averageFileSize = mediaData.length > 0 
      ? mediaData.reduce((sum, m) => sum + m.size, 0) / mediaData.length 
      : 0;
    
    const categories = new Set(mediaData.map(m => m.category));
    
    setStats({
      totalFiles: mediaData.length,
      images: mediaStats.images || mediaData.filter(m => m.type.startsWith('image/')).length,
      videos: mediaStats.videos || mediaData.filter(m => m.type.startsWith('video/')).length,
      documents: mediaStats.documents || mediaData.filter(m => !m.type.startsWith('image/') && !m.type.startsWith('video/')).length,
      totalSize: mediaStats.totalSize || mediaData.reduce((sum, m) => sum + m.size, 0),
      storageUsed: storageUsage.used,
      storageLimit: storageUsage.total,
      uploadedThisMonth,
      averageFileSize,
      categoriesCount: categories.size,
      recentUploads
    });
  }, []);

  // Advanced AI insights generation
  const generateAIInsights = useCallback((
    mediaData: MediaItem[], 
    mediaStats: any, 
    storageUsage: { used: number; total: number }
  ) => {
    const insights: AIInsight[] = [];
    
    // Storage usage warning
    const usagePercentage = (storageUsage.used / storageUsage.total) * 100;
    if (usagePercentage > 80) {
      insights.push({
        id: 'storage-warning',
        type: 'warning',
        title: 'High Storage Usage',
        description: `Storage is ${usagePercentage.toFixed(1)}% full (${(storageUsage.used / (1024 * 1024 * 1024)).toFixed(2)}GB used)`,
        recommendation: 'Consider deleting unused files or upgrading storage plan',
        confidence: 0.98,
        priority: 'high',
        actionable: true
      });
    } else if (usagePercentage > 60) {
      insights.push({
        id: 'storage-notice',
        type: 'info',
        title: 'Storage Usage Notice',
        description: `Storage is ${usagePercentage.toFixed(1)}% full`,
        recommendation: 'Monitor storage usage and plan for future needs',
        confidence: 0.85,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Large file analysis
    const averageSize = stats.averageFileSize;
    const largeFiles = mediaData.filter(m => m.size > averageSize * 5);
    if (largeFiles.length > 0) {
      insights.push({
        id: 'large-files',
        type: 'warning',
        title: 'Large Files Detected',
        description: `${largeFiles.length} files are significantly larger than average`,
        recommendation: 'Consider optimizing large files or using compression',
        confidence: 0.87,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Upload activity analysis
    if (stats.recentUploads > 20) {
      insights.push({
        id: 'high-activity',
        type: 'success',
        title: 'High Upload Activity',
        description: `${stats.recentUploads} files uploaded in the last week`,
        recommendation: 'Monitor storage usage due to increased activity',
        confidence: 0.92,
        priority: 'medium',
        actionable: true
      });
    } else if (stats.recentUploads === 0) {
      insights.push({
        id: 'low-activity',
        type: 'info',
        title: 'Low Recent Activity',
        description: 'No files uploaded in the last week',
        recommendation: 'Consider updating content or reviewing media strategy',
        confidence: 0.78,
        priority: 'low',
        actionable: true
      });
    }
    
    // Media type distribution
    const imagePercentage = (stats.images / stats.totalFiles) * 100;
    if (imagePercentage > 80) {
      insights.push({
        id: 'media-diversity',
        type: 'info',
        title: 'Image-Heavy Media Library',
        description: `${imagePercentage.toFixed(1)}% of files are images`,
        recommendation: 'Consider adding more video content for better engagement',
        confidence: 0.75,
        priority: 'low',
        actionable: true
      });
    }
    
    // Unused files detection (mock logic)
    const potentiallyUnused = mediaData.filter(m => {
      const age = new Date().getTime() - new Date(m.uploadedAt).getTime();
      const daysOld = age / (1000 * 60 * 60 * 24);
      return daysOld > 90; // Files older than 90 days
    });
    
    if (potentiallyUnused.length > 10) {
      insights.push({
        id: 'unused-files',
        type: 'warning',
        title: 'Potentially Unused Files',
        description: `${potentiallyUnused.length} files haven't been accessed in 90+ days`,
        recommendation: 'Review and consider archiving or deleting old unused files',
        confidence: 0.65,
        priority: 'low',
        actionable: true
      });
    }
    
    setAiInsights(insights.slice(0, 5));
  }, [stats.averageFileSize, stats.recentUploads, stats.images, stats.totalFiles]);

  // File upload handlers
  const handleFileUpload = useCallback(async (files: File[], category: string = 'general') => {
    setUploading(true);
    setUploadProgress({});
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('category', category);
      
      const uploadedItems = await uploadMedia(formData, setUploadProgress);
      
      // Refresh media list
      await loadMedia();
      
      setUploading(false);
      setUploadProgress({});
    } catch (err) {
      setError("Failed to upload files");
      setUploading(false);
      setUploadProgress({});
    }
  }, [loadMedia]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  // Media management handlers
  const handleDeleteMedia = async (mediaId: string) => {
    if (confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
      try {
        await deleteMedia(mediaId);
        await loadMedia();
      } catch (err) {
        setError("Failed to delete media");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedMedia.length} file(s)? This action cannot be undone.`)) {
      try {
        await bulkDeleteMedia(selectedMedia);
        setSelectedMedia([]);
        await loadMedia();
      } catch (err) {
        setError("Failed to delete files");
      }
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // You could show a toast notification here
  };

  const handleEditMedia = (mediaItem: MediaItem) => {
    // Open edit modal or navigate to edit page
    console.log('Edit media:', mediaItem);
  };

  // Filter and sort media
  const filteredMedia = useMemo(() => {
    let filtered = media.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === "all" || 
                         (filterType === "images" && item.type.startsWith('image/')) ||
                         (filterType === "videos" && item.type.startsWith('video/')) ||
                         (filterType === "documents" && !item.type.startsWith('image/') && !item.type.startsWith('video/'));
      
      const matchesCategory = filterCategory === "all" || item.category === filterCategory;
      
      let matchesDateRange = true;
      if (dateRange !== "all") {
        const itemDate = new Date(item.uploadedAt);
        const now = new Date();
        
        switch (dateRange) {
          case "today":
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            matchesDateRange = itemDate >= today;
            break;
          case "this_week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDateRange = itemDate >= weekAgo;
            break;
          case "this_month":
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchesDateRange = itemDate >= thisMonth;
            break;
        }
      }
      
      return matchesSearch && matchesType && matchesCategory && matchesDateRange;
    });

    // Sort media
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          return b.size - a.size;
        case "type":
          return a.type.localeCompare(b.type);
        case "category":
          return a.category.localeCompare(b.category);
        case "uploadedAt":
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

    return filtered;
  }, [media, searchTerm, filterType, filterCategory, dateRange, sortBy]);

  // Get unique categories for filter options
  const categories = Array.from(new Set(media.map(m => m.category)));

  // Component configuration
  const headerActions = [
    {
      label: "AI Media Insights",
      icon: <FiCpu />,
      onClick: () => console.log('AI insights'),
      variant: "ai" as const
    },
    {
      label: "Storage Usage",
      icon: <FiHardDrive />,
      onClick: () => console.log('Storage usage'),
      variant: "secondary" as const
    },
    {
      label: viewMode === 'grid' ? "List View" : "Grid View",
      icon: viewMode === 'grid' ? <FiList /> : <FiGrid />,
      onClick: () => setViewMode(viewMode === 'grid' ? 'list' : 'grid'),
      variant: "secondary" as const
    },
    {
      label: "Upload Media",
      icon: <FiUpload />,
      onClick: () => document.getElementById('file-upload')?.click(),
      variant: "primary" as const
    }
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statsData = [
    {
      label: "Total Files",
      value: stats.totalFiles.toLocaleString(),
      icon: <FiFile />,
      color: "primary" as const,
      change: { value: stats.uploadedThisMonth, type: "increase" as const, period: "this month" },
      description: "All media files"
    },
    {
      label: "Images",
      value: stats.images.toLocaleString(),
      icon: <FiImage />,
      color: "success" as const,
      change: { value: 8, type: "increase" as const, period: "this week" },
      description: "Image files"
    },
    {
      label: "Videos",
      value: stats.videos.toLocaleString(),
      icon: <FiVideo />,
      color: "info" as const,
      change: { value: 3, type: "increase" as const, period: "this week" },
      description: "Video files"
    },
    {
      label: "Documents",
      value: stats.documents.toLocaleString(),
      icon: <FiFile />,
      color: "secondary" as const,
      change: { value: 2, type: "increase" as const, period: "this week" },
      description: "Document files"
    },
    {
      label: "Storage Used",
      value: formatFileSize(stats.storageUsed),
      icon: <FiHardDrive />,
      color: stats.storageUsed > stats.storageLimit * 0.8 ? "danger" as const : "warning" as const,
      change: { value: ((stats.storageUsed / stats.storageLimit) * 100), type: "neutral" as const, period: "of limit" },
      description: `${formatFileSize(stats.storageLimit)} total`
    },
    {
      label: "Average File Size",
      value: formatFileSize(stats.averageFileSize),
      icon: <FiTarget />,
      color: "info" as const,
      description: "Per file average"
    },
    {
      label: "Recent Uploads",
      value: stats.recentUploads,
      icon: <FiTrendingUp />,
      color: "success" as const,
      change: { value: stats.recentUploads, type: stats.recentUploads > 0 ? "increase" as const : "neutral" as const, period: "this week" },
      description: "Last 7 days"
    },
    {
      label: "Categories",
      value: stats.categoriesCount,
      icon: <FiFolder />,
      color: "secondary" as const,
      description: "Content categories"
    }
  ];

  const filterConfigs = [
    {
      key: "type",
      label: "File Type",
      type: "select" as const,
      options: [
        { label: "All Types", value: "all" },
        { label: "Images", value: "images" },
        { label: "Videos", value: "videos" },
        { label: "Documents", value: "documents" }
      ]
    },
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
      key: "dateRange",
      label: "Upload Date",
      type: "select" as const,
      options: [
        { label: "All Time", value: "all" },
        { label: "Today", value: "today" },
        { label: "This Week", value: "this_week" },
        { label: "This Month", value: "this_month" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Upload Date", value: "uploadedAt" },
        { label: "File Name", value: "name" },
        { label: "File Size", value: "size" },
        { label: "File Type", value: "type" },
        { label: "Category", value: "category" }
      ]
    }
  ];

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FiImage />;
    if (type.startsWith('video/')) return <FiVideo />;
    return <FiFile />;
  };

  const renderGridView = () => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "1rem",
      padding: "1rem 0"
    }}>
      {filteredMedia.map((item) => (
        <AdminCard key={item.id} padding="medium" style={{ 
          cursor: "pointer",
          border: selectedMedia.includes(item.id!) ? "2px solid var(--colorPrimary)" : undefined
        }}>
          <div onClick={() => {
            if (selectedMedia.includes(item.id!)) {
              setSelectedMedia(selectedMedia.filter(id => id !== item.id));
            } else {
              setSelectedMedia([...selectedMedia, item.id!]);
            }
          }}>
            {/* File Preview */}
            <div style={{
              width: "100%",
              height: "150px",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "1rem",
              background: "rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {item.type.startsWith('image/') ? (
                <img
                  src={item.url}
                  alt={item.alt || item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div style={{
                  fontSize: "3rem",
                  color: "rgba(255, 255, 255, 0.3)"
                }}>
                  {getFileIcon(item.type)}
                </div>
              )}
            </div>

            {/* File Info */}
            <div>
              <h4 style={{
                color: "rgba(255, 255, 255, 0.95)",
                margin: "0 0 0.5rem 0",
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {item.name}
              </h4>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.8rem",
                color: "rgba(255, 255, 255, 0.6)"
              }}>
                <span>{formatFileSize(item.size)}</span>
                <span>{item.type.split('/')[1]?.toUpperCase()}</span>
              </div>
              <div style={{
                marginTop: "0.5rem",
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.5)"
              }}>
                {new Date(item.uploadedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(item.url, '_blank');
                }}
                style={{
                  padding: "0.5rem",
                  background: "rgba(59, 130, 246, 0.2)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "4px",
                  color: "#3b82f6",
                  cursor: "pointer"
                }}
              >
                <FiEye size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyUrl(item.url);
                }}
                style={{
                  padding: "0.5rem",
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "4px",
                  color: "#10b981",
                  cursor: "pointer"
                }}
              >
                <FiCopy size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditMedia(item);
                }}
                style={{
                  padding: "0.5rem",
                  background: "rgba(245, 158, 11, 0.2)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "4px",
                  color: "#f59e0b",
                  cursor: "pointer"
                }}
              >
                <FiEdit size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMedia(item.id!);
                }}
                style={{
                  padding: "0.5rem",
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "4px",
                  color: "#ef4444",
                  cursor: "pointer",
                  marginLeft: "auto"
                }}
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );

  const tableColumns = [
    {
      key: "name",
      label: "File",
      sortable: true,
      render: (value: string, row: MediaItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "6px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.05)"
          }}>
            {row.type.startsWith('image/') ? (
              <img
                src={row.url}
                alt={row.alt || row.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ fontSize: "1.2rem", color: "rgba(255, 255, 255, 0.6)" }}>
                {getFileIcon(row.type)}
              </div>
            )}
          </div>
          <div>
            <strong style={{ color: "rgba(255, 255, 255, 0.95)", fontSize: "0.9rem" }}>
              {value}
            </strong>
            <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
              {row.type} • {formatFileSize(row.size)}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "category",
      label: "Category",
      render: (category: string) => (
        <span style={{
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          background: "rgba(59, 130, 246, 0.2)",
          color: "#3b82f6",
          fontSize: "0.75rem",
          textTransform: "capitalize"
        }}>
          {category}
        </span>
      )
    },
    {
      key: "uploadedAt",
      label: "Uploaded",
      sortable: true,
      render: (date: Date) => (
        <div style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.7)" }}>
          {new Date(date).toLocaleDateString()}
        </div>
      )
    },
    {
      key: "tags",
      label: "Tags",
      render: (tags: string[]) => (
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              style={{
                padding: "0.15rem 0.4rem",
                borderRadius: "3px",
                background: "rgba(107, 114, 128, 0.2)",
                color: "#6b7280",
                fontSize: "0.7rem"
              }}
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.5)" }}>
              +{tags.length - 2}
            </span>
          )}
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: "View",
      icon: <FiEye />,
      onClick: (item: MediaItem) => window.open(item.url, '_blank'),
      variant: "secondary" as const
    },
    {
      label: "Copy URL",
      icon: <FiCopy />,
      onClick: (item: MediaItem) => handleCopyUrl(item.url),
      variant: "info" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (item: MediaItem) => handleEditMedia(item),
      variant: "primary" as const
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (item: MediaItem) => handleDeleteMedia(item.id!),
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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading media...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader
        title="Media Management"
        subtitle="Upload, organize, and manage your media files with AI-powered insights and cloud storage integration"
        actions={headerActions}
        breadcrumb={["Admin", "Media"]}
      />

      {/* File upload input */}
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(Array.from(e.target.files));
          }
        }}
        style={{ display: "none" }}
      />

      {/* Upload Drop Zone */}
      {dragOver && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div style={{
            background: "rgba(59, 130, 246, 0.2)",
            border: "2px dashed #3b82f6",
            borderRadius: "12px",
            padding: "3rem",
            textAlign: "center",
            color: "#3b82f6"
          }}>
            <FiUpload size={48} />
            <h3 style={{ margin: "1rem 0", color: "#3b82f6" }}>Drop files here to upload</h3>
          </div>
        </div>
      )}

      <AdminStats stats={statsData} columns={8} />

      {/* Upload Progress */}
      {uploading && Object.keys(uploadProgress).length > 0 && (
        <AdminCard variant="gradient" padding="medium">
          <h4 style={{ color: "rgba(255, 255, 255, 0.95)", margin: "0 0 1rem 0" }}>
            Uploading files...
          </h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} style={{ marginBottom: "0.5rem" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.25rem"
              }}>
                <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
                  {fileName}
                </span>
                <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  {progress === -1 ? "Error" : `${progress}%`}
                </span>
              </div>
              <div style={{
                width: "100%",
                height: "4px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "2px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${Math.max(0, progress)}%`,
                  height: "100%",
                  background: progress === -1 ? "#ef4444" : "var(--colorPrimary)",
                  transition: "width 0.3s ease"
                }} />
              </div>
            </div>
          ))}
        </AdminCard>
      )}

      {/* AI Insights Panel */}
      {aiInsights.length > 0 && (
        <AdminCard variant="gradient" padding="large">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <FiCpu style={{ color: "var(--colorPrimary)" }} size={24} />
            <h3 style={{ color: "rgba(255, 255, 255, 0.95)", margin: 0 }}>AI Media Insights</h3>
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
          type: filterType,
          category: filterCategory,
          dateRange: dateRange,
          sortBy: sortBy
        }}
        onFilterChange={(key, value) => {
          switch (key) {
            case 'type': setFilterType(value); break;
            case 'category': setFilterCategory(value); break;
            case 'dateRange': setDateRange(value); break;
            case 'sortBy': setSortBy(value); break;
          }
        }}
        onClearFilters={() => {
          setFilterType('all');
          setFilterCategory('all');
          setDateRange('all');
          setSortBy('uploadedAt');
        }}
        placeholder="Search media by name, description, or tags..."
        aiSuggestions={[
          "High resolution product images",
          "Educational video content",
          "Recent skincare documentation",
          "Large file optimization needed",
          "Unused media files"
        ]}
      />

      {/* Bulk Actions */}
      {selectedMedia.length > 0 && (
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
              {selectedMedia.length} file{selectedMedia.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => {
                  selectedMedia.forEach(id => {
                    const item = media.find(m => m.id === id);
                    if (item) handleCopyUrl(item.url);
                  });
                }}
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
                Copy URLs
              </button>
              <button
                onClick={handleBulkDelete}
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

      {/* Media Display */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {viewMode === 'grid' ? renderGridView() : (
          <AdminTable
            columns={tableColumns}
            data={filteredMedia}
            actions={tableActions}
            selectable={true}
            selectedRows={selectedMedia}
            onRowSelect={setSelectedMedia}
            loading={loading}
            emptyMessage="No media files found. Upload your first files to get started!"
          />
        )}
      </div>

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