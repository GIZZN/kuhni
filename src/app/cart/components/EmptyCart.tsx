import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

export default function EmptyCart() {
  return (
    <div className={styles.emptyCard}>
      <div className={styles.emptyIconWrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </div>
      <div className={styles.emptyContent}>
        <h1>Корзина пуста</h1>
        <p>Перейдите в каталог, чтобы добавить товары. В нашем ассортименте вы найдете качественную сантехнику от проверенных производителей.</p>
        <Link href="/catalog" className={styles.continueButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Перейти в каталог
        </Link>
      </div>
    </div>
  );
}
