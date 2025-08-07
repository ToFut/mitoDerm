import React, { useState } from 'react';
import styles from './ProductGallery.module.scss';

interface Image {
  url: string;
  alt?: string;
}

interface ProductGalleryProps {
  images: Image[];
  name: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [selected, setSelected] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <img
          src={images[selected].url}
          alt={images[selected].alt || name}
          className={styles.mainImage}
        />
      </div>
      <div className={styles.thumbnails}>
        {images.map((img, idx) => (
          <button
            key={idx}
            className={selected === idx ? styles.active : ''}
            onClick={() => setSelected(idx)}
          >
            <img src={img.url} alt={img.alt || name} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery; 