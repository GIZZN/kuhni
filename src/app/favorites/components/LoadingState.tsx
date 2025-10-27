import React from 'react';
import styles from '../page.module.css';

export default function LoadingState() {
  return (
    <div className={styles.loading}>
      Загрузка избранного...
    </div>
  );
}
