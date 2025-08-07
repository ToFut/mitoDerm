'use client';

import { motion, AnimatePresence } from 'framer-motion';
// React Three Fiber imports disabled for SSR compatibility
import { useRef, useState, useEffect } from 'react';
import styles from './luxury-components.module.scss';

// NEXT-GEN BUTTON COMPONENT
interface LuxuryButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass' | 'holographic' | 'quantum';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  glowEffect?: boolean;
  soundEffect?: boolean;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  icon,
  glowEffect = true,
  soundEffect = true
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (soundEffect && audioRef.current) {
      audioRef.current.play();
    }
    
    onClick?.();
  };

  return (
    <>
      <motion.button
        className={`${styles.luxuryButton} ${styles[variant]} ${styles[size]}`}
        onClick={handleClick}
        disabled={disabled || loading}
        whileHover={{ 
          scale: disabled ? 1 : 1.05, 
          y: disabled ? 0 : -3,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: disabled ? 1 : 0.98,
          transition: { duration: 0.1 }
        }}
        animate={{
          boxShadow: isPressed 
            ? "0 5px 15px rgba(191, 128, 12, 0.4)" 
            : "0 10px 30px rgba(191, 128, 12, 0.2)"
        }}
      >
        {/* Background Effects */}
        <div className={styles.buttonBackground} />
        {glowEffect && <div className={styles.buttonGlow} />}
        
        {/* Quantum Particles - Fallback for SSR */}
        {variant === 'quantum' && (
          <div className={styles.quantumParticles}>
            <div className={styles.fallbackQuantum}></div>
          </div>
        )}
        
        {/* Content */}
        <span className={styles.buttonContent}>
          {loading ? (
            <motion.div
              className={styles.loadingSpinner}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <>
              {icon && <span className={styles.buttonIcon}>{icon}</span>}
              <span className={styles.buttonText}>{children}</span>
            </>
          )}
        </span>
        
        {/* Ripple Effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className={styles.rippleEffect}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </motion.button>
      
      {soundEffect && (
        <audio ref={audioRef} preload="auto">
          <source src="/sounds/button-click-luxury.mp3" type="audio/mpeg" />
        </audio>
      )}
    </>
  );
};

// HOLOGRAPHIC CARD COMPONENT
interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'gold' | 'rose' | 'platinum' | 'rainbow';
  interactive?: boolean;
  floating?: boolean;
  quantumEffect?: boolean;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = '',
  glowColor = 'gold',
  interactive = true,
  floating = false,
  quantumEffect = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !interactive) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.holographicCard} ${styles[glowColor]} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0.5, y: 0.5 })}
      style={{
        transform: interactive
          ? `perspective(1000px) rotateY(${(mousePosition.x - 0.5) * 20}deg) rotateX(${(mousePosition.y - 0.5) * -20}deg)`
          : undefined
      }}
      animate={floating ? {
        y: [0, -10, 0],
        rotateX: [0, 2, 0],
        rotateY: [0, -2, 2, 0]
      } : {}}
      transition={floating ? {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      whileHover={interactive ? {
        scale: 1.05,
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* Holographic Overlay */}
      <div className={styles.holographicOverlay} />
      
      {/* Quantum Effect - Fallback for SSR */}
      {quantumEffect && (
        <div className={styles.quantumField}>
          <div className={styles.fallbackQuantumField}></div>
        </div>
      )}
      
      {/* Content */}
      <div className={styles.cardContent}>
        {children}
      </div>
      
      {/* Glow Effect */}
      <div className={styles.cardGlow} />
    </motion.div>
  );
};

// NEURAL NETWORK VISUALIZATION - Temporarily disabled for SSR
interface NeuralNetworkData {
  id: string;
  value: number;
  connections?: string[];
}

export const NeuralNetworkViz: React.FC<{ data: NeuralNetworkData[] }> = ({ data }) => {
  return (
    <div className={styles.neuralNetwork}>
      {/* 3D Canvas disabled for SSR compatibility */}
      <div className={styles.fallbackNeuralNetwork}>
        <p>Neural Network Visualization (3D disabled for SSR)</p>
        <div className={styles.networkStats}>
          <span>Nodes: {data.length}</span>
        </div>
      </div>
    </div>
  );
};

// LUXURY INPUT COMPONENT
interface LuxuryInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: React.ReactNode;
  aiSuggestions?: boolean;
  voiceInput?: boolean;
}

export const LuxuryInput: React.FC<LuxuryInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  aiSuggestions = false,
  voiceInput = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          onChange(transcript);
        }
      };
      
      recognition.start();
    }
  };

  return (
    <div className={`${styles.luxuryInput} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''}`}>
      <div className={styles.inputContainer}>
        {icon && <div className={styles.inputIcon}>{icon}</div>}
        
        <div className={styles.inputField}>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={styles.input}
          />
          
          <motion.label
            className={styles.inputLabel}
            animate={{
              y: isFocused || value ? -25 : 0,
              scale: isFocused || value ? 0.85 : 1,
              color: isFocused ? '#be800c' : '#ffffff'
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        </div>
        
        {voiceInput && (
          <motion.button
            type="button"
            className={styles.voiceButton}
            onClick={handleVoiceInput}
            animate={{
              scale: isListening ? 1.2 : 1,
              backgroundColor: isListening ? '#e74c3c' : '#be800c'
            }}
          >
            🎤
          </motion.button>
        )}
      </div>
      
      {/* Neural Glow Effect */}
      <div className={styles.neuralGlow} />
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className={styles.errorMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// QUANTUM PROGRESS BAR
interface QuantumProgressProps {
  progress: number;
  label?: string;
  animated?: boolean;
  particleEffect?: boolean;
}

export const QuantumProgress: React.FC<QuantumProgressProps> = ({
  progress,
  label,
  animated = true,
  particleEffect = true
}) => {
  return (
    <div className={styles.quantumProgress}>
      {label && <div className={styles.progressLabel}>{label}</div>}
      
      <div className={styles.progressContainer}>
        <div className={styles.progressTrack}>
          <motion.div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
            animate={animated ? {
              boxShadow: [
                '0 0 10px rgba(191, 128, 12, 0.5)',
                '0 0 20px rgba(191, 128, 12, 0.8)',
                '0 0 10px rgba(191, 128, 12, 0.5)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {particleEffect && (
            <div className={styles.progressParticles}>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={styles.particle}
                  animate={{
                    x: [0, 300, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.6
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.progressValue}>{Math.round(progress)}%</div>
      </div>
    </div>
  );
};

// FLOATING NOTIFICATION
interface FloatingNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'luxury';
  title: string;
  message: string;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const FloatingNotification: React.FC<FloatingNotificationProps> = ({
  type,
  title,
  message,
  onClose,
  action
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`${styles.floatingNotification} ${styles[type]}`}
      initial={{ opacity: 0, y: -100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.8 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className={styles.notificationIcon}>
        <NotificationIcon type={type} />
      </div>
      
      <div className={styles.notificationContent}>
        <h4 className={styles.notificationTitle}>{title}</h4>
        <p className={styles.notificationMessage}>{message}</p>
        
        {action && (
          <motion.button
            className={styles.notificationAction}
            onClick={action.onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {action.label}
          </motion.button>
        )}
      </div>
      
      <motion.button
        className={styles.notificationClose}
        onClick={onClose}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        ×
      </motion.button>
      
      {/* Holographic Glow */}
      <div className={styles.notificationGlow} />
    </motion.div>
  );
};

// HELPER COMPONENTS
interface NotificationIconProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'luxury';
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    luxury: '✨'
  } as const;
  
  return <span>{icons[type]}</span>;
};