import React from 'react';
import styles from './StickyFilterBar.module.scss';

interface StickyFilterBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
}

const categories = [
  { key: 'all', label: 'All' },
  { key: 'clinic', label: 'Clinic' },
  { key: 'home', label: 'Home' },
];

const StickyFilterBar: React.FC<StickyFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className={styles.stickyBar}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat.key}
            className={selectedCategory === cat.key ? styles.active : ''}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className={styles.viewToggle}>
        <button
          className={viewMode === 'grid' ? styles.active : ''}
          onClick={() => setViewMode('grid')}
        >
          <span>▦</span>
        </button>
        <button
          className={viewMode === 'list' ? styles.active : ''}
          onClick={() => setViewMode('list')}
        >
          <span>≡</span>
        </button>
      </div>
    </div>
  );
};

export default StickyFilterBar; 