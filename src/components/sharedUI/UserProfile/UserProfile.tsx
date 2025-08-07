'use client';

import { signOut, useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import styles from './UserProfile.module.scss';

export default function UserProfile() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Admin users list - in production, this should be in a database
  const adminUsers = [
    'admin@mitoderm.com',
    'shiri@mitoderm.com',
    'segev@futurixs.com',
    'ilona@mitoderm.co.il'
  ];

  const isAdmin = session?.user?.email && adminUsers.includes(session.user.email);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.profileButton}
        onClick={handleDropdownToggle}
        aria-label="User profile menu"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={32}
            height={32}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {session.user.name?.charAt(0) || 'U'}
          </div>
        )}
        <span className={styles.name}>{session.user.name}</span>
        <svg
          className={`${styles.chevron} ${isDropdownOpen ? styles.rotated : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{session.user.name}</span>
              <span className={styles.userEmail}>{session.user.email}</span>
              {session.provider && (
                <span className={styles.provider}>
                  Signed in with {session.provider}
                </span>
              )}
              {isAdmin && (
                <span className={styles.adminBadge}>
                  Administrator
                </span>
              )}
            </div>
          </div>
          <div className={styles.dropdownDivider} />
          
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className={styles.adminButton}
                onClick={handleDropdownToggle}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
                Admin Dashboard
              </Link>
              <div className={styles.dropdownDivider} />
            </>
          )}
          
          <button
            onClick={handleSignOut}
            className={styles.signOutButton}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 