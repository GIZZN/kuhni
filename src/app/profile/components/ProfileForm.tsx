import React from 'react';
import styles from '../page.module.css';
import AlertMessage from './AlertMessage';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ProfileFormProps {
  formData: FormData;
  isUpdating: boolean;
  updateMessage: string;
  updateError: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileForm({
  formData,
  isUpdating,
  updateMessage,
  updateError,
  onInputChange,
  onSubmit
}: ProfileFormProps) {
  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <h2>Личные данные</h2>
        <p>Обновите информацию о себе для улучшения качества обслуживания</p>
      </div>
      
      {updateMessage && (
        <AlertMessage type="success" message={updateMessage} />
      )}
      
      {updateError && (
        <AlertMessage type="error" message={updateError} />
      )}
      
      <form className={styles.profileForm} onSubmit={onSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Полное имя
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className={styles.inputField}
              placeholder="Введите ваше имя"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email адрес
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className={styles.inputField}
              placeholder="example@email.com"
              disabled
            />
            <span className={styles.inputNote}>Email нельзя изменить</span>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Номер телефона
            </label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              className={styles.inputField}
              placeholder="+7 (999) 123-45-67"
            />
            <span className={styles.inputNote}>Для связи по заказам</span>
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveButton} disabled={isUpdating}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}
