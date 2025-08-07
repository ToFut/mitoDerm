'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiEdit, FiTrash2, FiEye, FiUpload, FiX, FiBox } from 'react-icons/fi';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage, Product } from '@/lib/services/productService';
import styles from './ProductsManager.module.scss';

export default function ProductsManager() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Form state - Updated to match Product interface exactly
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    nameHebrew: '',
    title: '',
    shortDescription: '',
    description: '',
    descriptionHebrew: '',
    price: 0,
    stock: 0,
    requiresCertification: false,
    certificationLevel: 'none' as 'none' | 'basic' | 'advanced' | 'expert',
    isActive: true,
    image: '',
    images: [] as { url: string; alt?: string }[],
    category: '',
    sku: '',
    weight: 0,
    dimensions: '',
    ingredients: '',
    instructions: '',
    benefits: '',
    contraindications: '',
    expiryDate: '',
    manufacturer: '',
    tags: [] as string[],
    featured: false,
    bestSeller: false,
    newArrival: false,
    badge: '',
    technology: '',
    application: '',
    target: ''
  });

  const categories = ['Skincare', 'Anti-aging', 'Exosomes', 'Serums', 'Creams', 'Other'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      let imageUrl = '';
      
      // Upload image if a new file is selected
      if (imageFile) {
        const tempId = editingProduct?.id || `temp-${Date.now()}`;
        const uploadedUrl = await uploadProductImage(imageFile, tempId);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const productData = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        image: imageUrl || formData.image,
        images: imageUrl ? [{ url: imageUrl, alt: formData.name }] : formData.images,
        tags: formData.tags.length > 0 ? formData.tags : ['skincare']
      };

      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        loadProducts();
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      name: '',
      nameHebrew: '',
      title: '',
      shortDescription: '',
      description: '',
      descriptionHebrew: '',
      price: 0,
      stock: 0,
      requiresCertification: false,
      certificationLevel: 'none',
      isActive: true,
      image: '',
      images: [],
      category: '',
      sku: '',
      weight: 0,
      dimensions: '',
      ingredients: '',
      instructions: '',
      benefits: '',
      contraindications: '',
      expiryDate: '',
      manufacturer: '',
      tags: [],
      featured: false,
      bestSeller: false,
      newArrival: false,
      badge: '',
      technology: '',
      application: '',
      target: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      slug: product.slug || '',
      name: product.name || '',
      nameHebrew: product.nameHebrew || '',
      title: product.title || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      descriptionHebrew: product.descriptionHebrew || '',
      price: product.price || 0,
      stock: product.stock || 0,
      requiresCertification: product.requiresCertification || false,
      certificationLevel: product.certificationLevel || 'none',
      isActive: product.isActive || true,
      image: product.image || '',
      images: product.images || [],
      category: product.category || '',
      sku: product.sku || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || '',
      ingredients: typeof product.ingredients === 'string' ? product.ingredients : (product.ingredients ? product.ingredients.join(', ') : ''),
      instructions: product.instructions || '',
      benefits: typeof product.benefits === 'string' ? product.benefits : (product.benefits ? product.benefits.join(', ') : ''),
      contraindications: product.contraindications || '',
      expiryDate: product.expiryDate || '',
      manufacturer: product.manufacturer || '',
      tags: product.tags || [],
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      newArrival: product.newArrival || false,
      badge: product.badge || '',
      technology: product.technology || '',
      application: product.application || '',
      target: product.target || ''
    });
    setImagePreview(product.image || '');
    setShowAddModal(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!session) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.productsManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Products Management</h1>
          <p>Manage your product catalog with ease</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus />
            Add Product
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchFilter}>
          <div className={styles.searchBox}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categoryFilter}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className={styles.viewControls}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={loadProducts}>Retry</button>
        </div>
      ) : (
        <div className={`${styles.productsContainer} ${styles[viewMode]}`}>
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiBox />
              </div>
              <h3>No products found</h3>
              <p>Add your first product to get started</p>
              <button onClick={() => setShowAddModal(true)}>
                <FiPlus />
                Add Product
              </button>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image || '/placeholder-product.jpg'} alt={product.name} />
                  {product.badge && <div className={styles.badge}>{product.badge}</div>}
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription}</p>
                  <div className={styles.productMeta}>
                    <span className={styles.category}>{product.category}</span>
                    <span className={styles.price}>${product.price}</span>
                  </div>
                  {product.application && (
                    <div className={styles.applicationBadge}>{product.application}</div>
                  )}
                </div>
                <div className={styles.productActions}>
                  <button onClick={() => openEditModal(product)} className={styles.editBtn}>
                    <FiEdit />
                  </button>
                  <button onClick={() => product.id && handleDelete(product.id)} className={styles.deleteBtn}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowAddModal(false)} className={styles.closeBtn}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.productForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="product-slug"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    placeholder="New, Featured, etc."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Application</label>
                  <input
                    type="text"
                    value={formData.application}
                    onChange={(e) => setFormData({...formData, application: e.target.value})}
                    placeholder="Facial, Body, etc."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Technology</label>
                  <input
                    type="text"
                    value={formData.technology}
                    onChange={(e) => setFormData({...formData, technology: e.target.value})}
                    placeholder="Exosomes, Peptides, etc."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Target</label>
                  <input
                    type="text"
                    value={formData.target}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    placeholder="Anti-aging, Brightening, etc."
                  />
                </div>
              </div>
              
              {/* Image Upload Section */}
              <div className={styles.formGroup}>
                <label>Product Image</label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    id="product-image"
                    className={styles.fileInput}
                  />
                  <label htmlFor="product-image" className={styles.uploadButton}>
                    <FiUpload />
                    {imageFile ? 'Change Image' : 'Upload Image'}
                  </label>
                  {imagePreview && (
                    <div className={styles.imagePreview}>
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Short Description</label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  rows={2}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Full Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(k => k.trim())})}
                  placeholder="skincare, anti-aging, professional"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ingredients</label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  rows={3}
                  placeholder="Hyaluronic acid, Vitamin C, Peptides"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Benefits</label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  rows={3}
                  placeholder="Advanced technology, Natural ingredients, Clinical results"
                />
              </div>

              <div className={styles.formCheckboxes}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.requiresCertification}
                    onChange={(e) => setFormData({...formData, requiresCertification: e.target.checked})}
                  />
                  <span>Requires Certification</span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <span>Active</span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <span>Featured</span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({...formData, bestSeller: e.target.checked})}
                  />
                  <span>Best Seller</span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({...formData, newArrival: e.target.checked})}
                  />
                  <span>New Arrival</span>
                </label>
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className={styles.submitBtn}>
                  {uploading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 