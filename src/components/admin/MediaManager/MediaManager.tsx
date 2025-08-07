'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiUpload, FiImage, FiVideo, FiFile, FiTrash2, FiEdit, FiEye, FiDownload, FiGrid, FiList, FiSearch, FiFilter, FiX, FiPlus } from 'react-icons/fi';
import { uploadMedia, deleteMedia, getMedia, MediaItem } from '@/lib/services/mediaService';
import styles from './MediaManager.module.scss';

export default function MediaManager() {
  const { data: session } = useSession();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const categories = ['products', 'gallery', 'education', 'team', 'banners', 'other'];
  const fileTypes = ['all', 'image', 'video', 'document'];

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await getMedia();
      setMediaItems(data);
    } catch (err) {
      setError('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const results = await uploadMedia(formData, (progress) => {
        setUploadProgress(progress);
      });

      setShowUploadModal(false);
      setSelectedFiles([]);
      setUploadProgress({});
      loadMedia();
    } catch (err) {
      setError('Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (confirm('Are you sure you want to delete this media item?')) {
      try {
        await deleteMedia(mediaId);
        loadMedia();
      } catch (err) {
        setError('Failed to delete media');
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FiImage />;
    if (type.startsWith('video/')) return <FiVideo />;
    return <FiFile />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type.startsWith(selectedType);
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesType && matchesCategory;
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
    <div className={styles.mediaManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Media Library</h1>
          <p>Manage all your media files, images, and videos</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.uploadButton}
            onClick={() => setShowUploadModal(true)}
          >
            <FiUpload />
            Upload Media
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
            <span className={styles.statNumber}>
              {mediaItems.filter(item => item.type.startsWith('image/')).length}
            </span>
            <span className={styles.statLabel}>Images</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiVideo />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {mediaItems.filter(item => item.type.startsWith('video/')).length}
            </span>
            <span className={styles.statLabel}>Videos</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiFile />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {mediaItems.filter(item => !item.type.startsWith('image/') && !item.type.startsWith('video/')).length}
            </span>
            <span className={styles.statLabel}>Documents</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FiDownload />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>
              {formatFileSize(mediaItems.reduce((acc, item) => acc + item.size, 0))}
            </span>
            <span className={styles.statLabel}>Total Size</span>
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
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.typeFilter}
          >
            <option value="all">All Types</option>
            {fileTypes.slice(1).map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categoryFilter}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
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

      {/* Media Display */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading media...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={loadMedia}>Retry</button>
        </div>
      ) : (
        <div className={`${styles.mediaContainer} ${styles[viewMode]}`}>
          {filteredMedia.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiImage />
              </div>
              <h3>No media found</h3>
              <p>Upload your first media file to get started</p>
              <button onClick={() => setShowUploadModal(true)}>
                <FiUpload />
                Upload Media
              </button>
            </div>
          ) : (
            filteredMedia.map(item => (
              <div key={item.id} className={styles.mediaCard}>
                <div className={styles.mediaPreview}>
                  {item.type.startsWith('image/') ? (
                    <img src={item.url} alt={item.name} />
                  ) : item.type.startsWith('video/') ? (
                    <video src={item.url} muted />
                  ) : (
                    <div className={styles.filePreview}>
                      {getFileIcon(item.type)}
                    </div>
                  )}
                  <div className={styles.mediaOverlay}>
                    <button className={styles.previewBtn}>
                      <FiEye />
                    </button>
                    <button className={styles.downloadBtn}>
                      <FiDownload />
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => item.id && handleDelete(item.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                <div className={styles.mediaInfo}>
                  <h3>{item.name}</h3>
                  <p>{item.description || 'No description'}</p>
                  <div className={styles.mediaMeta}>
                    <span className={styles.category}>{item.category}</span>
                    <span className={styles.size}>{formatFileSize(item.size)}</span>
                    <span className={styles.date}>
                      {new Date(item.uploadedAt).toLocaleDateString()}
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
              <h2>Upload Media</h2>
              <button onClick={() => setShowUploadModal(false)} className={styles.closeBtn}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpload} className={styles.uploadForm}>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  id="media-upload"
                  className={styles.fileInput}
                />
                <label htmlFor="media-upload" className={styles.uploadLabel}>
                  <FiUpload />
                  <span>Choose files or drag and drop</span>
                  <small>Images, videos, and documents up to 50MB each</small>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className={styles.selectedFiles}>
                  <h3>Selected Files ({selectedFiles.length})</h3>
                  <div className={styles.fileList}>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className={styles.fileItem}>
                        <div className={styles.fileIcon}>
                          {getFileIcon(file.type)}
                        </div>
                        <div className={styles.fileInfo}>
                          <span className={styles.fileName}>{file.name}</span>
                          <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                        </div>
                        {uploadProgress[file.name] !== undefined && (
                          <div className={styles.progressBar}>
                            <div 
                              className={styles.progressFill}
                              style={{ width: `${uploadProgress[file.name]}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowUploadModal(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading || selectedFiles.length === 0} 
                  className={styles.submitBtn}
                >
                  {uploading ? 'Uploading...' : 'Upload Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 