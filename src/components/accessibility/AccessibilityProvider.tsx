'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEye, 
  FiEyeOff, 
  FiType, 
  FiMousePointer, 
  FiSettings, 
  FiX,
  FiSun,
  FiMoon,
  FiVolume2,
  FiVolumeX,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
  FiSquare,
  FiCircle
} from 'react-icons/fi';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  focusOutlines: boolean;
  colorBlindFriendly: boolean;
  darkMode: boolean;
  soundEffects: boolean;
  keyboardNavigation: boolean;
  magnification: number;
  cursorSize: number;
  underlineLinks: boolean;
  spacing: number;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  focusOutlines: true,
  colorBlindFriendly: false,
  darkMode: false,
  soundEffects: true,
  keyboardNavigation: true,
  magnification: 1,
  cursorSize: 1,
  underlineLinks: false,
  spacing: 1
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('mitoderm-accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }

    // Check for system preferences
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    if (prefersDarkMode && !savedSettings) {
      setSettings(prev => ({ ...prev, darkMode: true }));
    }
    if (prefersReducedMotion && !savedSettings) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    if (prefersHighContrast && !savedSettings) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply settings to document
    applyAccessibilitySettings(settings);
    
    // Save to localStorage
    localStorage.setItem('mitoderm-accessibility-settings', JSON.stringify(settings));
  }, [settings, mounted]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('mitoderm-accessibility-settings');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    isMenuOpen,
    toggleMenu
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      <AccessibilityToolbar />
      <AccessibilityMenu />
      <KeyboardNavigationHelper />
      <ScreenReaderAnnouncements />
    </AccessibilityContext.Provider>
  );
}

function applyAccessibilitySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;
  
  // Font size
  root.style.fontSize = `${settings.fontSize}px`;
  
  // High contrast
  if (settings.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }
  
  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('reduced-motion');
  }
  
  // Focus outlines
  if (settings.focusOutlines) {
    root.classList.add('focus-outlines');
  } else {
    root.classList.remove('focus-outlines');
  }
  
  // Color blind friendly
  if (settings.colorBlindFriendly) {
    root.classList.add('color-blind-friendly');
  } else {
    root.classList.remove('color-blind-friendly');
  }
  
  // Dark mode
  if (settings.darkMode) {
    root.classList.add('dark-mode');
  } else {
    root.classList.remove('dark-mode');
  }
  
  // Magnification
  if (settings.magnification !== 1) {
    root.style.zoom = settings.magnification.toString();
  } else {
    root.style.zoom = '';
  }
  
  // Cursor size
  if (settings.cursorSize !== 1) {
    root.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${24 * settings.cursorSize}\" height=\"${24 * settings.cursorSize}\" viewBox=\"0 0 24 24\" fill=\"black\"><path d=\"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\"/></svg>') ${12 * settings.cursorSize} ${12 * settings.cursorSize}, auto`;
  } else {
    root.style.cursor = '';
  }
  
  // Underline links
  if (settings.underlineLinks) {
    root.classList.add('underline-links');
  } else {
    root.classList.remove('underline-links');
  }
  
  // Spacing
  if (settings.spacing !== 1) {
    root.style.setProperty('--accessibility-spacing-multiplier', settings.spacing.toString());
  } else {
    root.style.removeProperty('--accessibility-spacing-multiplier');
  }
}

function AccessibilityToolbar() {
  const context = useContext(AccessibilityContext);
  if (!context) return null;
  
  const { toggleMenu, isMenuOpen } = context;
  
  return (
    <motion.div
      className="accessibility-toolbar"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="accessibility-toggle"
        onClick={toggleMenu}
        aria-label="Open accessibility menu"
        aria-expanded={isMenuOpen}
      >
        <FiSettings />
        <span>Accessibility</span>
      </button>
    </motion.div>
  );
}

function AccessibilityMenu() {
  const context = useContext(AccessibilityContext);
  if (!context) return null;
  
  const { settings, updateSetting, resetSettings, isMenuOpen, toggleMenu } = context;
  
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            className="accessibility-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
          <motion.div
            className="accessibility-menu"
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="accessibility-menu-header">
              <h2>Accessibility Settings</h2>
              <button
                className="accessibility-close"
                onClick={toggleMenu}
                aria-label="Close accessibility menu"
              >
                <FiX />
              </button>
            </div>
            
            <div className="accessibility-menu-content">
              {/* Vision Settings */}
              <div className="accessibility-section">
                <h3><FiEye /> Vision</h3>
                
                <div className="accessibility-control">
                  <label htmlFor="font-size">Font Size</label>
                  <div className="font-size-controls">
                    <button
                      onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                      aria-label="Decrease font size"
                    >
                      <FiZoomOut />
                    </button>
                    <span>{settings.fontSize}px</span>
                    <button
                      onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                      aria-label="Increase font size"
                    >
                      <FiZoomIn />
                    </button>
                  </div>
                </div>
                
                <div className="accessibility-control">
                  <label htmlFor="magnification">Page Zoom</label>
                  <div className="zoom-controls">
                    <button
                      onClick={() => updateSetting('magnification', Math.max(0.5, settings.magnification - 0.1))}
                      aria-label="Zoom out"
                    >
                      <FiZoomOut />
                    </button>
                    <span>{Math.round(settings.magnification * 100)}%</span>
                    <button
                      onClick={() => updateSetting('magnification', Math.min(2, settings.magnification + 0.1))}
                      aria-label="Zoom in"
                    >
                      <FiZoomIn />
                    </button>
                  </div>
                </div>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => updateSetting('highContrast', e.target.checked)}
                    />
                    High Contrast Mode
                  </label>
                </div>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.colorBlindFriendly}
                      onChange={(e) => updateSetting('colorBlindFriendly', e.target.checked)}
                    />
                    Color Blind Friendly
                  </label>
                </div>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.underlineLinks}
                      onChange={(e) => updateSetting('underlineLinks', e.target.checked)}
                    />
                    Underline All Links
                  </label>
                </div>
              </div>
              
              {/* Motor Settings */}
              <div className="accessibility-section">
                <h3><FiMousePointer /> Motor</h3>
                
                <div className="accessibility-control">
                  <label htmlFor="cursor-size">Cursor Size</label>
                  <div className="cursor-size-controls">
                    <button
                      onClick={() => updateSetting('cursorSize', Math.max(0.5, settings.cursorSize - 0.25))}
                      aria-label="Decrease cursor size"
                    >
                      <FiCircle style={{ fontSize: '12px' }} />
                    </button>
                    <span>{settings.cursorSize}x</span>
                    <button
                      onClick={() => updateSetting('cursorSize', Math.min(3, settings.cursorSize + 0.25))}
                      aria-label="Increase cursor size"
                    >
                      <FiCircle style={{ fontSize: '18px' }} />
                    </button>
                  </div>
                </div>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                    />
                    Reduce Motion
                  </label>
                </div>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.focusOutlines}
                      onChange={(e) => updateSetting('focusOutlines', e.target.checked)}
                    />
                    Enhanced Focus Indicators
                  </label>
                </div>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.keyboardNavigation}
                      onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                    />
                    Keyboard Navigation Helper
                  </label>
                </div>
              </div>
              
              {/* Audio Settings */}
              <div className="accessibility-section">
                <h3><FiVolume2 /> Audio</h3>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.soundEffects}
                      onChange={(e) => updateSetting('soundEffects', e.target.checked)}
                    />
                    UI Sound Effects
                  </label>
                </div>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.screenReader}
                      onChange={(e) => updateSetting('screenReader', e.target.checked)}
                    />
                    Screen Reader Announcements
                  </label>
                </div>
              </div>
              
              {/* General Settings */}
              <div className="accessibility-section">
                <h3><FiSettings /> General</h3>
                
                <div className="accessibility-toggle-control">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => updateSetting('darkMode', e.target.checked)}
                    />
                    <FiMoon /> Dark Mode
                  </label>
                </div>
                
                <div className="accessibility-control">
                  <label htmlFor="spacing">Content Spacing</label>
                  <div className="spacing-controls">
                    <button
                      onClick={() => updateSetting('spacing', Math.max(0.5, settings.spacing - 0.25))}
                      aria-label="Decrease spacing"
                    >
                      <FiSquare style={{ fontSize: '12px' }} />
                    </button>
                    <span>{settings.spacing}x</span>
                    <button
                      onClick={() => updateSetting('spacing', Math.min(2, settings.spacing + 0.25))}
                      aria-label="Increase spacing"
                    >
                      <FiSquare style={{ fontSize: '18px' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="accessibility-menu-footer">
              <button
                className="accessibility-reset"
                onClick={resetSettings}
              >
                <FiRotateCw /> Reset to Defaults
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function KeyboardNavigationHelper() {
  const context = useContext(AccessibilityContext);
  const [currentFocus, setCurrentFocus] = useState<string>('');
  
  useEffect(() => {
    if (!context || !context.settings.keyboardNavigation) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const activeElement = document.activeElement;
        if (activeElement) {
          const text = activeElement.textContent || activeElement.getAttribute('aria-label') || activeElement.tagName;
          setCurrentFocus(text.slice(0, 50));
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [context]);
  
  if (!context || !context.settings.keyboardNavigation || !currentFocus) return null;
  
  return (
    <div className="keyboard-navigation-helper" aria-live="polite">
      Focused: {currentFocus}
    </div>
  );
}

function ScreenReaderAnnouncements() {
  const context = useContext(AccessibilityContext);
  if (!context || !context.settings.screenReader) return null;
  
  return (
    <div 
      id="screen-reader-announcements" 
      className="sr-only" 
      aria-live="polite" 
      aria-atomic="true"
    />
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export function announceToScreenReader(message: string) {
  const announcements = document.getElementById('screen-reader-announcements');
  if (announcements) {
    announcements.textContent = message;
    setTimeout(() => {
      announcements.textContent = '';
    }, 1000);
  }
}