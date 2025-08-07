'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiPlay, FiPause, FiVolume2, FiVolumeX, FiUser, FiStar,
  FiShoppingCart, FiArrowRight, FiGift, FiZap, FiShield,
  FiHeart, FiTarget, FiTrendingUp, FiAward, FiUsers,
  FiCalendar, FiMapPin, FiClock, FiCheckCircle, FiCamera,
  FiEye, FiRefreshCw
} from 'react-icons/fi';

// Import existing sections
import Intro from '@/components/sections/Intro/Intro';
import About from '@/components/sections/About/About';
import Solution from '@/components/sections/Solution/Solution';
import Synergy from '@/components/sections/Synergy/Synergy';
import HowCanBeUsed from '@/components/sections/HowCanBeUsed/HowCanBeUsed';
import Reviews from '@/components/sections/Reviews/Reviews';
import Gallery from '@/components/sections/Gallery/Gallery';
import Faq from '@/components/sections/Faq/Faq';
import Mission from '@/components/sections/Mission/Mission';

import MemberLogin from '@/components/auth/MemberLogin/MemberLogin';
import { Product, getAllProducts } from '@/lib/services/productService';
import { Event, eventService } from '@/lib/services/eventService';
import styles from './IntegratedHomepage.module.scss';

interface IntegratedHomepageProps {
  locale: string;
  initialProducts?: Product[];
  initialEvents?: Event[];
}

export default function IntegratedHomepage({ 
  locale, 
  initialProducts = [], 
  initialEvents = [] 
}: IntegratedHomepageProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  
  // State management
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [showMemberLogin, setShowMemberLogin] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [featuredProduct, setFeaturedProduct] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 28, seconds: 45 });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const textY = useTransform(scrollY, [0, 300], [0, -50]);

  // Featured products data (combining existing mock data)
  const featuredProducts = useMemo(() => [
    {
      id: '1',
      name: t('products.hero.title'),
      description: 'Revolutionary anti-aging serum with synthetic exosomes',
      price: 299,
      originalPrice: 399,
      image: '/images/products/exosignal-spray-main.jpg',
      rating: 4.9,
      reviewCount: 1247,
      bestSeller: true,
      inStock: true
    },
    {
      id: '2',
      name: 'PDRN Renewal Complex',
      description: 'Advanced PDRN technology for skin regeneration',
      price: 259,
      originalPrice: 329,
      image: '/images/products/pdrn-serum-main.jpg',
      rating: 4.8,
      reviewCount: 892,
      bestSeller: false,
      inStock: true
    },
    {
      id: '3',
      name: 'V-Tech System Kit',
      description: 'Complete exosome therapy solution',
      price: 449,
      originalPrice: 599,
      image: '/images/products/vtech-system-main.jpg',
      rating: 5.0,
      reviewCount: 456,
      bestSeller: true,
      inStock: true
    }
  ], [t]);

  // Member benefits
  const memberBenefits = useMemo(() => [
    {
      icon: <FiGift />,
      title: t('navigation.member'),
      benefit: 'Up to 25% off',
      color: '#FF6B6B'
    },
    {
      icon: <FiZap />,
      title: 'Early Access',
      benefit: 'New products first',
      color: '#60A5FA'
    },
    {
      icon: <FiHeart />,
      title: 'Consultation',
      benefit: 'Free skin analysis',
      color: '#EC4899'
    },
    {
      icon: <FiStar />,
      title: 'Exclusive',
      benefit: 'Members-only content',
      color: '#FFD700'
    }
  ], [t]);

  useEffect(() => {
    // Load products and events
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, eventsData] = await Promise.all([
          getAllProducts(),
          eventService.getEvents()
        ]);
        setProducts(productsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (initialProducts.length === 0 || initialEvents.length === 0) {
      loadData();
    }

    // Auto-rotate featured products
    const productInterval = setInterval(() => {
      setFeaturedProduct((prev) => (prev + 1) % featuredProducts.length);
    }, 8000);

    // Timer countdown
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(productInterval);
      clearInterval(timerInterval);
    };
  }, [initialProducts.length, initialEvents.length, featuredProducts.length]);

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleSoundToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsSoundOn(!videoRef.current.muted);
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <div ref={containerRef} className={styles.integratedHomepage}>
      {/* Enhanced Hero Section with Video Background */}
      <section className={styles.heroSection}>
        <motion.div 
          className={styles.videoContainer}
          style={{ y: heroY }}
        >
          <video
            ref={videoRef}
            className={styles.backgroundVideo}
            autoPlay
            muted={!isSoundOn}
            loop
            playsInline
            onLoadedData={handleVideoLoad}
          >
            <source src="/videos/eventIntroVideo.webm" type="video/webm" />
            <source src="/videos/mitovideomobile.mp4" type="video/mp4" />
          </video>
          
          {/* Video overlay */}
          <div className={styles.videoOverlay} />
          
          {/* Video controls */}
          <div className={styles.videoControls}>
            <button
              className={styles.controlBtn}
              onClick={handleVideoToggle}
              aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
            >
              {isVideoPlaying ? <FiPause /> : <FiPlay />}
            </button>
            
            <button
              className={styles.controlBtn}
              onClick={handleSoundToggle}
              aria-label={isSoundOn ? 'Mute video' : 'Unmute video'}
            >
              {isSoundOn ? <FiVolume2 /> : <FiVolumeX />}
            </button>
          </div>
        </motion.div>

        {/* Hero Content - Enhanced Intro Section */}
        <motion.div 
          className={styles.heroContent}
          style={{ y: textY }}
        >
          <div className={styles.heroText}>
            <motion.div
              className={styles.membershipBadge}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {session ? (
                <div className={styles.welcomeBack}>
                  <FiStar />
                  Welcome back, {session.user?.name?.split(' ')[0] || 'Member'}
                  <span className={styles.premiumBadge}>PREMIUM</span>
                </div>
              ) : (
                <button
                  className={styles.memberLoginBtn}
                  onClick={() => setShowMemberLogin(true)}
                >
                  <FiUser />
                  {t('navigation.member')}
                  <span className={styles.benefits}>25% OFF</span>
                </button>
              )}
            </motion.div>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('intro.title')}
            </motion.h1>

            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('intro.subtitle')}
            </motion.p>

            <motion.div
              className={styles.heroActions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link href={`/${locale}/products`} className={styles.primaryCta}>
                <FiShoppingCart />
                {t('intro.exploreProducts')}
                <FiArrowRight />
              </Link>

              <Link href={`/${locale}/about`} className={styles.secondaryCta}>
                {t('intro.learnMore')}
              </Link>
            </motion.div>

            {/* Event countdown timer */}
            <motion.div
              className={styles.eventCountdown}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <h3>{t('intro.eventSubtitle1')}</h3>
              <div className={styles.countdownTimer}>
                <div className={styles.timeUnit}>
                  <span className={styles.number}>{timeLeft.days.toString().padStart(2, '0')}</span>
                  <span className={styles.label}>Days</span>
                </div>
                <div className={styles.separator}>:</div>
                <div className={styles.timeUnit}>
                  <span className={styles.number}>{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span className={styles.label}>Hours</span>
                </div>
                <div className={styles.separator}>:</div>
                <div className={styles.timeUnit}>
                  <span className={styles.number}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className={styles.label}>Min</span>
                </div>
                <div className={styles.separator}>:</div>
                <div className={styles.timeUnit}>
                  <span className={styles.number}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span className={styles.label}>Sec</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Member Benefits Showcase */}
          <motion.div
            className={styles.memberBenefitsGrid}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {memberBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className={styles.benefitCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div 
                  className={styles.benefitIcon}
                  style={{ backgroundColor: benefit.color + '20', color: benefit.color }}
                >
                  {benefit.icon}
                </div>
                <div className={styles.benefitContent}>
                  <h4>{benefit.title}</h4>
                  <p>{benefit.benefit}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Featured Products</h2>
            <p>Discover our revolutionary V-Tech exosome technology</p>
          </motion.div>

          <div className={styles.featuredProductsCarousel}>
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredProduct}
                className={styles.productShowcase}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.productImage}>
                  <Image
                    src={featuredProducts[featuredProduct].image}
                    alt={featuredProducts[featuredProduct].name}
                    width={400}
                    height={400}
                    className={styles.productImg}
                  />
                  {featuredProducts[featuredProduct].bestSeller && (
                    <span className={styles.bestSellerBadge}>
                      <FiStar />
                      Best Seller
                    </span>
                  )}
                </div>

                <div className={styles.productInfo}>
                  <div className={styles.productRating}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={i < Math.floor(featuredProducts[featuredProduct].rating) ? styles.starFilled : styles.starEmpty} 
                      />
                    ))}
                    <span className={styles.ratingText}>
                      {featuredProducts[featuredProduct].rating} ({featuredProducts[featuredProduct].reviewCount} reviews)
                    </span>
                  </div>

                  <h3>{featuredProducts[featuredProduct].name}</h3>
                  <p>{featuredProducts[featuredProduct].description}</p>

                  <div className={styles.priceContainer}>
                    <span className={styles.currentPrice}>
                      ${featuredProducts[featuredProduct].price}
                    </span>
                    <span className={styles.originalPrice}>
                      ${featuredProducts[featuredProduct].originalPrice}
                    </span>
                    <span className={styles.discount}>
                      {Math.round((1 - featuredProducts[featuredProduct].price / featuredProducts[featuredProduct].originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  <div className={styles.productActions}>
                    <button className={styles.addToCartBtn}>
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                    <Link 
                      href={`/${locale}/products/${featuredProducts[featuredProduct].id}`}
                      className={styles.learnMoreBtn}
                    >
                      Learn More
                    </Link>
                  </div>

                  {!session && (
                    <div className={styles.memberDiscount}>
                      <FiGift />
                      <span>Members get 25% off!</span>
                      <button onClick={() => setShowMemberLogin(true)}>
                        Join Now
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Existing Sections - Enhanced with new animations */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <About />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Solution />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Synergy />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <HowCanBeUsed />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Reviews />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Gallery />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Faq />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Mission />
      </motion.div>

      {/* Member Login Modal */}
      <MemberLogin
        isOpen={showMemberLogin}
        onClose={() => setShowMemberLogin(false)}
        showBenefits={true}
        redirectPath={`/${locale}`}
      />
    </div>
  );
}