import React from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import type { CartItemProps } from '../types';

export default function CartItemComponent({ 
  item, 
  onRemove, 
  onUpdateQuantity 
}: CartItemProps) {
  return (
    <article className={styles.cartItem}>
      <button 
        className={styles.removeButton}
        onClick={() => onRemove(item.product_id)}
        title="Удалить из корзины"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className={styles.itemProduct}>
        <div className={styles.itemImage}>
          <Image 
            src={item.product_image || '/images/products/placeholder1.jpg'} 
            alt={item.product_name}
            width={100}
            height={100}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className={styles.itemDetails}>
          <h3 className={styles.itemName}>{item.product_name}</h3>
          <span className={styles.itemCategory}>Кухни премиум-класса</span>
        </div>
      </div>

      <div className={styles.itemPrice}>
        {Number(item.product_price).toLocaleString()} ₽
      </div>

      <div className={styles.itemQuantity}>
        <div className={styles.quantityControls}>
          <button 
            className={styles.quantityBtn}
            onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <span className={styles.quantityValue}>{item.quantity}</span>
          <button 
            className={styles.quantityBtn}
            onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.itemTotal}>
        {Number(item.total_price).toLocaleString()} ₽
      </div>
    </article>
  );
}
