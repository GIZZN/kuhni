import React from 'react';
import styles from '../page.module.css';
import type { TabType } from '../types';

interface ProfileNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function ProfileNavigation({ activeTab, onTabChange }: ProfileNavigationProps) {
  return (
    <aside className={styles.navigationSidebar}>
      <nav className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <div className={styles.tabIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className={styles.tabContent}>
            <span className={styles.tabTitle}>Личные данные</span>
            <span className={styles.tabDescription}>Редактирование профиля</span>
          </div>
        </button>
        
        <button 
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => onTabChange('orders')}
        >
          <div className={styles.tabIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.3 2.3c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L9 14"/>
              <circle cx="9" cy="20" r="1"/>
              <circle cx="20" cy="20" r="1"/>
            </svg>
          </div>
          <div className={styles.tabContent}>
            <span className={styles.tabTitle}>История заказов</span>
            <span className={styles.tabDescription}>Отслеживание покупок</span>
          </div>
        </button>
      </nav>
    </aside>
  );
}
