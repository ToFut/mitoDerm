import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/services/productService';
import styles from './ProductDisplay.module.scss';

interface ProductDisplayProps {
  product: Product;
  variant?: 'card' | 'list' | 'featured';
  showActions?: boolean;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  userCertificationLevel?: 'none' | 'basic' | 'advanced' | 'expert';
}

export default function ProductDisplay({ 
  product, 
  variant = 'card',
  showActions = true,
  onAddToCart,
  onViewDetails,
  userCertificationLevel = 'none'
}: ProductDisplayProps) {
  const [imageError, setImageError] = useState(false);

  const canPurchase = !product.requiresCertification || 
    (product.requiresCertification && userCertificationLevel !== 'none');

  const getCertificationLevel = (level: string) => {
    switch (level) {
      case 'basic': return 'Basic Certification';
      case 'advanced': return 'Advanced Certification';
      case 'expert': return 'Expert Certification';
      default: return 'No Certification Required';
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const renderImage = (width: number, height: number, className?: string) => {
    if (product.image && !imageError) {
      return (
        <Image
          src={product.image}
          alt={product.name}
          width={width}
          height={height}
          className={className}
          onError={() => setImageError(true)}
        />
      );
    }
    return (
      <div className={styles.noImage}>
        <span>No Image</span>
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <div className={styles.productList}>
        <div className={styles.productImage}>
          {renderImage(80, 80)}
        </div>
        
        <div className={styles.productInfo}>
          <h3>{product.name}</h3>
          <p className={styles.sku}>SKU: {product.sku}</p>
          <p className={styles.category}>{product.category}</p>
          <div className={styles.badges}>
            {product.featured && <span className={styles.badge}>Featured</span>}
            {product.bestSeller && <span className={styles.badge}>Best Seller</span>}
            {product.newArrival && <span className={styles.badge}>New</span>}
          </div>
        </div>
        
        <div className={styles.productMeta}>
          <div className={styles.price}>${product.price}</div>
          <div className={styles.stock}>
            Stock: {product.stock}
          </div>
          {product.requiresCertification && (
            <div className={styles.certification}>
              {getCertificationLevel(product.certificationLevel)}
            </div>
          )}
        </div>
        
        {showActions && (
          <div className={styles.actions}>
            <button onClick={handleViewDetails} className={styles.viewButton}>
              View Details
            </button>
            {canPurchase ? (
              <button 
                onClick={handleAddToCart} 
                className={styles.addToCartButton}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <button className={styles.certificationRequired}>
                Certification Required
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={styles.productFeatured}>
        <div className={styles.featuredImage}>
          {renderImage(300, 200)}
          <div className={styles.featuredBadge}>Featured</div>
        </div>
        
        <div className={styles.featuredContent}>
          <h2>{product.name}</h2>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.featuredMeta}>
            <div className={styles.price}>${product.price}</div>
            <div className={styles.stock}>Stock: {product.stock}</div>
          </div>
          {showActions && (
            <div className={styles.featuredActions}>
              <button onClick={handleViewDetails} className={styles.viewButton}>
                Learn More
              </button>
              {canPurchase ? (
                <button 
                  onClick={handleAddToCart} 
                  className={styles.addToCartButton}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              ) : (
                <button className={styles.certificationRequired}>
                  Get Certified
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={styles.productCard}>
      <div className={styles.cardImage}>
        {renderImage(250, 200)}
        <div className={styles.cardBadges}>
          {product.featured && <span className={styles.badge}>Featured</span>}
          {product.bestSeller && <span className={styles.badge}>Best Seller</span>}
          {product.newArrival && <span className={styles.badge}>New</span>}
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <h3>{product.name}</h3>
        <p className={styles.sku}>SKU: {product.sku}</p>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.cardMeta}>
          <div className={styles.price}>${product.price}</div>
          <div className={`${styles.stock} ${product.stock < 10 ? styles.lowStock : ''}`}>
            Stock: {product.stock}
          </div>
        </div>
        
        {product.requiresCertification && (
          <div className={styles.certification}>
            {getCertificationLevel(product.certificationLevel)}
          </div>
        )}
        
        {showActions && (
          <div className={styles.cardActions}>
            <button onClick={handleViewDetails} className={styles.viewButton}>
              View Details
            </button>
            {canPurchase ? (
              <button 
                onClick={handleAddToCart} 
                className={styles.addToCartButton}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <button className={styles.certificationRequired}>
                Certification Required
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 