'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiPackage, 
  FiZap, 
  FiLayers, 
  FiActivity, 
  FiTarget, 
  FiTrendingUp, 
  FiDroplet, 
  FiSun, 
  FiStar,
  FiEdit3
} from 'react-icons/fi';
import styles from './Navigation.module.scss';
import { Product } from '@/lib/types/product';

interface DynamicMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MegaMenuData {
  featured: Product[];
  categories: {
    title: string;
    titleHebrew: string;
    items: Product[];
  }[];
  technologies: {
    name: string;
    nameHebrew: string;
    icon: string;
    url: string;
  }[];
}

const iconMap: { [key: string]: any } = {
  'FiZap': FiZap,
  'FiLayers': FiLayers,
  'FiActivity': FiActivity,
  'FiTarget': FiTarget,
  'FiTrendingUp': FiTrendingUp,
  'FiDroplet': FiDroplet,
  'FiSun': FiSun,
  'FiStar': FiStar,
  'FiPackage': FiPackage
};

const getTechnologyIcon = (technology: string): string => {
  const iconMap: { [key: string]: string } = {
    'Exosomes': 'FiZap',
    'PDRN': 'FiLayers',
    'Peptides': 'FiActivity',
    'Stem Cells': 'FiTarget',
    'Growth Factors': 'FiTrendingUp',
    'Hyaluronic Acid': 'FiDroplet',
    'Retinol': 'FiStar',
    'Vitamin C': 'FiSun'
  };
  return iconMap[technology] || 'FiPackage';
};

export default function DynamicMegaMenu({ isOpen, onClose, megaMenuRef }: DynamicMegaMenuProps & { megaMenuRef?: React.RefObject<HTMLDivElement> }) {
  const locale = useLocale();
  const router = useRouter();
  const [megaMenuData, setMegaMenuData] = useState<MegaMenuData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Cache products - only fetch once, not every time menu opens
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      setLoading(true);
      fetch('/api/products')
        .then(res => res.json())
        .then((data) => {
          setAllProducts(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load products');
          setLoading(false);
        });
    }
  }, [isOpen, allProducts.length]);

  const loadMegaMenuData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get featured products (first 3 instead of 4)
      const featured = allProducts.filter(p => p.featured).slice(0, 3);
      
      // If no featured products, use first 3 products
      const featuredProducts = featured.length > 0 ? featured : allProducts.slice(0, 3);
      
      // Organize by category (limit to 4 items per category)
      const clinicProducts = allProducts.filter(p => p.category === 'clinic').slice(0, 4);
      const homeProducts = allProducts.filter(p => p.category === 'home').slice(0, 4);
      
      // Get unique technologies (limit to 6)
      const technologies = allProducts.reduce((acc, product) => {
        if (product.technology && !acc.find(tech => tech.name === product.technology) && acc.length < 6) {
          acc.push({
            name: product.technology,
            nameHebrew: product.technology,
            icon: getTechnologyIcon(product.technology),
            url: `/${locale}/products?technology=${encodeURIComponent(product.technology)}`
          });
        }
        return acc;
      }, [] as { name: string; nameHebrew: string; icon: string; url: string }[]);

      const data: MegaMenuData = {
        featured: featuredProducts,
        categories: [
          {
            title: 'Clinic Products',
            titleHebrew: 'מוצרי קליניקה',
            items: clinicProducts
          },
          {
            title: 'Home Products',
            titleHebrew: 'מוצרי בית',
            items: homeProducts
          }
        ],
        technologies
      };
      
      setMegaMenuData(data);
    } catch (err) {
      console.error('Error loading mega menu data:', err);
      setError('Failed to load menu data');
    } finally {
      setLoading(false);
    }
  }, [allProducts, locale]);

  useEffect(() => {
    if (isOpen && allProducts.length > 0) {
      loadMegaMenuData();
    }
  }, [isOpen, allProducts, loadMegaMenuData]);

  const getProductUrl = (product: Product) => {
    const url = `/${locale}/products/${product.slug}`;
    return url;
  };

  const handleProductClick = (product: Product, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const url = getProductUrl(product);
    try {
      router.push(url);
      onClose();
    } catch (error: any) {
      console.error('Navigation error:', error);
      window.location.href = url;
    }
  };

  const handleTechnologyClick = (tech: { url: string; name: string }, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      router.push(tech.url);
      onClose();
    } catch (error) {
      window.location.href = tech.url;
    }
  };

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.megaMenu}>
        <div className={styles.megaMenuContent}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !megaMenuData) {
    return (
      <div className={styles.megaMenu}>
        <div className={styles.megaMenuContent}>
          <div className={styles.errorState}>
            <p>Failed to load menu data</p>
            <button onClick={loadMegaMenuData}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const hasData = megaMenuData.featured.length > 0 || 
                  megaMenuData.categories.some(cat => cat.items.length > 0);

  if (!hasData) {
    return (
      <div className={styles.megaMenu}>
        <div className={styles.megaMenuContent}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FiPackage />
            </div>
            <h3>No Products Available</h3>
            <p>No existing products available at the moment.</p>
            <Link href="/admin/brands" className={styles.adminLink}>
              <FiEdit3 />
              Add Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={styles.megaMenu}
      ref={megaMenuRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.megaMenuContent}>
        {/* Featured Products Section - Compact */}
        <div className={styles.megaMenuSection}>
          <h3>{locale === 'he' ? 'מוצרים מובילים' : 'Featured'}</h3>
          <div className={styles.featuredProducts}>
            {megaMenuData.featured.map((product, idx) => (
              <a
                key={idx}
                className={styles.featuredProduct}
                href={getProductUrl(product)}
              >
                <div className={styles.productIcon}>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.images[0].alt || product.name} />
                  ) : product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <FiPackage />
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h4>{locale === 'he' && product.nameHebrew ? product.nameHebrew : product.name}</h4>
                  {product.badge && (
                    <span className={styles.productBadge}>
                      {product.badge}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Categories Section - Compact */}
        <div className={styles.megaMenuSection}>
          <h3>{locale === 'he' ? 'קטגוריות' : 'Categories'}</h3>
          <div className={styles.categoriesGrid}>
            {megaMenuData.categories.map((category, idx) => (
              <div key={idx} className={styles.categoryGroup}>
                <h4>{locale === 'he' ? category.titleHebrew : category.title}</h4>
                <ul>
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a
                        className={styles.categoryLink}
                        href={getProductUrl(item)}
                      >
                        <span className={styles.itemName}>
                          {locale === 'he' && item.nameHebrew ? item.nameHebrew : item.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Section - Compact */}
        {megaMenuData.technologies.length > 0 && (
          <div className={styles.megaMenuSection}>
            <h3>{locale === 'he' ? 'טכנולוגיות' : 'Tech'}</h3>
            <div className={styles.technologiesGrid}>
              {megaMenuData.technologies.map((tech, idx) => (
                <button
                  key={idx}
                  className={styles.technologyItem}
                  onClick={(e) => handleTechnologyClick(tech, e)}
                >
                  <div className={styles.techIcon}>
                    {(() => {
                      const IconComponent = iconMap[tech.icon];
                      return IconComponent ? <IconComponent /> : <FiPackage />;
                    })()}
                  </div>
                  <span>{locale === 'he' ? tech.nameHebrew : tech.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View All Products Section */}
        <div className={styles.megaMenuSection}>
          <div className={styles.viewAllSection}>
            <Link href={`/${locale}/products`} className={styles.viewAllButton}>
              {locale === 'he' ? 'צפה בכל המוצרים' : 'View All'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 