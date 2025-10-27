import React from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite 
}: ProductCardProps) {
  return (
    <article className={styles.productCard}>
      <div className={styles.productImageWrapper}>
        <div className={styles.productBadge}>Премиум</div>
        <Image 
          src={product.image} 
          alt={product.name}
          width={300}
          height={240}
          className={styles.productImage}
        />
      </div>
      
      <div className={styles.productInfo}>
        <div className={styles.productContent}>
          <span className={styles.productCategory}>{product.category}</span>
          <h3 className={styles.productTitle}>
            {product.name}
          </h3>
        </div>
        
        <div className={styles.productBottom}>
          <div className={styles.productRating}>
            <div className={styles.ratingStars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className={styles.ratingText}>
              {product.rating.toFixed(1)}
            </span>
          </div>
          
          <div className={styles.productPrice}>
            {product.price.toLocaleString()} ₽
          </div>
          <div className={styles.productActions}>
          <button 
            className={styles.addToCartBtn}
            onClick={() => onAddToCart(product)}
          >
            Добавить в корзину
          </button>
          <button 
            className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
            onClick={() => onToggleFavorite(product)}
            title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill={isFavorite ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          </div>
        </div>
      </div>
    </article>
  );
}
