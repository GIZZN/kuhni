import React from 'react';
import styles from '../page.module.css';

interface FavoritesHeaderProps {
  itemsCount: number;
}

export default function FavoritesHeader({ itemsCount }: FavoritesHeaderProps) {
  const getItemsText = (count: number) => {
    if (count === 1) return 'товар';
    if (count < 5) return 'товара';
    return 'товаров';
  };

  return (
    <div className={styles.header}>
      <h1>Избранное</h1>
      <span className={styles.count}>
        {itemsCount} {getItemsText(itemsCount)}
      </span>
    </div>
  );
}
