import React from 'react';
import styles from './ProductReviews.module.scss';

const reviews = [
  {
    name: 'Dr. Sarah Cohen',
    photo: '/images/team/sarah-cohen.svg',
    rating: 5,
    text: 'Outstanding results and professional support. Highly recommended!'
  },
  {
    name: 'Prof. David Levy',
    photo: '/images/team/david-levy.svg',
    rating: 5,
    text: 'Innovative technology and visible improvements for my clients.'
  }
];

const ProductReviews: React.FC<{ productId: string }> = () => (
  <section className={styles.reviewsSection}>
    <h2 className={styles.sectionTitle}>What Professionals Say</h2>
    <div className={styles.reviewsGrid}>
      {reviews.map((r, i) => (
        <div className={styles.reviewCard} key={i}>
          <div className={styles.photo}><img src={r.photo} alt={r.name} /></div>
          <div className={styles.name}>{r.name}</div>
          <div className={styles.rating}>{'★'.repeat(r.rating)}</div>
          <div className={styles.text}>{r.text}</div>
        </div>
      ))}
    </div>
  </section>
);

export default ProductReviews; 