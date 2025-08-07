import React from 'react';
import styles from './StickyInfoSidebar.module.scss';
import { Product } from '@/lib/services/productService';
import { FaStar, FaShieldAlt, FaCertificate, FaWhatsapp, FaDownload, FaPhone } from 'react-icons/fa';

const StickyInfoSidebar: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <aside className={styles.sidebar}>
      {/* Product Header */}
      <div className={styles.productHeader}>
        {product.badge && (
          <span className={styles.productBadge}>{product.badge}</span>
        )}
        <h1 className={styles.productTitle}>{product.name}</h1>
        {product.subtitle && (
          <h2 className={styles.productSubtitle}>{product.subtitle}</h2>
        )}
      </div>

      {/* Product Description */}
      <div className={styles.productDescription}>
        <p>{product.shortDescription || product.description}</p>
      </div>

      {/* Product Meta Information */}
      <div className={styles.productMeta}>
        {product.category && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Category:</span>
            <span className={styles.metaValue}>{product.category}</span>
          </div>
        )}
        {product.technology && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Technology:</span>
            <span className={styles.metaValue}>{product.technology}</span>
          </div>
        )}
        {(product as any).professionalGrade && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Grade:</span>
            <span className={styles.metaValue}>{(product as any).professionalGrade}</span>
          </div>
        )}
        {product.stock !== undefined && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Stock:</span>
            <span className={`${styles.metaValue} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`}>
              {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
            </span>
          </div>
        )}
      </div>

      {/* Price Section */}
      {product.price && product.price > 0 && (
        <div className={styles.priceSection}>
          <div className={styles.priceDisplay}>
            <span className={styles.priceLabel}>Professional Price</span>
            <span className={styles.priceValue}>${product.price}</span>
          </div>
          <div className={styles.priceNote}>
            *Professional pricing available for certified practitioners
          </div>
        </div>
      )}

      {/* Key Benefits Preview */}
      {product.benefits && (
        <div className={styles.benefitsPreview}>
          <h3 className={styles.benefitsTitle}>Key Benefits</h3>
          <ul className={styles.benefitsList}>
            {Array.isArray(product.benefits) 
              ? product.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className={styles.benefitItem}>
                    <span className={styles.benefitIcon}>✓</span>
                    {benefit.title}
                  </li>
                ))
              : (
                <li className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>✓</span>
                  Professional-grade formulation
                </li>
              )
            }
          </ul>
        </div>
      )}

      {/* Trust Indicators */}
      <div className={styles.trustIndicators}>
        <div className={styles.trustItem}>
          <FaCertificate className={styles.trustIcon} />
          <span>Medical Grade</span>
        </div>
        <div className={styles.trustItem}>
          <FaShieldAlt className={styles.trustIcon} />
          <span>FDA Approved</span>
        </div>
        <div className={styles.trustItem}>
          <FaStar className={styles.trustIcon} />
          <span>Professional Quality</span>
        </div>
      </div>

      {/* Call-to-Action Buttons */}
      <div className={styles.ctaSection}>
        <button className={styles.primaryCTA}>
          <FaWhatsapp className={styles.ctaIcon} />
          WhatsApp Consultation
        </button>
        <button className={styles.secondaryCTA}>
          <FaPhone className={styles.ctaIcon} />
          Call for Quote
        </button>
        <button className={styles.tertiaryCTA}>
          <FaDownload className={styles.ctaIcon} />
          Download Brochure
        </button>
      </div>

      {/* Professional Note */}
      <div className={styles.professionalNote}>
        <p>
          <strong>Professional Use Only:</strong> This product is designed for use by qualified medical aesthetics professionals. 
          Please ensure you have the necessary certifications before ordering.
        </p>
      </div>
    </aside>
  );
};

export default StickyInfoSidebar; 