import React from 'react';
import styles from '../page.module.css';
import ProductCard from './ProductCard';
import { productsData } from '../data/products';
import type { Product } from '../types';

interface ProductsSectionProps {
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export default function ProductsSection({ 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite 
}: ProductsSectionProps) {
  return (
    <section className={styles.products}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>Популярные товары</span>
          <h2 className={styles.sectionTitle}>Рекомендуемые решения</h2>
          <p className={styles.sectionDescription}>
            Тщательно отобранная коллекция лучших товаров для вашего дома
          </p>
        </div>
        
        <div className={styles.productsContainer}>
          {productsData.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
