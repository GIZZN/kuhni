import React from 'react';
import styles from '../page.module.css';

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

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getStatusClass = (status: string) => {
    return status.toLowerCase().replace(/\s+/g, '_');
  };

  return (
    <article className={styles.orderCard}>
      <div className={styles.orderCardHeader}>
        <div className={styles.orderMeta}>
          <h3>Заказ №{order.id}</h3>
          <time className={styles.orderDate}>
            {new Date(order.date).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        <div className={`${styles.statusBadge} ${styles[getStatusClass(order.status)]}`}>
          <div className={styles.statusIcon}></div>
          {order.status}
        </div>
      </div>
      
      <div className={styles.orderItems}>
        {order.items.map((item, index) => (
          <div key={index} className={styles.orderItemRow}>
            <span className={styles.itemName}>{item.name}</span>
            <span className={styles.itemQuantity}>{item.quantity} шт.</span>
            <span className={styles.itemPrice}>{item.price.toLocaleString()} ₽</span>
          </div>
        ))}
      </div>
      
      <div className={styles.orderCardFooter}>
        <div className={styles.orderSummary}>
          <span className={styles.totalLabel}>Общая сумма:</span>
          <span className={styles.totalAmount}>{order.total.toLocaleString()} ₽</span>
        </div>
        <button className={styles.orderDetailsButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          Подробнее
        </button>
      </div>
    </article>
  );
}
