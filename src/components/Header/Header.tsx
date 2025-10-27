'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { productsData } from '@/app/data/products';
import CachedAvatar from '@/components/CachedAvatar/CachedAvatar';
import { 
  ChefHat,
  Search,
  X,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Menu
} from 'lucide-react';

const Header = () => {
  const { totalItems } = useCart();
  const { totalItems: favoritesCount } = useFavorites();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  // Состояние поиска
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof productsData>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Состояние мобильного меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('');
    setIsMobileMenuOpen(false);
  };

  // Функции для мобильного меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Поиск товаров
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = productsData.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
    setShowResults(true);
  };

  // Обработка отправки формы поиска
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 0) {
      setShowResults(false);
      setIsSearchFocused(false);
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Обработка клика на результат поиска
  const handleResultClick = (product: typeof productsData[0]) => {
    setSearchQuery('');
    setShowResults(false);
    setIsSearchFocused(false);
    router.push(`/catalog?search=${encodeURIComponent(product.name)}`);
  };

  // Закрытие результатов при клике вне поиска и мобильного меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsSearchFocused(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowResults(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
          >
            <Menu size={24} />
          </button>
          
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <div className={styles.logoIcon}>
                <ChefHat size={24} />
              </div>
              <h1>ПрофКухня</h1>  
            </Link>
          </div>
          
          <nav className={styles.navigation}>
            <Link href="/catalog" className={styles.navLink}>Каталог кухонь</Link>
          </nav>
        </div>

        <div className={styles.centerSection}>
          <div className={styles.search} ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="Поиск кухонь и техники..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  setIsSearchFocused(true);
                  if (searchQuery.length >= 2 && searchResults.length > 0) {
                    setShowResults(true);
                  }
                }}
                onBlur={() => {
                  // Небольшая задержка чтобы клик по результату успел сработать
                  setTimeout(() => {
                    setIsSearchFocused(false);
                    setShowResults(false);
                  }, 150);
                }}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className={styles.clearButton}
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowResults(false);
                  }}
                >
                  <X size={14} />
                </button>
              )}
              <button type="submit" className={styles.searchButton}>
                <Search size={16} />
              </button>
            </form>

            {/* Результаты поиска */}
            {showResults && isSearchFocused && searchQuery.length >= 2 && (
              <div className={styles.searchResults}>
                {searchResults.length > 0 ? (
                  <>
                    <div className={styles.resultsHeader}>
                      <span>Найдено товаров: {searchResults.length}</span>
                    </div>
                    {searchResults.slice(0, 5).map((product) => (
                      <div 
                        key={product.id} 
                        className={styles.searchResultItem}
                        onClick={() => handleResultClick(product)}
                      >
                        <div className={styles.resultImage}>
                               <Image 
                                 src={product.image} 
                                 alt={product.name}
                                 width={55}
                                 height={55}
                                 style={{ objectFit: 'contain' }}
                               />
                        </div>
                        <div className={styles.resultInfo}>
                          <div className={styles.resultName}>{product.name}</div>
                          <div className={styles.resultCategory}>{product.category}</div>
                        </div>
                        <div className={styles.resultPrice}>
                          {product.price.toLocaleString()} ₽
                        </div>
                      </div>
                    ))}
                    {searchResults.length > 5 && (
                      <div className={styles.showAllResults}>
                        <button onClick={() => handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent)}>
                          Показать все результаты ({searchResults.length})
                        </button>
                      </div>
                    )}
                  </>
                ) : searchQuery.length >= 2 ? (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>
                      <Search size={24} />
                    </div>
                    <div className={styles.noResultsText}>
                      Товары не найдены
                    </div>
                    <div className={styles.noResultsSubtext}>
                      Попробуйте изменить запрос
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.userActions}>
            <Link href="/favorites" className={styles.iconButton}>
              <div className={styles.iconWrapper}>
                <Heart size={18} />
                {favoritesCount > 0 && <span className={styles.badge}>{favoritesCount}</span>}
              </div>
              <span className={styles.buttonLabel}>Избранное</span>
            </Link>

            <Link href="/cart" className={styles.iconButton}>
              <div className={styles.iconWrapper}>
                <ShoppingCart size={18} />
                {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
              </div>
              <span className={styles.buttonLabel}>Корзина</span>
            </Link>

            <div className={styles.divider}></div>

            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <Link href="/profile" className={styles.userButton}>
                  <div className={styles.avatar}>
                    <CachedAvatar
                      src={user?.avatar}
                      alt="Аватар пользователя"
                      width={32}
                      height={32}
                      className={styles.avatarImage}
                      fallbackIcon={<User size={20} />}
                      priority
                    />
                  </div>
                  <span className={styles.userName}>{user?.name}</span>
                </Link>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className={styles.loginButton}>
                <LogIn size={20} />
                <span>Войти</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}></div>
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileMenuHeader}>
              <h3>Меню</h3>
              <button 
                className={styles.mobileMenuClose}
                onClick={closeMobileMenu}
                aria-label="Закрыть меню"
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.mobileMenuBody}>
              {/* Поиск в мобильном меню */}
              <div className={styles.mobileSearch}>
                <form onSubmit={(e) => { handleSearchSubmit(e); closeMobileMenu(); }}>
                  <input 
                    type="text" 
                    placeholder="Поиск кухонь и техники..." 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={styles.mobileSearchInput}
                  />
                  <button type="submit" className={styles.mobileSearchButton}>
                    <Search size={20} />
                  </button>
                </form>
              </div>

              {/* Навигация */}
              <nav className={styles.mobileNavigation}>
                <Link 
                  href="/catalog" 
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  <ChefHat size={20} />
                  Каталог кухонь
                </Link>
                <Link 
                  href="/consultation" 
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  <User size={20} />
                  Консультация
                </Link>
                <Link 
                  href="/favorites" 
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  <Heart size={20} />
                  Избранное
                  {favoritesCount > 0 && <span className={styles.mobileNavBadge}>{favoritesCount}</span>}
                </Link>
                <Link 
                  href="/cart" 
                  className={styles.mobileNavLink}
                  onClick={closeMobileMenu}
                >
                  <ShoppingCart size={20} />
                  Корзина
                  {totalItems > 0 && <span className={styles.mobileNavBadge}>{totalItems}</span>}
                </Link>
              </nav>

              {/* Пользователь */}
              <div className={styles.mobileUser}>
                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/profile" 
                      className={styles.mobileUserProfile}
                      onClick={closeMobileMenu}
                    >
                      <div className={styles.mobileAvatar}>
                        <CachedAvatar
                          src={user?.avatar}
                          alt="Аватар пользователя"
                          width={40}
                          height={40}
                          className={styles.mobileAvatarImage}
                          fallbackIcon={<User size={20} />}
                        />
                      </div>
                      <div className={styles.mobileUserInfo}>
                        <span className={styles.mobileUserName}>{user?.name}</span>
                        <span className={styles.mobileUserEmail}>{user?.email}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className={styles.mobileLogoutButton}
                    >
                      <LogOut size={20} />
                      Выйти
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/auth/login" 
                    className={styles.mobileLoginButton}
                    onClick={closeMobileMenu}
                  >
                    <LogIn size={20} />
                    Войти в аккаунт
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 