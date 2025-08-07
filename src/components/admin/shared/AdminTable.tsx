'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronUp, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import styles from './AdminTable.module.scss';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableAction {
  label: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface AdminTableProps {
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (selectedIds: string[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function AdminTable({
  columns,
  data,
  actions = [],
  selectable = false,
  selectedRows = [],
  onRowSelect,
  loading = false,
  emptyMessage = "No data available",
  className
}: AdminTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig || !data) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (columnKey: string) => {
    setSortConfig(current => ({
      key: columnKey,
      direction: current?.key === columnKey && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = () => {
    if (!onRowSelect) return;
    
    const allIds = data.map(row => row.id);
    const isAllSelected = allIds.every(id => selectedRows.includes(id));
    
    if (isAllSelected) {
      onRowSelect(selectedRows.filter(id => !allIds.includes(id)));
    } else {
      onRowSelect([...new Set([...selectedRows, ...allIds])]);
    }
  };

  const handleRowSelect = (rowId: string) => {
    if (!onRowSelect) return;
    
    if (selectedRows.includes(rowId)) {
      onRowSelect(selectedRows.filter(id => id !== rowId));
    } else {
      onRowSelect([...selectedRows, rowId]);
    }
  };

  if (loading) {
    return (
      <div className={`${styles.adminTable} ${className || ''}`}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`${styles.adminTable} ${className || ''}`}>
        <div className={styles.emptyState}>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.adminTable} ${className || ''}`}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              {selectable && (
                <th className={styles.selectColumn}>
                  <input
                    type="checkbox"
                    checked={data.length > 0 && data.every(row => selectedRows.includes(row.id))}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`${styles.headerCell} ${column.sortable ? styles.sortable : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={styles.headerContent}>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className={styles.sortIcons}>
                        <FiChevronUp 
                          className={`${styles.sortIcon} ${
                            sortConfig?.key === column.key && sortConfig.direction === 'asc' 
                              ? styles.active : ''
                          }`} 
                        />
                        <FiChevronDown 
                          className={`${styles.sortIcon} ${
                            sortConfig?.key === column.key && sortConfig.direction === 'desc' 
                              ? styles.active : ''
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className={styles.actionsColumn}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            <AnimatePresence mode="popLayout">
              {sortedData.map((row, index) => (
                <motion.tr
                  key={row.id}
                  className={`${styles.tableRow} ${selectedRows.includes(row.id) ? styles.selected : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  layout
                >
                  {selectable && (
                    <td className={styles.selectCell}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        className={styles.checkbox}
                      />
                    </td>
                  )}
                  {columns.map(column => (
                    <td key={column.key} className={styles.tableCell}>
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className={styles.actionsCell}>
                      <div className={styles.actionsContainer}>
                        <button
                          className={styles.actionsButton}
                          onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
                        >
                          <FiMoreVertical />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === row.id && (
                            <motion.div
                              className={styles.actionsDropdown}
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                            >
                              {actions.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  className={`${styles.actionItem} ${styles[action.variant || 'primary']}`}
                                  onClick={() => {
                                    action.onClick(row);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <span className={styles.actionIcon}>{action.icon}</span>
                                  <span className={styles.actionLabel}>{action.label}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}