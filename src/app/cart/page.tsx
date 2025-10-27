'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, LogIn, Minus, Plus, Trash2, CreditCard } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart, createOrder, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [hasPaymentMethods, setHasPaymentMethods] = useState(true);

  // Проверяем способы оплаты при авторизации
  useEffect(() => {
    const checkPaymentMethods = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch('/api/user/payment-methods');
          if (response.ok) {
            const data = await response.json();
            setHasPaymentMethods(data.paymentMethods.length > 0);
          }
        } catch (error) {
          console.error('Error checking payment methods:', error);
        }
      }
    };

    checkPaymentMethods();
  }, [isAuthenticated]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    setIsOrdering(true);
    setOrderError('');

    try {
      const result = await createOrder();
      
      if (result.success) {
        router.push('/profile?tab=orders');
      } else {
        setOrderError(result.error || 'Ошибка при создании заказа');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setOrderError('Ошибка при создании заказа');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.topPanel}>
          <div className={styles.topPanelContent}>
            <div className={styles.header}>
              <h1>Корзина</h1>
            </div>
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.loading}>
            Загрузка корзины...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Убираем проверку авторизации - теперь корзина доступна всем

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.topPanel}>
          <div className={styles.topPanelContent}>
            <div className={styles.header}>
              <h1>Корзина</h1>
            </div>
          </div>
        </div>
        
        <div className={styles.content}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <ShoppingCart size={40} />
            </div>
            <h1>Корзина пуста</h1>
            <p>Вы еще не добавили ни одного товара в корзину. Перейдите в каталог и выберите понравившиеся товары.</p>
            <Link href="/catalog" className={styles.catalogButton}>
              <ShoppingCart size={18} />
              Перейти в каталог
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.topPanel}>
        <div className={styles.topPanelContent}>
          <div className={styles.header}>
            <h1>Корзина</h1>
          </div>
          <div className={styles.count}>
            {items.length} {items.length === 1 ? 'товар' : items.length < 5 ? 'товара' : 'товаров'}
          </div>
          <div className={styles.actions}>
            <button 
              className={styles.clearButton}
              onClick={clearCart}
              title="Очистить корзину"
            >
              <Trash2 size={16} />
              Очистить корзину
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.content}>
        {orderError && (
          <div className={styles.errorMessage}>
            {orderError}
          </div>
        )}
        
        <div className={styles.cartLayout}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.product_id} className={styles.item}>
                <div className={styles.imageContainer}>
                  <Image 
                    src={item.product_image || '/images/products/placeholder1.jpg'} 
                    alt={item.product_name}
                    width={200}
                    height={150}
                    className={styles.image}
                  />
                </div>
                
                <div className={styles.itemInfo}>
                  <h3 className={styles.name}>{item.product_name}</h3>
                  <p className={styles.category}>Кухни</p>
                  
                  <div className={styles.priceContainer}>
                    <p className={styles.price}>{item.product_price.toLocaleString()} ₽</p>
                  </div>
                </div>
                
                <div className={styles.quantityControls}>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button 
                    className={styles.quantityButton}
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className={styles.itemTotal}>
                  {(item.product_price * item.quantity).toLocaleString()} ₽
                </div>
                
                <button 
                  className={styles.removeButton}
                  onClick={() => removeFromCart(item.product_id)}
                  title="Удалить из корзины"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <div className={styles.summary}>
            <div className={styles.summaryContent}>
              <h3>Итого к оплате</h3>
              <div className={styles.totalPrice}>
                {totalPrice.toLocaleString()} ₽
              </div>
                  {isAuthenticated ? (
                    hasPaymentMethods ? (
                      <button
                        className={styles.checkoutButton}
                        onClick={handleCheckout}
                        disabled={isOrdering}
                      >
                        <CreditCard size={18} />
                        {isOrdering ? 'Оформление...' : 'Оформить заказ'}
                      </button>
                    ) : (
                      <div className={styles.paymentPrompt}>
                        <p>Для оформления заказа необходимо добавить способ оплаты</p>
                        <Link href="/profile" className={styles.addPaymentButton}>
                          <CreditCard size={18} />
                          Добавить способ оплаты
                        </Link>
                      </div>
                    )
                  ) : (
                    <div className={styles.authPrompt}>
                      <p>Для оформления заказа необходимо войти в аккаунт</p>
                      <Link href="/auth/login" className={styles.loginButton}>
                        <LogIn size={18} />
                        Войти в аккаунт
                      </Link>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 