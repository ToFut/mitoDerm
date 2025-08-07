"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBook,
  FiUsers,
  FiPlay,
  FiAward,
  FiClock,
  FiStar,
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
  FiVideo,
  FiFileText,
  FiMoreHorizontal,
  FiCopy,
  FiRefreshCw,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiUser
} from "react-icons/fi";
import { educationService } from "@/lib/services/educationService";
import {
  AdminPageContainer,
  AdminHeader,
  AdminStats,
  AdminFilters,
  AdminTable,
  AdminCard
} from "@/components/admin/shared";
import { Course } from "@/types";

interface EducationStats {
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  totalRevenue: number;
  certificatesIssued: number;
  averageRating: number;
  coursesThisMonth: number;
  coursesByCategory: Record<string, number>;
  coursesByLevel: Record<string, number>;
  instructorStats: Record<string, number>;
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

export default function AdminEducationPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPrice, setFilterPrice] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  
  // Statistics and AI
  const [stats, setStats] = useState<EducationStats>({
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    averageCompletionRate: 0,
    totalRevenue: 0,
    certificatesIssued: 0,
    averageRating: 0,
    coursesThisMonth: 0,
    coursesByCategory: {},
    coursesByLevel: {},
    instructorStats: {}
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
    const fetchCourses = async () => {
      try {
        const coursesData = await educationService.getCourses();
        setCourses(coursesData);
        setLoading(false);
        calculateStats(coursesData);
        generateAIInsights(coursesData);
      } catch (err) {
        setError("Failed to load courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Calculate comprehensive statistics
  const calculateStats = useCallback((coursesData: Course[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const publishedCourses = coursesData.filter(c => c.status === 'published').length;
    const totalEnrollments = coursesData.reduce((sum, c) => sum + c.enrollmentCount, 0);
    const averageCompletionRate = coursesData.length > 0 
      ? coursesData.reduce((sum, c) => sum + c.completionRate, 0) / coursesData.length 
      : 0;
    const totalRevenue = coursesData.reduce((sum, c) => sum + (c.price * c.enrollmentCount), 0);
    const averageRating = coursesData.length > 0 
      ? coursesData.reduce((sum, c) => sum + c.averageRating, 0) / coursesData.length 
      : 0;
    const coursesThisMonth = coursesData.filter(c => 
      new Date(c.createdAt) >= thisMonth
    ).length;
    
    // Category breakdown
    const coursesByCategory = coursesData.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Level breakdown
    const coursesByLevel = coursesData.reduce((acc, course) => {
      acc[course.level] = (acc[course.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Instructor stats
    const instructorStats = coursesData.reduce((acc, course) => {
      acc[course.instructor.name] = (acc[course.instructor.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setStats({
      totalCourses: coursesData.length,
      publishedCourses,
      totalEnrollments,
      averageCompletionRate,
      totalRevenue,
      certificatesIssued: coursesData.filter(c => c.certificateTemplate).length * 10, // Mock data
      averageRating,
      coursesThisMonth,
      coursesByCategory,
      coursesByLevel,
      instructorStats
    });
  }, []);

  // Advanced AI insights generation
  const generateAIInsights = useCallback((coursesData: Course[]) => {
    const insights: AIInsight[] = [];
    
    // Low completion rate analysis
    const lowCompletionCourses = coursesData.filter(c => c.completionRate < 40);
    if (lowCompletionCourses.length > 0) {
      insights.push({
        id: 'low-completion-alert',
        type: 'warning',
        title: 'Low Completion Rates Detected',
        description: `${lowCompletionCourses.length} courses have completion rates below 40%`,
        recommendation: `Review course structure, add engaging content, or break down complex topics: ${lowCompletionCourses.slice(0, 3).map(c => c.title).join(', ')}`,
        confidence: 0.95,
        priority: 'high',
        actionable: true
      });
    }
    
    // High-performing course analysis
    const topPerformers = coursesData.filter(c => c.averageRating > 4.5 && c.enrollmentCount > 50);
    if (topPerformers.length > 0) {
      insights.push({
        id: 'top-performers',
        type: 'success',
        title: 'High-Performing Courses Identified',
        description: `${topPerformers.length} courses show excellent performance with high ratings and enrollment`,
        recommendation: 'Create similar courses or advanced versions to capitalize on success',
        confidence: 0.92,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Category performance analysis
    const categoryPerformance = Object.entries(stats.coursesByCategory)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
    
    if (categoryPerformance.length > 0) {
      const topCategory = categoryPerformance[0];
      insights.push({
        id: 'category-performance',
        type: 'info',
        title: 'Most Popular Category',
        description: `${topCategory.category} has the most courses (${topCategory.count} courses)`,
        recommendation: 'Focus marketing efforts on popular categories while exploring underrepresented areas',
        confidence: 0.88,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Revenue opportunity analysis
    const freeCourses = coursesData.filter(c => c.isFree && c.enrollmentCount > 100);
    if (freeCourses.length > 0) {
      insights.push({
        id: 'monetization-opportunity',
        type: 'info',
        title: 'Monetization Opportunities',
        description: `${freeCourses.length} free courses have high enrollment and could generate revenue`,
        recommendation: 'Consider creating premium versions or follow-up paid courses for popular free content',
        confidence: 0.85,
        priority: 'low',
        actionable: true
      });
    }
    
    // Content freshness analysis
    const oldCourses = coursesData.filter(c => {
      const courseDate = new Date(c.updatedAt);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return courseDate < sixMonthsAgo;
    });
    
    if (oldCourses.length > 0) {
      insights.push({
        id: 'content-freshness',
        type: 'warning',
        title: 'Content Updates Needed',
        description: `${oldCourses.length} courses haven't been updated in 6+ months`,
        recommendation: 'Review and update older content to maintain relevance and accuracy',
        confidence: 0.78,
        priority: 'low',
        actionable: true
      });
    }
    
    setAiInsights(insights.slice(0, 5));
  }, [stats.coursesByCategory]);

  // Event handlers
  const handleCreateCourse = () => {
    router.push('/admin/education/courses/new');
  };

  const handleEditCourse = (course: Course) => {
    router.push(`/admin/education/courses/${course.id}/edit`);
  };

  const handleViewCourse = (course: Course) => {
    window.open(`/courses/${course.id}`, '_blank');
  };

  const handleDuplicateCourse = async (course: Course) => {
    const { id, createdAt, updatedAt, enrollmentCount, completionRate, averageRating, reviewCount, ...courseData } = course;
    const duplicatedCourse = {
      ...courseData,
      title: `${course.title} (Copy)`,
      status: 'draft' as const,
      enrollmentCount: 0,
      completionRate: 0,
      averageRating: 0,
      reviewCount: 0
    };

    try {
      const newCourseId = await educationService.createCourse(duplicatedCourse);
      if (!newCourseId) {
        setError("Failed to duplicate course");
      }
    } catch (err) {
      setError("Failed to duplicate course");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      const success = await educationService.deleteCourse(courseId);
      if (!success) {
        setError("Failed to delete course");
      }
    }
  };

  const handleBulkAction = async (action: string, courseIds: string[]) => {
    try {
      switch (action) {
        case "publish":
          await Promise.all(courseIds.map(id => educationService.updateCourse(id, { status: 'published' })));
          break;
        case "draft":
          await Promise.all(courseIds.map(id => educationService.updateCourse(id, { status: 'draft' })));
          break;
        case "archive":
          await Promise.all(courseIds.map(id => educationService.updateCourse(id, { status: 'archived' })));
          break;
        case "delete":
          if (confirm(`Are you sure you want to delete ${courseIds.length} course(s)? This action cannot be undone.`)) {
            await Promise.all(courseIds.map(id => educationService.deleteCourse(id)));
          }
          break;
        case "export":
          handleExportCourses(courseIds);
          break;
      }
      setSelectedCourses([]);
    } catch (err) {
      setError(`Failed to perform bulk action: ${action}`);
    }
  };

  const handleExportCourses = (courseIds?: string[]) => {
    const coursesToExport = courseIds 
      ? courses.filter(c => courseIds.includes(c.id))
      : filteredCourses;
      
    const csv = [
      ["ID", "Title", "Category", "Level", "Status", "Enrollments", "Completion Rate", "Rating", "Revenue", "Created"].join(","),
      ...coursesToExport.map(course => [
        course.id,
        `"${course.title}"`,
        course.category,
        course.level,
        course.status,
        course.enrollmentCount,
        `${course.completionRate}%`,
        course.averageRating.toFixed(1),
        `$${(course.price * course.enrollmentCount).toFixed(2)}`,
        new Date(course.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `education-courses-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = filterCategory === "all" || course.category === filterCategory;
      const matchesLevel = filterLevel === "all" || course.level === filterLevel;
      const matchesStatus = filterStatus === "all" || course.status === filterStatus;
      
      const matchesPrice = filterPrice === "all" ||
                         (filterPrice === "free" && course.isFree) ||
                         (filterPrice === "paid" && !course.isFree);
      
      let matchesDateRange = true;
      if (dateRange !== "all") {
        const courseDate = new Date(course.createdAt);
        const now = new Date();
        
        switch (dateRange) {
          case "this_month":
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchesDateRange = courseDate >= thisMonth;
            break;
          case "last_3_months":
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            matchesDateRange = courseDate >= threeMonthsAgo;
            break;
          case "this_year":
            const thisYear = new Date(now.getFullYear(), 0, 1);
            matchesDateRange = courseDate >= thisYear;
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesLevel && matchesStatus && matchesPrice && matchesDateRange;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "enrollments":
          return b.enrollmentCount - a.enrollmentCount;
        case "rating":
          return b.averageRating - a.averageRating;
        case "completion":
          return b.completionRate - a.completionRate;
        case "revenue":
          return (b.price * b.enrollmentCount) - (a.price * a.enrollmentCount);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, filterCategory, filterLevel, filterStatus, filterPrice, dateRange, sortBy]);

  // Get unique categories for filter options
  const categories = Array.from(new Set(courses.map(c => c.category)));

  // Component configuration
  const headerActions = [
    {
      label: "AI Education Insights",
      icon: <FiCpu />,
      onClick: () => console.log('AI insights'),
      variant: "ai" as const
    },
    {
      label: "Export Courses",
      icon: <FiDownload />,
      onClick: () => handleExportCourses(),
      variant: "secondary" as const
    },
    {
      label: "Import Courses",
      icon: <FiUpload />,
      onClick: () => console.log('Import courses'),
      variant: "secondary" as const
    },
    {
      label: "Create Course",
      icon: <FiPlus />,
      onClick: handleCreateCourse,
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: <FiBook />,
      color: "primary" as const,
      change: { value: stats.coursesThisMonth, type: "increase" as const, period: "this month" },
      description: "All courses in catalog"
    },
    {
      label: "Published Courses",
      value: stats.publishedCourses,
      icon: <FiCheckCircle />,
      color: "success" as const,
      change: { value: 8, type: "increase" as const, period: "this month" },
      description: "Live and available"
    },
    {
      label: "Total Enrollments",
      value: stats.totalEnrollments.toLocaleString(),
      icon: <FiUsers />,
      color: "info" as const,
      change: { value: 24, type: "increase" as const, period: "this month" },
      description: "Student registrations"
    },
    {
      label: "Completion Rate",
      value: `${stats.averageCompletionRate.toFixed(1)}%`,
      icon: <FiTarget />,
      color: "success" as const,
      change: { value: 3.2, type: "increase" as const, period: "last month" },
      description: "Average across all courses"
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "warning" as const,
      change: { value: 18.5, type: "increase" as const, period: "this month" },
      description: "From course sales"
    },
    {
      label: "Certificates Issued",
      value: stats.certificatesIssued,
      icon: <FiAward />,
      color: "secondary" as const,
      change: { value: 12, type: "increase" as const, period: "this month" },
      description: "Course completions"
    },
    {
      label: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: <FiStar />,
      color: "warning" as const,
      change: { value: 0.2, type: "increase" as const, period: "last quarter" },
      description: "Course quality score"
    },
    {
      label: "Categories",
      value: Object.keys(stats.coursesByCategory).length,
              icon: <FiBarChart2 />,
      color: "info" as const,
      description: "Different course topics"
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
      key: "level",
      label: "Level",
      type: "select" as const,
      options: [
        { label: "All Levels", value: "all" },
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
        { label: "Expert", value: "expert" }
      ]
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All Status", value: "all" },
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" }
      ]
    },
    {
      key: "price",
      label: "Price",
      type: "select" as const,
      options: [
        { label: "All Courses", value: "all" },
        { label: "Free Only", value: "free" },
        { label: "Paid Only", value: "paid" }
      ]
    },
    {
      key: "dateRange",
      label: "Date Range",
      type: "select" as const,
      options: [
        { label: "All Time", value: "all" },
        { label: "This Month", value: "this_month" },
        { label: "Last 3 Months", value: "last_3_months" },
        { label: "This Year", value: "this_year" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Created Date", value: "createdAt" },
        { label: "Title", value: "title" },
        { label: "Enrollments", value: "enrollments" },
        { label: "Rating", value: "rating" },
        { label: "Completion Rate", value: "completion" },
        { label: "Revenue", value: "revenue" }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: { bg: "rgba(107, 114, 128, 0.2)", color: "#6b7280" },
      published: { bg: "rgba(16, 185, 129, 0.2)", color: "#10b981" },
      archived: { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }
    };
    
    const statusColors = colors[status as keyof typeof colors] || colors.draft;
    
    return (
      <span style={{
        padding: "0.25rem 0.75rem",
        borderRadius: "6px",
        background: statusColors.bg,
        color: statusColors.color,
        fontSize: "0.75rem",
        fontWeight: "500",
        textTransform: "capitalize"
      }}>
        {status}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: "#10b981",
      intermediate: "#3b82f6",
      advanced: "#f59e0b",
      expert: "#ef4444"
    };
    
    const color = colors[level as keyof typeof colors] || "#6b7280";
    
    return (
      <span style={{
        padding: "0.25rem 0.5rem",
        borderRadius: "4px",
        background: `${color}20`,
        color: color,
        fontSize: "0.7rem",
        textTransform: "capitalize"
      }}>
        {level}
      </span>
    );
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const tableColumns = [
    {
      key: "title",
      label: "Course",
      sortable: true,
      render: (value: any, row: Course) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {row.thumbnail ? (
            <img
              src={row.thumbnail}
              alt={row.title}
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
              background: "linear-gradient(135deg, var(--colorPrimary), var(--colorSecondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FiBook size={20} color="white" />
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
              {row.title}
            </strong>
            <small style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.8rem"
            }}>
              {row.category} • {formatDuration(row.duration)}
            </small>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              {getStatusBadge(row.status)}
              {getLevelBadge(row.level)}
              {row.isFree && (
                <span style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10b981",
                  fontSize: "0.7rem"
                }}>
                  Free
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      key: "instructor",
      label: "Instructor",
      render: (instructor: Course['instructor']) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {instructor.avatar ? (
            <img
              src={instructor.avatar}
              alt={instructor.name}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          ) : (
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FiUser size={16} color="rgba(255, 255, 255, 0.6)" />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.85rem" }}>
              {instructor.name}
            </span>
            <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
              {instructor.title}
            </small>
          </div>
        </div>
      )
    },
    {
      key: "enrollmentCount",
      label: "Performance",
      sortable: true,
      render: (enrollments: number, row: Course) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiUsers size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {enrollments} students
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiTarget size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {row.completionRate.toFixed(1)}% completion
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiStar size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {row.averageRating.toFixed(1)} ({row.reviewCount})
            </span>
          </div>
          {!row.isFree && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiDollarSign size={12} />
              <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
                ${(row.price * enrollments).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: "price",
      label: "Pricing",
      sortable: true,
      render: (price: number, row: Course) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ 
            color: row.isFree ? "#10b981" : "rgba(255, 255, 255, 0.9)", 
            fontWeight: "600",
            fontSize: "0.9rem"
          }}>
            {row.isFree ? "Free" : `$${price}`}
          </span>
          <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
            {row.lessons.length} lessons
          </small>
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: "View Course",
      icon: <FiEye />,
      onClick: (course: Course) => handleViewCourse(course),
      variant: "secondary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (course: Course) => handleEditCourse(course),
      variant: "primary" as const
    },
    {
      label: "Duplicate",
      icon: <FiCopy />,
      onClick: (course: Course) => handleDuplicateCourse(course),
      variant: "secondary" as const
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (course: Course) => handleDeleteCourse(course.id),
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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading courses...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader
        title="Education Management"
        subtitle="Create and manage educational courses, track student progress, and deliver world-class learning experiences"
        actions={headerActions}
        breadcrumb={["Admin", "Education"]}
      />

      <AdminStats stats={statsData} columns={6} />

      {/* AI Insights Panel */}
      {aiInsights.length > 0 && (
        <AdminCard variant="gradient" padding="large">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <FiCpu style={{ color: "var(--colorPrimary)" }} size={24} />
            <h3 style={{ color: "rgba(255, 255, 255, 0.95)", margin: 0 }}>AI Education Insights</h3>
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
          level: filterLevel,
          status: filterStatus,
          price: filterPrice,
          dateRange: dateRange,
          sortBy: sortBy
        }}
        onFilterChange={(key, value) => {
          switch (key) {
            case 'category': setFilterCategory(value); break;
            case 'level': setFilterLevel(value); break;
            case 'status': setFilterStatus(value); break;
            case 'price': setFilterPrice(value); break;
            case 'dateRange': setDateRange(value); break;
            case 'sortBy': setSortBy(value); break;
          }
        }}
        onClearFilters={() => {
          setFilterCategory('all');
          setFilterLevel('all');
          setFilterStatus('all');
          setFilterPrice('all');
          setDateRange('all');
          setSortBy('createdAt');
        }}
        placeholder="Search courses by title, description, category, instructor, or tags..."
        aiSuggestions={[
          "High-performing skincare courses",
          "Beginner beauty training modules",
          "Advanced aesthetic procedures",
          "Free introductory courses",
          "Most enrolled dermatology courses"
        ]}
      />

      {/* Bulk Actions */}
      {selectedCourses.length > 0 && (
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
              {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleBulkAction('publish', selectedCourses)}
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
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('draft', selectedCourses)}
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
                Draft
              </button>
              <button
                onClick={() => handleBulkAction('export', selectedCourses)}
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
                Export
              </button>
              <button
                onClick={() => handleBulkAction('delete', selectedCourses)}
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
        data={filteredCourses}
        actions={tableActions}
        selectable={true}
        selectedRows={selectedCourses}
        onRowSelect={setSelectedCourses}
        loading={loading}
        emptyMessage="No courses found. Create your first course to start building your educational catalog!"
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