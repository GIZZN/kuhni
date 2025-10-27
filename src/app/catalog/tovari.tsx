'use client';

import React, { useState, useMemo, useEffect } from 'react';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, ChevronDown } from 'lucide-react';

// Data and types
import { productsData, categoryNames, getCategoryBySlug } from '@/app/data/products';
import type { PriceRange, SortOption } from './types';
import type { Product } from '@/app/types';

export default function Tovari() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { addToCart, items } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const searchParams = useSearchParams();

  // Получаем поисковый запрос и категорию из URL
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (search) {
      setSearchQuery(search);
    }
    
    if (category) {
      const categoryName = getCategoryBySlug(category);
      if (categoryName && categoryNames.includes(categoryName)) {
        setSelectedCategory(categoryName);
      }
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = [...productsData];

    // Фильтр по поисковому запросу
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по категории
    if (selectedCategory !== 'Все') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Фильтр по цене
    if (priceRange.min !== '') {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    }
    if (priceRange.max !== '') {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }

    switch (sortBy) {
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, priceRange, sortBy, searchQuery]);

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'priceAsc', label: 'По возрастанию цены' },
    { value: 'priceDesc', label: 'По убыванию цены' },
    { value: 'nameAsc', label: 'По названию А-Я' }
  ];

  const handleSortSelect = (value: SortOption) => {
    setSortBy(value);
    setIsDropdownOpen(false);
  };

  const getCurrentSortLabel = () => {
    return sortOptions.find(option => option.value === sortBy)?.label || 'По популярности';
  };

  return (
    <div className={styles.container}>
      {/* Верхняя панель с фильтрами */}
      <div className={styles.topPanel}>
        <div className={styles.topPanelContent}>
          <div className={styles.catalogTitle}>
            <h1>Каталог кухонь</h1>
          </div>
          
          <div className={styles.filtersRow}>
            {/* Категории */}
            <div className={styles.categoriesFilter}>
              {categoryNames.map((category) => (
                <button 
                  key={category}
                  className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Фильтр по цене */}
            <div className={styles.priceFilter}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Цена:</span>
              <div className={styles.priceInputs}>
                <input 
                  type="number" 
                  placeholder="От" 
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                />
              </div>
            </div>
            
            {/* Сортировка */}
            <div className={styles.sorting}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Сортировка:</span>
              <div className={styles.customDropdown}>
                <button 
                  className={styles.dropdownButton}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{getCurrentSortLabel()}</span>
                  <ChevronDown 
                    size={16} 
                    className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconOpen : ''}`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`${styles.dropdownItem} ${sortBy === option.value ? styles.dropdownItemActive : ''}`}
                        onClick={() => handleSortSelect(option.value as SortOption)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className={styles.content}>
        {/* Информация о результатах */}
        {(searchQuery || selectedCategory !== 'Все') && (
          <div className={styles.resultsInfo}>
            {searchQuery && (
              <div className={styles.searchInfo}>
                Результаты поиска: <span className={styles.searchTerm}>{searchQuery}</span>
                <span className={styles.resultsCount}>({filteredProducts.length})</span>
              </div>
            )}
            {selectedCategory !== 'Все' && !searchQuery && (
              <div className={styles.categoryInfo}>
                Категория: <span className={styles.categoryTerm}>{selectedCategory}</span>
                <span className={styles.resultsCount}>({filteredProducts.length})</span>
              </div>
            )}
          </div>
        )}

        {/* Ультра-уникальная плавающая сетка продуктов */}
        <div className={styles.productGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const quantity = items.find(item => String(item.id) === String(product.id))?.quantity || 0;
              return (
                <div 
                  key={product.id} 
                  className={styles.productCard}
                >
                  <div className={styles.productImage}>
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      width={400}
                      height={300}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productContent}>
                      <h3>{product.name}</h3>
                      <p className={styles.category}>{product.category}</p>
                      
                      <div className={styles.productRating}>
                        <div className={styles.ratingStars}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i}
                              size={16}
                              fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <span className={styles.ratingText}>
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                      
                      {quantity > 0 && (
                        <div className={styles.quantityIndicator}>
                          В корзине: {quantity}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.productActions}>
                      <div className={styles.priceContainer}>
                        <p className={styles.price}>{product.price.toLocaleString()} ₽</p>
                      </div>
                      <div className={styles.buttonsContainer}>
                        <button 
                          className={styles.addToCart}
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart size={18} />
                          {quantity > 0 ? 'Добавить ещё' : 'В корзину'}
                        </button>
                        <button 
                          className={`${styles.favoriteButton} ${isFavorite(product.id) ? styles.favoriteActive : ''}`}
                          onClick={() => handleToggleFavorite(product)}
                          title={isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                        >
                          <Heart size={20} fill={isFavorite(product.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noProducts}>
              <div>Товары не найдены</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#9ca3af' }}>
                Попробуйте изменить фильтры
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 