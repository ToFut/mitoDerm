'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';
import styles from './AdminFilters.module.scss';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters?: FilterConfig[];
  activeFilters?: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  onClearFilters?: () => void;
  className?: string;
  placeholder?: string;
  showAdvanced?: boolean;
  aiSuggestions?: string[];
}

export default function AdminFilters({
  searchTerm,
  onSearchChange,
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  className,
  placeholder = "Search...",
  showAdvanced = true,
  aiSuggestions = []
}: AdminFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '' && value !== null && value !== undefined;
  });

  const renderFilterInput = (filter: FilterConfig) => {
    const value = activeFilters[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All {filter.label}</option>
            {filter.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className={styles.multiselectContainer}>
            <select
              multiple
              value={value || []}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                onFilterChange?.(filter.key, selectedValues);
              }}
              className={styles.filterMultiselect}
            >
              {filter.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'range':
        const rangeValue = value || [filter.min || 0, filter.max || 100];
        return (
          <div className={styles.rangeContainer}>
            <label className={styles.rangeLabel}>
              {filter.label}: {rangeValue[0]} - {rangeValue[1]}
            </label>
            <div className={styles.rangeInputs}>
              <input
                type="range"
                min={filter.min || 0}
                max={filter.max || 100}
                value={rangeValue[0]}
                onChange={(e) => 
                  onFilterChange?.(filter.key, [parseInt(e.target.value), rangeValue[1]])
                }
                className={styles.rangeSlider}
              />
              <input
                type="range"
                min={filter.min || 0}
                max={filter.max || 100}
                value={rangeValue[1]}
                onChange={(e) => 
                  onFilterChange?.(filter.key, [rangeValue[0], parseInt(e.target.value)])
                }
                className={styles.rangeSlider}
              />
            </div>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            className={styles.filterDate}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${styles.adminFilters} ${className || ''}`}>
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className={styles.clearSearch}
            >
              <FiX />
            </button>
          )}
        </div>
        
        {/* AI Suggestions */}
        <AnimatePresence>
          {showSuggestions && aiSuggestions.length > 0 && (
            <motion.div
              className={styles.suggestions}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => {
                    onSearchChange(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Filters */}
      {filters.length > 0 && (
        <div className={styles.quickFilters}>
          {filters.slice(0, 3).map(filter => (
            <div key={filter.key} className={styles.quickFilter}>
              {renderFilterInput(filter)}
            </div>
          ))}
          
          {showAdvanced && filters.length > 3 && (
            <button
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className={styles.advancedToggle}
            >
              <FiFilter />
              Advanced
              <FiChevronDown 
                className={`${styles.chevron} ${isAdvancedOpen ? styles.rotated : ''}`} 
              />
            </button>
          )}

          {hasActiveFilters && onClearFilters && (
            <button
              onClick={onClearFilters}
              className={styles.clearFilters}
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Advanced Filters */}
      <AnimatePresence>
        {isAdvancedOpen && filters.length > 3 && (
          <motion.div
            className={styles.advancedFilters}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.advancedGrid}>
              {filters.slice(3).map(filter => (
                <div key={filter.key} className={styles.advancedFilter}>
                  <label className={styles.filterLabel}>{filter.label}</label>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className={styles.activeFiltersSummary}>
          <span className={styles.activeFiltersLabel}>Active filters:</span>
          <div className={styles.activeFilterTags}>
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const filter = filters.find(f => f.key === key);
              if (!filter) return null;

              let displayValue: string;
              if (Array.isArray(value)) {
                displayValue = value.join(', ');
              } else if (filter.type === 'range') {
                displayValue = `${value[0]} - ${value[1]}`;
              } else {
                displayValue = String(value);
              }

              return (
                <motion.span
                  key={key}
                  className={styles.activeFilterTag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  {filter.label}: {displayValue}
                  <button
                    onClick={() => onFilterChange?.(key, filter.type === 'multiselect' ? [] : '')}
                    className={styles.removeFilter}
                  >
                    <FiX />
                  </button>
                </motion.span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}