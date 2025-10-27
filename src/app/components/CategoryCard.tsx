import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <Link 
      href={`/catalog?category=${category.slug}`} 
      className={styles.categoryCard}
    >
      <div className={styles.categoryNumber}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className={styles.categoryIcon}>
        {category.icon}
      </div>
      <h3 className={styles.categoryTitle}>
        {category.name}
      </h3>
      <div className={styles.categoryArrow}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M7 17l9.2-9.2M17 17V7H7"/>
        </svg>
      </div>
    </Link>
  );
}
