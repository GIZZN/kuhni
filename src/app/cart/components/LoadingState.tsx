import React from 'react';
import styles from '../page.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loadingCard}>
      <div className={styles.loadingSpinner}></div>
      <h2>Загрузка корзины...</h2>
      <p>Подождите, мы загружаем ваши товары</p>
    </div>
  );
}
