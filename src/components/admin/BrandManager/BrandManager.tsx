'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiUpload, FiPackage, FiTag } from 'react-icons/fi';
import styles from './BrandManager.module.scss';
import { brandService, Brand, Product } from '@/lib/services/brandService';

export default function BrandManager() {
  const t = useTranslations('admin');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [brandsData, productsData] = await Promise.all([
        brandService.getBrands(),
        brandService.getProducts()
      ]);
      setBrands(brandsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = async (brandData: Omit<Brand, 'id' | 'createdAt' | 'updatedAt' | 'products'>) => {
    try {
      const brandId = await brandService.createBrand(brandData);
      if (brandId) {
        await loadData();
        setShowBrandForm(false);
      }
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  const handleUpdateBrand = async (brandId: string, updates: Partial<Brand>) => {
    try {
      const success = await brandService.updateBrand(brandId, updates);
      if (success) {
        await loadData();
        setEditingBrand(null);
      }
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        const success = await brandService.deleteBrand(brandId);
        if (success) {
          await loadData();
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const productId = await brandService.createProduct(productData);
      if (productId) {
        await loadData();
        setShowProductForm(false);
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const success = await brandService.updateProduct(productId, updates);
      if (success) {
        await loadData();
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const success = await brandService.deleteProduct(productId);
        if (success) {
          await loadData();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading brands and products...</p>
      </div>
    );
  }

  return (
    <div className={styles.brandManager}>
      <div className={styles.header}>
        <h1>Brand & Product Management</h1>
        <div className={styles.headerActions}>
          <button 
            className={styles.addButton}
            onClick={() => setShowBrandForm(true)}
          >
            <FiPlus />
            Add Brand
          </button>
          <button 
            className={styles.addButton}
            onClick={() => setShowProductForm(true)}
          >
            <FiPackage />
            Add Product
          </button>
        </div>
      </div>

      {/* Brands Section */}
      <div className={styles.section}>
        <h2>Brands</h2>
        <div className={styles.brandsGrid}>
          {brands.map((brand) => (
            <div key={brand.id} className={styles.brandCard}>
              <div className={styles.brandHeader}>
                <div className={styles.brandInfo}>
                  {brand.logo && (
                    <img src={brand.logo} alt={brand.name} className={styles.brandLogo} />
                  )}
                  <div>
                    <h3>{brand.name}</h3>
                    <p>{brand.nameHebrew}</p>
                    <span className={`${styles.category} ${styles[brand.category]}`}>
                      {brand.category}
                    </span>
                  </div>
                </div>
                <div className={styles.brandActions}>
                  <button 
                    onClick={() => setEditingBrand(brand)}
                    className={styles.editButton}
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteBrand(brand.id)}
                    className={styles.deleteButton}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p className={styles.brandDescription}>{brand.description}</p>
              <div className={styles.brandStats}>
                <span>{brand.products.length} products</span>
                <span className={brand.featured ? styles.featured : ''}>
                  {brand.featured ? 'Featured' : 'Standard'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className={styles.section}>
        <h2>Products</h2>
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productHeader}>
                <div className={styles.productInfo}>
                  {product.images && product.images.length > 0 && (
                    <img src={product.images[0]} alt={product.name} className={styles.productImage} />
                  )}
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.nameHebrew}</p>
                    <span className={styles.brandName}>{product.brandName}</span>
                  </div>
                </div>
                <div className={styles.productActions}>
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className={styles.editButton}
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className={styles.deleteButton}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p className={styles.productDescription}>{product.description}</p>
              <div className={styles.productStats}>
                <span className={styles.price}>${product.price}</span>
                <span className={`${styles.category} ${styles[product.category]}`}>
                  {product.category}
                </span>
                <span className={product.featured ? styles.featured : ''}>
                  {product.featured ? 'Featured' : 'Standard'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Form Modal */}
      {showBrandForm && (
        <BrandForm
          onSubmit={handleCreateBrand}
          onCancel={() => setShowBrandForm(false)}
        />
      )}

      {/* Edit Brand Modal */}
      {editingBrand && (
        <BrandForm
          brand={editingBrand}
          onSubmit={(data) => handleUpdateBrand(editingBrand.id, data)}
          onCancel={() => setEditingBrand(null)}
        />
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          brands={brands}
          onSubmit={handleCreateProduct}
          onCancel={() => setShowProductForm(false)}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          brands={brands}
          onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}

// Brand Form Component
interface BrandFormProps {
  brand?: Brand;
  onSubmit: (data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt' | 'products'>) => void;
  onCancel: () => void;
}

function BrandForm({ brand, onSubmit, onCancel }: BrandFormProps) {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    nameHebrew: brand?.nameHebrew || '',
    description: brand?.description || '',
    descriptionHebrew: brand?.descriptionHebrew || '',
    logo: brand?.logo || '',
    category: brand?.category || 'clinic',
    technology: brand?.technology || '',
    featured: brand?.featured || false,
    isActive: brand?.isActive ?? true,
    slug: brand?.slug || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{brand ? 'Edit Brand' : 'Add New Brand'}</h2>
          <button onClick={onCancel} className={styles.closeButton}>
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Brand Name (English)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Brand Name (Hebrew)</label>
              <input
                type="text"
                value={formData.nameHebrew}
                onChange={(e) => setFormData({ ...formData, nameHebrew: e.target.value })}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Description (English)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description (Hebrew)</label>
              <textarea
                value={formData.descriptionHebrew}
                onChange={(e) => setFormData({ ...formData, descriptionHebrew: e.target.value })}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Logo URL</label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="clinic">Clinic</option>
                <option value="home">Home</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Technology</label>
              <input
                type="text"
                value={formData.technology}
                onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Featured Brand
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              <FiSave />
              {brand ? 'Update Brand' : 'Create Brand'}
            </button>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Product Form Component
interface ProductFormProps {
  product?: Product;
  brands: Brand[];
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

function ProductForm({ product, brands, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    nameHebrew: product?.nameHebrew || '',
    description: product?.description || '',
    descriptionHebrew: product?.descriptionHebrew || '',
    brandId: product?.brandId || '',
    brandName: product?.brandName || '',
    category: product?.category || 'clinic',
    technology: product?.technology || '',
    price: product?.price || 0,
    images: product?.images || [],
    featured: product?.featured || false,
    isActive: product?.isActive ?? true,
    slug: product?.slug || '',
    specifications: product?.specifications || {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBrand = brands.find(b => b.id === formData.brandId);
    onSubmit({
      ...formData,
      brandName: selectedBrand?.name || formData.brandName
    });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onCancel} className={styles.closeButton}>
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Product Name (English)</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Product Name (Hebrew)</label>
              <input
                type="text"
                value={formData.nameHebrew}
                onChange={(e) => setFormData({ ...formData, nameHebrew: e.target.value })}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Description (English)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description (Hebrew)</label>
              <textarea
                value={formData.descriptionHebrew}
                onChange={(e) => setFormData({ ...formData, descriptionHebrew: e.target.value })}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Brand</label>
              <select
                value={formData.brandId}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="clinic">Clinic</option>
                <option value="home">Home</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Technology</label>
              <input
                type="text"
                value={formData.technology}
                onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Image URLs (comma separated)</label>
              <input
                type="text"
                value={formData.images.join(', ')}
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map(url => url.trim()) })}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                Featured Product
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              <FiSave />
              {product ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 