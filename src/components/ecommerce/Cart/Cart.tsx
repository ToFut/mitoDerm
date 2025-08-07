'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  FiShoppingCart, 
  FiPlus, 
  FiMinus, 
  FiTrash2, 
  FiArrowRight,
  FiX,
  FiTag
} from 'react-icons/fi';
import { useCart, useUser, useUpdateCartQuantity, useRemoveFromCart, useClearCart, useApplyCoupon, useRemoveCoupon } from '@/store/store';
import { Product } from '@/types';
import { canUserAccessProduct, getProductPrice } from '@/lib/services/productService';
import styles from './Cart.module.scss';

interface CartProps {
  isOpen?: boolean;
  onClose?: () => void;
  products?: Product[]; // Products data to display cart items
}

const Cart: FC<CartProps> = ({ isOpen = false, onClose, products = [] }) => {
  const router = useRouter();
  const t = useTranslations();
  const user = useUser();
  const cart = useCart();
  const updateCartQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Get cart items with product details
  const cartItemsWithProducts = cart.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product); // Only include items where product is found

  const isPartner = user?.role === 'partner';

  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError('');
    
    try {
      // TODO: Validate coupon with backend
      // For now, apply if not already applied
      if (!cart.appliedCoupons.includes(couponCode)) {
        applyCoupon(couponCode);
        setCouponCode('');
      } else {
        setCouponError('Coupon already applied');
      }
    } catch (error) {
      setCouponError('Invalid coupon code');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.items.length === 0) return;
    
    // Check if user can access all products
    const restrictedItems = cartItemsWithProducts.filter(item => 
      !canUserAccessProduct(item.product!.id!, user?.id || '')
    );
    
    if (restrictedItems.length > 0) {
      // Handle restricted items (show error, remove items, etc.)
      return;
    }
    
    router.push('/checkout');
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.cartOverlay} onClick={onClose}>
      <div className={styles.cartSidebar} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.cartHeader}>
          <div className={styles.cartTitle}>
            <FiShoppingCart />
            <h3>{t('cart.title')} ({cart.itemCount})</h3>
          </div>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t('cart.close')}
          >
            <FiX />
          </button>
        </div>

        {/* Cart Content */}
        <div className={styles.cartContent}>
          {cart.items.length === 0 ? (
            <div className={styles.emptyCart}>
              <FiShoppingCart className={styles.emptyIcon} />
              <h4>{t('cart.empty.title')}</h4>
              <p>{t('cart.empty.description')}</p>
              <button 
                className={styles.continueShoppingButton}
                onClick={() => {
                  router.push('/products');
                  onClose?.();
                }}
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className={styles.cartItems}>
                {cartItemsWithProducts.map(item => (
                  <div key={item.productId} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img 
                        src={item.product!.images?.[0]?.url || '/images/placeholder.jpg'} 
                        alt={item.product!.name}
                        loading="lazy"
                      />
                    </div>
                    
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemName}>{item.product!.name}</h4>
                      <p className={styles.itemSku}>SKU: {item.product!.sku}</p>
                      
                      <div className={styles.itemPrice}>
                        <span className={styles.currentPrice}>
                          ${(isPartner && item.product!.partnerPrice ? item.product!.partnerPrice : item.product!.price || 0).toFixed(2)}
                        </span>
                        {isPartner && item.product!.partnerPrice && (
                          <span className={styles.originalPrice}>
                            ${(item.product!.price || 0).toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => handleQuantityUpdate(item.productId, item.quantity - 1)}
                          className={styles.quantityButton}
                          aria-label={t('cart.decreaseQuantity')}
                        >
                          <FiMinus />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityUpdate(item.productId, item.quantity + 1)}
                          className={styles.quantityButton}
                          aria-label={t('cart.increaseQuantity')}
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.itemActions}>
                      <div className={styles.itemTotal}>
                        ${(getProductPrice(item.product!, isPartner) * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className={styles.removeButton}
                        aria-label={t('cart.removeItem')}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className={styles.couponSection}>
                <div className={styles.couponInput}>
                  <FiTag />
                  <input
                    type="text"
                    placeholder={t('cart.coupon.placeholder')}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className={styles.applyCouponButton}
                  >
                    {isApplyingCoupon ? t('cart.coupon.applying') : t('cart.coupon.apply')}
                  </button>
                </div>
                
                {couponError && (
                  <div className={styles.couponError}>{couponError}</div>
                )}
                
                {cart.appliedCoupons.length > 0 && (
                  <div className={styles.appliedCoupons}>
                    {cart.appliedCoupons.map(coupon => (
                      <div key={coupon} className={styles.appliedCoupon}>
                        <span>{coupon}</span>
                        <button onClick={() => removeCoupon(coupon)}>
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                  <span>{t('cart.subtotal')}</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                
                {cart.estimatedShipping > 0 && (
                  <div className={styles.summaryRow}>
                    <span>{t('cart.shipping')}</span>
                    <span>${cart.estimatedShipping.toFixed(2)}</span>
                  </div>
                )}
                
                <div className={styles.summaryRow}>
                  <span>{t('cart.tax')}</span>
                  <span>${cart.estimatedTax.toFixed(2)}</span>
                </div>
                
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>{t('cart.total')}</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.cartActions}>
                <button
                  onClick={handleProceedToCheckout}
                  className={styles.checkoutButton}
                  disabled={cart.items.length === 0}
                >
                  {t('cart.checkout')}
                  <FiArrowRight />
                </button>
                
                <button
                  onClick={() => {
                    router.push('/products');
                    onClose?.();
                  }}
                  className={styles.continueShoppingButton}
                >
                  {t('cart.continueShopping')}
                </button>
                
                {cart.items.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm(t('cart.clearConfirm'))) {
                        clearCart();
                      }
                    }}
                    className={styles.clearCartButton}
                  >
                    {t('cart.clear')}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;