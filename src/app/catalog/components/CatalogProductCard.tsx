import React from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import type { Product } from '@/app/types';
import { Star, Heart, ShoppingCart } from 'lucide-react';

interface CatalogProductCardProps {
  product: Product;
  quantity: number;
  isFavorite: boolean;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

export default function CatalogProductCard({
  product,
  quantity,
  isFavorite,
  onAddToCart,
  onToggleFavorite
}: CatalogProductCardProps) {
  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <Image 
          src={product.image} 
          alt={product.name}
          width={300}
          height={200}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productContent}>
          <h3>{product.name}</h3>
          <p className={styles.category}>{product.category}</p>
          {quantity > 0 && (
            <div className={styles.quantityIndicator}>
              В корзине: {quantity}
            </div>
          )}
        </div>
        <div className={styles.productBottom}>
          <div className={styles.productRating}>
            <div className={styles.ratingStars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i}
                  size={14}
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className={styles.ratingText}>
              {product.rating.toFixed(1)}
            </span>
          </div>
          
          <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
          <div className={styles.actionButtons}>
          <button 
            className={styles.addToCart}
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart size={18} />
            {quantity > 0 ? 'Добавить ещё' : 'В корзину'}
          </button>
          <button 
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
            onClick={() => onToggleFavorite(product)}
            title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
