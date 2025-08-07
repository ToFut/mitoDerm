'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiUsers, 
  FiCalendar, 
  FiMapPin, 
  FiClock,
  FiEye,
  FiSend,
  FiCheck,
  FiX,
  FiBarChart2,
  FiFilter,
  FiSearch,
  FiGrid,
  FiList,
  FiDownload,
  FiShare2,
  FiMoreVertical,
  FiStar,
  FiAlertCircle,
  FiCheckCircle,
  FiClock as FiPending,
  FiTrendingUp,
  FiDollarSign,
  FiRefreshCw,
  FiSettings,
  FiArchive,
  FiPlay,
  FiPause,
  FiStopCircle
} from 'react-icons/fi';
import { LuxuryButton, HolographicCard, LuxuryInput } from '@/components/nextgen/LuxuryComponents';
import { Event, EventRegistration, EventStats } from '@/lib/types/event';
import EnhancedEventModal from './EnhancedEventModal';
import styles from './events-admin.module.scss';

interface EventsAdminClientProps {}

export default function EventsAdminClient({}: EventsAdminClientProps) {
  // State Management
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<EventRegistration[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'analytics'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'cancelled' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'upcoming' | 'past'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'registrations' | 'status' | 'revenue'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    revenue: 0,
    pendingApprovals: 0,
    activeEvents: 0
  });

  // Memoized filtered and sorted events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      
      let matchesDate = true;
      const now = new Date();
      const eventDate = new Date(event.startDate);
      
      switch (dateFilter) {
        case 'today':
          matchesDate = eventDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDate = eventDate >= now && eventDate <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          matchesDate = eventDate >= now && eventDate <= monthFromNow;
          break;
        case 'upcoming':
          matchesDate = eventDate > now;
          break;
        case 'past':
          matchesDate = eventDate < now;
          break;
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    // Sort events
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'registrations':
          aValue = a.capacity.total - a.capacity.available;
          bValue = b.capacity.total - b.capacity.available;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'revenue':
          aValue = (a.capacity.total - a.capacity.available) * (a.pricing[0]?.price || 0);
          bValue = (b.capacity.total - b.capacity.available) * (b.pricing[0]?.price || 0);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [events, searchTerm, statusFilter, typeFilter, dateFilter, sortBy, sortOrder]);

  // Data fetching
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch events');
      }

      const events = data.events.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        registrationDeadline: new Date(event.registrationDeadline),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }));

      setEvents(events);
      updateStats(events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
      updateStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStats = useCallback((events: Event[]) => {
    const now = new Date();
    const stats = {
      totalEvents: events.length,
      totalRegistrations: events.reduce((sum, event) => sum + (event.capacity.total - event.capacity.available), 0),
      upcomingEvents: events.filter(event => new Date(event.startDate) > now).length,
      revenue: events.reduce((sum, event) => {
        const registrations = event.capacity.total - event.capacity.available;
        const price = event.pricing.find(p => p.isDefault)?.price || event.pricing[0]?.price || 0;
        return sum + (registrations * price);
      }, 0),
      pendingApprovals: pendingRegistrations.length,
      activeEvents: events.filter(event => event.status === 'published' && new Date(event.startDate) > now).length
    };
    setStats(stats);
  }, [pendingRegistrations]);

  const fetchPendingRegistrations = useCallback(async () => {
    try {
      const response = await fetch('/api/events/registrations?status=pending');
      const data = await response.json();
      if (data.success) {
        setPendingRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Failed to fetch pending registrations:', error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchPendingRegistrations();
  }, [fetchEvents, fetchPendingRegistrations]);

  // Event handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchEvents(), fetchPendingRegistrations()]);
    setRefreshing(false);
  }, [fetchEvents, fetchPendingRegistrations]);

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowCreateModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowCreateModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setSelectedEvents(prev => prev.filter(id => id !== eventId));
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedEvents.length === 0) return;
    
    try {
      const response = await fetch('/api/events/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventIds: selectedEvents, action })
      });
      
      if (response.ok) {
        await fetchEvents();
        setSelectedEvents([]);
        setShowBulkActions(false);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAllEvents = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(e => e.id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <FiCheckCircle className={styles.statusIcon} />;
      case 'draft': return <FiClock className={styles.statusIcon} />;
      case 'cancelled': return <FiX className={styles.statusIcon} />;
      case 'completed': return <FiArchive className={styles.statusIcon} />;
      default: return <FiAlertCircle className={styles.statusIcon} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return styles.statusPublished;
      case 'draft': return styles.statusDraft;
      case 'cancelled': return styles.statusCancelled;
      case 'completed': return styles.statusCompleted;
      default: return styles.statusDefault;
    }
  };

  return (
    <div className={styles.eventsAdminContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Events Management</h1>
            <p className={styles.pageSubtitle}>
              Manage your events, registrations, and analytics
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <LuxuryButton
              variant="glass"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw className={refreshing ? styles.spinning : ''} />
              Refresh
            </LuxuryButton>
            
            <LuxuryButton
              variant="primary"
              onClick={handleCreateEvent}
              glowEffect={true}
            >
              <FiPlus />
              Create Event
            </LuxuryButton>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <HolographicCard glowColor="gold" className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon}>
              <FiCalendar />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{stats.totalEvents}</span>
              <span className={styles.statLabel}>Total Events</span>
            </div>
          </div>
        </HolographicCard>

        <HolographicCard glowColor="platinum" className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon}>
              <FiUsers />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{stats.totalRegistrations}</span>
              <span className={styles.statLabel}>Total Registrations</span>
            </div>
          </div>
        </HolographicCard>

        <HolographicCard glowColor="rose" className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon}>
              <FiTrendingUp />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>{stats.upcomingEvents}</span>
              <span className={styles.statLabel}>Upcoming Events</span>
            </div>
          </div>
        </HolographicCard>

        <HolographicCard glowColor="rainbow" className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon}>
              <FiDollarSign />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statNumber}>${stats.revenue.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Revenue</span>
            </div>
          </div>
        </HolographicCard>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeTab === 'events' ? styles.active : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <FiCalendar />
          Events ({filteredEvents.length})
        </button>
        
        <button
          className={`${styles.tabButton} ${activeTab === 'registrations' ? styles.active : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          <FiUsers />
          Registrations ({pendingRegistrations.length})
        </button>
        
        <button
          className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FiBarChart2 />
          Analytics
        </button>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.eventsTab}
            >
              {/* Filters and Controls */}
              <div className={styles.controls}>
                <div className={styles.searchAndFilters}>
                  <div className={styles.searchContainer}>
                    <FiSearch className={styles.searchIcon} />
                    <LuxuryInput
                      type="text"
                      value={searchTerm}
                      onChange={setSearchTerm}
                      placeholder="Search events..."
                      label=""
                    />
                  </div>
                  
                  <div className={styles.filters}>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                    
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Types</option>
                      <option value="workshop">Workshop</option>
                      <option value="conference">Conference</option>
                      <option value="webinar">Webinar</option>
                      <option value="training">Training</option>
                    </select>
                    
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as any)}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.viewControls}>
                  <div className={styles.viewModeToggle}>
                    <button
                      className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.active : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <FiGrid />
                    </button>
                    <button
                      className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.active : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <FiList />
                    </button>
                  </div>
                  
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split('-');
                      setSortBy(sort as any);
                      setSortOrder(order as any);
                    }}
                    className={styles.sortSelect}
                  >
                    <option value="date-desc">Date (Newest)</option>
                    <option value="date-asc">Date (Oldest)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="registrations-desc">Registrations (High)</option>
                    <option value="registrations-asc">Registrations (Low)</option>
                    <option value="revenue-desc">Revenue (High)</option>
                    <option value="revenue-asc">Revenue (Low)</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={styles.bulkActions}
                >
                  <div className={styles.bulkInfo}>
                    <span>{selectedEvents.length} events selected</span>
                    <button
                      onClick={() => setSelectedEvents([])}
                      className={styles.clearSelection}
                    >
                      Clear Selection
                    </button>
                  </div>
                  
                  <div className={styles.bulkButtons}>
                    <LuxuryButton
                      variant="glass"
                      onClick={() => handleBulkAction('publish')}
                    >
                      <FiPlay />
                      Publish
                    </LuxuryButton>
                    
                    <LuxuryButton
                      variant="glass"
                      onClick={() => handleBulkAction('archive')}
                    >
                      <FiArchive />
                      Archive
                    </LuxuryButton>
                    
                    <LuxuryButton
                      variant="secondary"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <FiTrash2 />
                      Delete
                    </LuxuryButton>
                  </div>
                </motion.div>
              )}

              {/* Events Grid/List */}
              {loading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner} />
                  <p>Loading events...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className={styles.emptyState}>
                  <FiCalendar className={styles.emptyIcon} />
                  <h3>No events found</h3>
                  <p>Try adjusting your filters or create a new event.</p>
                  <LuxuryButton
                    variant="primary"
                    onClick={handleCreateEvent}
                  >
                    <FiPlus />
                    Create Your First Event
                  </LuxuryButton>
                </div>
              ) : (
                <div className={`${styles.eventsContainer} ${styles[viewMode]}`}>
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -2 }}
                      className={styles.eventCard}
                    >
                      <HolographicCard
                        glowColor={event.status === 'published' ? 'gold' : 'platinum'}
                        className={styles.eventCardContent}
                        interactive={true}
                      >
                        <div className={styles.eventHeader}>
                          <div className={styles.eventStatus}>
                            {getStatusIcon(event.status)}
                            <span className={`${styles.statusBadge} ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                          
                          <div className={styles.eventActions}>
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => handleSelectEvent(event.id)}
                              className={styles.eventCheckbox}
                            />
                            
                            <div className={styles.actionMenu}>
                              <button className={styles.actionButton}>
                                <FiMoreVertical />
                              </button>
                              <div className={styles.actionDropdown}>
                                <button onClick={() => handleEditEvent(event)}>
                                  <FiEdit3 />
                                  Edit
                                </button>
                                <button onClick={() => setShowStatsModal(true)}>
                                  <FiBarChart2 />
                                  Analytics
                                </button>
                                <button>
                                  <FiShare2 />
                                  Share
                                </button>
                                <button onClick={() => handleDeleteEvent(event.id)}>
                                  <FiTrash2 />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.eventContent}>
                          <h3 className={styles.eventTitle}>{event.title}</h3>
                          {event.subtitle && (
                            <p className={styles.eventSubtitle}>{event.subtitle}</p>
                          )}
                          
                          <div className={styles.eventDetails}>
                            <div className={styles.eventDetail}>
                              <FiCalendar />
                              <span>{event.startDate.toLocaleDateString()}</span>
                            </div>
                            
                            <div className={styles.eventDetail}>
                              <FiClock />
                              <span>
                                {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                {event.endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            <div className={styles.eventDetail}>
                              <FiMapPin />
                              <span>
                                {event.location.type === 'virtual' 
                                  ? 'Virtual Event' 
                                  : `${event.location.venue}, ${event.location.city}`
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div className={styles.eventStats}>
                            <div className={styles.stat}>
                              <FiUsers />
                              <span>{event.capacity.total - event.capacity.available}/{event.capacity.total}</span>
                            </div>
                            
                            <div className={styles.stat}>
                              <FiDollarSign />
                              <span>${event.pricing.find(p => p.isDefault)?.price || event.pricing[0]?.price || 0}</span>
                            </div>
                          </div>
                        </div>
                      </HolographicCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'registrations' && (
            <motion.div
              key="registrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.registrationsTab}
            >
              <div className={styles.registrationsHeader}>
                <h2>Pending Registrations</h2>
                <p>{pendingRegistrations.length} registrations awaiting approval</p>
              </div>
              
              {pendingRegistrations.length === 0 ? (
                <div className={styles.emptyState}>
                  <FiCheckCircle className={styles.emptyIcon} />
                  <h3>No pending registrations</h3>
                  <p>All registrations have been processed.</p>
                </div>
              ) : (
                <div className={styles.registrationsList}>
                  {pendingRegistrations.map((registration) => (
                    <div key={registration.id} className={styles.registrationCard}>
                      <div className={styles.registrationInfo}>
                        <h4>{registration.attendeeInfo.firstName} {registration.attendeeInfo.lastName}</h4>
                        <p>{registration.attendeeInfo.email}</p>
                        <span className={styles.eventName}>Event ID: {registration.eventId}</span>
                      </div>
                      
                      <div className={styles.registrationActions}>
                        <LuxuryButton
                          variant="primary"
                          size="small"
                          onClick={() => {/* Handle approve */}}
                        >
                          <FiCheck />
                          Approve
                        </LuxuryButton>
                        
                        <LuxuryButton
                          variant="secondary"
                          size="small"
                          onClick={() => {/* Handle reject */}}
                        >
                          <FiX />
                          Reject
                        </LuxuryButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.analyticsTab}
            >
              <div className={styles.analyticsHeader}>
                <h2>Event Analytics</h2>
                <p>Comprehensive insights into your events performance</p>
              </div>
              
              <div className={styles.analyticsGrid}>
                <HolographicCard glowColor="gold" className={styles.analyticsCard}>
                  <h3>Registration Trends</h3>
                  <div className={styles.chartPlaceholder}>
                    <FiBarChart2 />
                    <p>Chart coming soon</p>
                  </div>
                </HolographicCard>
                
                <HolographicCard glowColor="platinum" className={styles.analyticsCard}>
                  <h3>Revenue Analysis</h3>
                  <div className={styles.chartPlaceholder}>
                    <FiTrendingUp />
                    <p>Chart coming soon</p>
                  </div>
                </HolographicCard>
                
                <HolographicCard glowColor="rose" className={styles.analyticsCard}>
                  <h3>Event Performance</h3>
                  <div className={styles.chartPlaceholder}>
                    <FiStar />
                    <p>Chart coming soon</p>
                  </div>
                </HolographicCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <EnhancedEventModal
            event={selectedEvent}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedEvent(null);
            }}
            onSave={async (event) => {
              try {
                // Save to database via API
                const response = await fetch('/api/events', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(event),
                });

                const data = await response.json();
                
                if (!data.success) {
                  throw new Error(data.error || 'Failed to save event');
                }

                // Update local state with the saved event
                if (selectedEvent) {
                  setEvents(prev => prev.map(e => e.id === event.id ? { ...event, id: data.event.id } : e));
                } else {
                  setEvents(prev => [...prev, { ...event, id: data.event.id }]);
                }
                
                setShowCreateModal(false);
                setSelectedEvent(null);
                
                // Refresh events to get updated data
                fetchEvents();
              } catch (error) {
                console.error('Failed to save event:', error);
                // You might want to show an error notification here
                alert('Failed to save event. Please try again.');
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}