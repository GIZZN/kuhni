import React from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import type { FavoriteItem } from '../types';

interface FavoriteCardProps {
  item: FavoriteItem;
  onAddToCart: (item: FavoriteItem) => void;
  onRemoveFromFavorites: (productId: string) => void;
}

export default function FavoriteCard({ 
  item, 
  onAddToCart, 
  onRemoveFromFavorites 
}: FavoriteCardProps) {
  return (
    <div className={styles.item}>
      <button 
        className={styles.removeButton}
        onClick={() => onRemoveFromFavorites(item.product_id)}
        title="Удалить из избранного"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className={styles.imageContainer}>
        <Image 
          src={item.product_image || '/images/products/placeholder1.jpg'} 
          alt={item.product_name}
          width={280}
          height={220}
          style={{ objectFit: 'contain' }}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.category}>{item.product_category}</div>
        <h3 className={styles.name}>{item.product_name}</h3>
        <div className={styles.price}>
          {item.product_price.toLocaleString()} ₽
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.addToCart}
            onClick={() => onAddToCart(item)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}
