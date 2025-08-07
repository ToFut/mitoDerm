import React from 'react';
import styles from './RelatedProductsCarousel.module.scss';

const related = [
  {
    id: '1',
    name: 'V-Tech Serum',
    image: '/images/products/serum.jpg'
  },
  {
    id: '2',
    name: 'V-Tech Gel Mask',
    image: '/images/products/mask.jpg'
  },
  {
    id: '3',
    name: 'V-Tech Kit',
    image: '/images/products/kit.jpg'
  }
];

const RelatedProductsCarousel: React.FC<{ productId: string }> = () => (
  <section className={styles.relatedSection}>
    <h2 className={styles.sectionTitle}>You May Also Like</h2>
    <div className={styles.carouselWrapper}>
      {related.map((p) => (
        <div className={styles.relatedCard} key={p.id}>
          <div className={styles.imageWrapper}>
            <img src={p.image} alt={p.name} />
          </div>
          <div className={styles.name}>{p.name}</div>
          <button className={styles.quickView}>View</button>
        </div>
      ))}
    </div>
  </section>
);

export default RelatedProductsCarousel; 