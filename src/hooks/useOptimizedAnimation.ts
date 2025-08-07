'use client';

import { useMemo, useCallback } from 'react';

export const useOptimizedAnimation = () => {
  // Reduce heavy animations for better performance
  const fadeInVariant = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  }), []);

  const slideInVariant = useMemo(() => ({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
  }), []);

  const scaleInVariant = useMemo(() => ({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: 'easeOut' }
  }), []);

  const getStaggeredAnimation = useCallback((index: number, delay = 0.1) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.3, 
      delay: index * delay,
      ease: 'easeOut'
    }
  }), []);

  // Optimized hover animations
  const hoverScale = useMemo(() => ({
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  }), []);

  return {
    fadeInVariant,
    slideInVariant,
    scaleInVariant,
    getStaggeredAnimation,
    hoverScale
  };
};

export default useOptimizedAnimation;