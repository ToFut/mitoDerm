'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { 
  FiHeart, 
  FiShoppingCart, 
  FiEye, 
  FiStar,
  FiShield,
  FiUsers,
  FiTag,
  FiTrendingUp
} from 'react-icons/fi';
import { Product } from '@/types';
import { useCart, useWishlist, useAuth, useAddNotification } from '@/store/store';
import { canUserAccessProduct, getProductPrice } from '@/lib/services/productService';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
  onQuickView?: (product: Product) => void;
}

const ProductCard: FC<ProductCardProps> = ({ 
  product, 
  variant = 'default',
  showQuickActions = true,
  onQuickView 
}) => {
  const router = useRouter();
  const t = useTranslations();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const addNotification = useAddNotification();
  
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isPartner = user?.role === 'partner';
  const canAccess = canUserAccessProduct(product.id!, user?.id || '');
  const isInWishlist = wishlist.includes(product.id!);
  const currentPrice = product.price || 0;
  const hasDiscount = product.pricing?.salePrice && product.flags?.onSale;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.pricing!.salePrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!canAccess) {
      addNotification({
        type: 'error',
        title: t('product.accessDenied'),
        message: product.certificationRequired 
          ? t('product.requiresCertification')
          : t('product.partnersOnly')
      });
      return;
    }

    if (!product.availability?.inStock && !product.availability?.backorderAllowed) {
      addNotification({
        type: 'error',
        title: t('product.outOfStock'),
        message: t('product.outOfStockMessage')
      });
      return;
    }

    setIsLoading(true);
    try {
      addToCart(product, 1);
      addNotification({
        type: 'success',
        title: t('cart.itemAdded'),
        message: t('cart.itemAddedMessage', { name: product.name })
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error.generic'),
        message: t('cart.addError')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeFromWishlist(product.id!);
      addNotification({
        type: 'info',
        title: t('wishlist.removed'),
        message: t('wishlist.removedMessage', { name: product.name })
      });
    } else {
      addToWishlist(product.id!);
      addNotification({
        type: 'success',
        title: t('wishlist.added'),
        message: t('wishlist.addedMessage', { name: product.name })
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleProductClick = () => {
    router.push(`/products/${product.slug}`);
  };

  const renderBadges = () => {
    const badges = [];

    if (product.flags?.newArrival) {
      badges.push(
        <span key="new" className={`${styles.badge} ${styles.badgeNew}`}>
          {t('product.new')}
        </span>
      );
    }

    if (product.flags?.bestSeller) {
      badges.push(
        <span key="bestseller" className={`${styles.badge} ${styles.badgeBestseller}`}>
          <FiTrendingUp />
          {t('product.bestseller')}
        </span>
      );
    }

    if (hasDiscount) {
      badges.push(
        <span key="sale" className={`${styles.badge} ${styles.badgeSale}`}>
          -{discountPercent}%
        </span>
      );
    }

    if (product.partnerOnly) {
      badges.push(
        <span key="partner" className={`${styles.badge} ${styles.badgePartner}`}>
          <FiUsers />
          {t('product.partnersOnly')}
        </span>
      );
    }

    if (product.certificationRequired) {
      badges.push(
        <span key="certified" className={`${styles.badge} ${styles.badgeCertified}`}>
          <FiShield />
          {t('product.certified')}
        </span>
      );
    }

    return badges;
  };

  const renderRating = () => {
    if (!product.analytics?.averageRating || product.analytics.reviewCount === 0) {
      return null;
    }

    const rating = product.analytics.averageRating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className={styles.rating}>
        <div className={styles.stars}>
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              className={i < fullStars ? styles.starFilled : 
                      i === fullStars && hasHalfStar ? styles.starHalf : styles.starEmpty}
            />
          ))}
        </div>
        <span className={styles.ratingText}>
          {rating.toFixed(1)} ({product.analytics.reviewCount})
        </span>
      </div>
    );
  };

  return (
    <div 
      className={`${styles.productCard} ${styles[variant]} ${!canAccess ? styles.restricted : ''}`}
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className={styles.imageContainer}>
        <Image
          src={imageError ? '/images/placeholder-product.jpg' : (product.images?.[0]?.url || product.image)}
          alt={product.images?.[0]?.alt || product.name}
          fill
          className={styles.productImage}
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        {renderBadges().length > 0 && (
          <div className={styles.badges}>
            {renderBadges()}
          </div>
        )}

        {/* Quick Actions */}
        {showQuickActions && (
          <div className={styles.quickActions}>
            <button
              onClick={handleWishlistToggle}
              className={`${styles.quickAction} ${isInWishlist ? styles.active : ''}`}
              aria-label={isInWishlist ? t('wishlist.remove') : t('wishlist.add')}
            >
              <FiHeart />
            </button>
            
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className={styles.quickAction}
                aria-label={t('product.quickView')}
              >
                <FiEye />
              </button>
            )}
          </div>
        )}

        {/* Stock Status */}
        {!product.availability?.inStock && (
          <div className={styles.stockStatus}>
            {product.availability?.backorderAllowed 
              ? t('product.backorder') 
              : t('product.outOfStock')
            }
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Category */}
        <div className={styles.category}>
          {product.category}
        </div>

        {/* Title */}
        <h3 className={styles.title}>{product.name}</h3>

        {/* Short Description */}
        {product.shortDescription && variant !== 'compact' && (
          <p className={styles.description}>{product.shortDescription}</p>
        )}

        {/* Rating */}
        {renderRating()}

        {/* Features */}
        {product.features && product.features.length > 0 && variant === 'featured' && (
          <div className={styles.features}>
            {product.features.slice(0, 3).map((feature, index) => (
              <span key={index} className={styles.feature}>
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className={styles.pricing}>
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>
              ${currentPrice.toFixed(2)}
            </span>
            
            {hasDiscount && (
              <span className={styles.originalPrice}>
                ${product.price.toFixed(2)}
              </span>
            )}
            
            {isPartner && product.partnerPrice && (
              <span className={styles.partnerBadge}>
                {t('product.partnerPrice')}
              </span>
            )}
          </div>

          {/* Bulk Pricing Indicator */}
          {product.pricing?.bulkPricing && product.pricing.bulkPricing.length > 0 && (
            <div className={styles.bulkPricing}>
              <FiTag />
              {t('product.bulkPricing')}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || (!product.availability?.inStock && !product.availability?.backorderAllowed) || !canAccess}
          className={styles.addToCartButton}
        >
          <FiShoppingCart />
          {isLoading 
            ? t('product.adding')
            : !canAccess
            ? (product.certificationRequired ? t('product.requiresCertification') : t('product.partnersOnly'))
            : !product.availability?.inStock && !product.availability?.backorderAllowed
            ? t('product.outOfStock')
            : t('product.addToCart')
          }
        </button>
      </div>
    </div>
  );
};

export default ProductCard;