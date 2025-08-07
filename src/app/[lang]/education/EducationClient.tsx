'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlay, FiFile, FiDownload, FiEye, FiClock, FiUser, FiTrendingUp, FiBookOpen, 
  FiVideo, FiStar, FiAward, FiLock, FiUnlock, FiCheckCircle, FiTarget, 
  FiBarChart, FiGift, FiZap, FiHeart, FiBookmark, FiShare2,
  FiArrowRight, FiArrowLeft, FiHome, FiShoppingCart, FiSearch, FiArrowDown,
  FiFilter, FiGrid, FiList, FiShare, FiExternalLink
} from 'react-icons/fi';
import { getMedia } from '@/lib/services/mediaService';
import { MediaItem, UserProgress, Category } from '@/types/media';
import { useOptimizedIntersectionObserver } from '@/utils/hooks/useOptimizedIntersectionObserver';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import styles from './education.module.scss';

export default function EducationClient() {
  const t = useTranslations('education');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'duration' | 'popularity'>('date');
  const [userProgress] = useState<UserProgress>({
    completedVideos: 12,
    totalVideos: 45,
    streak: 7,
    level: 3,
    xp: 1250,
    certifications: ['v-tech-basic', 'pdrn-advanced'],
    purchasedProducts: ['v-tech-system', 'pdrn-serum'],
    premiumAccess: false
  });
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellVideo, setUpsellVideo] = useState<MediaItem | null>(null);

  // Intersection observer for animations
  const { targetRef: heroRef, isIntersecting: heroVisible } = useOptimizedIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  const { targetRef: statsRef, isIntersecting: statsVisible } = useOptimizedIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true
  });

  const categories = useMemo((): Category[] => [
    { id: 'all', name: t('categories.all'), icon: FiVideo, color: '#6366f1', unlocked: true },
    { id: 'product', name: t('categories.product'), icon: FiStar, color: '#f59e0b', unlocked: true },
    { id: 'technology', name: t('categories.technology'), icon: FiBookOpen, color: '#10b981', unlocked: true },
    { id: 'how-to', name: t('categories.howTo'), icon: FiUser, color: '#8b5cf6', unlocked: true },
    { id: 'business', name: t('categories.business'), icon: FiTrendingUp, color: '#ef4444', unlocked: userProgress.premiumAccess },
    { id: 'advanced', name: t('categories.advanced'), icon: FiStar, color: '#06b6d4', unlocked: userProgress.premiumAccess },
    { id: 'new-products', name: t('categories.newProducts'), icon: FiVideo, color: '#84cc16', unlocked: true },
    { id: 'accounting', name: t('categories.accounting'), icon: FiFile, color: '#f97316', unlocked: userProgress.premiumAccess },
    { id: 'ai', name: t('categories.ai'), icon: FiTrendingUp, color: '#ec4899', unlocked: userProgress.premiumAccess }
  ], [t, userProgress.premiumAccess]);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const allMedia = await getMedia();
        setMediaItems(allMedia);
      } catch (error) {
        console.error('Error fetching media:', error);
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || 
                          item.category === activeCategory ||
                          item.tags.includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Sort media items
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'duration':
        return (a.duration || 0) - (b.duration || 0);
      case 'popularity':
        return (b.views || 0) - (a.views || 0);
      case 'date':
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const videos = sortedMedia.filter(item => item.type.startsWith('video/'));
  const documents = sortedMedia.filter(item => !item.type.startsWith('video/'));

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        stats[cat.id] = mediaItems.filter(item => 
          item.category === cat.id || item.tags.includes(cat.id)
        ).length;
      }
    });
    return stats;
  };

  const handleVideoClick = (video: MediaItem) => {
    if (!userProgress.premiumAccess && video.premium) {
      setUpsellVideo(video);
      setShowUpsell(true);
    } else {
      setSelectedVideo(video);
    }
  };

  const handleUpsellPurchase = () => {
    // Handle premium purchase
    setShowUpsell(false);
    setUpsellVideo(null);
  };

  const getProgressPercentage = () => {
    return Math.round((userProgress.completedVideos / userProgress.totalVideos) * 100);
  };

  const getNextLevelXP = () => {
    return userProgress.level * 1000;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className={styles.educationPage}>
      {/* Animated Background */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
      </div>
      
      {/* Glass Background */}
      <div className={styles.glassBg}></div>
      
      <div className={styles.educationContent}>
        {/* Enhanced Hero Section */}
        <motion.section 
          ref={heroRef}
          className={styles.heroSection}
          initial={{ opacity: 0, y: 50 }}
          animate={heroVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.gradientTitle}>{t('hero.title')}</h1>
          <p className={styles.heroDescription}>
            {t('hero.description')}
          </p>
          
          {/* Enhanced Search and Filters */}
          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button 
                className={styles.filterToggle}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter />
              </button>
            </div>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  className={styles.filterPanel}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.filterControls}>
                    <div className={styles.viewModeToggle}>
                      <button 
                        className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <FiGrid />
                      </button>
                      <button 
                        className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <FiList />
                      </button>
                    </div>
                    
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className={styles.sortSelect}
                    >
                      <option value="date">{t('search.sortBy.date')}</option>
                      <option value="name">{t('search.sortBy.name')}</option>
                      <option value="duration">{t('search.sortBy.duration')}</option>
                      <option value="popularity">{t('search.sortBy.popularity')}</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Enhanced User Progress Section */}
        <motion.section 
          ref={statsRef}
          className={styles.progressSection}
          initial={{ opacity: 0, y: 30 }}
          animate={statsVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.progressGrid}>
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <FiTarget className={styles.progressIcon} />
                <h3>{t('progress.learningProgress')}</h3>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <p className={styles.progressText}>
                {userProgress.completedVideos} / {userProgress.totalVideos} {t('progress.completedText')}
              </p>
            </div>
            
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <FiTrendingUp className={styles.progressIcon} />
                <h3>{t('progress.currentLevel')}</h3>
              </div>
              <div className={styles.levelInfo}>
                <span className={styles.levelNumber}>{t('progress.level')} {userProgress.level}</span>
                <span className={styles.xpInfo}>{userProgress.xp} / {getNextLevelXP()} XP</span>
              </div>
            </div>
            
            <div className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <FiZap className={styles.progressIcon} />
                <h3>{t('progress.learningStreak')}</h3>
              </div>
              <div className={styles.streakInfo}>
                <span className={styles.streakNumber}>{userProgress.streak} {t('progress.days')}</span>
                <span className={styles.streakLabel}>{t('progress.keepItUp')}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Enhanced Category Navigation */}
        <section className={styles.categorySection}>
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`${styles.categoryCard} ${activeCategory === category.id ? styles.active : ''} ${!category.unlocked ? styles.locked : ''}`}
                onClick={() => category.unlocked && setActiveCategory(category.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: category.unlocked ? 1.05 : 1 }}
                whileTap={{ scale: category.unlocked ? 0.95 : 1 }}
              >
                <div className={styles.categoryIcon} style={{ backgroundColor: category.color }}>
                  <category.icon />
                </div>
                <div className={styles.categoryInfo}>
                  <h4>{category.name}</h4>
                  <span className={styles.categoryCount}>{categoryStats[category.id] || 0} items</span>
                </div>
                {!category.unlocked && (
                  <div className={styles.lockOverlay}>
                    <FiLock />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Enhanced Content Display */}
        <section className={styles.contentSection}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading educational content...</p>
            </div>
          ) : (
            <>
              {/* Videos Section */}
              {videos.length > 0 && (
                <div className={styles.contentGroup}>
                  <h2 className={styles.contentTitle}>
                    <FiVideo className={styles.contentIcon} />
                    Video Tutorials ({videos.length})
                  </h2>
                  
                  <div className={`${styles.contentGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
                    {videos.map((video, index) => (
                      <motion.div
                        key={video.id}
                        className={styles.contentCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className={styles.contentThumbnail}>
                          <img src={video.thumbnail || '/images/education/video1.jpg'} alt={video.name} />
                          <div className={styles.contentOverlay}>
                            <button 
                              className={styles.playButton}
                              onClick={() => handleVideoClick(video)}
                            >
                              <FiPlay />
                            </button>
                            {video.premium && !userProgress.premiumAccess && (
                              <div className={styles.premiumBadge}>
                                <FiStar />
                              </div>
                            )}
                          </div>
                          {video.duration && (
                            <span className={styles.duration}>{formatDuration(video.duration)}</span>
                          )}
                        </div>
                        
                        <div className={styles.contentInfo}>
                          <h3 className={styles.contentName}>{video.name}</h3>
                          <p className={styles.contentDescription}>{video.description}</p>
                          
                          <div className={styles.contentMeta}>
                            <span className={styles.contentViews}>
                              <FiEye /> {video.views || 0} views
                            </span>
                            <span className={styles.contentDate}>
                              {new Date(video.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className={styles.contentActions}>
                            <button className={styles.actionButton}>
                              <FiBookmark />
                            </button>
                            <button className={styles.actionButton}>
                              <FiShare />
                            </button>
                            <button className={styles.actionButton}>
                              <FiExternalLink />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {documents.length > 0 && (
                <div className={styles.contentGroup}>
                  <h2 className={styles.contentTitle}>
                    <FiFile className={styles.contentIcon} />
                    Documents & Resources ({documents.length})
                  </h2>
                  
                  <div className={`${styles.contentGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
                    {documents.map((doc, index) => (
                      <motion.div
                        key={doc.id}
                        className={styles.contentCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className={styles.contentThumbnail}>
                          <div className={styles.documentIcon}>
                            <FiFile />
                          </div>
                          <div className={styles.contentOverlay}>
                            <button className={styles.downloadButton}>
                              <FiDownload />
                            </button>
                          </div>
                        </div>
                        
                        <div className={styles.contentInfo}>
                          <h3 className={styles.contentName}>{doc.name}</h3>
                          <p className={styles.contentDescription}>{doc.description}</p>
                          
                          <div className={styles.contentMeta}>
                            <span className={styles.contentSize}>
                              {formatFileSize(doc.size || 0)}
                            </span>
                            <span className={styles.contentDate}>
                              {new Date(doc.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className={styles.contentActions}>
                            <button className={styles.actionButton}>
                              <FiDownload />
                            </button>
                            <button className={styles.actionButton}>
                              <FiShare />
                            </button>
                            <button className={styles.actionButton}>
                              <FiExternalLink />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {videos.length === 0 && documents.length === 0 && (
                <div className={styles.emptyState}>
                  <FiBookOpen className={styles.emptyIcon} />
                  <h3>No content found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            className={styles.videoModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.modalContent}>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedVideo(null)}
              >
                ×
              </button>
              <video 
                src={selectedVideo.url} 
                controls 
                autoPlay
                className={styles.videoPlayer}
              />
              <div className={styles.videoInfo}>
                <h3>{selectedVideo.name}</h3>
                <p>{selectedVideo.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upsell Modal */}
      <AnimatePresence>
        {showUpsell && upsellVideo && (
          <motion.div 
            className={styles.upsellModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.upsellContent}>
              <div className={styles.upsellHeader}>
                <FiStar className={styles.upsellIcon} />
                <h3>Premium Content</h3>
              </div>
              <p>Upgrade to premium to access exclusive educational content</p>
              <div className={styles.upsellActions}>
                <button 
                  className={styles.upsellButton}
                  onClick={handleUpsellPurchase}
                >
                  Upgrade Now
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowUpsell(false)}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 