'use client';

import React from 'react';
import styles from './page.module.css';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';

// Types
import type { FavoriteItem, CartItem } from './types';

export default function FavoritesPage() {
  const { items, removeFromFavorites, loading } = useFavorites();
  const { addToCart } = useCart();

  // Убираем проверку авторизации - теперь избранное доступно всем

  const handleAddToCart = async (item: FavoriteItem) => {
    const cartItem: CartItem = {
      id: parseInt(item.product_id),
      name: item.product_name,
      price: item.product_price,
      image: item.product_image
    };
    await addToCart(cartItem);
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    await removeFromFavorites(productId);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.topPanel}>
          <div className={styles.topPanelContent}>
            <div className={styles.header}>
              <h1>Избранное</h1>
            </div>
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.loading}>
            Загрузка избранных товаров...
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.topPanel}>
          <div className={styles.topPanelContent}>
            <div className={styles.header}>
              <h1>Избранное</h1>
            </div>
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Heart size={40} />
            </div>
            <h1>Избранное пусто</h1>
            <p>Вы еще не добавили ни одного товара в избранное. Перейдите в каталог и выберите понравившиеся товары.</p>
            <Link href="/catalog" className={styles.catalogButton}>
              <ShoppingCart size={18} />
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.topPanel}>
        <div className={styles.topPanelContent}>
          <div className={styles.header}>
            <h1>Избранное</h1>
          </div>
          <div className={styles.count}>
            {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <button 
                className={styles.removeButton}
                onClick={() => handleRemoveFromFavorites(item.product_id)}
                title="Удалить из избранного"
              >
                ×
              </button>
              
              <div className={styles.imageContainer}>
                <Image 
                  src={item.product_image || '/images/products/placeholder1.jpg'} 
                  alt={item.product_name}
                  width={400}
                  height={300}
                  className={styles.image}
                />
              </div>
              
              <div className={styles.productInfo}>
                <div className={styles.productContent}>
                  <h3 className={styles.name}>{item.product_name}</h3>
                  <p className={styles.category}>Кухни</p>
                </div>
                
                <div className={styles.productActions}>
                  <div className={styles.priceContainer}>
                    <p className={styles.price}>{item.product_price.toLocaleString()} ₽</p>
                  </div>
                  <div className={styles.buttonsContainer}>
                    <button 
                      className={styles.addToCart}
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart size={18} />
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
