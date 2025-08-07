'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Product } from '@/lib/services/productService';
import styles from './ProductDetailEnhanced.module.scss';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  FiStar, FiHeart, FiShare2, FiShoppingCart, FiZap, FiTrendingUp,
  FiAward, FiShield, FiCheck, FiChevronLeft, FiChevronRight,
  FiPlay, FiMaximize, FiRotateCw, FiUsers, FiClock, FiTarget,
  FiGift, FiThumbsUp, FiPackage, FiTruck, FiLock, FiRefreshCw,
  FiDroplet, FiSun, FiMoon, FiEye, FiInfo, FiX, FiPlus, FiMinus,
  FiBarChart2, FiActivity, FiZoomIn, FiGrid, FiList, FiFilter
} from 'react-icons/fi';

interface ProductDetailEnhancedProps {
  product: Product;
}

// ============= HERO PRODUCT SHOWCASE =============
const HeroProductShowcase = ({ product }: { product: Product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [is3DView, setIs3DView] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const images = product.images || [{ url: '/images/placeholder-product.svg', alt: product.name }];
  
  // Ensure activeImageIndex stays within bounds
  useEffect(() => {
    if (activeImageIndex >= images.length) {
      setActiveImageIndex(Math.max(0, images.length - 1));
    }
  }, [images.length, activeImageIndex]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !isZoomed) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <motion.div 
      className={styles.heroShowcase}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Main Image Display */}
      <div className={styles.showcaseMain}>
        {/* Floating Badges */}
        <div className={styles.floatingBadges}>
          {product.featured && (
            <motion.div 
              className={styles.badge}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FiAward /> Featured
            </motion.div>
          )}
          {product.stock <= 10 && product.stock > 0 && (
            <motion.div 
              className={`${styles.badge} ${styles.urgent}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <FiClock /> Only {product.stock} left
            </motion.div>
          )}
          {product.discount && (
            <motion.div 
              className={`${styles.badge} ${styles.discount}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              -{product.discount}% OFF
            </motion.div>
          )}
        </div>

        {/* Image Container with Zoom */}
        <motion.div 
          ref={containerRef}
          className={`${styles.imageContainer} ${isZoomed ? styles.zoomed : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          animate={is3DView ? { rotateY: 360 } : { rotateY: 0 }}
          transition={{ duration: 20, repeat: is3DView ? Infinity : 0, ease: "linear" }}
        >
          <Image
            src={images[activeImageIndex]?.url || '/images/placeholder-product.svg'}
            alt={images[activeImageIndex]?.alt || product.name}
            width={800}
            height={800}
            className={styles.mainImage}
            style={isZoomed ? {
              transform: `scale(2) translate(-${mousePosition.x - 50}%, -${mousePosition.y - 50}%)`
            } : {}}
            priority
          />
          
          {/* Zoom Indicator */}
          {isZoomed && (
            <div className={styles.zoomIndicator}>
              <FiZoomIn /> Zooming
            </div>
          )}
        </motion.div>

        {/* Interactive Controls */}
        <div className={styles.showcaseControls}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIs3DView(!is3DView)}
            className={`${styles.controlBtn} ${is3DView ? styles.active : ''}`}
          >
            <FiRotateCw /> 360° View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={styles.controlBtn}
          >
            <FiMaximize /> Full Screen
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={styles.controlBtn}
          >
            <FiPlay /> Video
          </motion.button>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className={styles.thumbnailGallery}>
        <button 
          className={styles.galleryNav}
          onClick={() => setActiveImageIndex(Math.max(0, activeImageIndex - 1))}
          disabled={activeImageIndex === 0}
        >
          <FiChevronLeft />
        </button>
        
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <motion.button
              key={index}
              className={`${styles.thumbnail} ${activeImageIndex === index ? styles.active : ''}`}
              onClick={() => setActiveImageIndex(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image.url}
                alt={image.alt || `${product.name} ${index + 1}`}
                width={100}
                height={100}
              />
            </motion.button>
          ))}
        </div>
        
        <button 
          className={styles.galleryNav}
          onClick={() => setActiveImageIndex(Math.min(images.length - 1, activeImageIndex + 1))}
          disabled={activeImageIndex === images.length - 1}
        >
          <FiChevronRight />
        </button>
      </div>
    </motion.div>
  );
};

// ============= PRODUCT INFO PANEL =============
const ProductInfoPanel = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const calculateSavings = () => {
    if (product.originalPrice && product.price) {
      return product.originalPrice - product.price;
    }
    return 0;
  };

  return (
    <motion.div 
      className={styles.infoPanel}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Product Title & Rating */}
      <div className={styles.titleSection}>
        <h1 className={styles.productTitle}>{product.name}</h1>
        <p className={styles.productSubtitle}>{product.subtitle}</p>
        
        <div className={styles.ratingSection}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.floor(product.rating || 0) ? styles.filled : ''} />
            ))}
            <span className={styles.ratingValue}>{product.rating || 0}</span>
          </div>
          <span className={styles.reviewCount}>({product.reviewCount || 0} reviews)</span>
          <span className={styles.separator}>•</span>
          <span className={styles.soldCount}>
            <FiTrendingUp /> {product.soldCount || 0} sold
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className={styles.priceSection}>
        <div className={styles.priceRow}>
          {product.originalPrice && (
            <span className={styles.originalPrice}>${product.originalPrice}</span>
          )}
          <span className={styles.currentPrice}>${product.price}</span>
          {calculateSavings() > 0 && (
            <span className={styles.savings}>Save ${calculateSavings().toFixed(2)}</span>
          )}
        </div>
        
        {/* Limited Time Offer */}
        {product.discount && (
          <motion.div 
            className={styles.limitedOffer}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FiClock /> Limited Time: Extra {product.discount}% OFF
          </motion.div>
        )}
      </div>

      {/* Key Benefits */}
      <div className={styles.keyBenefits}>
        <h3>Key Benefits</h3>
        <div className={styles.benefitsList}>
          {(Array.isArray(product.benefits) ? product.benefits : product.benefits ? [product.benefits] : []).map((benefit, index) => (
            <motion.div 
              key={index}
              className={styles.benefitItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <FiCheck className={styles.checkIcon} />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Product Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className={styles.variantsSection}>
          <h3>Select Size</h3>
          <div className={styles.variantOptions}>
            {product.variants.map((variant, index) => (
              <motion.button
                key={index}
                className={`${styles.variantBtn} ${selectedVariant === variant ? styles.selected : ''}`}
                onClick={() => setSelectedVariant(variant)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {variant}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className={styles.quantitySection}>
        <h3>Quantity</h3>
        <div className={styles.quantitySelector}>
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className={styles.quantityBtn}
          >
            <FiMinus />
          </button>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className={styles.quantityInput}
          />
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className={styles.quantityBtn}
          >
            <FiPlus />
          </button>
        </div>
        <span className={styles.stockStatus}>
          {product.stock > 0 ? (
            <><FiCheck /> In Stock</>
          ) : (
            <><FiX /> Out of Stock</>
          )}
        </span>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <motion.button 
          className={styles.addToCartBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={product.stock === 0}
        >
          <FiShoppingCart /> Add to Cart - ${(product.price * quantity).toFixed(2)}
        </motion.button>
        
        <motion.button 
          className={styles.buyNowBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={product.stock === 0}
        >
          <FiZap /> Buy Now
        </motion.button>
        
        <div className={styles.secondaryActions}>
          <motion.button 
            className={`${styles.iconBtn} ${isWishlisted ? styles.active : ''}`}
            onClick={() => setIsWishlisted(!isWishlisted)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiHeart />
          </motion.button>
          <motion.button 
            className={styles.iconBtn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiShare2 />
          </motion.button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className={styles.trustBadges}>
        <div className={styles.trustBadge}>
          <FiShield />
          <span>Secure Payment</span>
        </div>
        <div className={styles.trustBadge}>
          <FiTruck />
          <span>Fast Delivery</span>
        </div>
        <div className={styles.trustBadge}>
          <FiRefreshCw />
          <span>30-Day Returns</span>
        </div>
      </div>

      {/* Promotion Banner */}
      <motion.div 
        className={styles.promotionBanner}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <FiGift className={styles.giftIcon} />
        <div>
          <strong>Special Offer!</strong>
          <p>Buy 2 get 10% off, Buy 3 get 15% off</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============= INTERACTIVE TABS SECTION =============
const InteractiveTabs = ({ product }: { product: Product }) => {
  const [activeTab, setActiveTab] = useState('description');
  
  const tabs = [
    { id: 'description', label: 'Description', icon: FiInfo },
    { id: 'ingredients', label: 'Ingredients', icon: FiDroplet },
    { id: 'usage', label: 'How to Use', icon: FiTarget },
    { id: 'science', label: 'The Science', icon: FiActivity },
    { id: 'reviews', label: 'Reviews', icon: FiStar }
  ];

  return (
    <motion.div 
      className={styles.tabsSection}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon />
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                className={styles.tabIndicator}
                layoutId="tabIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className={styles.tabContent}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'description' && (
            <div className={styles.descriptionTab}>
              <h3>About This Product</h3>
              <p>{product.description}</p>
              
              <div className={styles.features}>
                <h4>Key Features</h4>
                <div className={styles.featureGrid}>
                  <div className={styles.featureItem}>
                    <FiAward />
                    <span>Medical Grade Formula</span>
                  </div>
                  <div className={styles.featureItem}>
                    <FiDroplet />
                    <span>20B Synthetic Exosomes</span>
                  </div>
                  <div className={styles.featureItem}>
                    <FiSun />
                    <span>All Skin Types</span>
                  </div>
                  <div className={styles.featureItem}>
                    <FiShield />
                    <span>Clinically Tested</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'ingredients' && (
            <div className={styles.ingredientsTab}>
              <h3>Active Ingredients</h3>
              <div className={styles.ingredientsList}>
                {(Array.isArray(product.ingredients) ? product.ingredients : product.ingredients ? product.ingredients.split(',') : []).map((ingredient, index) => (
                  <motion.div 
                    key={index}
                    className={styles.ingredientItem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.ingredientIcon}>
                      <FiDroplet />
                    </div>
                    <div className={styles.ingredientInfo}>
                      <h4>{ingredient}</h4>
                      <p>Clinically proven for maximum effectiveness</p>
                    </div>
                    <div className={styles.concentration}>
                      {Math.floor(Math.random() * 20 + 5)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'usage' && (
            <div className={styles.usageTab}>
              <h3>How to Use</h3>
              <div className={styles.usageSteps}>
                {(product.instructions ? product.instructions.split('\n').filter(step => step.trim()) : []).map((step, index) => (
                  <motion.div 
                    key={index}
                    className={styles.usageStep}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <p>{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'science' && (
            <div className={styles.scienceTab}>
              <h3>The Science Behind</h3>
              <div className={styles.scienceContent}>
                <p>Our revolutionary exosome technology delivers 20 billion synthetic exosomes directly to your skin cells, promoting cellular regeneration and collagen production.</p>
                
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>98%</div>
                    <div className={styles.statLabel}>Improved Skin Texture</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>85%</div>
                    <div className={styles.statLabel}>Reduced Wrinkles</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statNumber}>92%</div>
                    <div className={styles.statLabel}>Increased Hydration</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className={styles.reviewsTab}>
              <h3>Customer Reviews</h3>
              <div className={styles.reviewsSummary}>
                <div className={styles.overallRating}>
                  <div className={styles.bigRating}>4.8</div>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={styles.filled} />
                    ))}
                  </div>
                  <p>Based on 234 reviews</p>
                </div>
                
                <div className={styles.ratingBars}>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className={styles.ratingBar}>
                      <span>{rating}★</span>
                      <div className={styles.barContainer}>
                        <div 
                          className={styles.barFill} 
                          style={{ width: `0%` }}
                        />
                      </div>
                      <span>0</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// ============= LIVE SOCIAL PROOF =============
const LiveSocialProof = () => {
  const [activities, setActivities] = useState([]);

  return (
    <motion.div 
      className={styles.socialProof}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <h3><FiUsers /> Live Activity</h3>
      <div className={styles.activityFeed}>
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className={styles.activityItem}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.activityAvatar}>{activity.avatar}</div>
              <div className={styles.activityInfo}>
                <strong>{activity.user}</strong> {activity.action}
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <motion.div 
        className={styles.viewingNow}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FiEye /> <strong>47 people</strong> are viewing this product now
      </motion.div>
    </motion.div>
  );
};

// ============= MAIN COMPONENT =============
export default function ProductDetailEnhanced({ product }: ProductDetailEnhancedProps) {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  
  return (
    <div className={styles.productDetailEnhanced}>
      {/* Animated Background */}
      <motion.div 
        className={styles.animatedBackground}
        style={{ y: backgroundY }}
      >
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </motion.div>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span>Home</span> / <span>Products</span> / <span>{product.category || 'Skincare'}</span> / <strong>{product.name}</strong>
      </div>

      {/* Main Product Section */}
      <div className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.productGrid}>
            <HeroProductShowcase product={product} />
            <ProductInfoPanel product={product} />
          </div>
        </div>
      </div>

      {/* Live Social Proof */}
      <LiveSocialProof />

      {/* Interactive Tabs */}
      <InteractiveTabs product={product} />

      {/* Floating Action Bar */}
      <motion.div 
        className={styles.floatingActionBar}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <div className={styles.pricePreview}>
          <span className={styles.floatingPrice}>${product.price}</span>
          {product.stock <= 10 && product.stock > 0 && (
            <span className={styles.stockWarning}>Only {product.stock} left!</span>
          )}
        </div>
        <div className={styles.floatingActions}>
          <button className={styles.floatingBtn}>
            <FiHeart /> Save
          </button>
          <button className={`${styles.floatingBtn} ${styles.primary}`}>
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
}