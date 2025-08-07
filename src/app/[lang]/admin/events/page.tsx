"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiDownload,
  FiZap,
  FiActivity,
  FiTrendingUp,
  FiBarChart2,
  FiPlay,
  FiPause,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiStar,
  FiShare2,
  FiCopy,
  FiExternalLink,
  FiMoreHorizontal
} from "react-icons/fi";
import { eventService } from "@/lib/services/eventService";
import { 
  AdminPageContainer, 
  AdminHeader, 
  AdminStats, 
  AdminFilters, 
  AdminTable, 
  AdminCard 
} from "@/components/admin/shared";
import { Event } from "@/types";

type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
type EventType = 'conference' | 'workshop' | 'webinar' | 'product_launch' | 'training' | 'networking';

export default function AdminEventsPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  
  // State Management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("startDate");
  
  // Statistics
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    averageAttendance: 0,
    eventsByStatus: {} as Record<string, number>,
    eventsByType: {} as Record<string, number>,
  });

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

  // Real-time data fetching
  useEffect(() => {
    const unsubscribe = eventService.subscribeToEvents((eventsData) => {
      setEvents(eventsData);
      setLoading(false);
      calculateStats(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // Calculate statistics
  const calculateStats = useCallback((eventsData: Event[]) => {
    const now = new Date();
    const upcoming = eventsData.filter(e => new Date(e.startDate) > now);
    const totalRegistrations = eventsData.reduce((sum, e) => sum + e.registeredCount, 0);
    const totalRevenue = eventsData.reduce((sum, e) => sum + e.analytics.revenue, 0);
    const completedEvents = eventsData.filter(e => e.status === 'completed');
    const averageAttendance = completedEvents.length > 0 
      ? completedEvents.reduce((sum, e) => sum + e.analytics.attendance, 0) / completedEvents.length
      : 0;

    const eventsByStatus = eventsData.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByType = eventsData.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      totalEvents: eventsData.length,
      upcomingEvents: upcoming.length,
      totalRegistrations,
      totalRevenue,
      averageAttendance,
      eventsByStatus,
      eventsByType,
    });
  }, []);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === "all" || event.status === filterStatus;
      const matchesType = filterType === "all" || event.type === filterType;
      
      let matchesDateRange = true;
      if (dateRange !== "all") {
        const eventDate = new Date(event.startDate);
        const now = new Date();
        
        switch (dateRange) {
          case "upcoming":
            matchesDateRange = eventDate > now;
            break;
          case "this_week":
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            matchesDateRange = eventDate >= now && eventDate <= weekFromNow;
            break;
          case "this_month":
            const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            matchesDateRange = eventDate >= now && eventDate <= monthFromNow;
            break;
          case "past":
            matchesDateRange = eventDate < now;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDateRange;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "startDate":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "registrations":
          return b.registeredCount - a.registeredCount;
        case "revenue":
          return b.analytics.revenue - a.analytics.revenue;
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, filterStatus, filterType, dateRange, sortBy]);

  // Event handlers
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsCreating(true);
    setShowEventModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsCreating(false);
    setShowEventModal(true);
  };

  const handleViewEvent = (event: Event) => {
    router.push(`/events/${event.id}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      const success = await eventService.deleteEvent(eventId);
      if (!success) {
        setError("Failed to delete event");
      }
    }
  };

  const handleDuplicateEvent = async (event: Event) => {
    const { id, createdAt, updatedAt, analytics, registeredCount, waitlistCount, ...eventData } = event;
    const duplicatedEvent = {
      ...eventData,
      title: `${event.title} (Copy)`,
      status: 'draft' as EventStatus,
      registeredCount: 0,
      waitlistCount: 0,
      analytics: {
        views: 0,
        registrations: 0,
        attendance: 0,
        completionRate: 0,
        averageRating: 0,
        revenue: 0
      }
    };

    const newEventId = await eventService.createEvent(duplicatedEvent);
    if (!newEventId) {
      setError("Failed to duplicate event");
    }
  };

  const handleBulkAction = async (action: string, eventIds: string[]) => {
    try {
      switch (action) {
        case "publish":
          await Promise.all(eventIds.map(id => eventService.updateEvent(id, { status: 'published' })));
          break;
        case "unpublish":
          await Promise.all(eventIds.map(id => eventService.updateEvent(id, { status: 'draft' })));
          break;
        case "cancel":
          await Promise.all(eventIds.map(id => eventService.updateEvent(id, { status: 'cancelled' })));
          break;
        case "delete":
          if (confirm(`Are you sure you want to delete ${eventIds.length} event(s)? This action cannot be undone.`)) {
            await Promise.all(eventIds.map(id => eventService.deleteEvent(id)));
          }
          break;
      }
      setSelectedEvents([]);
    } catch (err) {
      setError(`Failed to perform bulk action: ${action}`);
    }
  };

  const handleExportEvents = () => {
    const csv = [
      ["Title", "Type", "Status", "Start Date", "Registrations", "Revenue", "Location"].join(","),
      ...filteredEvents.map(event => [
        `"${event.title}"`,
        event.type,
        event.status,
        event.startDate,
        event.registeredCount,
        event.analytics.revenue,
        `"${event.location.venue || event.location.virtualLink || 'TBD'}"`
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `events-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Component configuration
  const headerActions = [
    {
      label: "AI Insights",
      icon: <FiZap />,
      onClick: () => console.log('AI insights'),
      variant: "ai" as const
    },
    {
      label: "Export Events",
      icon: <FiDownload />,
      onClick: handleExportEvents,
      variant: "secondary" as const
    },
    {
      label: "Create Event",
      icon: <FiPlus />,
      onClick: handleCreateEvent,
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Total Events",
      value: stats.totalEvents,
      icon: <FiCalendar />,
      color: "primary" as const,
      change: { value: 15, type: "increase" as const, period: "last month" },
      description: "All events created"
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: <FiClock />,
      color: "info" as const,
      change: { value: 8, type: "increase" as const, period: "this week" },
      description: "Events scheduled ahead"
    },
    {
      label: "Total Registrations",
      value: stats.totalRegistrations,
      icon: <FiUsers />,
      color: "success" as const,
      change: { value: 23, type: "increase" as const, period: "last month" },
      description: "Total attendees registered"
    },
    {
      label: "Revenue Generated",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "warning" as const,
      change: { value: 31, type: "increase" as const, period: "last month" },
      description: "From paid events"
    },
    {
      label: "Average Attendance",
      value: `${stats.averageAttendance.toFixed(1)}%`,
      icon: <FiActivity />,
      color: "secondary" as const,
      change: { value: 5, type: "increase" as const, period: "last quarter" },
      description: "Show-up rate"
    },
    {
      label: "Event Types",
      value: Object.keys(stats.eventsByType).length,
              icon: <FiBarChart2 />,
      color: "info" as const,
      description: "Different event categories"
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
        { label: "Published", value: "published" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Completed", value: "completed" }
      ]
    },
    {
      key: "type",
      label: "Type",
      type: "select" as const,
      options: [
        { label: "All Types", value: "all" },
        { label: "Conference", value: "conference" },
        { label: "Workshop", value: "workshop" },
        { label: "Webinar", value: "webinar" },
        { label: "Product Launch", value: "product_launch" },
        { label: "Training", value: "training" },
        { label: "Networking", value: "networking" }
      ]
    },
    {
      key: "dateRange",
      label: "Date Range",
      type: "select" as const,
      options: [
        { label: "All Dates", value: "all" },
        { label: "Upcoming", value: "upcoming" },
        { label: "This Week", value: "this_week" },
        { label: "This Month", value: "this_month" },
        { label: "Past Events", value: "past" }
      ]
    },
    {
      key: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Start Date", value: "startDate" },
        { label: "Title", value: "title" },
        { label: "Registrations", value: "registrations" },
        { label: "Revenue", value: "revenue" },
        { label: "Created Date", value: "createdAt" }
      ]
    }
  ];

  const getStatusBadge = (status: EventStatus) => {
    const colors = {
      draft: { bg: "rgba(107, 114, 128, 0.2)", color: "#6b7280" },
      published: { bg: "rgba(16, 185, 129, 0.2)", color: "#10b981" },
      cancelled: { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444" },
      completed: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" }
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

  const getTypeBadge = (type: EventType) => {
    return (
      <span style={{
        padding: "0.25rem 0.5rem",
        borderRadius: "4px",
        background: "rgba(190, 128, 12, 0.2)",
        color: "var(--colorPrimary)",
        fontSize: "0.7rem",
        textTransform: "capitalize"
      }}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tableColumns = [
    { 
      key: "title", 
      label: "Event", 
      sortable: true, 
      render: (value: any, row: Event) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {row.images?.[0] && (
            <img 
              src={row.images[0]} 
              alt={row.title}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                objectFit: "cover"
              }}
            />
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
            {row.shortDescription && (
              <small style={{ 
                color: "rgba(255, 255, 255, 0.6)", 
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px"
              }}>
                {row.shortDescription}
              </small>
            )}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              {getStatusBadge(row.status)}
              {getTypeBadge(row.type)}
            </div>
          </div>
        </div>
      )
    },
    { 
      key: "startDate", 
      label: "Date & Time", 
      sortable: true, 
      render: (value: string, row: Event) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.85rem" }}>
            {formatDate(value)}
          </span>
          <small style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.75rem" }}>
            {row.location.type === 'virtual' ? '🌐 Virtual' : 
             row.location.type === 'hybrid' ? '🔄 Hybrid' : 
             `📍 ${row.location.address?.city || 'TBD'}`}
          </small>
        </div>
      )
    },
    { 
      key: "registeredCount", 
      label: "Attendance", 
      sortable: true, 
      render: (value: number, row: Event) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiUsers size={14} color="var(--colorPrimary)" />
            <span style={{ color: "rgba(255, 255, 255, 0.9)", fontWeight: "600" }}>
              {value} / {row.capacity}
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
              width: `${Math.min((value / row.capacity) * 100, 100)}%`,
              height: "100%",
              background: value >= row.capacity ? "#ef4444" : value >= row.capacity * 0.8 ? "#f59e0b" : "var(--colorPrimary)",
              borderRadius: "2px",
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>
      )
    },
    { 
      key: "analytics", 
      label: "Performance", 
      render: (analytics: Event['analytics'], row: Event) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiEye size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {analytics.views} views
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiDollarSign size={12} />
            <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
              ${analytics.revenue}
            </span>
          </div>
          {analytics.averageRating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiStar size={12} />
              <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.7)" }}>
                {analytics.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      )
    }
  ];

  const tableActions = [
    {
      label: "View Event",
      icon: <FiExternalLink />,
      onClick: (event: Event) => handleViewEvent(event),
      variant: "secondary" as const
    },
    {
      label: "Edit",
      icon: <FiEdit />,
      onClick: (event: Event) => handleEditEvent(event),
      variant: "primary" as const
    },
    {
      label: "Duplicate",
      icon: <FiCopy />,
      onClick: (event: Event) => handleDuplicateEvent(event),
      variant: "secondary" as const
    },
    {
      label: "Delete",
      icon: <FiTrash2 />,
      onClick: (event: Event) => handleDeleteEvent(event.id),
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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading events...</p>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader 
        title="Event Management"
        subtitle="Create, manage, and analyze your events with comprehensive insights and powerful tools"
        actions={headerActions}
        breadcrumb={["Admin", "Events"]}
      />

      <AdminStats stats={statsData} columns={6} />

      <AdminFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={{ 
          status: filterStatus, 
          type: filterType, 
          dateRange: dateRange,
          sortBy: sortBy 
        }}
        onFilterChange={(key, value) => {
          switch (key) {
            case 'status': setFilterStatus(value); break;
            case 'type': setFilterType(value); break;
            case 'dateRange': setDateRange(value); break;
            case 'sortBy': setSortBy(value); break;
          }
        }}
        onClearFilters={() => {
          setFilterStatus('all');
          setFilterType('all');
          setDateRange('all');
          setSortBy('startDate');
        }}
        placeholder="Search events by title, description, category, or tags..."
        aiSuggestions={[
          "Upcoming webinars",
          "High-revenue workshops",
          "Virtual conferences",
          "Product launches this quarter"
        ]}
      />

      {/* Bulk Actions */}
      {selectedEvents.length > 0 && (
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
              {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => handleBulkAction('publish', selectedEvents)}
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
                onClick={() => handleBulkAction('unpublish', selectedEvents)}
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
                Unpublish
              </button>
              <button 
                onClick={() => handleBulkAction('cancel', selectedEvents)}
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
                Cancel
              </button>
              <button 
                onClick={() => handleBulkAction('delete', selectedEvents)}
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
        data={filteredEvents}
        actions={tableActions}
        selectable={true}
        selectedRows={selectedEvents}
        onRowSelect={setSelectedEvents}
        loading={loading}
        emptyMessage="No events found. Create your first event to get started!"
      />

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