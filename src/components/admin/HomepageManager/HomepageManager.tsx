'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  FiImage, FiVideo, FiType, FiSave, FiUpload, FiEye, FiSettings,
  FiVolume2, FiVolumeX, FiPlay, FiPause, FiRefreshCw, FiTrash2,
  FiPlus, FiEdit3, FiMonitor, FiSmartphone, FiTablet, FiLayers,
  FiGlobe, FiUsers, FiShield, FiZap, FiTarget, FiBarChart
} from 'react-icons/fi';
import Image from 'next/image';
import styles from './HomepageManager.module.scss';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  description: string;
  position: 'hero' | 'background' | 'section';
  language: 'en' | 'he' | 'ru' | 'all';
  isActive: boolean;
  hasSound?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

interface HomepageSection {
  id: string;
  title: { en: string; he: string; ru: string };
  content: { en: string; he: string; ru: string };
  media: MediaItem[];
  isVisible: boolean;
  order: number;
  layout: 'full' | 'split' | 'grid' | 'carousel';
}

interface HomepageContent {
  heroSection: {
    title: { en: string; he: string; ru: string };
    subtitle: { en: string; he: string; ru: string };
    backgroundVideo: string;
    backgroundImage: string;
    ctaButton: { en: string; he: string; ru: string };
    hasSound: boolean;
  };
  sections: HomepageSection[];
  globalSettings: {
    videoQuality: 'auto' | 'high' | 'medium' | 'low';
    autoplayEnabled: boolean;
    soundEnabled: boolean;
    mobileOptimized: boolean;
  };
}

export default function HomepageManager() {
  const t = useTranslations('admin');
  const [content, setContent] = useState<HomepageContent>({
    heroSection: {
      title: {
        en: 'Revolutionary Skincare Solutions',
        he: 'פתרונות טיפוח עור מהפכניים',
        ru: 'Революционные решения по уходу за кожей'
      },
      subtitle: {
        en: 'Experience the future of aesthetic medicine',
        he: 'חווה את עתיד הרפואה האסתטית',
        ru: 'Ощутите будущее эстетической медицины'
      },
      backgroundVideo: '/videos/eventIntroVideo.webm',
      backgroundImage: '/images/introBG.png',
      ctaButton: {
        en: 'Explore Products',
        he: 'גלה מוצרים',
        ru: 'Изучить продукты'
      },
      hasSound: true
    },
    sections: [],
    globalSettings: {
      videoQuality: 'high',
      autoplayEnabled: true,
      soundEnabled: true,
      mobileOptimized: true
    }
  });
  
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'media' | 'settings'>('hero');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'he' | 'ru'>('en');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load existing content from database
    loadHomepageContent();
  }, []);

  const loadHomepageContent = async () => {
    try {
      const response = await fetch('/api/admin/homepage');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Failed to load homepage content:', error);
    }
  };

  const saveContent = async () => {
    try {
      const response = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });
      
      if (response.ok) {
        // Show success message
        console.log('Content saved successfully');
      }
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const handleFileUpload = async (files: FileList | null, type: 'image' | 'video') => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    try {
      const response = await fetch('/api/upload/media', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const { url } = await response.json();
        
        if (type === 'video' && activeTab === 'hero') {
          setContent(prev => ({
            ...prev,
            heroSection: {
              ...prev.heroSection,
              backgroundVideo: url
            }
          }));
        } else if (type === 'image' && activeTab === 'hero') {
          setContent(prev => ({
            ...prev,
            heroSection: {
              ...prev.heroSection,
              backgroundImage: url
            }
          }));
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsSoundOn(!videoRef.current.muted);
      
      // Update content state
      setContent(prev => ({
        ...prev,
        heroSection: {
          ...prev.heroSection,
          hasSound: !videoRef.current!.muted
        }
      }));
    }
  };

  const updateHeroContent = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      heroSection: {
        ...prev.heroSection,
        [field]: {
          ...prev.heroSection[field as keyof typeof prev.heroSection],
          [currentLanguage]: value
        }
      }
    }));
  };

  const getPreviewSize = () => {
    switch (previewMode) {
      case 'mobile': return { width: '375px', height: '812px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      default: return { width: '100%', height: '600px' };
    }
  };

  const languageFlags = {
    en: '🇺🇸',
    he: '🇮🇱',
    ru: '🇷🇺'
  };

  return (
    <div className={styles.homepageManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <FiLayers className={styles.titleIcon} />
            Homepage Content Manager
          </h1>
          <p className={styles.subtitle}>
            Manage your homepage content, videos, and multi-language support
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.languageSelector}>
            {Object.entries(languageFlags).map(([lang, flag]) => (
              <button
                key={lang}
                className={`${styles.langBtn} ${currentLanguage === lang ? styles.active : ''}`}
                onClick={() => setCurrentLanguage(lang as 'en' | 'he' | 'ru')}
              >
                {flag} {lang.toUpperCase()}
              </button>
            ))}
          </div>
          
          <button
            className={styles.previewBtn}
            onClick={() => setIsPreviewOpen(true)}
          >
            <FiEye />
            Preview
          </button>
          
          <button
            className={styles.saveBtn}
            onClick={saveContent}
          >
            <FiSave />
            Save Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.navigation}>
        {[
          { id: 'hero', label: 'Hero Section', icon: <FiVideo /> },
          { id: 'sections', label: 'Content Sections', icon: <FiLayers /> },
          { id: 'media', label: 'Media Library', icon: <FiImage /> },
          { id: 'settings', label: 'Global Settings', icon: <FiSettings /> }
        ].map(tab => (
          <button
            key={tab.id}
            className={`${styles.navTab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">
          {/* Hero Section Tab */}
          {activeTab === 'hero' && (
            <motion.div
              key="hero"
              className={styles.tabContent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.heroEditor}>
                {/* Video Background Section */}
                <div className={styles.videoSection}>
                  <h3 className={styles.sectionTitle}>
                    <FiVideo />
                    Background Video
                  </h3>
                  
                  <div className={styles.videoPreview}>
                    {content.heroSection.backgroundVideo && (
                      <div className={styles.videoContainer}>
                        <video
                          ref={videoRef}
                          src={content.heroSection.backgroundVideo}
                          muted={!isSoundOn}
                          loop
                          className={styles.previewVideo}
                          onLoadedData={() => {
                            if (videoRef.current && content.globalSettings.autoplayEnabled) {
                              videoRef.current.play();
                              setIsPlaying(true);
                            }
                          }}
                        />
                        
                        <div className={styles.videoControls}>
                          <button
                            className={styles.controlBtn}
                            onClick={toggleVideoPlayback}
                          >
                            {isPlaying ? <FiPause /> : <FiPlay />}
                          </button>
                          
                          <button
                            className={styles.controlBtn}
                            onClick={toggleSound}
                          >
                            {isSoundOn ? <FiVolume2 /> : <FiVolumeX />}
                          </button>
                          
                          <div className={styles.videoInfo}>
                            {content.heroSection.backgroundVideo.split('/').pop()}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.uploadSection}>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e.target.files, 'video')}
                        className={styles.hiddenInput}
                      />
                      
                      <button
                        className={styles.uploadBtn}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <FiRefreshCw className={styles.spinning} />
                            Uploading... {uploadProgress}%
                          </>
                        ) : (
                          <>
                            <FiUpload />
                            Upload Video
                          </>
                        )}
                      </button>
                      
                      <p className={styles.uploadHint}>
                        Recommended: WebM format, max 50MB, 1920x1080 resolution
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text Content Section */}
                <div className={styles.textSection}>
                  <h3 className={styles.sectionTitle}>
                    <FiType />
                    Hero Content ({currentLanguage.toUpperCase()})
                  </h3>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Main Title</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={content.heroSection.title[currentLanguage]}
                      onChange={(e) => updateHeroContent('title', e.target.value)}
                      placeholder="Enter main title..."
                    />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Subtitle</label>
                    <textarea
                      className={styles.textArea}
                      value={content.heroSection.subtitle[currentLanguage]}
                      onChange={(e) => updateHeroContent('subtitle', e.target.value)}
                      placeholder="Enter subtitle..."
                      rows={3}
                    />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>CTA Button Text</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={content.heroSection.ctaButton[currentLanguage]}
                      onChange={(e) => updateHeroContent('ctaButton', e.target.value)}
                      placeholder="Enter button text..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              className={styles.tabContent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.settingsGrid}>
                <div className={styles.settingsCard}>
                  <h3 className={styles.cardTitle}>
                    <FiVideo />
                    Video Settings
                  </h3>
                  
                  <div className={styles.settingItem}>
                    <label className={styles.settingLabel}>Video Quality</label>
                    <select 
                      className={styles.settingSelect}
                      value={content.globalSettings.videoQuality}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        globalSettings: {
                          ...prev.globalSettings,
                          videoQuality: e.target.value as any
                        }
                      }))}
                    >
                      <option value="auto">Auto</option>
                      <option value="high">High (1080p)</option>
                      <option value="medium">Medium (720p)</option>
                      <option value="low">Low (480p)</option>
                    </select>
                  </div>
                  
                  <div className={styles.settingItem}>
                    <label className={styles.settingLabel}>
                      <input
                        type="checkbox"
                        checked={content.globalSettings.autoplayEnabled}
                        onChange={(e) => setContent(prev => ({
                          ...prev,
                          globalSettings: {
                            ...prev.globalSettings,
                            autoplayEnabled: e.target.checked
                          }
                        }))}
                      />
                      Enable Autoplay
                    </label>
                  </div>
                  
                  <div className={styles.settingItem}>
                    <label className={styles.settingLabel}>
                      <input
                        type="checkbox"
                        checked={content.globalSettings.soundEnabled}
                        onChange={(e) => setContent(prev => ({
                          ...prev,
                          globalSettings: {
                            ...prev.globalSettings,
                            soundEnabled: e.target.checked
                          }
                        }))}
                      />
                      Enable Sound by Default
                    </label>
                  </div>
                </div>

                <div className={styles.settingsCard}>
                  <h3 className={styles.cardTitle}>
                    <FiSmartphone />
                    Mobile Settings
                  </h3>
                  
                  <div className={styles.settingItem}>
                    <label className={styles.settingLabel}>
                      <input
                        type="checkbox"
                        checked={content.globalSettings.mobileOptimized}
                        onChange={(e) => setContent(prev => ({
                          ...prev,
                          globalSettings: {
                            ...prev.globalSettings,
                            mobileOptimized: e.target.checked
                          }
                        }))}
                      />
                      Mobile Optimized Videos
                    </label>
                  </div>
                </div>

                <div className={styles.settingsCard}>
                  <h3 className={styles.cardTitle}>
                    <FiUsers />
                    User Access
                  </h3>
                  
                  <div className={styles.settingItem}>
                    <label className={styles.settingLabel}>Member Login Required</label>
                    <select className={styles.settingSelect}>
                      <option value="none">Public Access</option>
                      <option value="basic">Basic Membership</option>
                      <option value="premium">Premium Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Media Library Tab */}
          {activeTab === 'media' && (
            <motion.div
              key="media"
              className={styles.tabContent}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.mediaLibrary}>
                <div className={styles.mediaHeader}>
                  <h3>Media Library</h3>
                  <button className={styles.addMediaBtn}>
                    <FiPlus />
                    Add Media
                  </button>
                </div>
                
                <div className={styles.mediaGrid}>
                  {/* Media items will be rendered here */}
                  <div className={styles.mediaItem}>
                    <div className={styles.mediaPreview}>
                      <video src="/videos/eventIntroVideo.webm" />
                      <div className={styles.mediaOverlay}>
                        <button className={styles.mediaAction}>
                          <FiEye />
                        </button>
                        <button className={styles.mediaAction}>
                          <FiEdit3 />
                        </button>
                        <button className={styles.mediaAction}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className={styles.mediaInfo}>
                      <h4>Event Intro Video</h4>
                      <p>eventIntroVideo.webm</p>
                      <span className={styles.mediaType}>Video</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            className={styles.previewModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.modalContent}>
              <div className={styles.previewHeader}>
                <h3>Homepage Preview</h3>
                
                <div className={styles.previewControls}>
                  {['desktop', 'tablet', 'mobile'].map(mode => (
                    <button
                      key={mode}
                      className={`${styles.previewModeBtn} ${previewMode === mode ? styles.active : ''}`}
                      onClick={() => setPreviewMode(mode as any)}
                    >
                      {mode === 'desktop' && <FiMonitor />}
                      {mode === 'tablet' && <FiTablet />}
                      {mode === 'mobile' && <FiSmartphone />}
                    </button>
                  ))}
                </div>
                
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsPreviewOpen(false)}
                >
                  ×
                </button>
              </div>
              
              <div className={styles.previewContainer} style={getPreviewSize()}>
                <div className={styles.previewFrame}>
                  {/* Preview content will be rendered here */}
                  <div className={styles.heroPreview}>
                    {content.heroSection.backgroundVideo && (
                      <video
                        src={content.heroSection.backgroundVideo}
                        muted={!content.globalSettings.soundEnabled}
                        autoPlay={content.globalSettings.autoplayEnabled}
                        loop
                        className={styles.backgroundVideo}
                      />
                    )}
                    
                    <div className={styles.heroContent}>
                      <h1>{content.heroSection.title[currentLanguage]}</h1>
                      <p>{content.heroSection.subtitle[currentLanguage]}</p>
                      <button className={styles.ctaButton}>
                        {content.heroSection.ctaButton[currentLanguage]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}