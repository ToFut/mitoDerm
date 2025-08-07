"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { 
  FiUsers, 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiEye, 
  FiToggleLeft, 
  FiToggleRight,
  FiSearch,
  FiFilter,
  FiActivity,
  FiPackage,
  FiAward,
  FiUserPlus,
  FiDownload,
  FiZap
} from "react-icons/fi";
import { userService, User } from "@/lib/services/userService";
import { 
  AdminPageContainer, 
  AdminHeader, 
  AdminStats, 
  AdminFilters, 
  AdminTable, 
  AdminCard 
} from "@/components/admin/shared";

export default function AdminUsersPage() {
  const t = useTranslations("admin");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    usersByRole: {} as { [key: string]: number }
  });

  // Add keyframe animation for spinner
  React.useEffect(() => {
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

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get real-time users
        unsubscribe = await userService.getUsers((users) => {
          setUsers(users);
          setLoading(false);
        });

        // Get user statistics
        const userStats = await userService.getUserStats();
        setStats(userStats);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    };

    loadUsers();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const newStatus = currentStatus ? 'inactive' : 'active';
      await userService.updateUser(userId, { status: newStatus });
    } catch (err) {
      setError("Failed to update user status");
    }
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && user.status === 'active') || 
      (filterStatus === "inactive" && user.status === 'inactive');
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  const roles = Array.from(new Set(users.map(u => u.role)));

  const headerActions = [
    {
      label: "AI Insights",
      icon: <FiZap />,
      onClick: () => console.log('AI insights'),
      variant: "ai" as const
    },
    {
      label: "Export Users",
      icon: <FiDownload />,
      onClick: () => console.log('Export users'),
      variant: "secondary" as const
    },
    {
      label: "Add User",
      icon: <FiUserPlus />,
      onClick: () => console.log('Add user'),
      variant: "primary" as const
    }
  ];

  const statsData = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <FiUsers />,
      color: "primary" as const,
      change: { value: 12, type: "increase" as const, period: "last month" }
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: <FiActivity />,
      color: "success" as const,
      change: { value: 8, type: "increase" as const, period: "last month" }
    },
    {
      label: "New This Month",
      value: stats.newUsersThisMonth,
      icon: <FiUserPlus />,
      color: "info" as const,
      change: { value: 25, type: "increase" as const, period: "last month" }
    },
    {
      label: "Professionals",
      value: stats.usersByRole.professional || 0,
      icon: <FiAward />,
      color: "warning" as const,
      change: { value: 5, type: "increase" as const, period: "last month" }
    }
  ];

  const filterConfigs = [
    {
      key: "role",
      label: "Role",
      type: "select" as const,
      options: [{ label: "All Roles", value: "all" }, ...roles.map(role => ({ label: role, value: role }))]
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
    }
  ];

  const tableColumns = [
    { key: "name", label: "User", sortable: true, render: (value: any, row: User) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <strong style={{ color: "rgba(255, 255, 255, 0.9)" }}>{row.name}</strong>
        <small style={{ color: "rgba(255, 255, 255, 0.6)" }}>{row.email}</small>
      </div>
    )},
    { key: "role", label: "Role", sortable: true, render: (value: string) => (
      <span style={{ 
        padding: "0.25rem 0.5rem", 
        borderRadius: "6px", 
        background: "rgba(190, 128, 12, 0.2)", 
        color: "var(--colorPrimary)",
        fontSize: "0.75rem",
        textTransform: "capitalize"
      }}>
        {value}
      </span>
    )},
    { key: "status", label: "Status", sortable: true, render: (value: string) => (
      <span style={{ 
        padding: "0.25rem 0.5rem", 
        borderRadius: "6px", 
        background: value === 'active' ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)", 
        color: value === 'active' ? "#10b981" : "#ef4444",
        fontSize: "0.75rem",
        textTransform: "capitalize"
      }}>
        {value}
      </span>
    )},
    { key: "createdAt", label: "Join Date", sortable: true, render: (value: any) => (
      value ? new Date(value.seconds * 1000).toLocaleDateString() : "Unknown"
    )},
    { key: "lastLogin", label: "Last Login", sortable: true, render: (value: any) => (
      value ? new Date(value.seconds * 1000).toLocaleDateString() : "Never"
    )}
  ];

  const tableActions = [
    {
      label: "View Details",
      icon: <FiEye />,
      onClick: (user: User) => handleViewUserDetails(user),
      variant: "primary" as const
    },
    {
      label: "Toggle Status",
      icon: (user: User) => user.status === 'active' ? <FiToggleRight /> : <FiToggleLeft />,
      onClick: (user: User) => handleToggleUserStatus(user.id, user.status === 'active'),
      variant: "secondary" as const
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
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Loading users...</p>
        </div>
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminCard variant="gradient">
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--colorSecondary)" }}>
            <h3>Error Loading Users</h3>
            <p>{error}</p>
          </div>
        </AdminCard>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader 
        title="User Management"
        subtitle="Manage user accounts, view profiles, and monitor activity"
        actions={headerActions}
        breadcrumb={["Admin", "Users"]}
      />

      <AdminStats stats={statsData} columns={4} />

      <AdminFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfigs}
        activeFilters={{ role: filterRole, status: filterStatus }}
        onFilterChange={(key, value) => {
          if (key === 'role') setFilterRole(value);
          if (key === 'status') setFilterStatus(value);
        }}
        onClearFilters={() => {
          setFilterRole('all');
          setFilterStatus('all');
        }}
        placeholder="Search users by name or email..."
      />

      <AdminTable 
        columns={tableColumns}
        data={filteredUsers}
        actions={tableActions}
        loading={loading}
        emptyMessage="No users found. Try adjusting your search criteria."
      />

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)"
          }} 
          onClick={() => setShowUserModal(false)}
        >
          <div
            style={{
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}
            onClick={(e: any) => e.stopPropagation()}
          >
            <AdminCard 
              variant="glass" 
              padding="large"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ color: "rgba(255, 255, 255, 0.95)", margin: 0 }}>User Details</h2>
                <button 
                  onClick={() => setShowUserModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0.25rem",
                    borderRadius: "4px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, var(--colorPrimary), var(--colorPrimaryLight))",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.5rem"
                }}>
                  <FiUser />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "rgba(255, 255, 255, 0.95)", margin: "0 0 0.25rem 0" }}>{selectedUser.name}</h3>
                  <p style={{ color: "rgba(255, 255, 255, 0.7)", margin: "0 0 0.5rem 0" }}>{selectedUser.email}</p>
                  <span style={{ 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "6px", 
                    background: "rgba(190, 128, 12, 0.2)", 
                    color: "var(--colorPrimary)",
                    fontSize: "0.75rem",
                    textTransform: "capitalize",
                    fontWeight: "500"
                  }}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              
              <div style={{ display: "grid", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Status:</strong>
                  <span style={{ 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "6px", 
                    background: selectedUser.status === 'active' ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)", 
                    color: selectedUser.status === 'active' ? "#10b981" : "#ef4444",
                    fontSize: "0.875rem",
                    textTransform: "capitalize",
                    fontWeight: "500"
                  }}>
                    {selectedUser.status}
                  </span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Join Date:</strong>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Last Login:</strong>
                  <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin.seconds * 1000).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                
                {selectedUser.profile && (
                  <>
                    {selectedUser.profile.phone && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Phone:</strong>
                        <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{selectedUser.profile.phone}</span>
                      </div>
                    )}
                    
                    {selectedUser.profile.clinic && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Clinic:</strong>
                        <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{selectedUser.profile.clinic}</span>
                      </div>
                    )}
                    
                    {selectedUser.profile.profession && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Profession:</strong>
                        <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{selectedUser.profile.profession}</span>
                      </div>
                    )}
                    
                    {selectedUser.profile.certificationStatus && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ color: "rgba(255, 255, 255, 0.8)" }}>Certification:</strong>
                        <span style={{ 
                          padding: "0.25rem 0.75rem", 
                          borderRadius: "6px", 
                          background: "rgba(16, 185, 129, 0.2)", 
                          color: "#10b981",
                          fontSize: "0.875rem",
                          textTransform: "capitalize",
                          fontWeight: "500"
                        }}>
                          {selectedUser.profile.certificationStatus}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </AdminCard>
          </div>
        </div>
      )}
    </AdminPageContainer>
  );
}