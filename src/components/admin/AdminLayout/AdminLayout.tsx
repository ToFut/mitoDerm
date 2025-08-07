'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, 
  FiUsers, 
  FiImage, 
  FiVideo, 
  FiPackage, 
  FiAward, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiChevronRight,
  FiChevronLeft,
  FiTag,
  FiCalendar,
  FiSidebar
} from 'react-icons/fi';
import styles from './AdminLayout.module.scss';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  section: 'main' | 'content' | 'system';
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Extract language from pathname - memoized
  const lang = useMemo(() => pathname?.split('/')[1] || 'en', [pathname]);

  // Memoize navigation items to prevent re-creation on every render
  const navItems: NavItem[] = useMemo(() => [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: <FiHome />,
      href: `/${lang}/admin`,
      section: 'main'
    },
    {
      id: 'products',
      label: t('products'),
      icon: <FiPackage />,
      href: `/${lang}/admin/products`,
      section: 'content'
    },
    {
      id: 'events',
      label: 'Events',
      icon: <FiCalendar />,
      href: `/${lang}/admin/events`,
      section: 'content'
    },
    {
      id: 'brands',
      label: 'Brands & Products',
      icon: <FiTag />,
      href: `/${lang}/admin/brands`,
      section: 'content'
    },
    {
      id: 'media',
      label: t('media'),
      icon: <FiImage />,
      href: `/${lang}/admin/media`,
      section: 'content'
    },
    {
      id: 'gallery',
      label: t('gallery'),
      icon: <FiVideo />,
      href: `/${lang}/admin/gallery`,
      section: 'content'
    },
    {
      id: 'users',
      label: t('users'),
      icon: <FiUsers />,
      href: `/${lang}/admin/users`,
      section: 'system'
    },
    {
      id: 'certifications',
      label: t('certifications'),
      icon: <FiAward />,
      href: `/${lang}/admin/certifications`,
      section: 'system'
    }
  ], [lang, t]);

  // Memoize sections to prevent re-filtering on every render
  const sections = useMemo(() => [
    { id: 'main', label: t('main'), items: navItems.filter(item => item.section === 'main') },
    { id: 'content', label: t('content'), items: navItems.filter(item => item.section === 'content') },
    { id: 'system', label: t('system'), items: navItems.filter(item => item.section === 'system') }
  ], [navItems, t]);

  // Optimize pathname matching for active state
  const isActive = useCallback((itemId: string, itemHref: string) => {
    return pathname === itemHref || (itemId !== 'dashboard' && pathname?.includes(`/admin/${itemId}`));
  }, [pathname]);

  const handleLogout = useCallback(() => {
    router.push('/auth/signin');
  }, [router]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const getBreadcrumb = useMemo(() => {
    if (!pathname) return t('dashboard');
    const currentItem = navItems.find(item => pathname.includes(item.id));
    return currentItem ? currentItem.label : t('dashboard');
  }, [pathname, navItems, t]);

  return (
    <div className={styles.adminLayout}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          {!sidebarCollapsed && <h2 className={styles.logo}>MitoDerm Admin</h2>}
          {sidebarCollapsed && <div className={styles.logoCompact}>M</div>}
          <div className={styles.headerButtons}>
            <button 
              className={styles.collapseButton}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
            <button 
              className={styles.closeButton}
              onClick={() => setSidebarOpen(false)}
            >
              <FiX />
            </button>
          </div>
        </div>

        <nav className={styles.navigation}>
          {sections.map(section => (
            <div key={section.id} className={styles.section}>
              {!sidebarCollapsed && <h3 className={styles.sectionTitle}>{section.label}</h3>}
              <ul className={styles.navList}>
                {section.items.map(item => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`${styles.navItem} ${isActive(item.id, item.href) ? styles.active : ''}`}
                      onClick={handleSidebarToggle}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <span className={styles.icon}>{item.icon}</span>
                      {!sidebarCollapsed && (
                        <>
                          <span className={styles.label}>{item.label}</span>
                          <FiChevronRight className={styles.arrow} />
                        </>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <FiUser />
            </div>
            {!sidebarCollapsed && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
            )}
          </div>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
            title={sidebarCollapsed ? t('logout') : undefined}
          >
            <FiLogOut />
            {!sidebarCollapsed && <span>{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`${styles.mainContent} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        {/* Top header */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu />
            </button>
            <button 
              className={styles.desktopToggle}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <FiSidebar />
            </button>
            <div className={styles.breadcrumb}>
              <span className={styles.breadcrumbLabel}>{t('dashboard')}</span>
              <FiChevronRight className={styles.breadcrumbArrow} />
              <span className={styles.breadcrumbCurrent}>{getBreadcrumb}</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.headerActions}>
              <button className={styles.actionButton}>
                <FiSettings />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
} 