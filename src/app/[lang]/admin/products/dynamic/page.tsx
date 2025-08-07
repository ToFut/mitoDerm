'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/services/productService';

export default function DynamicProductManager() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    subtitle: '',
    badge: '',
    category: '',
    application: '',
    technology: '',
    target: '',
    professionalGrade: '',
    keywords: '',
    features: '',
    specifications: '',
    ingredients: '',
    aiPrompt: '',
    benefits: '',
    aiContent: ''
  });

  // Admin users list
  const adminUsers = [
    'admin@mitoderm.com',
    'shiri@mitoderm.com',
    'segev@futurixs.com',
    'ilona@mitoderm.co.il'
  ];

  const isAdmin = session?.user?.email && adminUsers.includes(session.user.email);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    loadProducts();
  }, [isAdmin, router]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.aiPrompt) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/products/generate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: formData.aiPrompt,
          productTitle: formData.title
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          description: data.description || prev.description,
          features: data.features || prev.features,
          specifications: data.specifications || prev.specifications,
          benefits: data.benefits || prev.benefits,
          aiContent: data.aiContent || prev.aiContent
        }));
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const productData = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        features: formData.features.split('\n').filter(f => f.trim()),
        specifications: Object.fromEntries(
          formData.specifications.split('\n')
            .filter(s => s.includes(':'))
            .map(s => {
              const [key, value] = s.split(':').map(part => part.trim());
              return [key, value];
            })
        ),
        ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
        benefits: [
          {
            title: 'Key Benefit 1',
            description: 'AI generated benefit description'
          }
        ]
      };

      const response = await fetch('/api/admin/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        loadProducts();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      subtitle: '',
      badge: '',
      category: '',
      application: '',
      technology: '',
      target: '',
      professionalGrade: '',
      keywords: '',
      features: '',
      specifications: '',
      ingredients: '',
      aiPrompt: '',
      benefits: '',
      aiContent: ''
    });
    setIsEditing(false);
    setSelectedProduct(null);
  };

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dynamic Product Manager</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedProduct(product);
                    setFormData({
                      title: product.title || '',
                      slug: product.slug || '',
                      shortDescription: product.shortDescription || '',
                      description: product.description || '',
                      subtitle: '',
                      badge: product.badge || '',
                      category: product.category || '',
                      application: product.application || '',
                      technology: product.technology || '',
                      target: product.target || '',
                      professionalGrade: '',
                      keywords: '',
                      features: '',
                      specifications: '',
                      ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : (product.ingredients || ''),
                      aiPrompt: '',
                      benefits: '',
                      aiContent: ''
                    });
                    setIsEditing(true);
                  }}
                >
                  <div className="font-medium">{product.title}</div>
                  <div className="text-sm text-gray-600">{product.shortDescription}</div>
                  <div className="text-xs text-gray-500">/{product.slug}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Product' : 'Create New Product'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  className="w-full p-2 border rounded h-20"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">AI Prompt for Content Generation</label>
                <textarea
                  value={formData.aiPrompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, aiPrompt: e.target.value }))}
                  className="w-full p-2 border rounded h-20"
                  placeholder="Describe the product and what content you want to generate..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate AI Content'}
                </button>
                
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {isEditing ? 'Update Product' : 'Create Product'}
                </button>
                
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 