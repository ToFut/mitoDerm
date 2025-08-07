'use client';
import { FC, useEffect, useState, useMemo } from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import Navigation from '../Navigation/Navigation';
import { useMediaQuery } from 'react-responsive';
import BurgerButton from '@/components/sharedUI/BurgerButton/BurgerButton';
import Link from 'next/link';
import { usePathname } from '@/i18n/routing';
import { useUser, useIsAuthenticated, useCart, useNotifications } from '@/store/store';
import { FiShoppingCart, FiBell, FiUser } from 'react-icons/fi';
import Cart from '@/components/ecommerce/Cart/Cart';

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showCart, setShowCart] = useState<boolean>(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });
  const pathname = usePathname();
  const isSuccessPage = pathname.includes('success');
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const cart = useCart();
  const notifications = useNotifications();
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const handleClose = (e: MouseEvent) => {
    const { target } = e;
    if ((target as HTMLDivElement).id === 'overlay') setIsOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    isOpen
      ? window.addEventListener('click', handleClose)
      : window.removeEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [isOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div
        className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
        id='overlay'
      />
      <div className={styles.container}>
        <Link className={styles.logoContainer} href='/'>
          <Image
            src='/images/logo.svg'
            width={isTabletOrMobile ? 96 : 120}
            height={isTabletOrMobile ? 32 : 40}
            quality={100}
            alt='mitoderm logo'
            className={styles.logo}
          />
        </Link>
        <Navigation setIsOpen={setIsOpen} isOpen={isOpen} />
        
        {/* Header Actions */}
        <div className={styles.headerActions}>
          {/* Cart Icon */}
          <button 
            className={styles.actionButton}
            onClick={() => setShowCart(true)}
            aria-label="Shopping cart"
          >
            <FiShoppingCart />
            {cart.itemCount > 0 && (
              <span className={styles.badge}>{cart.itemCount}</span>
            )}
          </button>
          
          {/* Notifications */}
          {isAuthenticated && (
            <button 
              className={styles.actionButton}
              aria-label="Notifications"
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </button>
          )}
          
          {/* User Account */}
          <Link 
            href={isAuthenticated ? '/profile' : '/auth/login'}
            className={styles.actionButton}
            aria-label={isAuthenticated ? 'User profile' : 'Sign in'}
          >
            <FiUser />
          </Link>
          
          {!isSuccessPage ? <LanguageSwitch /> : <div style={{ width: 120 }} />}
        </div>
        {isTabletOrMobile && (
          <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
        )}
      </div>
      
      {/* Cart Sidebar */}
      {showCart && (
        <Cart 
          isOpen={showCart} 
          onClose={() => setShowCart(false)}
        />
      )}
    </header>
  );
};

export default Header;
