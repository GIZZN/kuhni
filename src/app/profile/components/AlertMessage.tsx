import React from 'react';
import styles from '../page.module.css';

interface AlertMessageProps {
  type: 'success' | 'error';
  message: string;
}

export default function AlertMessage({ type, message }: AlertMessageProps) {
  const isSuccess = type === 'success';
  
  return (
    <div className={isSuccess ? styles.successAlert : styles.errorAlert}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {isSuccess ? (
          <path d="M20 6L9 17l-5-5"/>
        ) : (
          <>
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </>
        )}
      </svg>
      {message}
    </div>
  );
}
