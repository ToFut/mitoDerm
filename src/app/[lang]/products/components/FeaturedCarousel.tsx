import React from 'react';
import styles from './FeaturedCarousel.module.scss';
import { Product } from '@/lib/types/product';

interface FeaturedCarouselProps {
  products: Product[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ products }) => {
  if (!products || products.length === 0) return null;
  return (
    <section className={styles.carouselSection}>
      <div className={styles.carouselTitle}>Featured Products</div>
      <div className={styles.carouselWrapper}>
        {products.map((product, idx) => (
          <div className={styles.carouselCard} key={product.id}>
            <div className={styles.imageWrapper}>
              <img src={product.image || (product.images && product.images[0]?.url)} alt={product.name} />
              {product.badge && <span className={styles.badge}>{product.badge}</span>}
            </div>
            <div className={styles.infoWrapper}>
              <div className={styles.productName}>{product.name}</div>
              <button className={styles.detailsButton}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCarousel; 