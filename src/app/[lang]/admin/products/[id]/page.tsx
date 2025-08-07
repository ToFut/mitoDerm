"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiEdit, 
  FiArrowLeft, 
  FiPackage,
  FiDollarSign,
  FiEye,
  FiStar,
  FiCheckCircle
} from 'react-icons/fi';
import { Product, getProduct } from '@/lib/services/productService';
import styles from './productDetail.module.scss';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(productId);
      setProduct(data);
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || 'Product not found'}
          <button onClick={() => router.push('/admin/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          onClick={() => router.push('/admin/products')}
          className={styles.backButton}
        >
          <FiArrowLeft /> Back to Products
        </button>
        
        <Link 
          href={`/admin/products/${productId}/edit`}
          className={styles.editButton}
        >
          <FiEdit /> Edit Product
        </Link>
      </div>

      <div className={styles.productDetail}>
        <div className={styles.mainInfo}>
          <h1>{product.name}</h1>
          {product.nameHebrew && (
            <h2 className={styles.hebrewName}>{product.nameHebrew}</h2>
          )}
          
          <div className={styles.badges}>
            {product.featured && (
              <span className={styles.badge}>
                <FiStar /> Featured
              </span>
            )}
            {product.bestSeller && (
              <span className={styles.badge}>
                <FiCheckCircle /> Best Seller
              </span>
            )}
            {product.newArrival && (
              <span className={styles.badge}>New Arrival</span>
            )}
          </div>

          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <FiPackage />
              <span>Category: {product.category}</span>
            </div>
            <div className={styles.metaItem}>
              <FiDollarSign />
              <span>Price: ${product.price}</span>
            </div>
            <div className={styles.metaItem}>
              <FiEye />
              <span>Views: 0</span>
            </div>
          </div>

          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.ingredients && product.ingredients.length > 0 && (
            <div className={styles.section}>
              <h3>Ingredients</h3>
              <ul>
                {Array.isArray(product.ingredients) ? product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                )) : (
                  <li>{product.ingredients}</li>
                )}
              </ul>
            </div>
          )}

          {product.benefits && product.benefits.length > 0 && (
            <div className={styles.section}>
              <h3>Benefits</h3>
              <ul>
                {Array.isArray(product.benefits) ? product.benefits.map((benefit, index) => (
                  <li key={index}>
                    {typeof benefit === 'object' ? `${benefit.title}: ${benefit.description}` : benefit}
                  </li>
                )) : (
                  <li>{product.benefits}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          {product.images && product.images.length > 0 && (
            <div className={styles.images}>
              <h3>Product Images</h3>
              {product.images.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <Image
                    src={typeof image === 'string' ? image : image.url}
                    alt={typeof image === 'string' ? `Product image ${index + 1}` : (image.alt || `Product image ${index + 1}`)}
                    width={200}
                    height={200}
                    className={styles.productImage}
                  />
                </div>
              ))}
            </div>
          )}

          <div className={styles.analytics}>
            <h3>Analytics</h3>
            <div className={styles.stat}>
              <span>Stock:</span>
              <strong>{product.stock || 0}</strong>
            </div>
            <div className={styles.stat}>
              <span>Sold:</span>
              <strong>{product.soldCount || 0}</strong>
            </div>
            <div className={styles.stat}>
              <span>Rating:</span>
              <strong>{product.rating || 0}/5</strong>
            </div>
            <div className={styles.stat}>
              <span>Reviews:</span>
              <strong>{product.reviewCount || 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}