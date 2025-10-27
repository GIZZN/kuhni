import React from 'react';
import styles from '../page.module.css';
import CartItemComponent from './CartItemComponent';
import type { CartItem } from '../types';

interface CartItemsProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function CartItems({ 
  items, 
  onRemove, 
  onUpdateQuantity 
}: CartItemsProps) {
  return (
    <div className={styles.cartItems}>
      <div className={styles.itemsHeader}>
        <span>Товар</span>
        <span>Цена</span>
        <span>Количество</span>
        <span>Сумма</span>
      </div>
      
      {items.map((item) => (
        <CartItemComponent
          key={item.id}
          item={item}
          onRemove={onRemove}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}
    </div>
  );
}
