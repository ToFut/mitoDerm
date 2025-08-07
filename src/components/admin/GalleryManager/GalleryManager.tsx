'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiUpload, FiImage, FiTrash2, FiEdit, FiEye, FiGrid, FiList, FiSearch, FiFilter, FiX, FiPlus, FiMove, FiCopy, FiDownload } from 'react-icons/fi';
import { getMediaByCategory, updateMedia, deleteMedia, MediaItem } from '@/lib/services/mediaService';
import styles from './GalleryManager.module.scss';

interface GalleryItem extends MediaItem {
  beforeImage?: string;
  afterImage?: string;
  treatment?: string;
  duration?: string;
  patientAge?: number;
  skinType?: string;
}

export default function GalleryManager() {
  const { data: session } = useSession();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ before?: File; after?: File }>({});

  const treatments = ['acne', 'aging', 'pigmentation', 'scars', 'texture', 'other'];
  const skinTypes = ['oily', 'dry', 'combination', 'sensitive', 'normal'];

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await getMediaByCategory('gallery');
      setGalleryItems(data as GalleryItem[]);
    } catch (err) {
      setError('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles.before || !selectedFiles.after) return;

    try {
      setUploading(true);
      // TODO: Implement gallery upload logic
      setShowUploadModal(false);
      setSelectedFiles({});
      loadGallery();
    } catch (err) {
      setError('Failed to upload gallery item');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updates = {
        treatment: formData.get('treatment') as string,
        duration: formData.get('duration') as string,
        patientAge: parseInt(formData.get('patientAge') as string),
        skinType: formData.get('skinType') as string,
        description: formData.get('description') as string
      };

      await updateMedia(editingItem.id!, updates);
      setShowEditModal(false);
      setEditingItem(null);
      loadGallery();
    } catch (err) {
      setError('Failed to update gallery item');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await deleteMedia(itemId);
        loadGallery();
      } catch (err) {
        setError('Failed to delete gallery item');
      }
    }
  };

  const filteredGallery = galleryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.treatment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTreatment = selectedTreatment === 'all' || item.treatment === selectedTreatment;
    return matchesSearch && matchesTreatment;
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
    <div className={styles.galleryManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Gallery Management</h1>
          <p>Manage before/after treatment images and patient results</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.uploadButton}
            onClick={() => setShowUploadModal(true)}
          >
            <FiUpload />
            Add Treatment Result
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiImage />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{galleryItems.length}</span>
            <span className={styles.statLabel}>Total Results</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiGrid />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {galleryItems.filter(item => item.treatment === 'acne').length}
            </span>
            <span className={styles.statLabel}>Acne Treatments</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiEye />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {galleryItems.filter(item => item.treatment === 'aging').length}
            </span>
            <span className={styles.statLabel}>Anti-Aging</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiCopy />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {galleryItems.filter(item => item.treatment === 'pigmentation').length}
            </span>
            <span className={styles.statLabel}>Pigmentation</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchFilter}>
          <div className={styles.searchBox}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search treatments, descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedTreatment}
            onChange={(e) => setSelectedTreatment(e.target.value)}
            className={styles.treatmentFilter}
          >
            <option value="all">All Treatments</option>
            {treatments.map(treatment => (
              <option key={treatment} value={treatment}>
                {treatment.charAt(0).toUpperCase() + treatment.slice(1)}
              </option>
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

      {/* Gallery Display */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading gallery...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={loadGallery}>Retry</button>
        </div>
      ) : (
        <div className={`${styles.galleryContainer} ${styles[viewMode]}`}>
          {filteredGallery.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiImage />
              </div>
              <h3>No gallery items found</h3>
              <p>Add your first before/after treatment result to get started</p>
              <button onClick={() => setShowUploadModal(true)}>
                <FiUpload />
                Add Treatment Result
              </button>
            </div>
          ) : (
            filteredGallery.map(item => (
              <div key={item.id} className={styles.galleryCard}>
                <div className={styles.galleryPreview}>
                  <div className={styles.beforeAfter}>
                    <div className={styles.beforeImage}>
                      <img src={item.beforeImage || item.url} alt="Before treatment" />
                      <span className={styles.label}>Before</span>
                    </div>
                    <div className={styles.afterImage}>
                      <img src={item.afterImage || item.url} alt="After treatment" />
                      <span className={styles.label}>After</span>
                    </div>
                  </div>
                  <div className={styles.galleryOverlay}>
                    <button className={styles.previewBtn}>
                      <FiEye />
                    </button>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(item)}
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item.id!)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className={styles.galleryInfo}>
                  <h3>{item.name}</h3>
                  <p>{item.description || 'No description'}</p>
                  <div className={styles.treatmentMeta}>
                    {item.treatment && (
                      <span className={styles.treatment}>{item.treatment}</span>
                    )}
                    {item.duration && (
                      <span className={styles.duration}>{item.duration}</span>
                    )}
                    {item.patientAge && (
                      <span className={styles.age}>{item.patientAge} years</span>
                    )}
                    {item.skinType && (
                      <span className={styles.skinType}>{item.skinType}</span>
                    )}
                  </div>
                  <div className={styles.galleryMeta}>
                    <span className={styles.date}>
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </span>
                    <span className={styles.size}>
                      {Math.round(item.size / 1024)} KB
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add Treatment Result</h2>
              <button onClick={() => setShowUploadModal(false)} className={styles.closeBtn}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpload} className={styles.uploadForm}>
              <div className={styles.uploadSection}>
                <h3>Before Treatment</h3>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect('before', e)}
                    id="before-upload"
                    className={styles.fileInput}
                  />
                  <label htmlFor="before-upload" className={styles.uploadLabel}>
                    <FiUpload />
                    <span>Choose before image</span>
                  </label>
                </div>
              </div>

              <div className={styles.uploadSection}>
                <h3>After Treatment</h3>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect('after', e)}
                    id="after-upload"
                    className={styles.fileInput}
                  />
                  <label htmlFor="after-upload" className={styles.uploadLabel}>
                    <FiUpload />
                    <span>Choose after image</span>
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Treatment Type</label>
                <select name="treatment" required>
                  <option value="">Select treatment</option>
                  {treatments.map(treatment => (
                    <option key={treatment} value={treatment}>
                      {treatment.charAt(0).toUpperCase() + treatment.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Duration</label>
                  <input type="text" name="duration" placeholder="e.g., 3 months" />
                </div>
                <div className={styles.formGroup}>
                  <label>Patient Age</label>
                  <input type="number" name="patientAge" min="18" max="100" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Skin Type</label>
                <select name="skinType">
                  <option value="">Select skin type</option>
                  {skinTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea name="description" rows={3} placeholder="Treatment details and results..."></textarea>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowUploadModal(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading || !selectedFiles.before || !selectedFiles.after} 
                  className={styles.submitBtn}
                >
                  {uploading ? 'Uploading...' : 'Add Treatment Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Treatment Result</h2>
              <button onClick={() => setShowEditModal(false)} className={styles.closeBtn}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdate} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label>Treatment Type</label>
                <select name="treatment" defaultValue={editingItem.treatment}>
                  {treatments.map(treatment => (
                    <option key={treatment} value={treatment}>
                      {treatment.charAt(0).toUpperCase() + treatment.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Duration</label>
                  <input type="text" name="duration" defaultValue={editingItem.duration} />
                </div>
                <div className={styles.formGroup}>
                  <label>Patient Age</label>
                  <input type="number" name="patientAge" defaultValue={editingItem.patientAge} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Skin Type</label>
                <select name="skinType" defaultValue={editingItem.skinType}>
                  {skinTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea name="description" rows={3} defaultValue={editingItem.description}></textarea>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowEditModal(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Update Treatment Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 