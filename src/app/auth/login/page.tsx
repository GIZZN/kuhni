'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { ChefHat, Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: ''
    };

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError('');
      
      try {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          router.push('/profile');
        } else {
          setApiError(result.error || 'Ошибка входа');
        }
      } catch (error) {
        console.error('Login error:', error);
        setApiError('Ошибка соединения с сервером');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.authPage}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.logoSection}>
              <div className={styles.logoIcon}>
                <ChefHat size={32} />
              </div>
              <h1>ПрофКухня</h1>  
              <p>Премиальные кухни</p>
            </div>
            
            <div className={styles.formSection}>
              <h2>Вход в аккаунт</h2>
              
              {apiError && (
                <div className={styles.errorMessage}>
                  {apiError}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">
                    <Mail size={18} />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${styles.inputField} ${errors.email ? styles.inputError : ''}`}
                    placeholder="Введите ваш email"
                  />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password">
                    <Lock size={18} />
                    Пароль
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${styles.inputField} ${errors.password ? styles.inputError : ''}`}
                    placeholder="Введите ваш пароль"
                  />
                  {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                </div>

                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  <LogIn size={18} />
                  {isLoading ? 'Вход...' : 'Войти в аккаунт'}
                </button>
              </form>

              <div className={styles.authPrompt}>
                <p>Нет аккаунта? <Link href="/auth/register">Зарегистрироваться</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 