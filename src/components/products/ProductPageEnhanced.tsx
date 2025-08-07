'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  FiZap, FiStar, FiTrendingUp, FiAward, FiShield, 
  FiHeart, FiEye, FiShoppingCart, FiShare2, FiRotateCw,
  FiPlay, FiPause, FiVolume2, FiMaximize, FiMinimize,
  FiChevronLeft, FiChevronRight, FiGrid, FiList,
  FiFilter, FiSearch, FiCpu, FiTarget, FiGift,
  FiClock, FiUsers, FiBarChart2, FiCheckCircle
} from 'react-icons/fi';
import styles from './ProductPageEnhanced.module.scss';

// ============= HERO SECTION WITH 3D PRODUCT SHOWCASE =============
const Hero3DShowcase = ({ products }: any) => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  
  return (
    <motion.section 
      className={styles.hero3D}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background with Particles */}
      <div className={styles.particleBackground}>
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            animate={{
              y: [-100, 1000],
              x: [(i % 3 - 1) * 30, (i % 2 - 0.5) * 30],
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + (i % 3) * 2,
              repeat: Infinity,
              ease: "linear",
              delay: (i * 0.2) % 3
            }}
            style={{
              left: `${20 + (i * 5) % 60}%`,
              width: `${3 + (i % 2)}px`,
              height: `${3 + (i % 2)}px`,
            }}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className={styles.heroGrid}>
        {/* Left: Dynamic Text Content */}
        <motion.div 
          className={styles.heroContent}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div className={styles.badge}>
            <FiAward /> #1 Best Seller
          </motion.div>
          
          <motion.h1 
            className={styles.heroTitle}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Revolutionary
            <span className={styles.gradientText}> Exosome Technology</span>
            <br />
            for Next-Gen Skincare
          </motion.h1>
          
          <motion.p 
            className={styles.heroDescription}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover the power of 20 billion synthetic exosomes working at the cellular level 
            to transform your skin from within. Clinically proven, professionally recommended.
          </motion.p>

          {/* Live Stats */}
          <motion.div 
            className={styles.liveStats}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={styles.statItem}>
              <FiUsers className={styles.statIcon} />
              <span className={styles.statNumber}>2,847</span>
              <span className={styles.statLabel}>Professionals Using</span>
            </div>
            <div className={styles.statItem}>
              <FiStar className={styles.statIcon} />
              <span className={styles.statNumber}>4.9/5</span>
              <span className={styles.statLabel}>Average Rating</span>
            </div>
            <div className={styles.statItem}>
              <FiTrendingUp className={styles.statIcon} />
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>See Results</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className={styles.heroCTA}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button className={styles.primaryCTA}>
              <FiShoppingCart /> Shop Collection
              <span className={styles.ctaPulse} />
            </button>
            <button className={styles.secondaryCTA}>
              <FiPlay /> Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Right: 3D Product Showcase */}
        <motion.div 
          className={styles.showcase3D}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.showcaseContainer}>
            {/* Main Product Display */}
            <motion.div 
              className={styles.productStage}
              animate={{ rotateY: isAutoRotating ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <img 
                src={products[activeProduct]?.image || "/images/product-hero.png"}
                alt="Product"
                className={styles.productImage}
              />
              <div className={styles.productGlow} />
              <div className={styles.productReflection} />
            </motion.div>

            {/* Product Selector */}
            <div className={styles.productSelector}>
              {products.slice(0, 4).map((product: any, index: number) => (
                <motion.button
                  key={index}
                  className={`${styles.selectorItem} ${activeProduct === index ? styles.active : ''}`}
                  onClick={() => setActiveProduct(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={product.thumbnail} alt={product.name} />
                </motion.button>
              ))}
            </div>

            {/* 3D Controls */}
            <div className={styles.controls3D}>
              <button onClick={() => setIsAutoRotating(!isAutoRotating)}>
                <FiRotateCw className={isAutoRotating ? styles.rotating : ''} />
              </button>
              <button>
                <FiMaximize /> AR View
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className={styles.scrollIndicator}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>Scroll to Explore</span>
        <div className={styles.scrollArrow} />
      </motion.div>
    </motion.section>
  );
};

// ============= INTERACTIVE PRODUCT GRID =============
const InteractiveProductGrid = ({ products }: any) => {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'carousel'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  return (
    <motion.section className={styles.productShowcase}>
      {/* Section Header with Controls */}
      <div className={styles.showcaseHeader}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
                      <FiCpu /> AI-Curated Collection
        </motion.h2>
        
        <div className={styles.viewControls}>
          <button 
            className={viewMode === 'grid' ? styles.active : ''}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid />
          </button>
          <button 
            className={viewMode === 'list' ? styles.active : ''}
            onClick={() => setViewMode('list')}
          >
            <FiList />
          </button>
          <button 
            className={viewMode === 'carousel' ? styles.active : ''}
            onClick={() => setViewMode('carousel')}
          >
            <FiMaximize />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className={styles.categoryPills}>
        {['all', 'bestsellers', 'new', 'professional', 'bundles'].map(category => (
          <motion.button
            key={category}
            className={`${styles.pill} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category === 'bestsellers' && <FiTrendingUp />}
            {category === 'new' && <FiZap />}
            {category === 'professional' && <FiAward />}
            {category === 'bundles' && <FiGift />}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Product Grid */}
      <motion.div 
        className={`${styles.productGrid} ${styles[viewMode]}`}
        layout
      >
        <AnimatePresence mode="popLayout">
          {products.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={styles.productCard}
              onMouseEnter={() => setHoveredProduct(index)}
              onMouseLeave={() => setHoveredProduct(null)}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              {/* Product Media */}
              <div className={styles.productMedia}>
                <div className={styles.mediaContainer}>
                  <motion.img 
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                    animate={{ 
                      scale: hoveredProduct === index ? 1.1 : 1,
                      rotateY: hoveredProduct === index ? 10 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Video Preview on Hover */}
                  {hoveredProduct === index && product.video && (
                    <motion.video
                      className={styles.productVideo}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      autoPlay
                      muted
                      loop
                    >
                      <source src={product.video} type="video/mp4" />
                    </motion.video>
                  )}
                </div>

                {/* Badges */}
                <div className={styles.badges}>
                  {product.isNew && (
                    <motion.div 
                      className={styles.badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      NEW
                    </motion.div>
                  )}
                  {product.isBestseller && (
                    <motion.div 
                      className={`${styles.badge} ${styles.bestseller}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <FiTrendingUp /> BESTSELLER
                    </motion.div>
                  )}
                  {product.discount && (
                    <motion.div 
                      className={`${styles.badge} ${styles.discount}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      -{product.discount}%
                    </motion.div>
                  )}
                </div>

                {/* Quick Actions */}
                <AnimatePresence>
                  {hoveredProduct === index && (
                    <motion.div 
                      className={styles.quickActions}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <button className={styles.actionBtn}>
                        <FiHeart />
                      </button>
                      <button className={styles.actionBtn}>
                        <FiEye />
                      </button>
                      <button className={styles.actionBtn}>
                        <FiShare2 />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Product Info */}
              <div className={styles.productInfo}>
                <div className={styles.productHeader}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.rating}>
                    <FiStar className={styles.starFilled} />
                    <span>{product.rating}</span>
                    <span className={styles.reviews}>({product.reviews})</span>
                  </div>
                </div>

                <p className={styles.productDescription}>
                  {product.description}
                </p>

                {/* Key Benefits with Icons */}
                <div className={styles.benefits}>
                  {Array.isArray(product.benefits) ? product.benefits.slice(0, 3).map((benefit: string, i: number) => (
                    <span key={i} className={styles.benefit}>
                      <FiCheckCircle /> {benefit}
                    </span>
                  )) : null}
                </div>

                {/* Price and CTA */}
                <div className={styles.productFooter}>
                  <div className={styles.pricing}>
                    {product.originalPrice && (
                      <span className={styles.originalPrice}>
                        ${product.originalPrice}
                      </span>
                    )}
                    <span className={styles.currentPrice}>
                      ${product.price}
                    </span>
                  </div>
                  
                  <motion.button 
                    className={styles.addToCart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiShoppingCart /> Add to Cart
                  </motion.button>
                </div>

                {/* Stock Status */}
                {product.stock < 10 && (
                  <div className={styles.stockWarning}>
                    <FiClock /> Only {product.stock} left in stock!
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};

// ============= AI RECOMMENDATIONS SECTION =============
const AIRecommendations = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    skinType: '',
    concerns: [],
    budget: '',
    experience: ''
  });

  const steps = [
    {
      title: "What's your skin type?",
      options: ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal']
    },
    {
      title: "Primary concerns?",
      options: ['Anti-aging', 'Hydration', 'Acne', 'Brightening', 'Texture']
    },
    {
      title: "Your budget range?",
      options: ['$50-100', '$100-200', '$200-500', '$500+']
    }
  ];

  return (
    <motion.section className={styles.aiSection}>
      <div className={styles.aiContainer}>
        <motion.div 
          className={styles.aiHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
                        <FiCpu className={styles.aiIcon} />
          <h2>AI Personal Skincare Advisor</h2>
          <p>Get personalized recommendations in 30 seconds</p>
        </motion.div>

        <div className={styles.aiWizard}>
          {/* Progress Bar */}
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progress}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Question Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className={styles.stepContent}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <h3>{steps[currentStep].title}</h3>
              <div className={styles.options}>
                {steps[currentStep].options.map((option, i) => (
                  <motion.button
                    key={i}
                    className={styles.optionBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (currentStep < steps.length - 1) {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className={styles.navigation}>
            {currentStep > 0 && (
              <button onClick={() => setCurrentStep(currentStep - 1)}>
                <FiChevronLeft /> Back
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button className={styles.getResults}>
                <FiTarget /> Get My Recommendations
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// ============= SOCIAL PROOF SECTION =============
const SocialProofSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Dermatologist",
      image: "/images/testimonial1.jpg",
      text: "The exosome technology is revolutionary. I've seen remarkable results in my patients.",
      rating: 5,
      verified: true
    },
    {
      name: "Maria Rodriguez",
      role: "Aesthetician",
      image: "/images/testimonial2.jpg",
      text: "My clients love the immediate results. It's become our signature treatment.",
      rating: 5,
      verified: true
    }
  ];

  return (
    <motion.section className={styles.socialProof}>
      <div className={styles.proofContainer}>
        {/* Live Activity Feed */}
        <motion.div 
          className={styles.activityFeed}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3><FiUsers /> Live Activity</h3>
          <div className={styles.feedItems}>
            <motion.div 
              className={styles.feedItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.feedIcon}>🛒</div>
              <div className={styles.feedText}>
                <strong>Lisa M.</strong> just purchased Exosome Serum
                <span className={styles.feedTime}>2 min ago</span>
              </div>
            </motion.div>
            <motion.div 
              className={styles.feedItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.feedIcon}>⭐</div>
              <div className={styles.feedText}>
                <strong>Dr. James</strong> rated Premium Kit 5 stars
                <span className={styles.feedTime}>5 min ago</span>
              </div>
            </motion.div>
            <motion.div 
              className={styles.feedItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className={styles.feedIcon}>👁️</div>
              <div className={styles.feedText}>
                <strong>47 professionals</strong> viewing this product
                <span className={styles.feedTime}>Now</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div 
          className={styles.testimonials}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3><FiStar /> Professional Reviews</h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              className={styles.testimonialCard}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className={styles.testimonialHeader}>
                <img src={testimonials[activeTestimonial].image} alt="Reviewer" />
                <div className={styles.reviewerInfo}>
                  <h4>{testimonials[activeTestimonial].name}</h4>
                  <p>{testimonials[activeTestimonial].role}</p>
                  {testimonials[activeTestimonial].verified && (
                    <span className={styles.verified}>
                      <FiCheckCircle /> Verified Professional
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.testimonialContent}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} className={styles.starFilled} />
                  ))}
                </div>
                <p>"{testimonials[activeTestimonial].text}"</p>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className={styles.testimonialNav}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={activeTestimonial === i ? styles.active : ''}
                onClick={() => setActiveTestimonial(i)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// ============= MAIN ENHANCED PRODUCT PAGE COMPONENT =============
export default function ProductPageEnhanced({ products = [] }: any) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock products if none provided
  const mockProducts = products.length > 0 ? products : [
    {
      id: 1,
      name: "Exosome Rejuvenation Serum",
      description: "20B synthetic exosomes for cellular renewal",
      price: 299,
      originalPrice: 399,
      discount: 25,
      image: "/images/product1.jpg",
      thumbnail: "/images/thumb1.jpg",
      video: "/videos/product1.mp4",
      rating: 4.9,
      reviews: 234,
      stock: 7,
      isNew: true,
      isBestseller: true,
      benefits: ["Reduces wrinkles", "Increases hydration", "Improves texture"]
    },
    {
      id: 2,
      name: "Professional Treatment Kit",
      description: "Complete professional-grade skincare system",
      price: 899,
      originalPrice: 1199,
      discount: 25,
      image: "/images/product2.jpg",
      thumbnail: "/images/thumb2.jpg",
      rating: 4.8,
      reviews: 156,
      stock: 15,
      isBestseller: true,
      benefits: ["Clinical results", "Full treatment", "Professional grade"]
    },
    {
      id: 3,
      name: "Daily Defense Complex",
      description: "Advanced protection and repair formula",
      price: 189,
      image: "/images/product3.jpg",
      thumbnail: "/images/thumb3.jpg",
      rating: 4.7,
      reviews: 89,
      stock: 23,
      isNew: true,
      benefits: ["UV protection", "Antioxidants", "Daily repair"]
    }
  ];

  return (
    <div className={styles.enhancedProductPage}>
      {/* Hero Section with 3D Showcase */}
      <Hero3DShowcase products={mockProducts} />
      
      {/* AI Recommendations */}
      <AIRecommendations />
      
      {/* Interactive Product Grid */}
      <InteractiveProductGrid products={mockProducts} />
      
      {/* Social Proof */}
      <SocialProofSection />
      
      {/* Floating Action Bar */}
      <motion.div 
        className={styles.floatingBar}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <button className={styles.floatingBtn}>
          <FiFilter /> Smart Filter
        </button>
        <button className={styles.floatingBtn}>
                      <FiCpu /> AI Assistant
        </button>
        <button className={styles.floatingBtn}>
          <FiTarget /> Compare
        </button>
        <button className={`${styles.floatingBtn} ${styles.primary}`}>
          <FiShoppingCart /> Cart (3)
        </button>
      </motion.div>
    </div>
  );
}