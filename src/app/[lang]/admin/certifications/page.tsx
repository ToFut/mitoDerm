"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAward,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDownload,
  FiUpload,
  FiPlus,
  FiEdit,
  FiEye,
  FiTrash2,
  FiStar,
  FiCpu,
  FiTrendingUp,
  FiActivity,
  FiBarChart2,
  FiTarget,
  FiAlertCircle,
  FiRefreshCw,
  FiFilter,
  FiMoreHorizontal,
  FiFileText,
  FiMail,
  FiLink,
  FiShield
} from "react-icons/fi";
import { Certificate } from "@/types";
import { certificationService } from "@/lib/services/certificationService";
import {
  AdminPageContainer,
  AdminHeader,
  AdminStats,
  AdminFilters,
  AdminTable,
  AdminCard
} from "@/components/admin/shared";

interface CertificationStats {
  totalCertificates: number;
  activeCertificates: number;
  pendingCertificates: number;
  expiredCertificates: number;
  certificatesByType: Record<string, number>;
  certificatesByLevel: Record<string, number>;
  monthlyIssuance: number;
  averageProcessingTime: number;
  completionRate: number;
  renewalRate: number;
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

export default function AdminCertificationsPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("issuedDate");
  
  // Statistics and AI
  const [stats, setStats] = useState<CertificationStats>({
    totalCertificates: 0,
    activeCertificates: 0,
    pendingCertificates: 0,
    expiredCertificates: 0,
    certificatesByType: {},
    certificatesByLevel: {},
    monthlyIssuance: 0,
    averageProcessingTime: 0,
    completionRate: 0,
    renewalRate: 0
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
    const unsubscribe = certificationService.subscribeToCertificates((certificatesData) => {
      setCertificates(certificatesData);
      setLoading(false);
      calculateStats(certificatesData);
      generateAIInsights(certificatesData);
    });

    return () => unsubscribe();
  }, []);

  // Calculate comprehensive statistics
  const calculateStats = useCallback((certificatesData: Certificate[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const activeCertificates = certificatesData.filter(c => c.status === 'active').length;
    const expiredCertificates = certificatesData.filter(c => c.status === 'expired').length;
    const monthlyIssuance = certificatesData.filter(c => new Date(c.issuedDate) >= thisMonth).length;
    
    // Certificate type breakdown
    const certificatesByType = certificatesData.reduce((acc, cert) => {
      acc[cert.type] = (acc[cert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Certificate level breakdown (if available in metadata)
    const certificatesByLevel = certificatesData.reduce((acc, cert) => {
      const level = cert.metadata?.level || 'basic';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setStats({
      totalCertificates: certificatesData.length,
      activeCertificates,
      pendingCertificates: 0, // Would need additional status
      expiredCertificates,
      certificatesByType,
      certificatesByLevel,
      monthlyIssuance,
      averageProcessingTime: 2.5, // Mock data - would calculate from actual processing times
      completionRate: 87.5, // Mock data - would calculate from course completions
      renewalRate: 65.2 // Mock data - would calculate from renewal data
    });
  }, []);

  // Advanced AI insights generation
  const generateAIInsights = useCallback((certificatesData: Certificate[]) => {
    const insights: AIInsight[] = [];
    const now = new Date();
    
    // Expiration analysis
    const soonToExpire = certificatesData.filter(c => {
      if (!c.expiryDate) return false;
      const expiryDate = new Date(c.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });
    
    if (soonToExpire.length > 0) {
      insights.push({
        id: 'expiration-alert',
        type: 'warning',
        title: 'Certificates Expiring Soon',
        description: `${soonToExpire.length} certificates will expire within 30 days`,
        recommendation: 'Send renewal reminders to certificate holders and prepare renewal campaigns',
        confidence: 0.98,
        priority: 'high',
        actionable: true
      });
    }
    
    // Issuance trends
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthIssuance = certificatesData.filter(c => new Date(c.issuedDate) >= new Date(now.getFullYear(), now.getMonth(), 1)).length;
    const lastMonthIssuance = certificatesData.filter(c => {
      const issueDate = new Date(c.issuedDate);
      return issueDate >= lastMonth && issueDate < new Date(now.getFullYear(), now.getMonth(), 1);
    }).length;
    
    if (thisMonthIssuance > lastMonthIssuance * 1.2) {
      insights.push({
        id: 'issuance-growth',
        type: 'success',
        title: 'Certificate Issuance Surge',
        description: `${Math.round(((thisMonthIssuance - lastMonthIssuance) / lastMonthIssuance) * 100)}% increase in certificates issued this month`,
        recommendation: 'Consider scaling certification programs and prepare for increased demand',
        confidence: 0.92,
        priority: 'medium',
        actionable: true
      });
    }
    
    // Type distribution insights
    const typeEntries = Object.entries(stats.certificatesByType);
    if (typeEntries.length > 0) {
      const mostPopularType = typeEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      insights.push({
        id: 'popular-certification',
        type: 'info',
        title: 'Most Popular Certification Type',
        description: `${mostPopularType[0]} certifications account for ${Math.round((mostPopularType[1] / certificatesData.length) * 100)}% of all certificates`,
        recommendation: `Expand ${mostPopularType[0]} program offerings and create advanced levels`,
        confidence: 0.88,
        priority: 'medium',
        actionable: true
      });
    }
    
    setAiInsights(insights.slice(0, 5));
  }, [stats.certificatesByType]);

  // Event handlers
  const handleCreateCertificate = () => {
    router.push('/admin/certifications/new');
  };

  const handleEditCertificate = (certificate: Certificate) => {
    router.push(`/admin/certifications/${certificate.id}/edit`);
  };

  const handleViewCertificate = (certificate: Certificate) => {
    window.open(certificate.verificationUrl, '_blank');
  };

  const handleRevokeCertificate = async (certificateId: string) => {
    if (confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) {
      const success = await certificationService.revokeCertificate(certificateId);
      if (!success) {
        setError("Failed to revoke certificate");
      }
    }
  };

  const handleReissueCertificate = async (certificate: Certificate) => {
    try {
      const newCertificateId = await certificationService.reissueCertificate(certificate.id);
      if (!newCertificateId) {
        setError("Failed to reissue certificate");
      }
    } catch (err) {
      setError("Failed to reissue certificate");
    }
  };

  const handleBulkAction = async (action: string, certificateIds: string[]) => {
    try {
      switch (action) {
        case "revoke":
          if (confirm(`Are you sure you want to revoke ${certificateIds.length} certificate(s)? This action cannot be undone.`)) {
            await Promise.all(certificateIds.map(id => certificationService.revokeCertificate(id)));
          }
          break;
        case "send_reminder":
          await Promise.all(certificateIds.map(id => certificationService.sendRenewalReminder(id)));
          break;
        case "export":
          handleExportCertificates(certificateIds);
          break;
      }
      setSelectedCertificates([]);
    } catch (err) {
      setError(`Failed to perform bulk action: ${action}`);
    }
  };

  const handleExportCertificates = (certificateIds?: string[]) => {
    const certsToExport = certificateIds 
      ? certificates.filter(c => certificateIds.includes(c.id))
      : filteredCertificates;
      
    const csv = [
      ["ID", "User ID", "Type", "Title", "Status", "Issued Date", "Expiry Date", "Verification URL"].join(","),
      ...certsToExport.map(cert => [
        cert.id,
        cert.userId,
        cert.type,
        `"${cert.title}"`,
        cert.status,
        cert.issuedDate,
        cert.expiryDate || 'No expiry',
        cert.verificationUrl
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificates-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter and sort certificates
  const filteredCertificates = useMemo(() => {
    let filtered = certificates.filter(certificate => {
      const matchesSearch = certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           certificate.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           certificate.credentialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           certificate.issuerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "all" || certificate.type === filterType;
      const matchesStatus = filterStatus === "all" || certificate.status === filterStatus;
      
      const matchesLevel = filterLevel === "all" || 
                         (certificate.metadata?.level && certificate.metadata.level === filterLevel);
      
      let matchesDateRange = true;
      if (dateRange !== "all") {
        const issueDate = new Date(certificate.issuedDate);
        const now = new Date();
        
        switch (dateRange) {
          case "this_month":
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchesDateRange = issueDate >= thisMonth;
            break;
          case "last_3_months":
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            matchesDateRange = issueDate >= threeMonthsAgo;
            break;
          case "this_year":
            const thisYear = new Date(now.getFullYear(), 0, 1);
            matchesDateRange = issueDate >= thisYear;
            break;
          case "expired":
            if (certificate.expiryDate) {
              matchesDateRange = new Date(certificate.expiryDate) < now;
            } else {
              matchesDateRange = false;
            }
            break;
        }
      }
      
      return matchesSearch && matchesType && matchesStatus && matchesLevel && matchesDateRange;
    });

    // Sort certificates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "issuedDate":
          return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime();
        case "expiryDate":
          if (!a.expiryDate && !b.expiryDate) return 0;
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [certificates, searchTerm, filterType, filterStatus, filterLevel, dateRange, sortBy]);


  // Component configuration
  const headerActions = [
    {
      label: "AI Certification Insights",
      icon: <FiCpu />,
      onClick: () => console.log('AI insights'),
      variant: "ai" as const
    },
    {
      label: "Export Certificates",
      icon: <FiDownload />,
      onClick: () => handleExportCertificates(),
      variant: "secondary" as const
    },
    {
      label: "Bulk Import",
      icon: <FiUpload />,
      onClick: () => console.log('Bulk import'),
      variant: "secondary" as const
    },
    {
      label: "Issue Certificate",
      icon: <FiPlus />,
      onClick: handleCreateCertificate,
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Total Certificates",
      value: stats.totalCertificates,
      icon: <FiAward />,
      color: "primary" as const,
      change: { value: 12, type: "increase" as const, period: "this month" },
      description: "All certificates issued"
    },
    {
      label: "Active Certificates",
      value: stats.activeCertificates,
      icon: <FiCheckCircle />,
      color: "success" as const,
      change: { value: 8, type: "increase" as const, period: "this month" },
      description: "Currently valid"
    },
    {
      label: "Monthly Issuance",
      value: stats.monthlyIssuance,
      icon: <FiCalendar />,
      color: "info" as const,
      change: { value: 15, type: "increase" as const, period: "vs last month" },
      description: "Certificates issued this month"
    },
    {
      label: "Expired Certificates",
      value: stats.expiredCertificates,
      icon: <FiXCircle />,
      color: "danger" as const,
      change: { value: 3, type: "increase" as const, period: "this month" },
      description: "Need renewal attention"
    },
    {
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: <FiTarget />,
      color: "success" as const,
      change: { value: 2.1, type: "increase" as const, period: "this quarter" },
      description: "Course to certificate rate"
    },
    {
      label: "Renewal Rate",
      value: `${stats.renewalRate}%`,
      icon: <FiRefreshCw />,
      color: "warning" as const,
      change: { value: 1.8, type: "decrease" as const, period: "this quarter" },
      description: "Certificate renewals"
    },
    {
      label: "Processing Time",
      value: `${stats.averageProcessingTime} days`,
      icon: <FiClock />,
      color: "info" as const,
      change: { value: 0.3, type: "decrease" as const, period: "this month" },
      description: "Average issuance time"
    },
    {
      label: "Certificate Types",
      value: Object.keys(stats.certificatesByType).length,
      icon: <FiBarChart2 />,
      color: "secondary" as const,
      description: "Different certification programs"
    }
  ];

  const filterConfigs = [
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { label: "All Types", value: "all" },
        { label: "Course Certificate", value: "course" },
        { label: "Event Certificate", value: "event" },
        { label: "Professional Certification", value: "certification" }
      ]
    },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All Status", value: "all" },
        { label: "Active", value: "active" },
        { label: "Expired", value: "expired" },
        { label: "Revoked", value: "revoked" }
      ]
    },
    {
      key: "level",
      label: "Level",
      type: "select" as const,
      options: [
        { label: "All Levels", value: "all" },
        { label: "Basic", value: "basic" },
        { label: "Advanced", value: "advanced" },
        { label: "Expert", value: "expert" }
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
        { label: "This Year", value: "this_year" },
        { label: "Expired Only", value: "expired" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Issue Date", value: "issuedDate" },
        { label: "Title", value: "title" },
        { label: "Expiry Date", value: "expiryDate" },
        { label: "Status", value: "status" },
        { label: "Type", value: "type" }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      active: { bg: "rgba(16, 185, 129, 0.2)", color: "#10b981" },
      expired: { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444" },
      revoked: { bg: "rgba(107, 114, 128, 0.2)", color: "#6b7280" }
    };
    
    const statusColors = colors[status as keyof typeof colors] || colors.active;
    
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tableColumns = [
    {
      key: "title",
      label: "Certificate",
      sortable: true,
      render: (value: any, row: Certificate) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, var(--colorPrimary), var(--colorSecondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <FiAward size={20} color="white" />
          </div>
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
              ID: {row.credentialId}
            </small>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              {getStatusBadge(row.status)}
              <span style={{
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                background: "rgba(59, 130, 246, 0.2)",
                color: "#3b82f6",
                fontSize: "0.7rem",
                textTransform: "capitalize"
              }}>
                {row.type}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: "userId",
      label: "Holder",
      sortable: true,
      render: (userId: string) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.85rem" }}>
            User: {userId}
          </span>
          <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
            Click to view profile
          </small>
        </div>
      )
    },
    {
      key: "issuedDate",
      label: "Issued / Expires",
      sortable: true,
      render: (issuedDate: string, row: Certificate) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.85rem" }}>
            Issued: {formatDate(issuedDate)}
          </span>
          {row.expiryDate ? (
            <small style={{
              color: new Date(row.expiryDate) < new Date() ? "#ef4444" : "rgba(255, 255, 255, 0.6)",
              fontSize: "0.75rem"
            }}>
              Expires: {formatDate(row.expiryDate)}
            </small>
          ) : (
            <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
              No expiry
            </small>
          )}
        </div>
      )
    },
    {
      key: "issuerName",
      label: "Issuer & Verification",
      render: (issuerName: string, row: Certificate) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.85rem" }}>
            {issuerName}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiShield size={12} color="var(--colorPrimary)" />
            <button
              onClick={() => window.open(row.verificationUrl, '_blank')}
              style={{
                background: "none",
                border: "none",
                color: "var(--colorPrimary)",
                fontSize: "0.75rem",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Verify Certificate
            </button>
          </div>
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: "View Certificate",
      icon: <FiEye />,
      onClick: (certificate: Certificate) => handleViewCertificate(certificate),
      variant: "secondary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (certificate: Certificate) => handleEditCertificate(certificate),
      variant: "primary" as const
    },
    {
      label: "Reissue",
      icon: <FiRefreshCw />,
      onClick: (certificate: Certificate) => handleReissueCertificate(certificate),
      variant: "secondary" as const
    },
    {
      label: "Revoke",
      icon: <FiTrash2 />,
      onClick: (certificate: Certificate) => handleRevokeCertificate(certificate.id),
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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading certificates...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader
        title="Certification Management"
        subtitle="Manage professional certifications, track completions, and ensure quality standards with comprehensive analytics"
        actions={headerActions}
        breadcrumb={["Admin", "Certifications"]}
      />

      <AdminStats stats={statsData} columns={6} />

      {/* AI Insights Panel */}
      {aiInsights.length > 0 && (
        <AdminCard variant="gradient" padding="large">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <FiCpu style={{ color: "var(--colorPrimary)" }} size={24} />
            <h3 style={{ color: "rgba(255, 255, 255, 0.95)", margin: 0 }}>AI Certification Insights</h3>
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
          status: filterStatus,
          level: filterLevel,
          dateRange: dateRange,
          sortBy: sortBy
        }}
        onFilterChange={(key, value) => {
          switch (key) {
            case 'type': setFilterType(value); break;
            case 'status': setFilterStatus(value); break;
            case 'level': setFilterLevel(value); break;
            case 'dateRange': setDateRange(value); break;
            case 'sortBy': setSortBy(value); break;
          }
        }}
        onClearFilters={() => {
          setFilterType('all');
          setFilterStatus('all');
          setFilterLevel('all');
          setDateRange('all');
          setSortBy('issuedDate');
        }}
        placeholder="Search certificates by title, user ID, credential ID, or issuer..."
        aiSuggestions={[
          "Expiring certificates this month",
          "Advanced level certifications",
          "Course completion certificates",
          "Recently issued certificates",
          "Professional beauty certifications"
        ]}
      />

      {/* Bulk Actions */}
      {selectedCertificates.length > 0 && (
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
              {selectedCertificates.length} certificate{selectedCertificates.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleBulkAction('send_reminder', selectedCertificates)}
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
                Send Reminders
              </button>
              <button
                onClick={() => handleBulkAction('export', selectedCertificates)}
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
                Export Selected
              </button>
              <button
                onClick={() => handleBulkAction('revoke', selectedCertificates)}
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
                Revoke
              </button>
            </div>
          </div>
        </AdminCard>
      )}

      <AdminTable
        columns={tableColumns}
        data={filteredCertificates}
        actions={tableActions}
        selectable={true}
        selectedRows={selectedCertificates}
        onRowSelect={setSelectedCertificates}
        loading={loading}
        emptyMessage="No certificates found. Start issuing certificates to professionals!"
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