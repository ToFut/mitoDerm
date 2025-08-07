'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiSearch, FiFilter, FiGrid, FiList, FiStar, FiHeart, FiShoppingCart,
  FiShare2, FiEye, FiTrendingUp, FiZap, FiAward, FiTarget, FiGift,
  FiChevronDown, FiChevronUp, FiX, FiShuffle, FiBookmark, FiTag,
  FiClock, FiDollarSign, FiUsers, FiBarChart, FiThumbsUp, FiSettings,
  FiSliders, FiRefreshCw, FiArrowRight, FiCheckCircle, FiCpu,
  FiLayers, FiMonitor, FiSmartphone, FiTablet
} from 'react-icons/fi';
import styles from './ProductsEnhanced.module.scss';
import { Product, getAllProducts } from '@/lib/services/productService';

interface ProductsEnhancedProps {
  initialProducts?: Product[];
}

const ProductsEnhanced = ({ initialProducts = [] }: ProductsEnhancedProps) => {
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter and view states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  
  // Interactive states
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  // Animation refs
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Load products from API
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    } else if (products.length === 0) {
      setIsLoading(true);
      getAllProducts()
        .then(data => {
          setProducts(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading products:', error);
          setIsLoading(false);
        });
    }
  }, [initialProducts, products.length]);

  // Filter products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesBrand = selectedBrand === 'all' || product.manufacturer === selectedBrand;
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => (product.tags || []).includes(tag));
      const matchesRating = ratingFilter === 0 || (product.rating || 0) >= ratingFilter;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesTags && matchesRating;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return b.newArrival ? 1 : -1;
        case 'featured':
        default:
          return b.featured ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, selectedBrand, selectedTags, ratingFilter]);

  // Get unique values for filters
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ['all', ...cats];
  }, [products]);

  const brands = useMemo(() => {
    const brandList = Array.from(new Set(products.map(p => p.manufacturer).filter(Boolean)));
    return ['all', ...brandList];
  }, [products]);

  const allTags = useMemo(() => {
    const tags = products.flatMap(p => p.tags || []);
    return Array.from(new Set(tags));
  }, [products]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToComparison = (product: Product) => {
    if (comparisonList.length >= 3) return;
    if (!comparisonList.find(p => p.id === product.id)) {
      setComparisonList(prev => [...prev, product]);
    }
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== productId));
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`${styles.productCard} ${viewMode === 'list' ? styles.listView : ''}`}
      onMouseEnter={() => setHoveredProduct(product.id!)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      <div className={styles.cardInner}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          <Link href={`/products/${product.slug}`}>
            <Image
              src={product.images?.[0]?.url || product.image || '/images/placeholder-product.svg'}
              alt={product.images?.[0]?.alt || product.name || 'Product'}
              width={300}
              height={300}
              className={styles.productImage}
            />
          </Link>
          
          {/* Badges */}
          <div className={styles.badges}>
            {product.featured && <span className={styles.badge}>Featured</span>}
            {product.bestSeller && <span className={styles.badge}>Best Seller</span>}
            {product.newArrival && <span className={styles.badge}>New</span>}
          </div>

          {/* Quick Actions */}
          <motion.div 
            className={styles.quickActions}
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(product.id!)}
              className={`${styles.actionBtn} ${favorites.includes(product.id!) ? styles.active : ''}`}
            >
              <FiHeart />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuickViewProduct(product)}
              className={styles.actionBtn}
            >
              <FiEye />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => addToComparison(product)}
              className={styles.actionBtn}
            >
              <FiBarChart />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={styles.actionBtn}
            >
              <FiShoppingCart />
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className={styles.productInfo}>
          <div className={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i} 
                className={i < Math.floor(product.rating || 0) ? styles.filled : styles.empty} 
              />
            ))}
            <span className={styles.ratingText}>({product.reviewCount || 0})</span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className={styles.productName}>{product.name}</h3>
          </Link>
          
          <p className={styles.shortDescription}>{product.shortDescription || product.description}</p>
          
          <div className={styles.tags}>
            {(product.tags || []).slice(0, 3).map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          <div className={styles.priceSection}>
            <span className={styles.price}>${product.price}</span>
            {product.soldCount && (
              <span className={styles.soldCount}>{product.soldCount} sold</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <motion.div
            className={styles.loadingSpinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiCpu />
          </motion.div>
          <h2>Loading Premium Products...</h2>
          <p>Discovering the perfect solutions for your skin</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <motion.section 
        className={styles.heroSection}
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className={styles.heroBackground}>
          <div className={styles.gradientOverlay} />
          <div className={styles.particleField}>
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className={styles.particle}
                animate={{
                  y: [-20, -100, -20],
                  x: [0, (i % 3 - 1) * 30, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + (i % 2) * 0.5,
                  repeat: Infinity,
                  delay: (i * 0.1) % 2,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${20 + (i * 4) % 60}%`,
                  top: `${20 + (i * 3) % 60}%`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className={styles.heroTitle}>
              Discover Our
              <span className={styles.gradientText}> Premium Collection</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Advanced skincare solutions powered by cutting-edge science and AI technology
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{products.length}+</span>
                <span className={styles.statLabel}>Products</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>4.8</span>
                <span className={styles.statLabel}>Rating</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>50K+</span>
                <span className={styles.statLabel}>Happy Customers</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Filters */}
      <motion.section 
        className={styles.filtersSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className={styles.clearSearch}>
                <FiX />
              </button>
            )}
          </div>
        </div>

        <div className={styles.filterControls}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
          >
            <FiFilter />
            Filters
            <FiChevronDown className={`${styles.chevron} ${showFilters ? styles.rotated : ''}`} />
          </button>

          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
            >
              <FiList />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="featured">Featured</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={styles.expandedFilters}
            >
              <div className={styles.filterGrid}>
                <div className={styles.filterGroup}>
                  <label>Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand === 'all' ? 'All Brands' : brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Minimum Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Price Range</label>
                  <div className={styles.priceRange}>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                    <span>${priceRange[0]} - ${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.resultsInfo}>
          <span>{filteredProducts.length} products found</span>
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedBrand('all');
                setRatingFilter(0);
                setPriceRange([0, 2000]);
              }}
              className={styles.clearAll}
            >
              Clear All
            </button>
          )}
        </div>
      </motion.section>

      {/* Comparison Bar */}
      <AnimatePresence>
        {comparisonList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={styles.comparisonBar}
          >
            <div className={styles.comparisonContent}>
              <span>Compare Products ({comparisonList.length}/3)</span>
              <div className={styles.comparisonItems}>
                {comparisonList.map(product => (
                  <div key={product.id} className={styles.comparisonItem}>
                    <img src={product.image} alt={product.name} />
                    <button onClick={() => removeFromComparison(product.id!)}>
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
              <button className={styles.compareBtn}>
                Compare Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <motion.section className={styles.productsSection}>
        {filteredProducts.length === 0 ? (
          <motion.div 
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiSearch className={styles.emptyIcon} />
            <h3>No products found</h3>
            <p>Try adjusting your search criteria or browse all products.</p>
          </motion.div>
        ) : (
          <motion.div 
            className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listMode : ''}`}
            layout
          >
            <AnimatePresence>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={styles.quickViewModal}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className={styles.closeModal}
              >
                <FiX />
              </button>
              
              <div className={styles.modalContent}>
                <div className={styles.modalImage}>
                  <Image
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    width={400}
                    height={400}
                  />
                </div>
                
                <div className={styles.modalInfo}>
                  <h3>{quickViewProduct.name}</h3>
                  <p>{quickViewProduct.description}</p>
                  <div className={styles.modalPrice}>
                    ${quickViewProduct.price}
                  </div>
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    className={styles.viewDetailsBtn}
                  >
                    View Full Details
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductsEnhanced;