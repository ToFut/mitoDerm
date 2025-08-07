'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/services/productService';
import styles from './ProductDetail.module.scss';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of enhanced product detail page
const ProductDetailEnhanced = dynamic(
  () => import('./ProductDetailEnhanced'),
  { 
    ssr: false,
    loading: () => (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div>Loading...</div>
      </div>
    )
  }
);
import { 
  FaStar, 
  FaShieldAlt, 
  FaTruck, 
  FaCertificate, 
  FaWhatsapp, 
  FaDownload, 
  FaPhone,
  FaHeart,
  FaShare,
  FaEye,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
  FaUserMd,
  FaFlask,
  FaLeaf,
  FaGem,
  FaAward,
  FaUsers,
  FaChartLine,
  FaVideo,
  FaPlay,
  FaExpand,
  FaShoppingCart,
  FaCreditCard,
  FaLock,
  FaSearch,
  FaSearchPlus,
  FaSearchMinus,
  FaRedo,
  FaBookmark,
  FaBell,
  FaGift,
  FaRocket,
  FaHandSparkles,
  FaCrown,
  FaMedal,
  FaTrophy,
  FaGem as FaDiamond,
  FaMagic,
  FaHandSparkles as FaWandMagicSparkles
} from 'react-icons/fa';

// Components
import ProductGallery from './components/ProductGallery';
import StickyInfoSidebar from './components/StickyInfoSidebar';
import ProductReviews from './components/ProductReviews';
import RelatedProductsCarousel from './components/RelatedProductsCarousel';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [showEnhancedView, setShowEnhancedView] = useState(true); // Default to enhanced view
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [lastViewed, setLastViewed] = useState<Date | null>(null);
  const [showFloatingBadge, setShowFloatingBadge] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showStockAlert, setShowStockAlert] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll effects and progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 300);
      
      if (containerRef.current) {
        const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
        const progress = (scrollY / containerHeight) * 100;
        setScrollProgress(Math.min(progress, 100));
        setShowProgressBar(scrollY > 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // View count simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Floating badge animation
  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingBadge(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Stock alert for low stock items
  useEffect(() => {
    if (product.stock <= 10 && product.stock > 0) {
      setShowStockAlert(true);
    }
  }, [product.stock]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaEye },
    { id: 'ingredients', label: 'Ingredients', icon: FaFlask },
    { id: 'benefits', label: 'Benefits', icon: FaChartLine },
    { id: 'specifications', label: 'Specifications', icon: FaCertificate },
    { id: 'reviews', label: 'Reviews', icon: FaUsers }
  ];

  const getStockStatus = () => {
    if (product.stock === 0) return { status: 'out', text: 'Out of Stock', color: '#ef4444' };
    if (product.stock <= 10) return { status: 'low', text: `Only ${product.stock} left`, color: '#f59e0b' };
    return { status: 'available', text: 'In Stock', color: '#10b981' };
  };

  const stockStatus = getStockStatus();

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showNotificationMessage(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotificationMessage('Link copied to clipboard!');
    }
  };

  const handleQuickView = () => {
    setShowQuickView(true);
    setTimeout(() => setShowQuickView(false), 2000);
  };

  // Show enhanced view if enabled
  if (showEnhancedView) {
    return (
      <>
        <button 
          onClick={() => setShowEnhancedView(false)}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1000,
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #BE800C, #D4A574)',
            color: 'black',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Switch to Classic View
        </button>
        <ProductDetailEnhanced product={product} />
      </>
    );
  }

  return (
    <div className={styles.productDetailPage} ref={containerRef}>
      {/* Progress Bar */}
      {showProgressBar && (
        <motion.div 
          className={styles.progressBar}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className={styles.progressFill}
            style={{ width: `${scrollProgress}%` }}
          />
        </motion.div>
      )}

      {/* Floating Professional Badge */}
      {product.requiresCertification && (
        <motion.div 
          className={styles.floatingBadge}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FaUserMd />
          <span>Professional Only</span>
        </motion.div>
      )}

      {/* Floating View Counter */}
      {showFloatingBadge && (
        <motion.div 
          className={styles.floatingViewCounter}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <FaEye />
          <span>{viewCount} people viewing</span>
        </motion.div>
      )}

      {/* Hero Section with Gallery and Info */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            {/* Product Gallery */}
            <div className={styles.gallerySection}>
              <ProductGallery images={product.images || []} name={product.name} />
              
              {/* Interactive Gallery Controls */}
              <div className={styles.galleryControls}>
                <motion.button
                  className={styles.galleryButton}
                  onClick={() => setShowZoomModal(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaSearchPlus />
                  <span>Zoom</span>
                </motion.button>
                
                <motion.button
                  className={styles.galleryButton}
                  onClick={handleQuickView}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaEye />
                  <span>Quick View</span>
                </motion.button>
                
                <motion.button
                  className={styles.galleryButton}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaRedo />
                  <span>360° View</span>
                </motion.button>
              </div>
              
              {/* Video Preview Button */}
              {(product as any).coverVideo && (
                <motion.button
                  className={styles.videoPreviewButton}
                  onClick={() => setShowVideoModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay />
                  <span>Watch Product Video</span>
                </motion.button>
              )}
            </div>

            {/* Product Information Sidebar */}
            <div className={styles.infoSection}>
              <StickyInfoSidebar product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Trust Indicators Bar */}
      <section className={styles.trustBar}>
        <div className={styles.container}>
          <div className={styles.trustItems}>
            <motion.div 
              className={styles.trustItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <FaGem className={styles.trustIcon} />
              <span>Premium Quality</span>
            </motion.div>
            <motion.div 
              className={styles.trustItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <FaShieldAlt className={styles.trustIcon} />
              <span>Medical Grade</span>
            </motion.div>
            <motion.div 
              className={styles.trustItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <FaTruck className={styles.trustIcon} />
              <span>Free Shipping</span>
            </motion.div>
            <motion.div 
              className={styles.trustItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <FaAward className={styles.trustIcon} />
              <span>Certified Results</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stock Status Banner */}
      {stockStatus.status !== 'available' && (
        <motion.section 
          className={styles.stockBanner}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className={styles.container}>
            <div className={styles.stockAlert}>
              <FaExclamationTriangle style={{ color: stockStatus.color }} />
              <span style={{ color: stockStatus.color }}>{stockStatus.text}</span>
            </div>
          </div>
        </motion.section>
      )}

      {/* Interactive Features Bar */}
      <section className={styles.featuresBar}>
        <div className={styles.container}>
          <div className={styles.interactiveFeatures}>
            <motion.button
              className={styles.featureButton}
              onClick={handleWishlist}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHeart className={isWishlisted ? styles.active : ''} />
              <span>Wishlist</span>
            </motion.button>
            
            <motion.button
              className={styles.featureButton}
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShare />
              <span>Share</span>
            </motion.button>
            
            <motion.button
              className={styles.featureButton}
              onClick={() => showNotificationMessage('Downloading brochure...')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload />
              <span>Brochure</span>
            </motion.button>
            
            <motion.button
              className={styles.featureButton}
              onClick={() => showNotificationMessage('Scheduling consultation...')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaBell />
              <span>Consultation</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Tabbed Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          {/* Enhanced Tab Navigation */}
          <div className={styles.tabNavigation}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  className={styles.overviewTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.overviewGrid}>
                    {/* Key Features */}
                    {product.features && product.features.length > 0 && (
                      <motion.div 
                        className={styles.featuresCard}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <h3 className={styles.cardTitle}>
                          <FaCheck className={styles.cardIcon} />
                          Key Features
                        </h3>
                        <ul className={styles.featuresList}>
                          {product.features.map((feature, index) => (
                            <motion.li
                              key={index}
                              className={styles.featureItem}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + index * 0.1 }}
                            >
                              <span className={styles.featureIcon}>✓</span>
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Technology */}
                    {product.technology && (
                      <motion.div 
                        className={styles.technologyCard}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                      >
                        <h3 className={styles.cardTitle}>
                          <FaFlask className={styles.cardIcon} />
                          Technology
                        </h3>
                        <div className={styles.technologyInfo}>
                          <span className={styles.technologyBadge}>{product.technology}</span>
                          <p className={styles.technologyDescription}>
                            Advanced {product.technology.toLowerCase()} technology for professional results
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Application */}
                    {product.application && (
                      <motion.div 
                        className={styles.applicationCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5 }}
                      >
                        <h3 className={styles.cardTitle}>
                          <FaUserMd className={styles.cardIcon} />
                          Application
                        </h3>
                        <p className={styles.applicationText}>{product.application}</p>
                      </motion.div>
                    )}

                    {/* Professional Grade Info */}
                    {(product as any).professionalGrade && (
                      <motion.div 
                        className={styles.professionalCard}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ y: -5 }}
                      >
                        <h3 className={styles.cardTitle}>
                          <FaAward className={styles.cardIcon} />
                          Professional Grade
                        </h3>
                        <div className={styles.professionalInfo}>
                          <span className={styles.gradeBadge}>{(product as any).professionalGrade}</span>
                          <p>Medical-grade formulation for professional use</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Ingredients Tab */}
              {activeTab === 'ingredients' && (
                <motion.div
                  key="ingredients"
                  className={styles.ingredientsTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.ingredientsContent}>
                    <h3 className={styles.tabTitle}>
                      <FaLeaf className={styles.tabIcon} />
                      Active Ingredients
                    </h3>
                    <div className={styles.ingredientsGrid}>
                      {Array.isArray(product.ingredients) 
                        ? product.ingredients.map((ingredient, index) => (
                            <motion.div
                              key={index}
                              className={styles.ingredientCard}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05, y: -5 }}
                            >
                              <span className={styles.ingredientName}>{ingredient}</span>
                            </motion.div>
                          ))
                        : product.ingredients.split(',').map((ingredient, index) => (
                            <motion.div
                              key={index}
                              className={styles.ingredientCard}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.05, y: -5 }}
                            >
                              <span className={styles.ingredientName}>{ingredient.trim()}</span>
                            </motion.div>
                          ))
                      }
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Benefits Tab */}
              {activeTab === 'benefits' && (
                <motion.div
                  key="benefits"
                  className={styles.benefitsTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.benefitsContent}>
                    <h3 className={styles.tabTitle}>
                      <FaChartLine className={styles.tabIcon} />
                      Clinical Benefits
                    </h3>
                    <div className={styles.benefitsGrid}>
                      {Array.isArray(product.benefits) 
                        ? product.benefits.map((benefit, index) => (
                            <motion.div 
                              key={index}
                              className={styles.benefitCard}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -5 }}
                            >
                              <h4 className={styles.benefitTitle}>{benefit.title}</h4>
                              <p className={styles.benefitDescription}>{benefit.description}</p>
                            </motion.div>
                          ))
                        : (
                            <motion.div
                              className={styles.benefitCard}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={{ y: -5 }}
                            >
                              <p className={styles.benefitDescription}>{product.benefits}</p>
                            </motion.div>
                          )
                      }
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <motion.div
                  key="specifications"
                  className={styles.specificationsTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.specificationsContent}>
                    <h3 className={styles.tabTitle}>
                      <FaCertificate className={styles.tabIcon} />
                      Product Specifications
                    </h3>
                    <div className={styles.specificationsGrid}>
                      {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          className={styles.specificationItem}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -2 }}
                        >
                          <span className={styles.specificationLabel}>{key}</span>
                          <span className={styles.specificationValue}>{value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  className={styles.reviewsTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductReviews productId={product.id || ''} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Enhanced Call-to-Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <motion.h2 
              className={styles.ctaTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Ready to Experience Professional Results?
            </motion.h2>
            <motion.p 
              className={styles.ctaDescription}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Contact our team of medical aesthetics professionals for personalized consultation and ordering
            </motion.p>
            <motion.div 
              className={styles.ctaButtons}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button 
                className={styles.ctaPrimary}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp className={styles.ctaIcon} />
                WhatsApp Consultation
              </motion.button>
              <motion.button 
                className={styles.ctaSecondary}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPhone className={styles.ctaIcon} />
                Call Now
              </motion.button>
              <motion.button 
                className={styles.ctaTertiary}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload className={styles.ctaIcon} />
                Download Brochure
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className={styles.relatedSection}>
        <div className={styles.container}>
          <RelatedProductsCarousel productId={product.id || ''} />
        </div>
      </section>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div 
            className={styles.floatingActions}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <motion.button 
              className={styles.floatingButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaShoppingCart />
            </motion.button>
            <motion.button 
              className={styles.floatingButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaWhatsapp />
            </motion.button>
            <motion.button 
              className={styles.floatingButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPhone />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Notifications */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            className={styles.notification}
            initial={{ opacity: 0, y: -50, x: '50%' }}
            animate={{ opacity: 1, y: 0, x: '50%' }}
            exit={{ opacity: 0, y: -50, x: '50%' }}
          >
            <FaCheck />
            <span>{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div 
            className={styles.quickViewModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.quickViewContent}>
              <FaHandSparkles className={styles.quickViewIcon} />
              <h3>Quick View Activated</h3>
              <p>Enhanced product visualization enabled</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div 
            className={styles.videoModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.videoModalContent}>
              <button 
                className={styles.videoModalClose}
                onClick={() => setShowVideoModal(false)}
              >
                ×
              </button>
              <video controls>
                <source src={(product as any).coverVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zoom Modal */}
      <AnimatePresence>
        {showZoomModal && (
          <motion.div 
            className={styles.zoomModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.zoomModalContent}>
              <button 
                className={styles.zoomModalClose}
                onClick={() => setShowZoomModal(false)}
              >
                ×
              </button>
              <div className={styles.zoomImageContainer}>
                <img 
                  src={(product.images || [])[currentImageIndex]?.url || product.image} 
                  alt={product.name}
                  className={styles.zoomImage}
                />
              </div>
              <div className={styles.zoomControls}>
                <button onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}>
                  <FaSearchMinus />
                </button>
                <button onClick={() => setCurrentImageIndex(Math.min((product.images || []).length - 1, currentImageIndex + 1))}>
                  <FaSearchPlus />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 