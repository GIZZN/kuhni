import React from 'react';
import styles from '../page.module.css';
import CategoryCard from './CategoryCard';
import { categoriesData } from '../data/products';

export default function CategoriesSection() {
  return (
    <section className={styles.categories}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Наш ассортимент</span>
          <h2 className={styles.sectionTitle}>Категории товаров</h2>
          <p className={styles.sectionDescription}>
            Широкий выбор сантехники для создания идеального интерьера ванной комнаты
          </p>
        </div>
        
        <div className={styles.categoriesContainer}>
          {categoriesData.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
