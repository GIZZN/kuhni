import React from 'react';
import styles from '../page.module.css';
import { categoryNames } from '@/app/data/products';
import type { PriceRange } from '../types';

interface CatalogSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: PriceRange;
  onPriceChange: (type: 'min' | 'max', value: string) => void;
}

export default function CatalogSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange
}: CatalogSidebarProps) {
  return (
    <div className={styles.sidebar}>
      <h2>Категории</h2>
      <ul className={styles.categories}>
        {categoryNames.map((category) => (
          <li key={category}>
            <button 
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
      
      <div className={styles.filters}>
        <h2>Фильтры</h2>
        <div className={styles.priceFilter}>
          <h3>Цена</h3>
          <div className={styles.priceInputs}>
            <input 
              type="number" 
              placeholder="От" 
              value={priceRange.min}
              onChange={(e) => onPriceChange('min', e.target.value)}
            />
            <input 
              type="number" 
              placeholder="До" 
              value={priceRange.max}
              onChange={(e) => onPriceChange('max', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
