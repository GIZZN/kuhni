import React from 'react';
import styles from '../page.module.css';
import CatalogProductCard from './CatalogProductCard';
import type { Product } from '@/app/types';
import type { CartItem } from '../types';

interface ProductGridProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export default function ProductGrid({
  products,
  cartItems,
  onAddToCart,
  onToggleFavorite,
  isFavorite
}: ProductGridProps) {
  const getItemQuantity = (productId: number) => {
    const item = cartItems.find(item => item.product_id === String(productId));
    return item?.quantity || 0;
  };

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <CatalogProductCard
          key={product.id}
          product={product}
          quantity={getItemQuantity(product.id)}
          isFavorite={isFavorite(product.id)}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
