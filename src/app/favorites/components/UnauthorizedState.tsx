import React from 'react';
import Link from 'next/link';
import styles from '../page.module.css';

export default function UnauthorizedState() {
  return (
    <div className={styles.unauthorized}>
      <h1>Войдите в аккаунт</h1>
      <p>Для просмотра избранных товаров необходимо войти в аккаунт</p>
      <Link href="/auth/login" className={styles.loginButton}>
        Войти
      </Link>
    </div>
  );
}
