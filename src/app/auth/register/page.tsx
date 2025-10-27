'use client';

import React, { useState } from 'react';
import styles from '../login/page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { ChefHat, User, Mail, Lock, UserPlus } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    if (!formData.name) {
      newErrors.name = 'Имя обязательно';
      isValid = false;
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
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
        const result = await register(formData.name, formData.email, formData.password);
        
        if (result.success) {
          router.push('/profile');
        } else {
          setApiError(result.error || 'Ошибка регистрации');
        }
      } catch (error) {
        console.error('Registration error:', error);
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
              <h2>Регистрация</h2>
              
              {apiError && (
                <div className={styles.errorMessage}>
                  {apiError}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">
                    <User size={18} />
                    Имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${styles.inputField} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Введите ваше имя"
                  />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>

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
                    placeholder="Введите пароль"
                  />
                  {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">
                    <Lock size={18} />
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${styles.inputField} ${errors.confirmPassword ? styles.inputError : ''}`}
                    placeholder="Повторите пароль"
                  />
                  {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  <UserPlus size={18} />
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </form>

              <div className={styles.authPrompt}>
                <p>Уже есть аккаунт? <Link href="/auth/login">Войти</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 