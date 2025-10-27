'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface FavoriteItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_category: string;
  created_at: string;
}

interface FavoritesContextType {
  items: FavoriteItem[];
  loading: boolean;
  addToFavorites: (product: { id: string | number; name: string; price: number; image: string; category: string }) => Promise<void>;
  removeFromFavorites: (productId: string | number) => Promise<void>;
  isFavorite: (productId: string | number) => boolean;
  totalItems: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Утилиты для работы с localStorage
const FAVORITES_STORAGE_KEY = 'akvaproffi_favorites';

const saveToLocalStorage = (items: FavoriteItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }
};

const loadFromLocalStorage = (): FavoriteItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  }
  return [];
};

const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing favorites from localStorage:', error);
    }
  }
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Синхронизация локального избранного с сервером при авторизации
  const loadFavoritesAndSync = useCallback(async () => {
    try {
      setLoading(true);
      
      // Загружаем избранное из БД
      const response = await fetch('/api/favorites');
      let serverItems: FavoriteItem[] = [];
      
      if (response.ok) {
        const data = await response.json();
        serverItems = data.favorites || [];
      }

      // Загружаем локальное избранное
      const localItems = loadFromLocalStorage();

      if (localItems.length > 0) {
        // Есть локальные товары - синхронизируем с сервером
        await syncLocalFavoritesToServer(localItems);
        
        // Очищаем localStorage после синхронизации
        clearLocalStorage();
        
        // Перезагружаем избранное с сервера
        const syncResponse = await fetch('/api/favorites');
        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          setItems(syncData.favorites || []);
        } else {
          setItems(serverItems);
        }
      } else {
        // Нет локальных товаров - используем серверное избранное
        setItems(serverItems);
      }
    } catch (error) {
      console.error('Error loading and syncing favorites:', error);
      // В случае ошибки загружаем локальное избранное
      const localItems = loadFromLocalStorage();
      setItems(localItems);
    } finally {
      setLoading(false);
    }
  }, []);

  // Загрузка избранного при инициализации и изменении авторизации
  useEffect(() => {
    if (isAuthenticated) {
      // Пользователь авторизован - загружаем из БД и синхронизируем с localStorage
      loadFavoritesAndSync();
    } else {
      // Пользователь не авторизован - загружаем из localStorage
      const localItems = loadFromLocalStorage();
      setItems(localItems);
    }
  }, [isAuthenticated, loadFavoritesAndSync]);


  // Синхронизация локального избранного с сервером
  const syncLocalFavoritesToServer = async (localItems: FavoriteItem[]) => {
    try {
      for (const item of localItems) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.product_id,
            name: item.product_name,
            price: item.product_price,
            image: item.product_image,
            category: item.product_category
          }),
        });
      }
    } catch (error) {
      console.error('Error syncing local favorites to server:', error);
    }
  };

  const isFavorite = useCallback((productId: string | number): boolean => {
    return items.some(item => item.product_id === String(productId));
  }, [items]);

  const addToFavorites = useCallback(async (product: { id: string | number; name: string; price: number; image: string; category: string }) => {
    const productId = String(product.id);
    
    // Проверяем, не добавлен ли уже товар
    if (isFavorite(productId)) return;
    
    try {
      if (isAuthenticated) {
        // Авторизованный пользователь - работаем с сервером
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category
          }),
        });

        if (response.ok) {
          // Обновляем состояние локально
          const newItem: FavoriteItem = {
            id: `server-${Date.now()}-${productId}`,
            product_id: productId,
            product_name: product.name,
            product_price: product.price,
            product_image: product.image,
            product_category: product.category,
            created_at: new Date().toISOString()
          };
          
          setItems(prevItems => [...prevItems, newItem]);
        } else {
          console.error('Failed to add to favorites');
        }
      } else {
        // Неавторизованный пользователь - работаем с localStorage
        const newItem: FavoriteItem = {
          id: `local-${Date.now()}-${productId}`,
          product_id: productId,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image,
          product_category: product.category,
          created_at: new Date().toISOString()
        };
        
        const newItems = [...items, newItem];
        setItems(newItems);
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }, [isAuthenticated, items, isFavorite]);

  const removeFromFavorites = useCallback(async (productId: string | number) => {
    const productIdStr = String(productId);
    
    try {
      if (isAuthenticated) {
        // Авторизованный пользователь - работаем с сервером
        const response = await fetch(`/api/favorites?productId=${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Обновляем состояние локально
          setItems(prevItems => prevItems.filter(item => item.product_id !== productIdStr));
        } else {
          console.error('Failed to remove from favorites');
        }
      } else {
        // Неавторизованный пользователь - работаем с localStorage
        const newItems = items.filter(item => item.product_id !== productIdStr);
        setItems(newItems);
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }, [isAuthenticated, items]);

  const totalItems = items.length;

  return (
    <FavoritesContext.Provider
      value={{
        items,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        totalItems
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}