import React from 'react';
import styles from '../page.module.css';
import FavoriteCard from './FavoriteCard';
import type { FavoriteItem } from '../types';

interface FavoritesListProps {
  items: FavoriteItem[];
  onAddToCart: (item: FavoriteItem) => void;
  onRemoveFromFavorites: (productId: string) => void;
}

export default function FavoritesList({ 
  items, 
  onAddToCart, 
  onRemoveFromFavorites 
}: FavoritesListProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <FavoriteCard
          key={item.id}
          item={item}
          onAddToCart={onAddToCart}
          onRemoveFromFavorites={onRemoveFromFavorites}
        />
      ))}
    </div>
  );
}
