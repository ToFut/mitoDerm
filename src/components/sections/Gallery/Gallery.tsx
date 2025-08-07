'use client';

import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './Gallery.module.scss';
import { useTranslations } from 'next-intl';
import GalleryPagination from './GalleryPagination/GalleryPagination';

const env = process.env.NODE_ENV;

const GalleryWrapper = dynamic(
  () => import('@/components/sections/Gallery/GalleryWrapper/GalleryWrapper'),
  {
    ssr: false,
  }
);

const Gallery: FC = () => {
  const t = useTranslations('gallery');
  const [itemList, setItemList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setError(null);
        const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3090';
        const response = await fetch(`${baseUrl}/api/gallery`, {
          cache: 'default', // Use browser cache
          headers: {
            'Cache-Control': 'max-age=3600' // Cache for 1 hour
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setItemList(data.images || []);
        } else {
          console.error('Failed to fetch gallery images:', response.status);
          setError('Failed to load gallery images');
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setError('Failed to load gallery images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);
  
  return (
    <section id='gallery' className={styles.container}>
      <h2 className={styles.title}>{t('title')}</h2>
      {error && <p className={styles.error}>{error}</p>}
      {!isLoading && !error && <GalleryWrapper itemList={itemList} />}
      {!error && <GalleryPagination count={itemList.length} />}
    </section>
  );
};

export default Gallery;
