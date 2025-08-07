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
  FiCalendar, FiMapPin, FiClock, FiCheckCircle, FiCamera
} from 'react-icons/fi';
import MemberLogin from '@/components/auth/MemberLogin/MemberLogin';
import styles from './NextGenHomepage.module.scss';

interface NextGenHomepageProps {
  locale: string;
}

export default function NextGenHomepage({ locale }: NextGenHomepageProps) {
  const t = useTranslations();
  const { data: session } = useSession();
  
  // State management
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [showMemberLogin, setShowMemberLogin] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [featuredProduct, setFeaturedProduct] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const textY = useTransform(scrollY, [0, 300], [0, -50]);

  // Featured products data
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

  // Testimonials data
  const testimonials = useMemo(() => [
    {
      id: 1,
      name: 'Dr. Sarah Cohen',
      role: 'Aesthetic Physician',
      content: 'The V-Tech system has revolutionized my practice. Results are visible from the first treatment.',
      rating: 5,
      image: '/images/team/sarah-cohen.svg'
    },
    {
      id: 2,
      name: 'Rachel Green',
      role: 'Clinic Owner',
      content: 'My clients are amazed by the natural-looking results. This technology is game-changing.',
      rating: 5,
      image: '/images/team/rachel-green.svg'
    },
    {
      id: 3,
      name: 'Dr. David Levy',
      role: 'Dermatologist',
      content: 'The combination of exosomes and PDRN provides unprecedented regenerative results.',
      rating: 5,
      image: '/images/team/david-levy.svg'
    }
  ], []);

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
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // Auto-rotate featured products
    const productInterval = setInterval(() => {
      setFeaturedProduct((prev) => (prev + 1) % featuredProducts.length);
    }, 8000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(productInterval);
    };
  }, [testimonials.length, featuredProducts.length]);

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
    <div ref={containerRef} className={styles.nextGenHomepage}>
      {/* Hero Section with Video Background */}
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

        {/* Hero Content */}
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
                  Member Login
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
          </div>

          {/* Member Benefits Showcase */}
          <motion.div
            className={styles.memberBenefitsGrid}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {memberBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className={styles.benefitCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
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

      {/* Featured Product Showcase */}
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

            {/* Product Navigation Dots */}
            <div className={styles.productDots}>
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === featuredProduct ? styles.active : ''}`}
                  onClick={() => setFeaturedProduct(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>What Professionals Say</h2>
            <p>Trusted by medical professionals worldwide</p>
          </motion.div>

          <div className={styles.testimonialCarousel}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.testimonialAvatar}>
                  <Image
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    width={80}
                    height={80}
                  />
                </div>

                <div className={styles.testimonialContent}>
                  <div className={styles.testimonialRating}>
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <FiStar key={i} className={styles.star} />
                    ))}
                  </div>

                  <p className={styles.testimonialText}>
                    "{testimonials[currentTestimonial].content}"
                  </p>

                  <div className={styles.testimonialAuthor}>
                    <h4>{testimonials[currentTestimonial].name}</h4>
                    <p>{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className={styles.testimonialDots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentTestimonial ? styles.active : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Transform Your Practice?</h2>
            <p>Join thousands of medical professionals using V-Tech exosome technology</p>
            
            <div className={styles.ctaActions}>
              <Link href={`/${locale}/certification`} className={styles.primaryCta}>
                <FiShield />
                Get Certified
                <FiArrowRight />
              </Link>

              <Link href={`/${locale}/contact`} className={styles.secondaryCta}>
                <FiUsers />
                Contact Us
              </Link>
            </div>

            <div className={styles.ctaStats}>
              <div className={styles.stat}>
                <FiUsers />
                <span className={styles.number}>2,000+</span>
                <span className={styles.label}>Professionals</span>
              </div>
              <div className={styles.stat}>
                <FiAward />
                <span className={styles.number}>98%</span>
                <span className={styles.label}>Success Rate</span>
              </div>
              <div className={styles.stat}>
                <FiStar />
                <span className={styles.number}>4.9</span>
                <span className={styles.label}>Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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