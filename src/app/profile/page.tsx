'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import CachedAvatar from '@/components/CachedAvatar/CachedAvatar';
import { User, Mail, Phone, Package, ShoppingBag, CheckCircle, Clock, Truck, Star, Award, Calendar, TrendingUp, Gift, MapPin, CreditCard, Camera, Trash2, Plus } from 'lucide-react';

// Types
import type { Order, FormData, TabType } from './types';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: ''
  });
  const { user, isAuthenticated, updateProfile, uploadAvatar, deleteAvatar, loading } = useAuth();
  const router = useRouter();
  
  // Состояния для аватара
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  
  // Состояния для реальных данных
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalFavorites: 0,
    rating: 4.5,
    bonusPoints: 0,
    status: 'VIP',
    registrationYear: new Date().getFullYear()
  });
  const [activities, setActivities] = useState<Array<{
    type: string;
    title: string;
    date: string;
    amount?: number;
  }>>([]);
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    name: string;
    price: number;
  }>>([]);
  const [userAddress, setUserAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    contactPerson: ''
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Состояния для редактирования адреса
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    postalCode: ''
  });
  const [addressUpdating, setAddressUpdating] = useState(false);
  const [addressError, setAddressError] = useState('');
  
  // Состояния для способов оплаты
  const [paymentMethods, setPaymentMethods] = useState<Array<{
    id: string;
    type: string;
    cardNumber?: string;
    cardHolder?: string;
    cardExpiry?: string;
    isDefault: boolean;
  }>>([]);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: 'card',
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    isDefault: false
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  // Проверяем URL параметры для переключения вкладок
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['profile', 'orders'].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user, router, loading]);

  // Загрузка заказов при переключении на вкладку заказов
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      loadOrders();
    }
  }, [activeTab, isAuthenticated]);

  // Функция для загрузки статистики пользователя
  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        // Безопасная обработка данных с проверками типов
        setUserStats({
          totalOrders: Number(data.stats?.totalOrders) || 0,
          totalSpent: Number(data.stats?.totalSpent) || 0,
          totalFavorites: Number(data.stats?.totalFavorites) || 0,
          rating: Number(data.stats?.rating) || 4.5,
          bonusPoints: Number(data.stats?.bonusPoints) || 0,
          status: data.stats?.status || 'VIP',
          registrationYear: Number(data.stats?.registrationYear) || new Date().getFullYear()
        });
        setActivities(data.activities || []);
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Функция для загрузки адреса пользователя
  const loadUserAddress = async () => {
    try {
      const response = await fetch('/api/user/address');
      if (response.ok) {
        const data = await response.json();
        setUserAddress(data.address);
        // Заполняем форму текущими данными
        setAddressForm({
          street: data.address.street || '',
          city: data.address.city || '',
          postalCode: data.address.postalCode || ''
        });
      }
    } catch (error) {
      console.error('Error loading user address:', error);
    }
  };

  // Функция для загрузки способов оплаты
  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/user/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  // Загружаем данные при авторизации
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserStats();
      loadUserAddress();
      loadPaymentMethods();
    }
  }, [isAuthenticated, user]);

  // Функция для начала редактирования адреса
  const startEditingAddress = () => {
    setIsEditingAddress(true);
    setAddressError('');
  };

  // Функция для отмены редактирования адреса
  const cancelEditingAddress = () => {
    setIsEditingAddress(false);
    setAddressError('');
    // Восстанавливаем исходные данные
    setAddressForm({
      street: userAddress.street || '',
      city: userAddress.city || '',
      postalCode: userAddress.postalCode || ''
    });
  };

  // Функция для сохранения адреса
  const saveAddress = async () => {
    if (!addressForm.street.trim() || !addressForm.city.trim()) {
      setAddressError('Адрес и город обязательны для заполнения');
      return;
    }

    setAddressUpdating(true);
    setAddressError('');

    try {
      const response = await fetch('/api/user/address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street: addressForm.street.trim(),
          city: addressForm.city.trim(),
          postalCode: addressForm.postalCode.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserAddress(data.address);
        setIsEditingAddress(false);
        setUpdateMessage('Адрес успешно обновлен');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setAddressError(data.error || 'Ошибка обновления адреса');
      }
    } catch (error) {
      console.error('Address update error:', error);
      setAddressError('Ошибка соединения с сервером');
    } finally {
      setAddressUpdating(false);
    }
  };

  // Обработчик изменения полей адреса
  const handleAddressChange = (field: keyof typeof addressForm, value: string) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Функции для управления способами оплаты
  const startAddingPayment = () => {
    setIsAddingPayment(true);
    setPaymentError('');
    setPaymentForm({
      type: 'card',
      cardNumber: '',
      cardHolder: '',
      cardExpiry: '',
      isDefault: paymentMethods.length === 0 // Первый способ автоматически по умолчанию
    });
  };

  const cancelAddingPayment = () => {
    setIsAddingPayment(false);
    setPaymentError('');
  };

  const handlePaymentChange = (field: keyof typeof paymentForm, value: string | boolean) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPaymentMethod = async () => {
    if (paymentForm.type === 'card') {
      if (!paymentForm.cardNumber.trim() || !paymentForm.cardHolder.trim() || !paymentForm.cardExpiry.trim()) {
        setPaymentError('Все поля карты обязательны для заполнения');
        return;
      }
    }

    setPaymentLoading(true);
    setPaymentError('');

    try {
      const response = await fetch('/api/user/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: paymentForm.type,
          cardNumber: paymentForm.cardNumber,
          cardHolder: paymentForm.cardHolder,
          cardExpiry: paymentForm.cardExpiry,
          isDefault: paymentForm.isDefault
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await loadPaymentMethods(); // Перезагружаем список
        setIsAddingPayment(false);
        setUpdateMessage('Способ оплаты успешно добавлен');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setPaymentError(data.error || 'Ошибка добавления способа оплаты');
      }
    } catch (error) {
      console.error('Payment method add error:', error);
      setPaymentError('Ошибка соединения с сервером');
    } finally {
      setPaymentLoading(false);
    }
  };

  const deletePaymentMethod = async (methodId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот способ оплаты?')) {
      return;
    }

    try {
      const response = await fetch(`/api/user/payment-methods?id=${methodId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadPaymentMethods(); // Перезагружаем список
        setUpdateMessage('Способ оплаты успешно удален');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        const data = await response.json();
        setPaymentError(data.error || 'Ошибка удаления способа оплаты');
      }
    } catch (error) {
      console.error('Payment method delete error:', error);
      setPaymentError('Ошибка соединения с сервером');
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await fetch('/api/user/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        console.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');
    setUpdateError('');
    
    try {
      const result = await updateProfile(formData.name, formData.phone);
      
      if (result.success) {
        setUpdateMessage('Профиль успешно обновлен');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateError(result.error || 'Ошибка обновления профиля');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setUpdateError('Ошибка соединения с сервером');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setAvatarError('');

    try {
      const result = await uploadAvatar(file);
      
      if (result.success) {
        setUpdateMessage('Аватар успешно загружен');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setAvatarError(result.error || 'Ошибка загрузки аватара');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setAvatarError('Ошибка соединения с сервером');
    } finally {
      setAvatarUploading(false);
      // Очищаем input
      e.target.value = '';
    }
  };

  const handleAvatarDelete = async () => {
    setAvatarUploading(true);
    setAvatarError('');

    try {
      const result = await deleteAvatar();
      
      if (result.success) {
        setUpdateMessage('Аватар успешно удален');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setAvatarError(result.error || 'Ошибка удаления аватара');
      }
    } catch (error) {
      console.error('Avatar delete error:', error);
      setAvatarError('Ошибка соединения с сервером');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.topPanel}>
          <div className={styles.topPanelContent}>
            <div className={styles.header}>
              <h1>Профиль</h1>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.loading}>
            Загрузка профиля...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'доставлен':
        return <CheckCircle size={16} />;
      case 'в_пути':
        return <Truck size={16} />;
      case 'обработка':
        return <Clock size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'доставлен':
        return 'Доставлен';
      case 'в_пути':
        return 'В пути';
      case 'обработка':
        return 'Обработка';
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.topPanel}>
        <div className={styles.topPanelContent}>
          <div className={styles.header}>
            <h1>Профиль</h1>
          </div>
          <div className={styles.userInfo}>
                  <div className={styles.avatarSection}>
                    <div className={styles.avatar}>
                      <CachedAvatar
                        src={user.avatar}
                        alt="Аватар пользователя"
                        width={80}
                        height={80}
                        className={styles.avatarImage}
                        fallbackIcon={<User size={24} />}
                      />
                    </div>
              <div className={styles.avatarControls}>
                <label htmlFor="avatar-upload" className={styles.avatarUploadButton}>
                  <Camera size={16} />
                  {avatarUploading ? 'Загрузка...' : 'Изменить'}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                  className={styles.avatarInput}
                />
                {user.avatar && (
                  <button
                    onClick={handleAvatarDelete}
                    disabled={avatarUploading}
                    className={styles.avatarDeleteButton}
                  >
                    <Trash2 size={16} />
                    Удалить
                  </button>
                )}
              </div>
            </div>
            <div className={styles.userDetails}>
              <h2>{user.name || 'Пользователь'}</h2>
              <p>{user.email}</p>
              {avatarError && (
                <p className={styles.avatarError}>{avatarError}</p>
              )}
            </div>
          </div>
          <div className={styles.userStats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <ShoppingBag size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {statsLoading ? '...' : (userStats.totalOrders || 0)}
                </span>
                <span className={styles.statLabel}>Заказов</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Star size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {statsLoading ? '...' : (userStats.rating || 0).toFixed(1)}
                </span>
                <span className={styles.statLabel}>Рейтинг</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Award size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {statsLoading ? '...' : (userStats.status || 'use')}
                </span>
                <span className={styles.statLabel}>Статус</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Calendar size={20} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {statsLoading ? '...' : (userStats.registrationYear || new Date().getFullYear())}
                </span>
                <span className={styles.statLabel}>С нами</span>
              </div>
            </div>
          </div>

          <div className={styles.navigation}>
            <button
              className={`${styles.navButton} ${activeTab === 'profile' ? styles.navButtonActive : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              Личные данные
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'orders' ? styles.navButtonActive : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} />
              Заказы
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {updateMessage && (
          <div className={styles.successMessage}>
            <CheckCircle size={20} />
            {updateMessage}
          </div>
        )}

        {updateError && (
          <div className={styles.errorMessage}>
            {updateError}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className={styles.profileLayout}>
            <div className={styles.mainProfileSection}>
              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>
                  <User size={20} />
                  Личная информация
                </h3>
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>
                        <User size={18} />
                        Имя
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        placeholder="Введите ваше имя"
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>
                        <Mail size={18} />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        placeholder="Введите ваш email"
                        disabled
                      />
                      <span className={styles.inputNote}>Email нельзя изменить</span>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>
                        <Phone size={18} />
                        Телефон
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        placeholder="Введите ваш телефон"
                      />
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.saveButton}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                  </div>
                </form>
              </div>

              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>
                  <MapPin size={20} />
                  Адрес доставки
                </h3>
                <div className={styles.addressCard}>
                  {!isEditingAddress ? (
                    <>
                      <div className={styles.addressInfo}>
                        {userAddress.street ? (
                          <>
                            <p><strong>{userAddress.street}</strong></p>
                            <p>{userAddress.city} {userAddress.postalCode}</p>
                            <p>Контактное лицо: {userAddress.contactPerson || user.name || 'Не указано'}</p>
                          </>
                        ) : (
                          <p className={styles.emptyAddress}>
                            <strong>Адрес доставки не указан</strong><br />
                            <span>Добавьте адрес для удобного оформления заказов</span>
                          </p>
                        )}
                      </div>
                      <button 
                        className={styles.editAddressButton}
                        onClick={startEditingAddress}
                      >
                        {userAddress.street ? 'Изменить адрес' : 'Добавить адрес'}
                      </button>
                    </>
                  ) : (
                    <div className={styles.addressEditForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="street">Адрес *</label>
                        <input
                          id="street"
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => handleAddressChange('street', e.target.value)}
                          placeholder="Улица, дом, квартира"
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="city">Город *</label>
                          <input
                            id="city"
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            placeholder="Город"
                            className={styles.formInput}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="postalCode">Индекс</label>
                          <input
                            id="postalCode"
                            type="text"
                            value={addressForm.postalCode}
                            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                            placeholder="123456"
                            className={styles.formInput}
                          />
                        </div>
                      </div>
                      {addressError && (
                        <p className={styles.addressError}>{addressError}</p>
                      )}
                      <div className={styles.formActions}>
                        <button
                          onClick={saveAddress}
                          disabled={addressUpdating}
                          className={styles.saveAddressButton}
                        >
                          {addressUpdating ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                          onClick={cancelEditingAddress}
                          disabled={addressUpdating}
                          className={styles.cancelAddressButton}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>
                  <CreditCard size={20} />
                  Способы оплаты
                </h3>
                <div className={styles.paymentMethods}>
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <div key={method.id} className={styles.paymentCard}>
                        <div className={styles.paymentIcon}>
                          <CreditCard size={24} />
                        </div>
                        <div className={styles.paymentInfo}>
                          {method.type === 'card' ? (
                            <>
                              <p><strong>Карта {method.cardNumber}</strong></p>
                              <p>Действует до {method.cardExpiry}</p>
                              <p>{method.cardHolder}</p>
                            </>
                          ) : method.type === 'cash' ? (
                            <p><strong>Наличные при получении</strong></p>
                          ) : (
                            <p><strong>Онлайн оплата</strong></p>
                          )}
                        </div>
                        <div className={styles.paymentActions}>
                          {method.isDefault && (
                            <span className={styles.defaultBadge}>Основной</span>
                          )}
                          <button
                            onClick={() => deletePaymentMethod(method.id)}
                            className={styles.deletePaymentButton}
                            title="Удалить способ оплаты"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyPayments}>
                      <strong>Способы оплаты не добавлены</strong><br />
                      <span>Добавьте способ оплаты для оформления заказов</span>
                    </p>
                  )}
                  
                  {!isAddingPayment ? (
                    <button 
                      className={styles.addPaymentButton}
                      onClick={startAddingPayment}
                    >
                      <Plus size={16} />
                      Добавить способ оплаты
                    </button>
                  ) : (
                    <div className={styles.paymentForm}>
                      <div className={styles.formGroup}>
                        <label>Тип оплаты</label>
                        <select
                          value={paymentForm.type}
                          onChange={(e) => handlePaymentChange('type', e.target.value)}
                          className={styles.formInput}
                        >
                          <option value="card">Банковская карта</option>
                          <option value="cash">Наличные при получении</option>
                          <option value="online">Онлайн оплата</option>
                        </select>
                      </div>
                      
                      {paymentForm.type === 'card' && (
                        <>
                          <div className={styles.formGroup}>
                            <label htmlFor="cardNumber">Номер карты *</label>
                            <input
                              id="cardNumber"
                              type="text"
                              value={paymentForm.cardNumber}
                              onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className={styles.formInput}
                            />
                          </div>
                          <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                              <label htmlFor="cardHolder">Держатель карты *</label>
                              <input
                                id="cardHolder"
                                type="text"
                                value={paymentForm.cardHolder}
                                onChange={(e) => handlePaymentChange('cardHolder', e.target.value)}
                                placeholder="IVAN PETROV"
                                className={styles.formInput}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label htmlFor="cardExpiry">Срок действия *</label>
                              <input
                                id="cardExpiry"
                                type="text"
                                value={paymentForm.cardExpiry}
                                onChange={(e) => handlePaymentChange('cardExpiry', e.target.value)}
                                placeholder="12/2028"
                                maxLength={7}
                                className={styles.formInput}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className={styles.formGroup}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={paymentForm.isDefault}
                            onChange={(e) => handlePaymentChange('isDefault', e.target.checked)}
                          />
                          Сделать основным способом оплаты
                        </label>
                      </div>
                      
                      {paymentError && (
                        <p className={styles.paymentError}>{paymentError}</p>
                      )}
                      
                      <div className={styles.formActions}>
                        <button
                          onClick={addPaymentMethod}
                          disabled={paymentLoading}
                          className={styles.saveAddressButton}
                        >
                          {paymentLoading ? 'Добавление...' : 'Добавить'}
                        </button>
                        <button
                          onClick={cancelAddingPayment}
                          disabled={paymentLoading}
                          className={styles.cancelAddressButton}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.sidebar}>
              <div className={styles.sidebarSection}>
                <h3 className={styles.sectionTitle}>
                  <TrendingUp size={20} />
                  Активность
                </h3>
                <div className={styles.activityList}>
                  {statsLoading ? (
                    <div className={styles.activityItem}>
                      <div className={styles.activityContent}>
                        <p>Загрузка активности...</p>
                      </div>
                    </div>
                  ) : activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <div key={index} className={styles.activityItem}>
                        <div className={styles.activityIcon}>
                          <ShoppingBag size={16} />
                        </div>
                        <div className={styles.activityContent}>
                          <p>{activity.title}</p>
                          <span>{new Date(activity.date).toLocaleDateString('ru-RU')}</span>
                          {activity.amount && (
                            <span className={styles.activityAmount}>
                              ₽{activity.amount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.activityItem}>
                      <div className={styles.activityContent}>
                        <p>Пока нет активности</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.sidebarSection}>
                <h3 className={styles.sectionTitle}>
                  <Gift size={20} />
                  Бонусы и скидки
                </h3>
                <div className={styles.bonusCard}>
                  <div className={styles.bonusInfo}>
                    <p><strong>
                      {statsLoading ? '...' : `${(userStats.bonusPoints || 0).toLocaleString()} бонусов`}
                    </strong></p>
                    <p>Доступно к списанию</p>
                  </div>
                  <div className={styles.bonusProgress}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{
                        width: statsLoading ? '0%' : `${Math.min(((userStats.bonusPoints || 0) % 2000) / 2000 * 100, 100)}%`
                      }}></div>
                    </div>
                    <p>До следующего уровня: {statsLoading ? '...' : (2000 - ((userStats.bonusPoints || 0) % 2000))} бонусов</p>
                  </div>
                </div>
              </div>

              <div className={styles.sidebarSection}>
                <h3 className={styles.sectionTitle}>
                  <Star size={20} />
                  Рекомендации
                </h3>
                <div className={styles.recommendationsList}>
                  {statsLoading ? (
                    <div className={styles.recommendationItem}>
                      <div className={styles.recommendationContent}>
                        <p>Загрузка рекомендаций...</p>
                      </div>
                    </div>
                  ) : recommendations.length > 0 ? (
                    recommendations.map((item, index) => (
                      <div key={index} className={styles.recommendationItem}>
                        <div className={styles.recommendationImage}>
                          <Package size={24} />
                        </div>
                        <div className={styles.recommendationContent}>
                          <p><strong>{item.name}</strong></p>
                          <p>{item.price.toLocaleString()} ₽</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.recommendationItem}>
                      <div className={styles.recommendationContent}>
                        <p>Нет рекомендаций</p>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  className={styles.viewAllButton}
                  onClick={() => router.push('/catalog')}
                >
                  Смотреть все
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.ordersSection}>
            {ordersLoading ? (
              <div className={styles.loading}>
                Загрузка заказов...
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <Package size={40} />
                </div>
                <h3>Заказов пока нет</h3>
                <p>Вы еще не сделали ни одного заказа. Перейдите в каталог и выберите понравившиеся товары.</p>
                <a href="/catalog" className={styles.catalogButton}>
                  <ShoppingBag size={18} />
                  Перейти в каталог
                </a>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderMeta}>
                        <h3>Заказ #{order.id}</h3>
                        <p className={styles.orderDate}>
                          {new Date(order.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className={`${styles.statusBadge} ${styles[order.status]}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                    </div>

                    <div className={styles.orderItems}>
                      {order.items.map((item, index) => (
                        <div key={index} className={styles.orderItem}>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemQuantity}>×{item.quantity}</span>
                          <span className={styles.itemPrice}>{item.price.toLocaleString()} ₽</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderFooter}>
                      <div className={styles.orderTotal}>
                        <span>Итого: {order.total.toLocaleString()} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 