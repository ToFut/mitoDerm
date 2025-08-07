"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  FiSave, 
  FiArrowLeft, 
  FiUpload,
  FiTrash2,
  FiPlus, 
  FiX,
  FiEye,
  FiEyeOff,
  FiStar,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { Product, getProduct, updateProduct, uploadProductImage } from '@/lib/services/productService';
import styles from './ProductEdit.module.scss';

export default function ProductEditPage() {
  const t = useTranslations('admin');
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state - EXACTLY matching client product page fields
  const [form, setForm] = useState<Partial<Product>>({
    // Basic Information (from StickyInfoSidebar)
    name: '',
    nameHebrew: '',
    title: '',
    subtitle: '',
    shortDescription: '',
    description: '',
    descriptionHebrew: '',
    slug: '',
    
    // Product Meta (from StickyInfoSidebar)
    category: '',
    technology: '',
    badge: '',
    stock: 0,
    price: 0,
    
    // Product Details (from Overview Tab)
    application: '',
    target: '',
    features: [],
    
    // Ingredients Tab
    ingredients: '',
    
    // Benefits Tab
    benefits: '',
    
    // Specifications Tab
    specifications: {},
    
    // Images (from ProductGallery)
    images: [],
    image: '',
    
    // Additional Fields
    sku: '',
    weight: 0,
    dimensions: '',
    manufacturer: '',
    expiryDate: '',
    instructions: '',
    contraindications: '',
    tags: [],
    aiContent: '',
    
    // Settings
    isActive: true,
    featured: false,
    bestSeller: false,
    newArrival: false,
    requiresCertification: false,
    certificationLevel: 'none'
  });

  useEffect(() => {
    if (productId && productId !== 'new') {
      loadProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(productId);
      if (productData) {
        setProduct(productData);
        setForm({
          ...productData,
          ingredients: Array.isArray(productData.ingredients) 
            ? productData.ingredients.join(', ') 
            : productData.ingredients || '',
          features: productData.features || [],
          specifications: productData.specifications || {},
          images: productData.images || [],
          tags: productData.tags || [],
          benefits: Array.isArray(productData.benefits) 
            ? productData.benefits.map(b => `${b.title}: ${b.description}`).join('\n')
            : productData.benefits || ''
        });
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInput = (field: keyof Product, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setForm(prev => ({ ...prev, [field]: array }));
  };

  const handleBenefitsChange = (value: string) => {
    // Parse benefits from text format "Title: Description"
    const benefits = value.split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => {
        const [title, ...descParts] = line.split(':');
        return {
          title: title.trim(),
          description: descParts.join(':').trim()
        };
      });
    
    setForm(prev => ({ ...prev, benefits }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const addSpecification = () => {
    const key = prompt('Enter specification key:');
    if (key) {
      setForm(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [key]: ''
        }
      }));
    }
  };

  const removeSpecification = (key: string) => {
    setForm(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const imageUrl = await uploadProductImage(file, productId || 'temp');
        if (imageUrl) {
          setForm(prev => ({
            ...prev,
            images: [...(prev.images || []), { url: imageUrl, alt: file.name }]
          }));
        }
      } catch (err) {
        setError('Failed to upload image');
      }
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const productData = {
        ...form,
        ingredients: form.ingredients,
        features: form.features || [],
        specifications: form.specifications || {},
        images: form.images || [],
        tags: form.tags || []
      };

      if (productId === 'new') {
        // Handle new product creation
        // You'll need to implement addProduct in your service
        console.log('Creating new product:', productData);
      } else {
        await updateProduct(productId, productData);
      }

      router.push('/admin/products');
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
          <button 
            className={styles.backButton}
            onClick={() => router.push('/admin/products')}
          >
            <FiArrowLeft />
            Back to Products
            </button>
          <h1 className={styles.title}>
            {productId === 'new' ? 'Create New Product' : 'Edit Product'}
            </h1>
          </div>
          <div className={styles.headerActions}>
          <button 
            className={styles.previewButton}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <FiEyeOff /> : <FiEye />}
            {previewMode ? 'Hide Preview' : 'Preview'}
              </button>
          <button 
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
                  <FiSave />
            {saving ? 'Saving...' : 'Save Product'}
                </button>
        </div>
        </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.content}>
        {/* Basic Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Basic Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
              <label>Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Product name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Slug *</label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleInputChange}
                placeholder="product-slug"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Title</label>
                  <input
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Product title"
                  />
                </div>
                <div className={styles.formGroup}>
              <label>Subtitle</label>
              <input
                name="subtitle"
                value={form.subtitle}
                onChange={handleInputChange}
                placeholder="Product subtitle"
              />
                </div>
                <div className={styles.formGroup}>
              <label>Short Description</label>
                  <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief product description"
                rows={2}
                  />
                </div>
                <div className={styles.formGroup}>
              <label>Full Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Detailed product description"
                rows={4}
                required
                  />
                </div>
              </div>
        </section>

        {/* Pricing & Inventory */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pricing & Inventory</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Price *</label>
                  <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Stock *</label>
                  <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>SKU *</label>
                <input
                name="sku"
                value={form.sku}
                onChange={handleInputChange}
                placeholder="SKU-001"
                required
                />
              </div>
            <div className={styles.formGroup}>
              <label>Category *</label>
              <input
                name="category"
                value={form.category}
                onChange={handleInputChange}
                placeholder="clinic"
                required
              />
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Product Details</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
              <label>Technology</label>
                  <input
                name="technology"
                value={form.technology}
                onChange={handleInputChange}
                placeholder="e.g., PDRN Technology"
                  />
                </div>
                <div className={styles.formGroup}>
              <label>Application</label>
                  <input
                name="application"
                value={form.application}
                onChange={handleInputChange}
                placeholder="e.g., Professional skin regeneration"
                  />
                </div>
                <div className={styles.formGroup}>
              <label>Target</label>
                  <input
                name="target"
                value={form.target}
                onChange={handleInputChange}
                placeholder="e.g., Cellular regeneration"
                  />
                </div>
            <div className={styles.formGroup}>
              <label>Professional Grade (Badge)</label>
              <input
                name="badge"
                value={form.badge}
                onChange={handleInputChange}
                placeholder="e.g., Medical Grade"
              />
              </div>
            <div className={styles.formGroup}>
              <label>Badge</label>
              <input
                name="badge"
                value={form.badge}
                onChange={handleInputChange}
                placeholder="e.g., Advanced"
              />
            </div>
                <div className={styles.formGroup}>
              <label>Manufacturer</label>
                  <input
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleInputChange}
                placeholder="Manufacturer name"
                  />
                </div>
          </div>
        </section>
                
        {/* Ingredients */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ingredients</h2>
                <div className={styles.formGroup}>
            <label>Ingredients (comma-separated)</label>
                  <textarea
              name="ingredients"
              value={form.ingredients}
              onChange={handleInputChange}
              placeholder="Ingredient 1, Ingredient 2, Ingredient 3"
                    rows={3}
                  />
                </div>
        </section>

        {/* Benefits */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Benefits</h2>
          <div className={styles.formGroup}>
            <label>Benefits (format: "Title: Description" - one per line)</label>
            <textarea
              value={Array.isArray(form.benefits) 
                ? form.benefits.map(b => `${b.title}: ${b.description}`).join('\n')
                : form.benefits || ''
              }
              onChange={(e) => handleBenefitsChange(e.target.value)}
              placeholder="Deep Hydration: Advanced hydration technology for intensive skin moisturizing&#10;Skin Repair: Comprehensive skin repair and regeneration capabilities"
              rows={4}
            />
          </div>
        </section>

        {/* Features */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Features</h2>
                <div className={styles.formGroup}>
            <label>Features (comma-separated)</label>
                  <input
              value={Array.isArray(form.features) ? form.features.join(', ') : ''}
              onChange={(e) => handleArrayInput('features', e.target.value)}
              placeholder="Feature 1, Feature 2, Feature 3"
                  />
                </div>
        </section>

        {/* Specifications */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Specifications
            <button className={styles.addButton} onClick={addSpecification}>
              <FiPlus />
              Add Specification
            </button>
          </h2>
          <div className={styles.specificationsGrid}>
            {Object.entries(form.specifications || {}).map(([key, value]) => (
              <div key={key} className={styles.specificationItem}>
                <input
                  value={key}
                  onChange={(e) => {
                    const newSpecs = { ...form.specifications };
                    delete newSpecs[key];
                    newSpecs[e.target.value] = value;
                    setForm(prev => ({ ...prev, specifications: newSpecs }));
                  }}
                  placeholder="Specification name"
                />
                <input
                  value={value}
                  onChange={(e) => handleSpecificationChange(key, e.target.value)}
                  placeholder="Value"
                />
                <button
                  className={styles.removeButton}
                  onClick={() => removeSpecification(key)}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Product Images</h2>
          <div className={styles.imageUpload}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="image-upload"
              className={styles.fileInput}
            />
            <label htmlFor="image-upload" className={styles.uploadButton}>
              <FiUpload />
              Upload Image
            </label>
          </div>
          <div className={styles.imagesGrid}>
            {form.images?.map((image, index) => (
              <div key={index} className={styles.imageItem}>
                <img src={image.url} alt={image.alt || 'Product image'} />
                <button
                  className={styles.removeImageButton}
                  onClick={() => removeImage(index)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            </div>
        </section>

        {/* Tags & Keywords */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tags</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
              <label>Tags (comma-separated)</label>
                  <input
                value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
                onChange={(e) => handleArrayInput('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
                  />
                </div>

          </div>
        </section>
                
        {/* AI Content */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>AI Content</h2>
                <div className={styles.formGroup}>
            <label>AI Generated Content</label>
            <textarea
              name="aiContent"
              value={form.aiContent}
              onChange={handleInputChange}
              placeholder="AI-generated product description"
              rows={3}
            />
          </div>
        </section>

        {/* Settings */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Product Settings</h2>
          <div className={styles.settingsGrid}>
            <div className={styles.settingItem}>
              <label>
                    <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleInputChange}
                />
                Active Product
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                    <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleInputChange}
                />
                Featured Product
              </label>
            </div>
            <div className={styles.settingItem}>
              <label>
                    <input
                  type="checkbox"
                  name="bestSeller"
                  checked={form.bestSeller}
                  onChange={handleInputChange}
                />
                Best Seller
              </label>
                  </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={form.newArrival}
                  onChange={handleInputChange}
                />
                New Arrival
              </label>
                </div>
            <div className={styles.settingItem}>
              <label>
                <input
                  type="checkbox"
                  name="requiresCertification"
                  checked={form.requiresCertification}
                  onChange={handleInputChange}
                />
                Requires Certification
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Certification Level</label>
            <select
              name="certificationLevel"
              value={form.certificationLevel}
              onChange={handleInputChange}
            >
              <option value="none">No Certification</option>
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
        </div>
        </section>
      </div>
    </div>
  );
} 