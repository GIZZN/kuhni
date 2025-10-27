import React from 'react';
import styles from '../page.module.css';

interface LoadingStateProps {
  message?: string;
  description?: string;
}

export default function LoadingState({ 
  message = "Загрузка профиля...", 
  description = "Подождите, мы загружаем данные вашего аккаунта" 
}: LoadingStateProps) {
  return (
    <div className={styles.loadingCard}>
      <div className={styles.loadingSpinner}></div>
      <h2>{message}</h2>
      <p>{description}</p>
    </div>
  );
}
