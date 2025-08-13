'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiShoppingCart, FiStar, FiArrowRight, FiGift, FiZap, FiShield,
  FiTruck, FiRefreshCw, FiEye, FiHeart, FiCpu, FiAward,
  FiUsers, FiCalendar, FiMapPin, FiClock, FiCheckCircle,
  FiTrendingUp, FiBarChart, FiBookOpen, FiMic, FiTarget,
  FiPhoneCall, FiMail, FiPlay, FiAlertCircle, FiCamera,
  FiPause, FiVolume2, FiVolumeX, FiUser
} from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import MemberLogin from '@/components/auth/MemberLogin/MemberLogin';
import styles from './HomePageEnhanced.module.scss';

import { Product, getAllProducts } from '@/lib/services/productService';
import { Event, eventService } from '@/lib/services/eventService';

interface HomePageEnhancedProps {
  initialProducts?: Product[];
  initialEvents?: Event[];
  showClassicToggle?: boolean;
  locale?: string;
}

const HomePageEnhanced = ({ initialProducts = [], initialEvents = [], showClassicToggle = false, locale = 'en' }: HomePageEnhancedProps) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 28, seconds: 45 });
  
  // Video controls
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [showMemberLogin, setShowMemberLogin] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const textY = useTransform(scrollY, [0, 300], [0, -50]);

  // Mock data for demo
  const featuredProducts = useMemo(() => [
    {
      id: '1',
      name: 'Exosome Renewal Serum',
      description: 'Revolutionary anti-aging serum with synthetic exosomes',
      price: 299,
      originalPrice: 399,
      image: '/images/products/exosignal-spray-main.jpg',
      rating: 4.9,
      reviewCount: 1247,
      bestSeller: true,
      inventory: 3
    },
    {
      id: '2',
      name: 'Cellular Regeneration Complex',
      description: 'Advanced formula for deep skin renewal',
      price: 449,
      originalPrice: 599,
      image: '/images/products/pdrn-serum-main.jpg',
      rating: 4.8,
      reviewCount: 892,
      featured: true,
      inventory: 7
    },
    {
      id: '3',
      name: 'Professional Exosome Kit',
      description: 'Complete professional treatment system',
      price: 899,
      originalPrice: 1199,
      image: '/images/placeholder-product.svg',
      rating: 5.0,
      reviewCount: 445,
      bestSeller: true,
      inventory: 12
    },
    {
      id: '4',
      name: 'Youth Restoration Cream',
      description: 'Intensive night treatment with exosome technology',
      price: 199,
      originalPrice: 249,
      image: '/images/placeholder-product.svg',
      rating: 4.7,
      reviewCount: 634,
      featured: true,
      inventory: 8
    }
  ], []);

  const upcomingEvents = useMemo(() => [
    {
      id: '1',
      title: 'Exosome Mastery Workshop',
      date: '2024-03-15',
      location: 'Tel Aviv Medical Center',
      price: 450,
      image: '/images/placeholder-event.jpg',
      registeredCount: 127,
      capacity: 150,
      type: 'training'
    },
    {
      id: '2',
      title: 'Advanced Aesthetic Medicine Conference',
      date: '2024-04-20',
      location: 'David InterContinental',
      price: 650,
      image: '/images/placeholder-event.jpg',
      registeredCount: 342,
      capacity: 500,
      type: 'conference'
    }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: 'Dr. Sarah Cohen',
      role: 'Dermatologist',
      text: 'MitoDerm\'s exosome products have revolutionized my practice. Patient satisfaction has increased by 90%.',
      rating: 5,
      image: '/images/placeholder-team.svg'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Satisfied Customer',
      text: 'After 4 weeks of using the Renewal Serum, my skin looks 10 years younger. Absolutely incredible results!',
      rating: 5,
      image: '/images/placeholder-team.svg'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Aesthetic Clinic Owner',
      text: 'The professional training and products from MitoDerm have transformed our clinic\'s offerings.',
      rating: 5,
      image: '/images/placeholder-team.svg'
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

  // Video control functions
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

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
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

    return () => clearInterval(timer);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Load products if needed
  useEffect(() => {
    if (initialProducts.length === 0 && products.length === 0) {
      setIsLoading(true);
      getAllProducts()
        .then(data => {
          setProducts(data.slice(0, 8));
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [initialProducts, products]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Hero Section with Video Background */}
      <section className={styles.heroSection} style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <motion.div 
          className={styles.videoContainer}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 1,
            y: heroY 
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.7)'
            }}
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
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.7) 0%, rgba(31, 41, 55, 0.5) 50%, rgba(55, 65, 81, 0.3) 100%)'
          }} />
          
          {/* Video controls */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 3
          }}>
            <button
              onClick={handleVideoToggle}
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
              aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
            >
              {isVideoPlaying ? <FiPause /> : <FiPlay />}
            </button>
            
            <button
              onClick={handleSoundToggle}
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
              aria-label={isSoundOn ? 'Mute video' : 'Unmute video'}
            >
              {isSoundOn ? <FiVolume2 /> : <FiVolumeX />}
            </button>
          </div>
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          style={{ 
            position: 'relative', 
            zIndex: 2, 
            maxWidth: '1200px', 
            width: '100%', 
            padding: '0 2rem', 
            textAlign: 'center', 
            color: 'white',
            y: textY
          }}
        >
          <div style={{ marginBottom: '4rem' }}>
            <motion.div
              style={{ marginBottom: '2rem' }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {session ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.8rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  borderRadius: '25px',
                  backdropFilter: 'blur(10px)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  <FiStar style={{ color: '#FFD700', fontSize: '1.1rem' }} />
                  Welcome back, {session.user?.name?.split(' ')[0] || 'Member'}
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#1F2937',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>PREMIUM</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowMemberLogin(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0.8rem 1.8rem',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(167, 139, 250, 0.9) 100%)',
                    border: 'none',
                    borderRadius: '25px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                  }}
                >
                  <FiUser style={{ fontSize: '1.1rem' }} />
                  {t('navigation.member')}
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>25% OFF</span>
                </button>
              )}
            </motion.div>

            <motion.h1
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                margin: '0 0 1.5rem 0',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(96, 165, 250, 0.9) 50%, rgba(236, 72, 153, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('intro.title')}
            </motion.h1>

            <motion.p
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontWeight: 300,
                lineHeight: 1.4,
                margin: '0 0 3rem 0',
                opacity: 0.95,
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('intro.subtitle')}
            </motion.p>

            <motion.div
              style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link 
                href={`/${locale}/products`} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '16px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 20px rgba(96, 165, 250, 0.4)'
                }}
              >
                <FiShoppingCart style={{ fontSize: '1.2rem' }} />
                {t('intro.exploreProducts')}
                <FiArrowRight />
              </Link>

              <Link 
                href={`/${locale}/about`} 
                style={{
                  padding: '1rem 2rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  textDecoration: 'none',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)'
                }}
              >
                {t('intro.learnMore')}
              </Link>
            </motion.div>
          </div>

          {/* Member Benefits Grid */}
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              maxWidth: '900px',
              margin: '0 auto'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {memberBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0,
                    backgroundColor: benefit.color + '20',
                    color: benefit.color
                  }}
                >
                  {benefit.icon}
                </div>
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    margin: '0 0 0.3rem 0',
                    color: 'white'
                  }}>{benefit.title}</h4>
                  <p style={{
                    fontSize: '0.85rem',
                    opacity: 0.8,
                    margin: 0,
                    color: 'white'
                  }}>{benefit.benefit}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Background Pattern */}
      <motion.section 
        className={styles.heroSection}
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(190, 128, 12, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(223, 186, 116, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />

        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 20px', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Limited Offer Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #940030, #dc2626)',
              color: '#ffffff',
              padding: '12px 25px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: 700,
              marginBottom: '30px',
              boxShadow: '0 10px 30px rgba(148, 0, 48, 0.3)'
            }}
          >
            <FiZap style={{ fontSize: '20px' }} />
            LIMITED TIME: 35% OFF ALL PRODUCTS
          </motion.div>

          {/* Main Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '25px',
              color: '#ffffff'
            }}
          >
            Transform Your Skin with
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #be800c 0%, #dfba74 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none'
            }}>
              Synthetic Exosomes
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: '#dfba74',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
              fontWeight: 500
            }}
          >
            Clinically proven results • 92% skin improvement • Visible changes in 4 weeks
            <br />
            Join 50,000+ satisfied customers worldwide
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginBottom: '50px',
              flexWrap: 'wrap'
            }}
          >
            <Link 
              href="#products"
              style={{
                background: 'linear-gradient(135deg, #be800c, #dfba74)',
                color: '#000000',
                padding: '18px 45px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 15px 40px rgba(190, 128, 12, 0.4)',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(190, 128, 12, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(190, 128, 12, 0.4)';
              }}
            >
              <FiShoppingCart style={{ fontSize: '20px' }} />
              Shop Best Sellers
            </Link>
            
            <button
              style={{
                background: 'transparent',
                border: '3px solid #be800c',
                color: '#dfba74',
                padding: '15px 35px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#be800c';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#dfba74';
              }}
            >
              <FiGift style={{ fontSize: '20px' }} />
              Get Free Sample
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            {[
              { icon: FiShield, text: 'FDA Approved' },
              { icon: FiTruck, text: 'Free Shipping' },
              { icon: FiRefreshCw, text: '30-Day Guarantee' },
              { icon: FiStar, text: '4.9/5 Rating' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 500
              }}>
                <item.icon style={{ color: '#dfba74', fontSize: '20px' }} />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Sale Countdown Timer */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, #940030, #dc2626)',
          padding: '30px 0',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h3 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
            ⏰ Sale Ends Soon - Don't Miss Out!
          </h3>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '15px',
                borderRadius: '15px',
                minWidth: '80px'
              }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '5px'
                }}>
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section
        id="products"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          background: '#f8ecd6',
          padding: '80px 0',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 900,
                color: '#1a1a1a',
                marginBottom: '20px'
              }}
            >
              🔥 Best Selling <span style={{ color: '#be800c' }}>Exosome Products</span>
            </motion.h2>
            <p style={{
              fontSize: '20px',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Revolutionary synthetic exosome technology for professional-grade results at home
            </p>
          </div>

          {/* Products Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -15, transition: { duration: 0.3 } }}
                style={{
                  background: '#ffffff',
                  borderRadius: '25px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  position: 'relative',
                  border: '3px solid transparent',
                  backgroundClip: 'padding-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '3px solid #be800c';
                  e.currentTarget.style.boxShadow = '0 25px 80px rgba(190, 128, 12, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '3px solid transparent';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1)';
                }}
              >
                {/* Product Badges */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 3 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {product.bestSeller && (
                      <span style={{
                        background: 'linear-gradient(135deg, #be800c, #dfba74)',
                        color: '#ffffff',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                      }}>
                        🏆 Best Seller
                      </span>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span style={{
                        background: '#940030',
                        color: '#ffffff',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 700
                      }}>
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Image */}
                <div style={{ height: '280px', background: '#f5f5f5', position: 'relative' }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={280}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Product Content */}
                <div style={{ padding: '30px' }}>
                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', color: '#dfba74' }}>
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} style={{ 
                          fontSize: '18px',
                          fill: i < Math.floor(product.rating) ? '#dfba74' : 'none' 
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#be800c' }}>
                      {product.rating}
                    </span>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      ({product.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '12px',
                    lineHeight: 1.3
                  }}>
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '16px',
                    color: '#666',
                    marginBottom: '20px',
                    lineHeight: 1.5
                  }}>
                    {product.description}
                  </p>

                  {/* Exosome Technology Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(190, 128, 12, 0.1)',
                    padding: '12px',
                    borderRadius: '15px',
                    marginBottom: '20px'
                  }}>
                    <FiCpu style={{ color: '#be800c', fontSize: '20px' }} />
                    <span style={{ color: '#be800c', fontWeight: 600, fontSize: '14px' }}>
                      Advanced Synthetic Exosome Technology
                    </span>
                  </div>

                  {/* Price Section */}
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '32px',
                        fontWeight: 900,
                        color: '#be800c'
                      }}>
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span style={{
                          fontSize: '20px',
                          color: '#999',
                          textDecoration: 'line-through'
                        }}>
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    {product.inventory && product.inventory < 10 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#940030',
                        fontSize: '14px',
                        fontWeight: 600
                      }}>
                        <FiAlertCircle />
                        Only {product.inventory} left in stock!
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #be800c, #dfba74)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '15px',
                      borderRadius: '15px',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease'
                    }}>
                      <FiShoppingCart />
                      Add to Cart
                    </button>
                    
                    <Link 
                      href={`/products/${product.id}`}
                      style={{
                        background: 'transparent',
                        border: '2px solid #be800c',
                        color: '#be800c',
                        padding: '15px 20px',
                        borderRadius: '15px',
                        fontSize: '16px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FiEye />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Products CTA */}
          <div style={{ textAlign: 'center' }}>
            <Link 
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '15px',
                background: '#1a1a1a',
                color: '#dfba74',
                padding: '20px 50px',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 15px 40px rgba(26, 26, 26, 0.3)'
              }}
            >
              View All Products
              <FiArrowRight style={{ fontSize: '24px' }} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Interactive Exosome Microscope Viewer */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, #000000, #1a1a1a)',
          padding: '100px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 900,
                color: '#dfba74',
                marginBottom: '20px'
              }}
            >
              🔬 See The Science <span style={{ color: '#be800c' }}>Live</span>
            </motion.h2>
            <p style={{
              fontSize: '20px',
              color: '#999',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Explore synthetic exosomes in real-time with our interactive microscope
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '60px',
            alignItems: 'center'
          }}>
            {/* Microscope Viewer */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{
                background: 'radial-gradient(circle at center, rgba(190, 128, 12, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                width: '500px',
                height: '500px',
                margin: '0 auto',
                position: 'relative',
                border: '3px solid rgba(223, 186, 116, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Animated Exosomes */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '30px',
                    height: '30px',
                    background: 'radial-gradient(circle, #dfba74, #be800c)',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px rgba(223, 186, 116, 0.6)'
                  }}
                  animate={{
                    x: [0, Math.cos(i * 30 * Math.PI / 180) * 150, 0],
                    y: [0, Math.sin(i * 30 * Math.PI / 180) * 150, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 5 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              {/* Center Cell */}
              <motion.div
                style={{
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, rgba(190, 128, 12, 0.3), transparent)',
                  borderRadius: '50%',
                  border: '2px solid #be800c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <FiCpu style={{ fontSize: '40px', color: '#dfba74' }} />
              </motion.div>

              {/* Magnification Controls */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '10px',
                background: 'rgba(0,0,0,0.8)',
                padding: '10px 20px',
                borderRadius: '25px'
              }}>
                {['100x', '500x', '1000x'].map((mag) => (
                  <button
                    key={mag}
                    style={{
                      background: mag === '500x' ? '#be800c' : 'transparent',
                      color: mag === '500x' ? '#ffffff' : '#dfba74',
                      border: '1px solid #be800c',
                      padding: '5px 15px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {mag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Science Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#dfba74',
                marginBottom: '20px'
              }}>
                What You're Seeing
              </h3>
              
              <div style={{ marginBottom: '30px' }}>
                {[
                  { title: 'Synthetic Exosomes', desc: 'Nano-sized vesicles carrying regenerative signals' },
                  { title: 'Cellular Interaction', desc: 'Direct communication with skin cells' },
                  { title: 'Absorption Process', desc: '90% penetration rate within 30 minutes' },
                  { title: 'Regeneration Activation', desc: 'Triggers natural collagen production' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    marginBottom: '20px'
                  }}>
                    <FiCheckCircle style={{ color: '#be800c', fontSize: '20px', marginTop: '3px' }} />
                    <div>
                      <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '18px' }}>
                        {item.title}
                      </div>
                      <div style={{ color: '#999', fontSize: '16px' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button style={{
                background: 'linear-gradient(135deg, #be800c, #dfba74)',
                color: '#ffffff',
                border: 'none',
                padding: '15px 35px',
                borderRadius: '25px',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FiPlay />
                Watch Full Animation
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* MitoAI - All-in-One Management System */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, #f8ecd6, #ffffff)',
          padding: '100px 0',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #940030, #dc2626)',
                color: '#ffffff',
                padding: '10px 25px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 700,
                marginBottom: '20px'
              }}
            >
              🤖 POWERED BY AI
            </motion.div>
            
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900,
              color: '#1a1a1a',
              marginBottom: '20px'
            }}>
              Meet <span style={{
                background: 'linear-gradient(135deg, #be800c, #dfba74)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>MitoAI</span>
            </h2>
            <p style={{
              fontSize: '22px',
              color: '#666',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Your intelligent assistant for business, professional, and personal skincare management
            </p>
          </div>

          {/* Three Tier System */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* Professional Tier */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              style={{
                background: '#ffffff',
                borderRadius: '25px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: '3px solid #be800c',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '30px',
                background: 'linear-gradient(135deg, #be800c, #dfba74)',
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 700
              }}>
                PROFESSIONAL
              </div>

              <FiAward style={{ fontSize: '40px', color: '#be800c', marginBottom: '20px' }} />
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: '15px'
              }}>
                For Medical Professionals
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                {[
                  'Patient management system',
                  'Treatment protocol library',
                  'ROI & revenue calculator',
                  'Certification tracking',
                  'Bulk ordering portal',
                  'Marketing materials'
                ].map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                    color: '#666'
                  }}>
                    <FiCheckCircle style={{ color: '#be800c' }} />
                    {item}
                  </li>
                ))}
              </ul>

              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #be800c, #dfba74)',
                color: '#ffffff',
                border: 'none',
                padding: '15px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Start Professional Trial
              </button>
            </motion.div>

            {/* Business Tier */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              style={{
                background: '#1a1a1a',
                borderRadius: '25px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                position: 'relative',
                transform: 'scale(1.05)'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '30px',
                background: 'linear-gradient(135deg, #940030, #dc2626)',
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 700
              }}>
                MOST POPULAR
              </div>

              <FiTrendingUp style={{ fontSize: '40px', color: '#dfba74', marginBottom: '20px' }} />
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#dfba74',
                marginBottom: '15px'
              }}>
                For Business Owners
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                {[
                  'Inventory management AI',
                  'Staff training modules',
                  'Customer analytics',
                  'Automated marketing',
                  'Financial reporting',
                  'Multi-location support'
                ].map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                    color: '#999'
                  }}>
                    <FiCheckCircle style={{ color: '#dfba74' }} />
                    {item}
                  </li>
                ))}
              </ul>

              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #940030, #dc2626)',
                color: '#ffffff',
                border: 'none',
                padding: '15px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Get Business Access
              </button>
            </motion.div>

            {/* Personal Tier */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              style={{
                background: '#ffffff',
                borderRadius: '25px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                border: '3px solid rgba(223, 186, 116, 0.3)',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '30px',
                background: 'linear-gradient(135deg, #666, #999)',
                color: '#ffffff',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 700
              }}>
                PERSONAL
              </div>

              <FiHeart style={{ fontSize: '40px', color: '#be800c', marginBottom: '20px' }} />
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: '15px'
              }}>
                For Individual Users
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                {[
                  'Skin analysis tool',
                  'Personalized routines',
                  'Progress tracking',
                  'Product recommendations',
                  'Virtual consultations',
                  'Rewards program'
                ].map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                    color: '#666'
                  }}>
                    <FiCheckCircle style={{ color: '#be800c' }} />
                    {item}
                  </li>
                ))}
              </ul>

              <button style={{
                width: '100%',
                background: 'transparent',
                color: '#be800c',
                border: '2px solid #be800c',
                padding: '13px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                Start Free Trial
              </button>
            </motion.div>
          </div>

          {/* MitoAI Features Grid */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(190, 128, 12, 0.1), transparent)',
            borderRadius: '30px',
            padding: '40px',
            marginTop: '60px'
          }}>
            <h3 style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              🚀 MitoAI Capabilities
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              {[
                { icon: FiBarChart, title: 'Smart Analytics', desc: 'Real-time business insights' },
                { icon: FiUsers, title: 'CRM Integration', desc: 'Complete customer management' },
                { icon: FiTruck, title: 'Supply Chain AI', desc: 'Automated inventory ordering' },
                { icon: FiMail, title: 'Marketing Automation', desc: 'AI-powered campaigns' },
                { icon: FiShield, title: 'Compliance Tracking', desc: 'Regulatory management' },
                { icon: FiTrendingUp, title: 'Growth Predictions', desc: 'Revenue forecasting' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px'
                  }}
                >
                  <feature.icon style={{
                    fontSize: '30px',
                    color: '#be800c',
                    marginTop: '5px'
                  }} />
                  <div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#1a1a1a',
                      marginBottom: '5px'
                    }}>
                      {feature.title}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      {feature.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Skin Analysis Tool Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, #000000, #1a1a1a)',
          padding: '100px 0',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 900,
              color: '#dfba74',
              marginBottom: '20px'
            }}>
              📸 AI Skin Analysis
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#999',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Get instant personalized recommendations with our advanced AI skin scanner
            </p>
          </div>

          <div style={{
            background: 'rgba(190, 128, 12, 0.1)',
            borderRadius: '30px',
            padding: '60px',
            border: '2px solid rgba(223, 186, 116, 0.3)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #be800c, #dfba74)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiCamera style={{ fontSize: '60px', color: '#ffffff' }} />
                </div>
                <h3 style={{ color: '#dfba74', fontSize: '22px', marginBottom: '10px' }}>
                  Step 1: Scan
                </h3>
                <p style={{ color: '#999' }}>
                  Take a photo or upload an image of your skin
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #be800c, #dfba74)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiCpu style={{ fontSize: '60px', color: '#ffffff' }} />
                </div>
                <h3 style={{ color: '#dfba74', fontSize: '22px', marginBottom: '10px' }}>
                  Step 2: Analyze
                </h3>
                <p style={{ color: '#999' }}>
                  AI identifies concerns and skin type
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #be800c, #dfba74)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiGift style={{ fontSize: '60px', color: '#ffffff' }} />
                </div>
                <h3 style={{ color: '#dfba74', fontSize: '22px', marginBottom: '10px' }}>
                  Step 3: Personalize
                </h3>
                <p style={{ color: '#999' }}>
                  Get custom product recommendations
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <button style={{
                background: 'linear-gradient(135deg, #be800c, #dfba74)',
                color: '#ffffff',
                border: 'none',
                padding: '20px 50px',
                borderRadius: '30px',
                fontSize: '20px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 15px 40px rgba(190, 128, 12, 0.3)'
              }}>
                Try Free Skin Analysis
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Customer Testimonials */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, #000000, #1a1a1a)',
          padding: '80px 0',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#dfba74',
            marginBottom: '60px'
          }}>
            What Our Customers Say
          </h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              style={{
                maxWidth: '800px',
                margin: '0 auto',
                background: 'rgba(190, 128, 12, 0.1)',
                padding: '50px',
                borderRadius: '25px',
                border: '2px solid rgba(223, 186, 116, 0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <FiStar key={i} style={{ fontSize: '24px', color: '#dfba74', fill: '#dfba74' }} />
                ))}
              </div>
              
              <p style={{
                fontSize: '20px',
                color: '#ffffff',
                marginBottom: '30px',
                lineHeight: 1.6,
                fontStyle: 'italic'
              }}>
                "{testimonials[currentTestimonial].text}"
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <Image
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  width={60}
                  height={60}
                  style={{ borderRadius: '50%' }}
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#dfba74', fontWeight: 700, fontSize: '18px' }}>
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div style={{ color: '#999', fontSize: '16px' }}>
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentTestimonial ? '#dfba74' : 'rgba(223, 186, 116, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Professional Events */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          background: '#f8ecd6',
          padding: '80px 0'
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              color: '#1a1a1a',
              marginBottom: '20px'
            }}>
              Professional <span style={{ color: '#be800c' }}>Training & Events</span>
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#666',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Master exosome technology with hands-on training from industry experts
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '40px'
          }}>
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                  border: '2px solid transparent'
                }}
              >
                <div style={{ height: '200px', background: '#f5f5f5', position: 'relative' }}>
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={200}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    background: event.type === 'training' ? '#be800c' : '#940030',
                    color: '#ffffff',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {event.type === 'training' ? <FiTarget /> : <FiMic />}
                    {event.type}
                  </div>
                </div>

                <div style={{ padding: '30px' }}>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: '15px'
                  }}>
                    {event.title}
                  </h3>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <FiCalendar style={{ color: '#be800c' }} />
                      <span style={{ color: '#666' }}>{new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <FiMapPin style={{ color: '#be800c' }} />
                      <span style={{ color: '#666' }}>{event.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiUsers style={{ color: '#be800c' }} />
                      <span style={{ color: '#666' }}>{event.registeredCount}/{event.capacity} registered</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#be800c'
                    }}>
                      ${event.price}
                    </span>
                    <button style={{
                      background: 'linear-gradient(135deg, #be800c, #dfba74)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 25px',
                      borderRadius: '25px',
                      fontSize: '16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      Register Now
                      <FiArrowRight />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link 
              href="/events"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '15px',
                background: '#1a1a1a',
                color: '#dfba74',
                padding: '18px 40px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <FiCalendar />
              View All Events
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{
          background: 'linear-gradient(135deg, #be800c, #dfba74)',
          padding: '80px 0',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 900,
            color: '#000000',
            marginBottom: '25px'
          }}>
            Ready to Transform Your Skin?
          </h2>
          
          <p style={{
            fontSize: '22px',
            color: '#1a1a1a',
            marginBottom: '40px',
            fontWeight: 600
          }}>
            Join 50,000+ satisfied customers and see results in just 4 weeks
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/products"
              style={{
                background: '#000000',
                color: '#dfba74',
                padding: '20px 50px',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '15px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
              }}
            >
              <FiShoppingCart />
              Shop Now - 35% Off
            </Link>
            
            <Link 
              href="/contact"
              style={{
                background: 'transparent',
                border: '3px solid #000000',
                color: '#000000',
                padding: '17px 40px',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <FiPhoneCall />
              Get Expert Advice
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Member Login Modal */}
      <MemberLogin
        isOpen={showMemberLogin}
        onClose={() => setShowMemberLogin(false)}
        showBenefits={true}
        redirectPath={`/${locale}`}
      />
    </div>
  );
};

export default HomePageEnhanced;