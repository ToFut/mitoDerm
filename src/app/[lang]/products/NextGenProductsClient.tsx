'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Environment } from '@react-three/drei';
import dynamic from 'next/dynamic';
import styles from './nextgen-products.module.scss';

// Advanced Components (commented out for build)
// const AIRecommendations = dynamic(() => import('@/components/ai/AIRecommendations'), { ssr: false });
// const VirtualSkinAnalysis = dynamic(() => import('@/components/analysis/VirtualSkinAnalysis'), { ssr: false });

interface Product {
  id: string;
  name: string;
  category: 'exosome' | 'pdrn' | 'peptide' | 'device';
  price: number;
  model3D?: string;
  arCompatible: boolean;
  skinTypes: string[];
  results: {
    before: string;
    after: string;
    timeline: string;
  }[];
  scientificData: {
    studies: number;
    efficacy: number;
    satisfaction: number;
  };
  ingredients: {
    name: string;
    concentration: number;
    benefit: string;
  }[];
}

export default function NextGenProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | '3d' | 'ar'>('grid');

  const [isARSupported, setIsARSupported] = useState(false);
  const [skinProfile, setSkinProfile] = useState(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    // Check AR support
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then(setIsARSupported);
    }

    // Load products
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // Mock advanced product data
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'V-Tech Exosome System',
        category: 'exosome',
        price: 2500,
        model3D: '/models/vtech-bottle.glb',
        arCompatible: true,
        skinTypes: ['all', 'sensitive', 'aging', 'acne-prone'],
        results: [
          {
            before: '/images/results/before1.jpg',
            after: '/images/results/after1.jpg',
            timeline: '4 weeks'
          }
        ],
        scientificData: {
          studies: 15,
          efficacy: 94,
          satisfaction: 96
        },
        ingredients: [
          { name: 'Synthetic Exosomes', concentration: 20000000000, benefit: 'Cell regeneration' },
          { name: 'PDRN', concentration: 2, benefit: 'DNA repair' },
          { name: 'Growth Factors', concentration: 5, benefit: 'Collagen synthesis' }
        ]
      }
      // Add more products...
    ];
    setProducts(mockProducts);
  };

  return (
    <div className={styles.nextGenProducts} ref={containerRef}>
      {/* Dynamic Background */}
      <motion.div
        className={styles.dynamicBackground}
        style={{ y: backgroundY }}
      >
        <div className={styles.particleField} />
        <div className={styles.gradientOverlay} />
      </motion.div>

      {/* Advanced Header */}
      <section className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>REVOLUTIONARY</span>
            <span className={styles.titleLine2}>PRODUCT EXPERIENCE</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Explore our products in 3D, AR, and virtual reality
          </p>

          {/* Advanced Controls */}
          <div className={styles.viewControls}>
            <ViewModeButton
              mode="grid"
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
              icon={<GridIcon />}
              label="Grid View"
            />
            <ViewModeButton
              mode="3d"
              active={viewMode === '3d'}
              onClick={() => setViewMode('3d')}
              icon={<ThreeDIcon />}
              label="3D Experience"
            />
            {isARSupported && (
              <ViewModeButton
                mode="ar"
                active={viewMode === 'ar'}
                onClick={() => setViewMode('ar')}
                icon={<ARIcon />}
                label="AR Try-On"
              />
            )}
          </div>
        </motion.div>
      </section>

      {/* AI Skin Analysis */}
      <section className={styles.aiAnalysisSection}>
        <motion.div
          className={styles.analysisContainer}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.analysisTitle}>AI Skin Analysis</h2>
          <p className={styles.analysisSubtitle}>
            Get personalized product recommendations based on your skin analysis
          </p>
          {/* <VirtualSkinAnalysis onAnalysisComplete={setSkinProfile} /> */}
        </motion.div>
      </section>

      {/* Advanced Product Display */}
      <section className={styles.productsSection}>
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              className={styles.productsGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {products.map((product, index) => (
                <AdvancedProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onSelect={setSelectedProduct}
                  skinProfile={skinProfile}
                />
              ))}
            </motion.div>
          )}

          {viewMode === '3d' && (
            <motion.div
              key="3d"
              className={styles.experience3D}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className={styles.placeholder3D}>
                <h3>3D Experience Coming Soon</h3>
                <p>Interactive 3D product visualization will be available soon.</p>
              </div>
            </motion.div>
          )}

          {viewMode === 'ar' && (
            <motion.div
              key="ar"
              className={styles.arExperience}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.placeholderAR}>
                <h3>AR Experience Coming Soon</h3>
                <p>Augmented reality product preview will be available soon.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* AI Recommendations */}
      <section className={styles.recommendationsSection}>
        {/* <AIRecommendations skinProfile={skinProfile} products={products} /> */}
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className={styles.productModal}>
            <div className={styles.modalContent}>
              <h3>{selectedProduct.name}</h3>
              <p>Product details coming soon...</p>
              <button onClick={() => setSelectedProduct(null)}>Close</button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Advanced Components
const ViewModeButton = ({ mode, active, onClick, icon, label }: { mode: string, active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <motion.button
    className={`${styles.viewModeButton} ${active ? styles.active : ''}`}
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className={styles.buttonIcon}>{icon}</div>
    <span className={styles.buttonLabel}>{label}</span>
    {active && <div className={styles.activeIndicator} />}
  </motion.button>
);

const AdvancedProductCard = ({ product, index, onSelect, skinProfile }: { product: Product, index: number, onSelect: (product: Product) => void, skinProfile: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState(0);

  useEffect(() => {
    if (skinProfile) {
      // Calculate compatibility based on skin analysis
      const score = calculateCompatibility(product, skinProfile);
      setCompatibilityScore(score);
    }
  }, [product, skinProfile]);

  return (
    <motion.div
      className={styles.advancedCard}
      initial={{ opacity: 0, y: 100, rotateX: 45 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={{ 
        rotateY: 5, 
        rotateX: -5, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 3D Product Preview */}
      <div className={styles.cardPreview}>
        {product.model3D ? (
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={<div>Loading 3D Model...</div>}>
              <Product3DModel modelPath={product.model3D} isHovered={isHovered} />
              <Environment preset="studio" />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                autoRotate={isHovered}
                autoRotateSpeed={2}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className={styles.placeholderPreview}>
            <ProductIcon category={product.category} />
          </div>
        )}
        
        {/* Compatibility Badge */}
        {skinProfile && (
          <motion.div
            className={styles.compatibilityBadge}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className={styles.compatibilityScore}>
              {compatibilityScore}%
            </div>
            <div className={styles.compatibilityLabel}>Match</div>
          </motion.div>
        )}

        {/* AR Button */}
        {product.arCompatible && (
          <motion.button
            className={styles.arButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ARIcon />
          </motion.button>
        )}
      </div>

      {/* Product Info */}
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.productName}>{product.name}</h3>
          <div className={styles.categoryBadge}>
            {product.category.toUpperCase()}
          </div>
        </div>

        {/* Scientific Data */}
        <div className={styles.scientificData}>
          <DataPoint
            label="Studies"
            value={product.scientificData.studies}
            suffix=""
          />
          <DataPoint
            label="Efficacy"
            value={product.scientificData.efficacy}
            suffix="%"
          />
          <DataPoint
            label="Satisfaction"
            value={product.scientificData.satisfaction}
            suffix="%"
          />
        </div>

        {/* Key Ingredients */}
        <div className={styles.keyIngredients}>
          <h4>Key Technology</h4>
          <div className={styles.ingredientsList}>
            {(Array.isArray(product.ingredients) ? product.ingredients : product.ingredients ? (product.ingredients as any).split(',') : []).slice(0, 2).map((ingredient: any, idx: number) => (
              <motion.div
                key={idx}
                className={styles.ingredient}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <span className={styles.ingredientName}>{ingredient.name}</span>
                <span className={styles.ingredientBenefit}>{ingredient.benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.cardActions}>
          <motion.button
            className={styles.primaryButton}
            onClick={() => onSelect(product)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Explore in Detail</span>
            <ExploreIcon />
          </motion.button>
          
          <motion.button
            className={styles.secondaryButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HeartIcon />
          </motion.button>
        </div>
      </div>

      {/* Hover Effects */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={styles.hoverOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.quickActions}>
              <button className={styles.quickAction}>
                <ViewIcon />
                <span>Quick View</span>
              </button>
              <button className={styles.quickAction}>
                <CompareIcon />
                <span>Compare</span>
              </button>
              <button className={styles.quickAction}>
                <ShareIcon />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Product3DModel = ({ modelPath, isHovered }: { modelPath: string, isHovered: boolean }) => {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = isHovered 
        ? state.clock.elapsedTime * 0.5 
        : Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive
        ref={meshRef}
        object={scene}
        scale={isHovered ? 1.2 : 1}
      />
    </Float>
  );
};

const DataPoint = ({ label, value, suffix }: { label: string, value: number, suffix: string }) => (
  <motion.div
    className={styles.dataPoint}
    whileHover={{ scale: 1.1 }}
  >
    <div className={styles.dataValue}>
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {value}{suffix}
      </motion.span>
    </div>
    <div className={styles.dataLabel}>{label}</div>
  </motion.div>
);

// Helper functions
const calculateCompatibility = (product: Product, skinProfile: any) => {
  // AI algorithm to calculate product compatibility
  return Math.floor(Math.random() * 30) + 70; // Mock calculation
};

// Icon Components (simplified)
const GridIcon = () => <svg>...</svg>;
const ThreeDIcon = () => <svg>...</svg>;
const ARIcon = () => <svg>...</svg>;
const ExploreIcon = () => <svg>...</svg>;
const HeartIcon = () => <svg>...</svg>;
const ViewIcon = () => <svg>...</svg>;
const CompareIcon = () => <svg>...</svg>;
const ShareIcon = () => <svg>...</svg>;
const ProductIcon = ({ category }: { category: string }) => <svg>...</svg>;