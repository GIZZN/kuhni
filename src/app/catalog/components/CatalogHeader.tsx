import React from 'react';
import styles from '../page.module.css';
import type { SortOption } from '../types';

interface CatalogHeaderProps {
  searchQuery: string;
  selectedCategory: string;
  resultsCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function CatalogHeader({
  searchQuery,
  selectedCategory,
  resultsCount,
  sortBy,
  onSortChange
}: CatalogHeaderProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.catalogHeader}>
        <h1>Каталог кухонь</h1>
        {searchQuery && (
          <div className={styles.searchInfo}>
            Результаты поиска: <span className={styles.searchTerm}>{searchQuery}</span>
            <span className={styles.resultsCount}>({resultsCount})</span>
          </div>
        )}
        {selectedCategory !== 'Все' && !searchQuery && (
          <div className={styles.categoryInfo}>
            Категория: <span className={styles.categoryTerm}>{selectedCategory}</span>
            <span className={styles.resultsCount}>({resultsCount})</span>
          </div>
        )}
      </div>
      <div className={styles.sorting}>
        <select 
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="popular">По популярности</option>
          <option value="priceAsc">По возрастанию цены</option>
          <option value="priceDesc">По убыванию цены</option>
          <option value="nameAsc">По названию А-Я</option>
        </select>
      </div>
    </div>
  );
}
