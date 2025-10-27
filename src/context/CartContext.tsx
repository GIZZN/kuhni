'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
  total_price: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: { id: string | number; name: string; price: number; image: string }) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  createOrder: () => Promise<{ success: boolean; error?: string; order?: unknown }>;    
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Утилиты для работы с localStorage
const CART_STORAGE_KEY = 'akvaproffi_cart';

const saveToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
};

const loadFromLocalStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }
  return [];
};

const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const { isAuthenticated } = useAuth();

  // Загрузка корзины при инициализации и изменении авторизации
  useEffect(() => {
    if (isAuthenticated) {
      // Пользователь авторизован - загружаем из БД и синхронизируем с localStorage
      loadCartAndSync();
    } else {
      // Пользователь не авторизован - загружаем из localStorage
      const localItems = loadFromLocalStorage();
      setItems(localItems);
    }
  }, [isAuthenticated]);

  // Синхронизация локальной корзины с сервером при авторизации
  const loadCartAndSync = async () => {
    try {
      setLoading(true);
      
      // Загружаем корзину из БД
      const response = await fetch('/api/cart');
      let serverItems: CartItem[] = [];
      
      if (response.ok) {
        const data = await response.json();
        serverItems = data.items || [];
      }

      // Загружаем локальную корзину
      const localItems = loadFromLocalStorage();

      if (localItems.length > 0) {
        // Есть локальные товары - синхронизируем с сервером
        await syncLocalCartToServer(localItems);
        
        // Очищаем localStorage после синхронизации
        clearLocalStorage();
        
        // Перезагружаем корзину с сервера
        const syncResponse = await fetch('/api/cart');
        if (syncResponse.ok) {
          const syncData = await syncResponse.json();
          setItems(syncData.items || []);
        } else {
          setItems(serverItems);
        }
      } else {
        // Нет локальных товаров - используем серверную корзину
        setItems(serverItems);
      }
    } catch (error) {
      console.error('Error loading and syncing cart:', error);
      // В случае ошибки загружаем локальную корзину
      const localItems = loadFromLocalStorage();
      setItems(localItems);
    } finally {
      setLoading(false);
    }
  };

  // Синхронизация локальной корзины с сервером
  const syncLocalCartToServer = async (localItems: CartItem[]) => {
    try {
      for (const item of localItems) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.product_id,
            name: item.product_name,
            price: item.product_price,
            image: item.product_image,
            quantity: item.quantity
          }),
        });
      }
    } catch (error) {
      console.error('Error syncing local cart to server:', error);
    }
  };

  const addToCart = useCallback(async (product: { id: string | number; name: string; price: number; image: string }) => {
    const productId = String(product.id);
    
    // Предотвращаем дублирование запросов
    if (updatingItems.has(productId)) return;
    
    try {
      setUpdatingItems(prev => new Set(prev).add(productId));
      
      if (isAuthenticated) {
        // Авторизованный пользователь - работаем с сервером
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          }),
        });

        if (response.ok) {
          // Обновляем состояние локально
          updateLocalState(productId, product, 1);
        } else {
          console.error('Failed to add to cart');
        }
      } else {
        // Неавторизованный пользователь - работаем с localStorage
        updateLocalState(productId, product, 1);
        
        // Сохраняем в localStorage
        const newItems = [...items];
        const existingItemIndex = newItems.findIndex(item => item.product_id === productId);
        
        if (existingItemIndex >= 0) {
          newItems[existingItemIndex].quantity += 1;
          newItems[existingItemIndex].total_price = newItems[existingItemIndex].quantity * newItems[existingItemIndex].product_price;
        } else {
          newItems.push({
            id: `local-${Date.now()}-${productId}`,
            product_id: productId,
            product_name: product.name,
            product_price: product.price,
            product_image: product.image,
            quantity: 1,
            total_price: product.price
          });
        }
        
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  }, [isAuthenticated, updatingItems, items]);

  const updateLocalState = (productId: string, product: { name: string; price: number; image: string }, quantityChange: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product_id === productId);
      
      if (existingItem) {
        // Если товар уже есть, увеличиваем количество
        return prevItems.map(item =>
          item.product_id === productId
            ? {
                ...item,
                quantity: item.quantity + quantityChange,
                total_price: (item.quantity + quantityChange) * item.product_price
              }
            : item
        );
      } else {
        // Если товара нет, добавляем новый
        return [
          ...prevItems,
          {
            id: `${isAuthenticated ? 'server' : 'local'}-${Date.now()}-${productId}`,
            product_id: productId,
            product_name: product.name,
            product_price: product.price,
            product_image: product.image,
            quantity: quantityChange,
            total_price: product.price * quantityChange
          }
        ];
      }
    });
  };

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity < 0) return;
    
    // Предотвращаем дублирование запросов
    if (updatingItems.has(productId)) return;
    
    try {
      setUpdatingItems(prev => new Set(prev).add(productId));
      
      if (isAuthenticated) {
        // Авторизованный пользователь - работаем с сервером
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity
          }),
        });

        if (response.ok) {
          updateQuantityLocalState(productId, quantity);
        } else {
          console.error('Failed to update quantity');
        }
      } else {
        // Неавторизованный пользователь - работаем с localStorage
        updateQuantityLocalState(productId, quantity);
        
        // Обновляем localStorage
        const newItems = items.map(item => 
          item.product_id === productId 
            ? { ...item, quantity, total_price: quantity * item.product_price }
            : item
        ).filter(item => item.quantity > 0);
        
        saveToLocalStorage(newItems);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  }, [isAuthenticated, updatingItems, items]);

  const updateQuantityLocalState = (productId: string, quantity: number) => {
    setItems(prevItems => {
      if (quantity === 0) {
        // Удаляем товар если количество 0
        return prevItems.filter(item => item.product_id !== productId);
      } else {
        // Обновляем количество и общую цену
        return prevItems.map(item =>
          item.product_id === productId
            ? {
                ...item,
                quantity,
                total_price: quantity * item.product_price
              }
            : item
        );
      }
    });
  };

  const removeFromCart = useCallback(async (productId: string) => {
    // Используем updateQuantity с количеством 0 для удаления
    await updateQuantity(productId, 0);
  }, [updateQuantity]);

  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        // Авторизованный пользователь - очищаем на сервере
        const response = await fetch('/api/cart', {
          method: 'DELETE',
        });

        if (response.ok) {
          setItems([]);
        } else {
          console.error('Failed to clear cart');
        }
      } else {
        // Неавторизованный пользователь - очищаем localStorage
        setItems([]);
        clearLocalStorage();
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [isAuthenticated]);

  const createOrder = useCallback(async () => {
    if (!isAuthenticated) {
      return { success: false, error: 'Для оформления заказа необходимо войти в аккаунт' };
    }
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setItems([]); // Очищаем корзину после успешного заказа
        clearLocalStorage(); // Очищаем и localStorage на всякий случай
        return { success: true, order: data.order };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: 'Ошибка соединения с сервером' };
    }
  }, [isAuthenticated]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        createOrder,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}