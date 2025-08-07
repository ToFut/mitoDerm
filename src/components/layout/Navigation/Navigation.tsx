'use client';
import { FC, useState, useEffect, useRef } from 'react';
import styles from './Navigation.module.scss';
import { navMainList, navEventList, navFormList } from '@/constants';
import { NavItem } from '@/types';
import { useLocale, useTranslations } from 'next-intl';
import { useMediaQuery } from 'react-responsive';
import { usePathname, Link } from '@/i18n/routing';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import DynamicMegaMenu from './DynamicMegaMenu';
import { 
  FiSearch, 
  FiUser, 
  FiShoppingBag, 
  FiHeart, 
  FiMenu, 
  FiX,
  FiStar,
  FiBookOpen,
  FiAward,
  FiMessageCircle,
  FiCalendar,
  FiHome,
  FiInfo,
  FiShoppingCart,
  FiUsers,
  FiMapPin,
  FiChevronDown,
  FiChevronRight,
  FiZap,
  FiTrendingUp,
  FiShield,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiFilter,
  FiGrid,
  FiLayers,
  FiTarget,
  FiActivity
} from 'react-icons/fi';

const UserProfile = dynamic(() => import('@/components/sharedUI/UserProfile/UserProfile'), {
  ssr: false,
});

const SignInButton = dynamic(() => import('@/components/sharedUI/SignInButton/SignInButton'), {
  ssr: false,
});

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: FC<Props> = ({ isOpen, setIsOpen }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1024px)' });
  const pathName = usePathname();
  const isFormPage = pathName.includes('form');
  const isSuccessPage = pathName.includes('success');
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Admin users list
  const adminUsers = [
    'admin@mitoderm.com',
    'shiri@mitoderm.com',
    'segev@futurixs.com',
    'ilona@mitoderm.co.il'
  ];

  const isAdmin = session?.user?.email && adminUsers.includes(session.user.email);

  const navList =
    isFormPage || isSuccessPage
      ? navFormList
      : pathName.includes('event')
      ? navEventList
      : navMainList;

  const t = useTranslations();
  const locale = useLocale();

  // Enhanced search suggestions
  const allSuggestions = [
    'V-Tech System', 'ExoSignal Hair', 'EXOTECH Gel', 'ExoSignal Spray',
    'אקסוזומים', 'PDRN', 'פפטידים', 'תאי גזע',
    'נשירת שיער', 'אנטי אייג\'ינג', 'צלקות', 'מיקרונידלינג',
    'הכשרה', 'הסמכה', 'מפגש היכרות', 'קליניקה'
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Click outside handler fired
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      // Only close dropdown if clicking outside the mega menu
      if (
        megaMenuRef.current &&
        megaMenuRef.current.contains(event.target as Node)
      ) {
        // Click is inside the mega menu, do nothing
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.' + styles.dropdownMenu)) {
        setActiveDropdown(null);
      }
      // If click is outside everything, close the dropdown
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    if (isOpen || isSearchOpen || activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isSearchOpen, activeDropdown]); // Remove setIsOpen as React state setters are stable

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const handleMobileClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const getNavIcon = (iconName?: string) => {
    switch (iconName) {
      case 'home':
        return <FiHome className={styles.navIcon} />;
      case 'info':
        return <FiInfo className={styles.navIcon} />;
      case 'shopping':
        return <FiShoppingCart className={styles.navIcon} />;
      case 'star':
        return <FiStar className={styles.navIcon} />;
      case 'book':
        return <FiBookOpen className={styles.navIcon} />;
      case 'award':
        return <FiAward className={styles.navIcon} />;
      case 'calendar':
        return <FiCalendar className={styles.navIcon} />;
      case 'clinic':
        return <FiUsers className={styles.navIcon} />;
      case 'users':
        return <FiUsers className={styles.navIcon} />;
      case 'contact':
        return <FiMessageCircle className={styles.navIcon} />;
      default:
        return <FiStar className={styles.navIcon} />;
    }
  };

  const handleDropdownToggle = (text: string) => {
    setActiveDropdown(activeDropdown === text ? null : text);
  };

  const handleDropdownMouseEnter = (text: string) => {
    if (!isTabletOrMobile) {
      setActiveDropdown(text);
    }
  };

  const handleDropdownMouseLeave = () => {
    // Remove auto-close on mouse leave - only close on click outside
    // if (!isTabletOrMobile) {
    //   setActiveDropdown(null);
    // }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submission
            // Search query processing
    setIsSearchOpen(false);
  };

  // Dynamic mega menu state
  const [dynamicMegaMenuData, setDynamicMegaMenuData] = useState(null);

  // Debug logging removed to prevent console clutter

  return (
    <>
      {/* Enhanced Search Modal */}
      {isSearchOpen && (
        <div className={styles.searchModal} ref={searchRef}>
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchInputWrapper}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="חיפוש מוצרים, טכנולוגיות, טיפולים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  autoFocus
                />
                <button type="button" className={styles.searchClose} onClick={() => setIsSearchOpen(false)}>
                  <FiX />
                </button>
              </div>
              
              {searchSuggestions.length > 0 && (
                <div className={styles.searchSuggestions}>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className={styles.suggestionItem}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        // Handle suggestion click
                      }}
                    >
                      <FiSearch className={styles.suggestionIcon} />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {isTabletOrMobile ? (
        <div 
          className={`${styles.mobileMenuOverlay} ${isOpen ? styles.active : ''}`}
          ref={mobileMenuRef}
        >
          <nav className={`${styles.mobileNavigation} ${isOpen ? styles.active : ''}`}>
            {/* Enhanced Mobile Header */}
            <div className={styles.mobileHeader}>
              <div className={styles.mobileHeaderContent}>
                <h3 className={styles.mobileTitle}>מיטודרם</h3>
                <p className={styles.mobileSubtitle}>טכנולוגיה רפואית מתקדמת</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className={styles.mobileCloseButton}
              >
                <FiX />
              </button>
            </div>

            {/* Enhanced Mobile Search */}
            <div className={styles.mobileSearch}>
              <div className={styles.searchInput}>
                <FiSearch className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="חיפוש מהיר..." 
                  className={styles.searchField}
                />
              </div>
            </div>

            {/* Enhanced Mobile Navigation Items */}
            <div className={styles.mobileNavItems}>
              {navList.map((item: NavItem, index: number) => (
                <div key={`mobile-item-${index}`} className={styles.mobileNavItem}>
                  {item.hasDropdown ? (
                    <div className={styles.mobileDropdownWrapper}>
                      <button
                        onClick={() => handleDropdownToggle(item.text)}
                        className={styles.mobileDropdownButton}
                      >
                        <div className={styles.mobileNavContent}>
                          {getNavIcon(item.icon)}
                          <span className={styles.mobileNavText}>{t(item.text)}</span>
                        </div>
                        <FiChevronDown className={`${styles.mobileDropdownArrow} ${activeDropdown === item.text ? styles.rotated : ''}`} />
                      </button>
                      {activeDropdown === item.text && item.dropdownItems && (
                        <div className={styles.mobileDropdownMenu}>
                          {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                            <Link
                              key={`mobile-dropdown-${dropdownIndex}`}
                              onClick={handleMobileClick}
                              href={dropdownItem.url || `#${dropdownItem.scrollId}`}
                              className={styles.mobileDropdownLink}
                            >
                              {getNavIcon(dropdownItem.icon)}
                              <span>{t(dropdownItem.text)}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      onClick={handleMobileClick}
                      href={item.url ? item.url : `#${item.scrollId}`}
                      className={styles.mobileNavButton}
                    >
                      <div className={styles.mobileNavContent}>
                        {getNavIcon(item.icon)}
                        <span className={styles.mobileNavText}>{t(item.text)}</span>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Admin Dashboard Link for Mobile */}
              {isAdmin && (
                <div className={styles.mobileNavItem}>
                  <Link
                    onClick={handleMobileClick}
                    href="/admin"
                    className={`${styles.mobileNavButton} ${styles.adminLink}`}
                  >
                    <div className={styles.mobileNavContent}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={styles.navIcon}
                      >
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                      </svg>
                      <span className={styles.mobileNavText}>Admin Dashboard</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Enhanced Mobile Authentication */}
            <div className={styles.mobileAuth}>
              <UserProfile />
              <SignInButton variant="elegant" size="medium" />
            </div>
          </nav>
        </div>
      ) : (
        <nav
          className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''} ${
            isFormPage || isSuccessPage ? styles.formPage : ''
          }`}
        >
          {/* Enhanced Desktop Navigation Items */}
          <div className={styles.navItems}>
            {navList.map((item: NavItem, index: number) => (
              <div key={`desktop-item-${index}`} className={styles.navItem}>
                {item.hasDropdown ? (
                  <div 
                    className={styles.dropdownWrapper}
                    onMouseEnter={() => handleDropdownMouseEnter(item.text)}
                    onMouseLeave={handleDropdownMouseLeave}
                    ref={item.text === 'navigation.products' ? megaMenuRef : dropdownRef}
                  >
                    <button
                      className={`${styles.navButton} ${pathName === item.url ? styles.active : ''} ${activeDropdown === item.text ? styles.dropdownActive : ''}`}
                      onClick={() => handleDropdownToggle(item.text)}
                    >
                      {getNavIcon(item.icon)}
                      <span className={styles.navText}>{t(item.text)}</span>
                      <FiChevronDown className={`${styles.navArrow} ${activeDropdown === item.text ? styles.rotated : ''}`} />
                    </button>
                    
                    {activeDropdown === item.text && (
                      <>
                        {item.text === 'navigation.products' ? (
                          <DynamicMegaMenu 
                            isOpen={activeDropdown === item.text}
                            onClose={() => setActiveDropdown(null)}
                            megaMenuRef={megaMenuRef}
                          />
                        ) : item.dropdownItems ? (
                          // Member Dropdown Menu
                          <div className={styles.dropdownMenu}>
                            {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                              <Link
                                key={dropdownIndex}
                                href={dropdownItem.url || '/'}
                                className={styles.dropdownMenuItem}
                              >
                                {getNavIcon(dropdownItem.icon)}
                                <span>{t(dropdownItem.text)}</span>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.url || (item.scrollId ? `#${item.scrollId}` : '/')}
                    className={`${styles.navButton} ${pathName === item.url ? styles.active : ''}`}
                  >
                    {getNavIcon(item.icon)}
                    <span className={styles.navText}>{t(item.text)}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          {/* Enhanced Desktop Action Buttons */}
          <div className={styles.actionButtons}>
            <button 
              className={styles.actionButton}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <FiSearch />
            </button>
            
            <Link href="/cart" className={styles.actionButton} aria-label="Cart">
              <FiShoppingBag />
              <span className={styles.cartBadge}>0</span>
            </Link>
            
            <Link href="/wishlist" className={styles.actionButton} aria-label="Wishlist">
              <FiHeart />
            </Link>
            
            {/* Desktop Authentication */}
            <div className={styles.desktopAuth}>
              <UserProfile />
              <SignInButton variant="elegant" size="small" />
            </div>
          </div>
          
          {/* Admin Dashboard Link for Desktop */}
          {isAdmin && (
            <div className={styles.navItem}>
              <Link
                href="/admin"
                className={`${styles.navButton} ${styles.adminLink}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={styles.navIcon}
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
                <span className={styles.navText}>Admin</span>
              </Link>
            </div>
          )}
        </nav>
      )}
    </>
  );
};

export default Navigation;
