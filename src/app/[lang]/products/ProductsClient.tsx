'use client';
import { FC, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './products.module.scss';
import { useTranslations } from 'next-intl';

// Dynamic import of enhanced products page
const ProductsEnhanced = dynamic(
  () => import('./ProductsEnhanced'),
  { 
    ssr: false,
    loading: () => (
      <div className={styles.loadingGrid}>
        <div className={styles.loadingSkeleton}>
          <div className={styles.skeletonImage}></div>
          <div className={styles.skeletonText}></div>
        </div>
      </div>
    )
  }
);
import { 
  FiSearch, 
  FiX, 
  FiFilter, 
  FiChevronDown, 
  FiGrid, 
  FiList, 
  FiStar, 
  FiHeart, 
  FiShoppingCart,
  FiZap,
  FiTrendingUp,
  FiTarget,
  FiEye,
  FiThumbsUp,
  FiBookmark,
  FiShare2,
  FiMessageCircle,
  FiAward,
  FiClock,
  FiDollarSign,
  FiTag,
  FiShuffle,
  FiRefreshCw,
  FiSliders,
  FiUser,
  FiSettings
} from 'react-icons/fi';

interface ProductsClientProps {
  initialProducts: any[];
}

const ProductsClient: FC<ProductsClientProps> = ({ initialProducts }) => {
  const t = useTranslations();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<any[]>([]);
  const [showPersonalization, setShowPersonalization] = useState(true);
  const [skinTypeFilter, setSkinTypeFilter] = useState('all');
  const [concernsFilter, setConcernsFilter] = useState<string[]>([]);
  const [brandFilter, setBrandFilter] = useState('all');
  const [showWishlist, setShowWishlist] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [smartFilters, setSmartFilters] = useState(false);
  const [showEnhancedView, setShowEnhancedView] = useState(true); // Default to enhanced view

  // Enhanced initialization with personalization
  useEffect(() => {
    if (!products || products.length === 0) {
      setIsLoading(true);
      Promise.all([
        fetch('/api/products').then(res => res.json()),
        // Simulate user preferences API
        Promise.resolve({
          skinType: 'combination',
          concerns: ['aging', 'hydration'],
          priceRange: [50, 500],
          preferredBrands: ['MitoDerm'],
          previousPurchases: []
        }),
        // Simulate recently viewed
        Promise.resolve([]),
        // Load search history from localStorage
        Promise.resolve(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
      ])
        .then(([productsData, preferences, recent, history]) => {
          setProducts(productsData.products || []);
          setUserPreferences(preferences);
          setRecentlyViewed(recent);
          setSearchHistory(history.slice(0, 5)); // Keep last 5 searches
          generatePersonalizedRecommendations(productsData.products || [], preferences);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching data:', err);
          setIsLoading(false);
        });
    }
  }, [products]);

  // Generate AI-powered personalized recommendations
  const generatePersonalizedRecommendations = (products: any[], preferences: any) => {
    if (!products.length) return;
    
    // Simulate AI recommendation algorithm
    const recommended = products
      .filter(product => {
        // Match user preferences
        const matchesSkinType = !preferences.skinType || 
          product.suitableFor?.includes(preferences.skinType);
        const matchesConcerns = !preferences.concerns?.length || 
          preferences.concerns.some((concern: string) => 
            product.benefits?.includes(concern)
          );
        const matchesPriceRange = !preferences.priceRange || 
          (product.price >= preferences.priceRange[0] && 
           product.price <= preferences.priceRange[1]);
        
        return matchesSkinType && matchesConcerns && matchesPriceRange;
      })
      .slice(0, 6);
    
    setPersonalizedRecommendations(recommended);
  };

  // AI-powered search suggestions
  const generateAISuggestions = (term: string) => {
    if (term.length < 2) {
      setAiSuggestions([]);
      return;
    }
    
    // Simulate AI suggestions based on context
    const suggestions = [
      `${term} for ${userPreferences.skinType || 'all'} skin`,
      `${term} anti-aging benefits`,
      `${term} professional grade`,
      `${term} under $${userPreferences.priceRange?.[1] || 200}`,
      `${term} bestsellers`
    ].filter(s => s.toLowerCase().includes(term.toLowerCase()));
    
    setAiSuggestions(suggestions.slice(0, 3));
  };

  // Enhanced search with history
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term && !searchHistory.includes(term)) {
      const newHistory = [term, ...searchHistory.slice(0, 4)];
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
    
    generateAISuggestions(term);
  };

  // Wishlist management
  const toggleFavorite = (productId: string) => {
    setFavoriteProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Comparison management
  const addToComparison = (product: any) => {
    if (comparisonList.length >= 3) {
      alert('You can compare up to 3 products at once');
      return;
    }
    
    if (!comparisonList.find(p => p.id === product.id)) {
      setComparisonList(prev => [...prev, product]);
    }
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== productId));
  };

  // Advanced product filtering with AI-powered logic
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    let filtered = products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.benefits?.some((benefit: string) => 
                             benefit.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = !product.price || (product.price >= priceRange[0] && product.price <= priceRange[1]);
      
      // Advanced filters
      const matchesSkinType = skinTypeFilter === 'all' || 
        product.suitableFor?.includes(skinTypeFilter);
      const matchesConcerns = concernsFilter.length === 0 || 
        concernsFilter.some(concern => product.benefits?.includes(concern));
      const matchesBrand = brandFilter === 'all' || product.brand === brandFilter;
      
      // Smart filters based on user preferences
      let matchesPreferences = true;
      if (smartFilters && userPreferences.skinType) {
        matchesPreferences = product.suitableFor?.includes(userPreferences.skinType) || false;
      }
      
      return matchesSearch && matchesCategory && matchesPrice && 
             matchesSkinType && matchesConcerns && matchesBrand && matchesPreferences;
    });

    // Enhanced sorting with personalization
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'relevance':
          // AI-powered relevance scoring
          const scoreA = calculateRelevanceScore(a, searchTerm, userPreferences);
          const scoreB = calculateRelevanceScore(b, searchTerm, userPreferences);
          return scoreB - scoreA;
        case 'recommended':
          // Prioritize personalized recommendations
          const isRecommendedA = personalizedRecommendations.some(r => r.id === a.id);
          const isRecommendedB = personalizedRecommendations.some(r => r.id === b.id);
          if (isRecommendedA && !isRecommendedB) return -1;
          if (!isRecommendedA && isRecommendedB) return 1;
          return 0;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, skinTypeFilter, concernsFilter, brandFilter, smartFilters, userPreferences, personalizedRecommendations]);

  // AI relevance scoring
  const calculateRelevanceScore = (product: any, searchTerm: string, preferences: any) => {
    let score = 0;
    
    // Search term relevance
    if (product.name?.toLowerCase().includes(searchTerm.toLowerCase())) score += 10;
    if (product.description?.toLowerCase().includes(searchTerm.toLowerCase())) score += 5;
    
    // User preference matching
    if (preferences.skinType && product.suitableFor?.includes(preferences.skinType)) score += 8;
    if (preferences.concerns?.some((c: string) => product.benefits?.includes(c))) score += 6;
    
    // Popularity and ratings
    score += (product.rating || 0) * 2;
    score += Math.log(product.views || 1);
    
    return score;
  };

    // Get available brands
  const availableBrands = useMemo(() => {
    const brands = products.map(p => p.brand).filter(Boolean);
    return ['all', ...Array.from(new Set(brands))];
  }, [products]);

  // Get available concerns
  const availableConcerns = useMemo(() => {
    const concerns = products.flatMap(p => p.benefits || []);
    return Array.from(new Set(concerns));
  }, [products]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    return ['all', ...Array.from(new Set(cats))];
  }, [products]);

  const renderSearchAndFilters = () => (
    <div className={styles.searchAndFilters}>
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <FiSearch className={styles.searchIcon} />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className={styles.clearSearch}
          >
            <FiX />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className={styles.filterControls}>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={styles.filterToggle}
        >
          <FiFilter />
          Filters
          <FiChevronDown className={`${styles.chevron} ${isFilterOpen ? styles.rotated : ''}`} />
        </button>

        <div className={styles.viewModeToggle}>
          <button
            onClick={() => setViewMode('grid')}
            className={`${styles.viewModeBtn} ${viewMode === 'grid' ? styles.active : ''}`}
          >
            <FiGrid />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`${styles.viewModeBtn} ${viewMode === 'list' ? styles.active : ''}`}
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.filtersPanel}
          >
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Info */}
      <div className={styles.resultsInfo}>
        <span className={styles.resultCount}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </span>
        {(searchTerm || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange([0, 10000]);
            }}
            className={styles.clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );

  const renderProductCard = (product: any) => (
    <motion.div
      key={product.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${styles.productCard} ${viewMode === 'list' ? styles.listView : ''}`}
    >
      <Link href={`/products/${product.slug}`} className={styles.productLink}>
        <div className={styles.productImageContainer}>
          <Image
            src={product.images?.[0]?.url || '/images/placeholder-product.svg'}
            alt={product.images?.[0]?.alt || product.name}
            width={300}
            height={200}
            className={styles.productImage}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          {product.badge && (
            <div className={styles.productBadge}>
              {product.badge}
            </div>
          )}
          <div className={styles.productOverlay}>
            <div className={styles.productActions}>
              <button className={styles.actionBtn} title="Add to Favorites">
                <FiHeart />
              </button>
              <button className={styles.actionBtn} title="Quick View">
                <FiStar />
              </button>
              <button className={styles.actionBtn} title="Add to Cart">
                <FiShoppingCart />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          {product.subtitle && (
            <p className={styles.productSubtitle}>{product.subtitle}</p>
          )}
          <p className={styles.productDescription}>
            {product.shortDescription || product.description}
          </p>
          {product.price && (
            <div className={styles.productPrice}>
              ${product.price.toFixed(2)}
            </div>
          )}
          {product.technology && (
            <div className={styles.productTech}>
              {product.technology}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Products</h1>
          <p className={styles.subtitle}>Loading our premium skincare solutions...</p>
        </div>
        <div className={styles.loadingGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.loadingSkeleton}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show enhanced view if toggled
  if (showEnhancedView) {
    return (
      <>
        <button 
          onClick={() => setShowEnhancedView(false)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #BE800C, #D4A574)',
            color: 'black',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiX /> Switch to Classic View
        </button>
        <ProductsEnhanced initialProducts={filteredProducts} />
      </>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Products
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover our premium collection of advanced skincare solutions powered by cutting-edge AI technology
        </motion.p>
      </div>

      {renderSearchAndFilters()}

      {/* Comparison Panel */}
      <AnimatePresence>
        {showComparison && comparisonList.length > 0 && (
          <motion.div 
            className={styles.comparisonPanel}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
          >
            <div className={styles.comparisonHeader}>
              <h3>Product Comparison ({comparisonList.length}/3)</h3>
              <button onClick={() => setShowComparison(false)}>
                <FiX />
              </button>
            </div>
            <div className={styles.comparisonContent}>
              {comparisonList.map(product => (
                <div key={product.id} className={styles.comparisonItem}>
                  <img src={product.images?.[0]?.url} alt={product.name} />
                  <h4>{product.name}</h4>
                  <p>${product.price}</p>
                  <button onClick={() => removeFromComparison(product.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProducts.length === 0 ? (
        <motion.div 
          className={styles.emptyState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiSearch className={styles.emptyIcon} />
          <h3>No products found</h3>
          <p>Try adjusting your search criteria or browse all products.</p>
          {searchTerm && (
            <button 
              className={styles.clearSearchBtn}
              onClick={() => handleSearch('')}
            >
              Clear Search
            </button>
          )}
        </motion.div>
      ) : (
        <>
          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <motion.section 
              className={styles.recentlyViewed}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3><FiClock /> Recently Viewed</h3>
              <div className={styles.recentlyViewedGrid}>
                {recentlyViewed.slice(0, 4).map(product => (
                  <div key={product.id} className={styles.recentItem}>
                    <img src={product.images?.[0]?.url} alt={product.name} />
                    <span>{product.name}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
          
          <motion.div 
            className={`${styles.productsContainer} ${viewMode === 'list' ? styles.listMode : styles.gridMode}`}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(renderProductCard)}
            </AnimatePresence>
          </motion.div>
          
          {/* Load More / Pagination */}
          {filteredProducts.length >= 12 && (
            <motion.div 
              className={styles.loadMoreSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button className={styles.loadMoreBtn}>
                Load More Products
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsClient; 