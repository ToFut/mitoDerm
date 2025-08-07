'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiStar, FiShoppingBag, FiHeart, FiEye, FiArrowRight, FiFilter, FiSearch } from 'react-icons/fi';
import styles from './vmProducts.module.scss';

export default function VMProductsClient() {
  const t = useTranslations('vmProducts');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  // Mock VM products data with placeholder images
  const vmProducts = [
    {
      id: 'vm1',
      name: 'VM Serum Plus',
      description: 'Advanced exosome serum for professional use with enhanced cellular communication',
      category: 'serums',
      price: '$299',
      rating: 4.8,
      reviews: 124,
      image: 'https://via.placeholder.com/400x300/1a1a2e/dfba74?text=VM+Serum+Plus',
      featured: true,
      inStock: true,
      tags: ['exosomes', 'anti-aging', 'professional']
    },
    {
      id: 'vm2',
      name: 'VM Cream Elite',
      description: 'Premium anti-aging cream with synthetic exosomes and advanced peptides',
      category: 'creams',
      price: '$399',
      rating: 4.9,
      reviews: 89,
      image: 'https://via.placeholder.com/400x300/1a1a2e/dfba74?text=VM+Cream+Elite',
      featured: true,
      inStock: true,
      tags: ['anti-aging', 'moisturizing', 'premium']
    },
    {
      id: 'vm3',
      name: 'VM Mask Pro',
      description: 'Professional treatment mask for intensive care and deep hydration',
      category: 'masks',
      price: '$199',
      rating: 4.7,
      reviews: 156,
      image: 'https://via.placeholder.com/400x300/1a1a2e/dfba74?text=VM+Mask+Pro',
      featured: false,
      inStock: true,
      tags: ['treatment', 'hydration', 'intensive']
    },
    {
      id: 'vm4',
      name: 'VM Booster Advanced',
      description: 'Concentrated booster for enhanced results and skin regeneration',
      category: 'boosters',
      price: '$249',
      rating: 4.6,
      reviews: 67,
      image: 'https://via.placeholder.com/400x300/1a1a2e/dfba74?text=VM+Booster+Advanced',
      featured: false,
      inStock: false,
      tags: ['booster', 'regeneration', 'concentrated']
    },
    {
      id: 'vm5',
      name: 'VM Eye Serum',
      description: 'Specialized eye serum for delicate skin around the eyes',
      category: 'serums',
      price: '$179',
      rating: 4.5,
      reviews: 92,
      image: 'https://via.placeholder.com/400x300/1a1a2e/dfba74?text=VM+Eye+Serum',
      featured: false,
      inStock: true,
      tags: ['eye', 'delicate', 'specialized']
    },
    {
      id: 'vm6',
      name: 'VM Night Cream',
      description: 'Advanced night cream for overnight skin repair and regeneration',
      category: 'creams',
      price: '$349',
      rating: 4.8,
      reviews: 78,
      image: 'https://via.placeholder.com/400x300/1a1a2e/dfba74?text=VM+Night+Cream',
      featured: true,
      inStock: true,
      tags: ['night', 'repair', 'regeneration']
    }
  ];

  const categories = ['all', 'serums', 'creams', 'masks', 'boosters'];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort products
  const filteredProducts = vmProducts
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                           (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                           (product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) || false);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
        case 'price-high':
          return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
        default:
          return 0;
      }
    });

  const featuredProducts = filteredProducts.filter(product => product.featured);

  if (isLoading) {
    return (
      <div className={styles.vmProductsPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading VM Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.vmProductsPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
          <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{vmProducts.length}</span>
              <span className={styles.statLabel}>{t('hero.products')}</span>
            </div>
            <div className={styles.stat}>
              <FiStar className={styles.statIcon} />
              <span className={styles.statLabel}>{t('hero.rating')}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>VM</span>
              <span className={styles.statLabel}>{t('hero.line')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters Section */}
      <section className={styles.filters}>
        <div className={styles.filterContainer}>
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search VM products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Category Filters */}
          <div className={styles.categoryFilters}>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className={styles.sortContainer}>
            <FiFilter className={styles.sortIcon} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured VM Products</h2>
          <div className={styles.productsGrid}>
            {featuredProducts.map(product => (
              <div key={product.id} className={`${styles.productCard} ${styles.featuredCard}`}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
                  <span className={styles.featuredBadge}>
                    <FiStar /> {t('badges.featured')}
                  </span>
                  <div className={styles.productActions}>
                    <button className={styles.actionButton} title="Quick View">
                      <FiEye />
                    </button>
                    <button className={styles.actionButton} title="Add to Wishlist">
                      <FiHeart />
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDescription}>{product.description}</p>
                  <div className={styles.productMeta}>
                    <div className={styles.rating}>
                      <FiStar className={styles.starIcon} />
                      <span>{product.rating}</span>
                      <span className={styles.reviews}>({product.reviews})</span>
                    </div>
                    <span className={styles.productCategory}>{t(`categories.${product.category}`)}</span>
                  </div>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>{product.price}</span>
                    <button className={styles.addToCartButton}>
                      <FiShoppingBag />
                      {t('actions.addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Products Section */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>{t('products.title')}</h2>
        {filteredProducts.length === 0 ? (
          <div className={styles.noResults}>
            <p>{t('noResults.message')}</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
                  {product.featured && (
                    <span className={styles.featuredBadge}>
                      <FiStar /> {t('badges.featured')}
                    </span>
                  )}
                  {!product.inStock && (
                    <span className={styles.outOfStockBadge}>
                      {t('badges.outOfStock')}
                    </span>
                  )}
                  <div className={styles.productActions}>
                    <button className={styles.actionButton} title="Quick View">
                      <FiEye />
                    </button>
                    <button className={styles.actionButton} title="Add to Wishlist">
                      <FiHeart />
                    </button>
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDescription}>{product.description}</p>
                  <div className={styles.productMeta}>
                    <div className={styles.rating}>
                      <FiStar className={styles.starIcon} />
                      <span>{product.rating}</span>
                      <span className={styles.reviews}>({product.reviews})</span>
                    </div>
                    <span className={styles.productCategory}>{t(`categories.${product.category}`)}</span>
                  </div>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>{product.price}</span>
                    <button className={styles.addToCartButton} disabled={!product.inStock}>
                      <FiShoppingBag />
                      {product.inStock ? t('actions.addToCart') : t('actions.outOfStock')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enhanced CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton}>
              {t('cta.learnMore')} <FiArrowRight />
            </button>
            <button className={styles.secondaryButton}>
              {t('cta.contact')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 