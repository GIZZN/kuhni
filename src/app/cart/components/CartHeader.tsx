import React from 'react';
import styles from '../page.module.css';
import type { CartItem } from '../types';

interface CartHeaderProps {
  items: CartItem[];
  onClearCart: () => void;
}

export default function CartHeader({ items, onClearCart }: CartHeaderProps) {
  const getItemsText = (count: number) => {
    if (count === 1) return 'товар';
    if (count < 5) return 'товара';
    return 'товаров';
  };

  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <h1>Корзина</h1>
          <span className={styles.itemCount}>
            {items.length} {getItemsText(items.length)}
          </span>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.clearAllButton}
            onClick={onClearCart}
            title="Очистить корзину"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}
