import React from 'react';
import styles from './TestimonialsCarousel.module.scss';

const testimonials = [
  {
    name: 'Dr. Sarah Cohen',
    title: 'Aesthetic Physician',
    photo: '/images/team/sarah-cohen.svg',
    text: 'The results with MitoDerm products are outstanding. My clients are thrilled!'
  },
  {
    name: 'Prof. David Levy',
    title: 'Research Director',
    photo: '/images/team/david-levy.svg',
    text: 'Cutting-edge technology and visible results. Highly recommended.'
  },
  {
    name: 'Dr. Rachel Green',
    title: 'Clinical Specialist',
    photo: '/images/team/rachel-green.svg',
    text: 'Professional support and proven efficacy. MitoDerm is my go-to.'
  }
];

const TestimonialsCarousel: React.FC = () => (
  <section className={styles.testimonialsSection}>
    <div className={styles.carouselWrapper}>
      {testimonials.map((t, i) => (
        <div className={styles.testimonialCard} key={i}>
          <div className={styles.photo}><img src={t.photo} alt={t.name} /></div>
          <div className={styles.text}>{t.text}</div>
          <div className={styles.name}>{t.name}</div>
          <div className={styles.title}>{t.title}</div>
        </div>
      ))}
    </div>
  </section>
);

export default TestimonialsCarousel; 