import React from 'react';
import styles from '../page.module.css';
import type { OrderSummaryProps } from '../types';

export default function OrderSummary({ 
  items, 
  totalPrice, 
  isOrdering, 
  onCheckout 
}: OrderSummaryProps) {
  return (
    <aside className={styles.orderSummary}>
      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>Сводка заказа</h2>
        
        <div className={styles.summaryDetails}>
          <div className={styles.summaryRow}>
            <span>Товары ({items.length}):</span>
            <span>{totalPrice.toLocaleString()} ₽</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Доставка:</span>
            <span className={styles.freeDelivery}>Бесплатно</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Скидка:</span>
            <span className={styles.discount}>0 ₽</span>
          </div>
        </div>

        <div className={styles.summaryDivider}></div>

        <div className={styles.summaryTotal}>
          <span>К оплате:</span>
          <span className={styles.totalAmount}>{totalPrice.toLocaleString()} ₽</span>
        </div>

        <button 
          className={styles.checkoutButton} 
          onClick={onCheckout}
          disabled={isOrdering}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"/>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
            <path d="M3 12c0 5.5 4.5 10 10 10s10-4.5 10-10"/>
          </svg>
          {isOrdering ? 'Оформление...' : 'Оформить заказ'}
        </button>

        <div className={styles.guarantees}>
          <div className={styles.guarantee}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Гарантия качества</span>
          </div>
          <div className={styles.guarantee}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Быстрая доставка</span>
          </div>
          <div className={styles.guarantee}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span>Безопасная оплата</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
