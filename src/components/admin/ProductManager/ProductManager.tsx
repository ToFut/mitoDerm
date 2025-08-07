import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  Product
} from '@/lib/services/productService';
import { 
  FiEdit2, 
  FiTrash2, 
  FiStar, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiPlus,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiEye,
  FiDownload,
  FiUpload,
  FiArchive,
  FiRefreshCw,
  FiSettings,
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiUsers,
  FiShield,
  FiAward,
  FiClock,
  FiZap,
  FiHeart,
  FiShoppingCart,
  FiBarChart2,
  FiMoreVertical,
  FiCopy,
  FiExternalLink,
  FiImage,
  FiVideo,
  FiFileText,
  FiGlobe,
  FiTarget,
  FiFlask,
  FiUserCheck,
  FiLock,
  FiUnlock
} from 'react-icons/fi';
import styles from './ProductManager.module.scss';

interface ProductFormProps {
  product?: Product | null;
  onSave: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File) => void;
  onClose: () => void;
  loading: boolean;
}

function ProductForm({ product, onSave, onClose, loading }: ProductFormProps) {
  const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: product?.name || '',
    nameHebrew: product?.nameHebrew || '',
    slug: product?.slug || '',
    title: product?.title || '',
    subtitle: product?.subtitle || '',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    descriptionHebrew: product?.descriptionHebrew || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    requiresCertification: product?.requiresCertification || false,
    certificationLevel: product?.certificationLevel || 'none',
    professionalGrade: product?.professionalGrade || '',
    isActive: product?.isActive ?? true,
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    newArrival: product?.newArrival || false,
    badge: product?.badge || '',
    image: product?.image || '',
    images: product?.images || [],
    coverVideo: product?.coverVideo || '',
    category: product?.category || '',
    sku: product?.sku || '',
    weight: product?.weight || 0,
    dimensions: product?.dimensions || '',
    ingredients: product?.ingredients || '',
    instructions: product?.instructions || '',
    benefits: product?.benefits || '',
    contraindications: product?.contraindications || '',
    expiryDate: product?.expiryDate || '',
    manufacturer: product?.manufacturer || '',
    tags: product?.tags || [],
    keywords: product?.keywords || [],
    technology: product?.technology || '',
    target: product?.target || '',
    application: product?.application || '',
    aiContent: product?.aiContent || '',
    specifications: product?.specifications || {},
    features: product?.features || [],
    application: product?.application || '',
    rating: product?.rating || 0,
    reviewCount: product?.reviewCount || 0,
    soldCount: product?.soldCount || 0,
  });
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, tags: e.target.value.split(',').map((t) => t.trim()) }));
  };

  const handleKeywords = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, keywords: e.target.value.split(',').map((k) => k.trim()) }));
  };

  const handleFeatures = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, features: e.target.value.split(',').map((f) => f.trim()) }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FiPackage },
    { id: 'content', label: 'Content', icon: FiFileText },
    { id: 'pricing', label: 'Pricing & Stock', icon: FiDollarSign },
    { id: 'technical', label: 'Technical', icon: FiFlask },
    { id: 'marketing', label: 'Marketing', icon: FiTarget },
    { id: 'media', label: 'Media', icon: FiImage },
  ];

  return (
    <motion.div 
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={styles.modalContent}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
      >
        <div className={styles.modalHeader}>
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={e => {
          e.preventDefault();
          onSave(form, imageFile);
        }}>
          <AnimatePresence mode="wait">
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                className={styles.tabContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Product Name *</label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      placeholder="Product name" 
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Hebrew Name</label>
                    <input 
                      name="nameHebrew" 
                      value={form.nameHebrew} 
                      onChange={handleChange} 
                      placeholder="שם המוצר" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>SKU *</label>
                    <input 
                      name="sku" 
                      value={form.sku} 
                      onChange={handleChange} 
                      placeholder="SKU-001" 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} required>
                      <option value="">Select Category</option>
                      <option value="home">Home</option>
                      <option value="clinic">Clinic</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Slug</label>
                    <input 
                      name="slug" 
                      value={form.slug} 
                      onChange={handleChange} 
                      placeholder="product-slug" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Manufacturer</label>
                    <input 
                      name="manufacturer" 
                      value={form.manufacturer} 
                      onChange={handleChange} 
                      placeholder="MitoDerm" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div
                key="content"
                className={styles.tabContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <input 
                      name="title" 
                      value={form.title} 
                      onChange={handleChange} 
                      placeholder="Product title" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Subtitle</label>
                    <input 
                      name="subtitle" 
                      value={form.subtitle} 
                      onChange={handleChange} 
                      placeholder="Product subtitle" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Short Description</label>
                    <textarea 
                      name="shortDescription" 
                      value={form.shortDescription} 
                      onChange={handleChange} 
                      placeholder="Brief description"
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Full Description</label>
                    <textarea 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      placeholder="Detailed product description"
                      rows={5}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Hebrew Description</label>
                    <textarea 
                      name="descriptionHebrew" 
                      value={form.descriptionHebrew} 
                      onChange={handleChange} 
                      placeholder="תיאור מפורט של המוצר"
                      rows={5}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>AI Content</label>
                    <textarea 
                      name="aiContent" 
                      value={form.aiContent} 
                      onChange={handleChange} 
                      placeholder="AI-generated content for recommendations"
                      rows={4}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div
                key="pricing"
                className={styles.tabContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Price *</label>
                    <input 
                      name="price" 
                      type="number" 
                      value={form.price} 
                      onChange={handleChange} 
                      placeholder="0.00" 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Stock *</label>
                    <input 
                      name="stock" 
                      type="number" 
                      value={form.stock} 
                      onChange={handleChange} 
                      placeholder="0" 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Weight (g)</label>
                    <input 
                      name="weight" 
                      type="number" 
                      value={form.weight} 
                      onChange={handleChange} 
                      placeholder="0" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Dimensions</label>
                    <input 
                      name="dimensions" 
                      value={form.dimensions} 
                      onChange={handleChange} 
                      placeholder="10x5x2 cm" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Expiry Date</label>
                    <input 
                      name="expiryDate" 
                      value={form.expiryDate} 
                      onChange={handleChange} 
                      placeholder="12 months" 
                    />
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkbox}>
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      checked={form.isActive} 
                      onChange={handleChange} 
                    />
                    <span>Active</span>
                  </label>

                  <label className={styles.checkbox}>
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={form.featured} 
                      onChange={handleChange} 
                    />
                    <span>Featured</span>
                  </label>

                  <label className={styles.checkbox}>
                    <input 
                      type="checkbox" 
                      name="bestSeller" 
                      checked={form.bestSeller} 
                      onChange={handleChange} 
                    />
                    <span>Best Seller</span>
                  </label>

                  <label className={styles.checkbox}>
                    <input 
                      type="checkbox" 
                      name="newArrival" 
                      checked={form.newArrival} 
                      onChange={handleChange} 
                    />
                    <span>New Arrival</span>
                  </label>
                </div>
              </motion.div>
            )}

            {activeTab === 'technical' && (
              <motion.div
                key="technical"
                className={styles.tabContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Technology</label>
                    <input 
                      name="technology" 
                      value={form.technology} 
                      onChange={handleChange} 
                      placeholder="Exosomes, PDRN, etc." 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Target</label>
                    <input 
                      name="target" 
                      value={form.target} 
                      onChange={handleChange} 
                      placeholder="Skin regeneration, hydration" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Application</label>
                    <input 
                      name="application" 
                      value={form.application} 
                      onChange={handleChange} 
                      placeholder="Daily use, professional treatment" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ingredients</label>
                    <textarea 
                      name="ingredients" 
                      value={form.ingredients} 
                      onChange={handleChange} 
                      placeholder="List of ingredients"
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Instructions</label>
                    <textarea 
                      name="instructions" 
                      value={form.instructions} 
                      onChange={handleChange} 
                      placeholder="Usage instructions"
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Benefits</label>
                    <textarea 
                      name="benefits" 
                      value={form.benefits} 
                      onChange={handleChange} 
                      placeholder="Product benefits"
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contraindications</label>
                    <textarea 
                      name="contraindications" 
                      value={form.contraindications} 
                      onChange={handleChange} 
                      placeholder="Safety warnings"
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Features (comma-separated)</label>
                    <input 
                      name="features" 
                      value={form.features.join(', ')} 
                      onChange={handleFeatures} 
                      placeholder="Feature 1, Feature 2, Feature 3" 
                    />
                  </div>
                </div>

                <div className={styles.certificationSection}>
                  <h3>Certification & Professional Settings</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Requires Certification</label>
                      <select name="requiresCertification" value={form.requiresCertification.toString()} onChange={handleChange}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Certification Level</label>
                      <select name="certificationLevel" value={form.certificationLevel} onChange={handleChange}>
                        <option value="none">None</option>
                        <option value="basic">Basic</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Professional Grade</label>
                      <input 
                        name="professionalGrade" 
                        value={form.professionalGrade} 
                        onChange={handleChange} 
                        placeholder="Medical Grade, Clinical Grade" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'marketing' && (
              <motion.div
                key="marketing"
                className={styles.tabContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Badge</label>
                    <input 
                      name="badge" 
                      value={form.badge} 
                      onChange={handleChange} 
                      placeholder="New, Professional, Advanced" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tags (comma-separated)</label>
                    <input 
                      name="tags" 
                      value={form.tags.join(', ')} 
                      onChange={handleTags} 
                      placeholder="tag1, tag2, tag3" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Keywords (comma-separated)</label>
                    <input 
                      name="keywords" 
                      value={form.keywords.join(', ')} 
                      onChange={handleKeywords} 
                      placeholder="keyword1, keyword2, keyword3" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Product Rating (0-5)</label>
                    <input 
                      name="rating" 
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={form.rating} 
                      onChange={handleChange} 
                      placeholder="4.5" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Review Count</label>
                    <input 
                      name="reviewCount" 
                      type="number"
                      min="0"
                      value={form.reviewCount} 
                      onChange={handleChange} 
                      placeholder="234" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Sold Count</label>
                    <input 
                      name="soldCount" 
                      type="number"
                      min="0"
                      value={form.soldCount} 
                      onChange={handleChange} 
                      placeholder="1847" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'media' && (
              <motion.div
                key="media"
                className={styles.tabContent}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Main Image URL</label>
                    <input 
                      name="image" 
                      value={form.image} 
                      onChange={handleChange} 
                      placeholder="https://..." 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Cover Video URL</label>
                    <input 
                      name="coverVideo" 
                      value={form.coverVideo} 
                      onChange={handleChange} 
                      placeholder="https://..." 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Upload New Image</label>
                    <div 
                      className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                    >
                      <FiUpload className={styles.uploadIcon} />
                      <p>Drag & drop an image here or click to browse</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImage} 
                        style={{ display: 'none' }} 
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className={styles.uploadButton}>
                        Choose File
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      setNotification('Error fetching products');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && product.isActive) ||
                           (statusFilter === 'inactive' && !product.isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSave = async (form: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File) => {
    setActionLoading(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, form.sku || Date.now().toString()) || '';
      }
      if (editing) {
        await updateProduct(editing.id!, { ...form, image: imageUrl });
        setNotification('Product updated successfully!');
      } else {
        await addProduct({ ...form, image: imageUrl });
        setNotification('Product created successfully!');
      }
      setModalOpen(false);
      setEditing(null);
      fetchProducts();
    } catch (e) {
      setNotification('Error saving product.');
    }
    setActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setActionLoading(true);
    try {
      await deleteProduct(id);
      setNotification('Product deleted successfully!');
      fetchProducts();
    } catch (e) {
      setNotification('Error deleting product.');
    }
    setActionLoading(false);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) return;
    
    setActionLoading(true);
    try {
      // Implement bulk actions
      switch (action) {
        case 'delete':
          if (window.confirm(`Delete ${selectedProducts.length} products?`)) {
            await Promise.all(selectedProducts.map(id => deleteProduct(id)));
            setNotification(`${selectedProducts.length} products deleted!`);
          }
          break;
        case 'activate':
          await Promise.all(selectedProducts.map(id => updateProduct(id, { isActive: true })));
          setNotification(`${selectedProducts.length} products activated!`);
          break;
        case 'deactivate':
          await Promise.all(selectedProducts.map(id => updateProduct(id, { isActive: false })));
          setNotification(`${selectedProducts.length} products deactivated!`);
          break;
      }
      setSelectedProducts([]);
      fetchProducts();
    } catch (e) {
      setNotification('Error performing bulk action.');
    }
    setActionLoading(false);
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(productId => productId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id!));
    }
  };

  return (
    <div className={styles.productManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Product Management</h1>
            <p className={styles.pageSubtitle}>
              Manage your product catalog with advanced features
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <motion.button
              className={styles.refreshButton}
              onClick={fetchProducts}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw className={loading ? styles.spinning : ''} />
              Refresh
            </motion.button>
            
            <motion.button
              className={styles.addButton}
              onClick={() => { setModalOpen(true); setEditing(null); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus />
              Add Product
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.statIcon}>
            <FiPackage />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{products.length}</span>
            <span className={styles.statLabel}>Total Products</span>
          </div>
        </motion.div>

        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.statIcon}>
            <FiTrendingUp />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {products.filter(p => p.isActive).length}
            </span>
            <span className={styles.statLabel}>Active Products</span>
          </div>
        </motion.div>

        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.statIcon}>
            <FiStar />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {products.filter(p => p.featured).length}
            </span>
            <span className={styles.statLabel}>Featured Products</span>
          </div>
        </motion.div>

        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.statIcon}>
            <FiShield />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {products.filter(p => p.requiresCertification).length}
            </span>
            <span className={styles.statLabel}>Professional Products</span>
          </div>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <div className={styles.controls}>
        <div className={styles.searchAndFilters}>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Categories</option>
              <option value="home">Home</option>
              <option value="clinic">Clinic</option>
              <option value="professional">Professional</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setSortBy(sort);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className={styles.filterSelect}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="stock-asc">Stock (Low-High)</option>
              <option value="stock-desc">Stock (High-Low)</option>
            </select>
          </div>
        </div>
        
        <div className={styles.viewControls}>
          <div className={styles.viewModeToggle}>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button
              className={`${styles.viewModeButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <motion.div
          className={styles.bulkActions}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className={styles.bulkInfo}>
            <span>{selectedProducts.length} products selected</span>
            <button
              onClick={() => setSelectedProducts([])}
              className={styles.clearSelection}
            >
              Clear Selection
            </button>
          </div>
          
          <div className={styles.bulkButtons}>
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('activate')}
            >
              <FiCheckCircle />
              Activate
            </button>
            
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('deactivate')}
            >
              <FiArchive />
              Deactivate
            </button>
            
            <button
              className={styles.bulkButton}
              onClick={() => handleBulkAction('delete')}
            >
              <FiTrash2 />
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Notification */}
      {notification && (
        <motion.div
          className={styles.notification}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {notification}
        </motion.div>
      )}

      {/* Products Grid/List */}
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} />
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>
          <FiPackage className={styles.emptyIcon} />
          <h3>No products found</h3>
          <p>Try adjusting your filters or create a new product.</p>
          <button
            className={styles.addButton}
            onClick={() => { setModalOpen(true); setEditing(null); }}
          >
            <FiPlus />
            Create Your First Product
          </button>
        </div>
      ) : (
        <div className={`${styles.productsContainer} ${styles[viewMode]}`}>
          {viewMode === 'grid' ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className={styles.productCard}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.cardHeader}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id!)}
                    onChange={() => handleSelectProduct(product.id!)}
                    className={styles.productCheckbox}
                  />
                  
                  <div className={styles.productImage}>
                    <img src={product.image} alt={product.name} />
                    {product.requiresCertification && (
                      <div className={styles.professionalBadge}>
                        <FiShield />
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.productBadges}>
                    {product.featured && <span className={styles.badgeFeatured}>Featured</span>}
                    {product.newArrival && <span className={styles.badgeNew}>New</span>}
                    {product.bestSeller && <span className={styles.badgeBestSeller}>Best Seller</span>}
                    {!product.isActive && <span className={styles.badgeInactive}>Inactive</span>}
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productSku}>{product.sku}</p>
                  <p className={styles.productCategory}>{product.category}</p>
                  
                  <div className={styles.productStats}>
                    <div className={styles.stat}>
                      <FiDollarSign />
                      <span>₪{product.price}</span>
                    </div>
                    <div className={styles.stat}>
                      <FiPackage />
                      <span>{product.stock} in stock</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => { setEditing(product); setModalOpen(true); }}
                  >
                    <FiEdit2 />
                    Edit
                  </button>
                  
                  <button
                    className={styles.actionButton}
                    onClick={() => handleDelete(product.id!)}
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={handleSelectAll}
                      className={styles.selectAllCheckbox}
                    />
                  </th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Badges</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={!product.isActive ? styles.inactiveRow : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id!)}
                        onChange={() => handleSelectProduct(product.id!)}
                        className={styles.productCheckbox}
                      />
                    </td>
                    <td>
                      <div className={styles.productImageCell}>
                        <img src={product.image} alt={product.name} />
                        {product.requiresCertification && (
                          <div className={styles.professionalBadge}>
                            <FiShield />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={styles.productNameCell}>
                      <strong>{product.name}</strong>
                      {product.nameHebrew && (
                        <div className={styles.hebrewName}>{product.nameHebrew}</div>
                      )}
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td className={styles.priceCell}>₪{product.price}</td>
                    <td className={styles.stockCell}>
                      <span className={product.stock <= 10 ? styles.lowStock : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {product.isActive ? (
                        <span className={styles.statusActive}>Active</span>
                      ) : (
                        <span className={styles.statusInactive}>Inactive</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.badgesCell}>
                        {product.featured && <span className={styles.badgeFeatured}>Featured</span>}
                        {product.newArrival && <span className={styles.badgeNew}>New</span>}
                        {product.bestSeller && <span className={styles.badgeBestSeller}>Best Seller</span>}
                        {product.requiresCertification && <span className={styles.badgeProfessional}>Professional</span>}
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.actionButton}
                          onClick={() => { setEditing(product); setModalOpen(true); }}
                        >
                          <FiEdit2 />
                        </button>
                        
                        <button
                          className={styles.actionButton}
                          onClick={() => handleDelete(product.id!)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ProductForm
            product={editing}
            onSave={handleSave}
            onClose={() => { setModalOpen(false); setEditing(null); }}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 