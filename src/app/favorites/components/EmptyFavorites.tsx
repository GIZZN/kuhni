import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

export default function EmptyFavorites() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <h1>Избранное пусто</h1>
      <p>Добавьте товары в избранное, чтобы легко найти их позже. В нашем каталоге вы найдете качественную сантехнику от проверенных производителей.</p>
      <Link href="/catalog" className={styles.catalogButton}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Перейти в каталог
      </Link>
    </div>
  );
}
