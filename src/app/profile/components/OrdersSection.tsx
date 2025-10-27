import React from 'react';
import styles from '../page.module.css';
import OrderCard from './OrderCard';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface OrdersSectionProps {
  orders: Order[];
  isLoading: boolean;
}

export default function OrdersSection({ orders, isLoading }: OrdersSectionProps) {
  if (isLoading) {
    return (
      <div className={styles.ordersSection}>
        <div className={styles.sectionHeader}>
          <h2>История заказов</h2>
          <p>Отслеживайте статус ваших покупок и просматривайте детали заказов</p>
        </div>
        <div className={styles.ordersLoading}>
          <div className={styles.loadingSpinner}></div>
          <span>Загрузка заказов...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.ordersSection}>
        <div className={styles.sectionHeader}>
          <h2>История заказов</h2>
          <p>Отслеживайте статус ваших покупок и просматривайте детали заказов</p>
        </div>
        <div className={styles.emptyOrders}>
          <div className={styles.emptyIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h3>Заказов пока нет</h3>
          <p>Сделайте первый заказ в нашем каталоге качественной сантехники</p>
          <a href="/catalog" className={styles.catalogLink}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Перейти в каталог
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersSection}>
      <div className={styles.sectionHeader}>
        <h2>История заказов</h2>
        <p>Отслеживайте статус ваших покупок и просматривайте детали заказов</p>
      </div>
      
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
