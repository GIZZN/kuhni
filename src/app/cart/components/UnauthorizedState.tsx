import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

export default function UnauthorizedState() {
  return (
    <div className={styles.emptyCard}>
      <div className={styles.emptyIconWrapper}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <div className={styles.emptyContent}>
        <h1>Войдите в аккаунт</h1>
        <p>Для просмотра корзины необходимо войти в систему. Создайте аккаунт или войдите в существующий.</p>
        <Link href="/auth/login" className={styles.continueButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <path d="M15 12H3"/>
          </svg>
          Войти
        </Link>
      </div>
    </div>
  );
}
