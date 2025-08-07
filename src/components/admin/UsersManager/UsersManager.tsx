'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiUsers, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye, FiMail, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import styles from './UsersManager.module.scss';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  joinDate: Date;
  lastLogin: Date;
  certificationStatus: 'none' | 'pending' | 'approved' | 'rejected';
}

export default function UsersManager() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        joinDate: new Date('2024-01-15'),
        lastLogin: new Date('2024-07-14'),
        certificationStatus: 'approved'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        joinDate: new Date('2024-02-20'),
        lastLogin: new Date('2024-07-13'),
        certificationStatus: 'pending'
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        status: 'inactive',
        joinDate: new Date('2024-03-10'),
        lastLogin: new Date('2024-06-30'),
        certificationStatus: 'none'
      }
    ];
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#48bb78';
      case 'inactive': return '#e53e3e';
      default: return '#999';
    }
  };

  const getCertificationColor = (status: string) => {
    switch (status) {
      case 'approved': return '#48bb78';
      case 'pending': return '#ed8936';
      case 'rejected': return '#e53e3e';
      default: return '#999';
    }
  };

  if (!session) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.usersManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Users Management</h1>
          <p>Manage user accounts and permissions</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{users.length}</span>
              <span className={styles.statLabel}>Total Users</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{users.filter(u => u.status === 'active').length}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{users.filter(u => u.certificationStatus === 'approved').length}</span>
              <span className={styles.statLabel}>Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchFilter}>
          <div className={styles.searchBox}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className={styles.usersTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableRow}>
              <div className={styles.tableCell}>User</div>
              <div className={styles.tableCell}>Role</div>
              <div className={styles.tableCell}>Status</div>
              <div className={styles.tableCell}>Certification</div>
              <div className={styles.tableCell}>Join Date</div>
              <div className={styles.tableCell}>Last Login</div>
              <div className={styles.tableCell}>Actions</div>
            </div>
          </div>
          <div className={styles.tableBody}>
            {filteredUsers.map(user => (
              <div key={user.id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      {user.name.charAt(0)}
                    </div>
                    <div className={styles.userDetails}>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <span className={`${styles.badge} ${styles[user.role]}`}>
                    {user.role}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <span 
                    className={styles.statusBadge}
                    style={{ background: `${getStatusColor(user.status)}22`, color: getStatusColor(user.status) }}
                  >
                    {user.status}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <span 
                    className={styles.certificationBadge}
                    style={{ background: `${getCertificationColor(user.certificationStatus)}22`, color: getCertificationColor(user.certificationStatus) }}
                  >
                    {user.certificationStatus}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  {user.joinDate.toLocaleDateString()}
                </div>
                <div className={styles.tableCell}>
                  {user.lastLogin.toLocaleDateString()}
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} title="View Details">
                      <FiEye />
                    </button>
                    <button className={styles.actionBtn} title="Edit User">
                      <FiEdit />
                    </button>
                    <button className={styles.actionBtn} title="Send Email">
                      <FiMail />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiUsers />
          </div>
          <h3>No users found</h3>
          <p>No users match your current filters</p>
        </div>
      )}
    </div>
  );
} 