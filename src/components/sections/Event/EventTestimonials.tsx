import { FC } from 'react';
import { useTranslations } from 'next-intl';
import styles from './EventTestimonials.module.scss';

const EventTestimonials: FC = () => {
  const t = useTranslations();

  const testimonials = [
    {
      id: 1,
      name: 'Dr. Elena Rodriguez',
      title: 'Dermatologist',
      clinic: 'Advanced Skin Clinic',
      image: '/images/team/testimonial1.svg',
      rating: 5,
      text: 'The exosome technology training was exceptional. The hands-on practice sessions gave me confidence to implement these advanced treatments in my practice. Highly recommended!',
      event: 'Exosome Technology Workshop 2023'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      title: 'Aesthetic Physician',
      clinic: 'Beauty & Wellness Center',
      image: '/images/team/testimonial2.svg',
      rating: 5,
      text: 'Outstanding event! The speakers were experts in their field, and the practical demonstrations were invaluable. I\'ve already seen remarkable results with my patients.',
      event: 'V-Tech System Training 2023'
    },
    {
      id: 3,
      name: 'Dr. Sarah Johnson',
      title: 'Cosmetic Surgeon',
      clinic: 'Elite Aesthetics',
      image: '/images/team/testimonial3.svg',
      rating: 5,
      text: 'The combination of theoretical knowledge and practical application was perfect. The networking opportunities with other professionals were also incredibly valuable.',
      event: 'Medical Aesthetics Conference 2023'
    },
    {
      id: 4,
      name: 'Dr. David Kim',
      title: 'Plastic Surgeon',
      clinic: 'Advanced Aesthetics Institute',
      image: '/images/team/testimonial4.svg',
      rating: 5,
      text: 'This training transformed my approach to skin rejuvenation. The exosome technology is truly revolutionary, and the certification process was comprehensive.',
      event: 'Exosome Technology Workshop 2023'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Our Attendees Say</h2>
          <p className={styles.sectionSubtitle}>
            Hear from medical professionals who have attended our previous events
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.cardHeader}>
                <div className={styles.authorInfo}>
                  <div className={styles.authorImage}>
                    <img src={testimonial.image} alt={testimonial.name} />
                  </div>
                  <div className={styles.authorDetails}>
                    <h4 className={styles.authorName}>{testimonial.name}</h4>
                    <div className={styles.authorTitle}>{testimonial.title}</div>
                    <div className={styles.authorClinic}>{testimonial.clinic}</div>
                  </div>
                </div>
                <div className={styles.rating}>
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialText}>"{testimonial.text}"</p>
                <div className={styles.eventInfo}>
                  <span className={styles.eventIcon}>🎓</span>
                  <span className={styles.eventName}>{testimonial.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className={styles.statisticsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Professionals Trained</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statNumber}>4.9</div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statNumber}>98%</div>
              <div className={styles.statLabel}>Satisfaction Rate</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏆</div>
              <div className={styles.statNumber}>25+</div>
              <div className={styles.statLabel}>Events Completed</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>Join Our Next Event</h3>
            <p className={styles.ctaText}>
                              Don&apos;t miss out on this exclusive opportunity to learn from industry experts 
              and advance your professional skills in exosome technology.
            </p>
            <div className={styles.ctaStats}>
              <div className={styles.ctaStat}>
                <div className={styles.ctaStatNumber}>150</div>
                <div className={styles.ctaStatLabel}>Limited Seats</div>
              </div>
              <div className={styles.ctaStat}>
                <div className={styles.ctaStatNumber}>5</div>
                <div className={styles.ctaStatLabel}>Expert Speakers</div>
              </div>
              <div className={styles.ctaStat}>
                <div className={styles.ctaStatNumber}>8</div>
                <div className={styles.ctaStatLabel}>Hours Training</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventTestimonials; 