import { useState, useEffect, useCallback } from 'react';

interface ImageCacheEntry {
  url: string;
  blob: Blob;
  timestamp: number;
}

class ImageCache {
  private cache = new Map<string, ImageCacheEntry>();
  private readonly maxAge = 24 * 60 * 60 * 1000; // 24 часа
  private readonly maxSize = 50; // Максимум 50 изображений

  private isExpired(entry: ImageCacheEntry): boolean {
    return Date.now() - entry.timestamp > this.maxAge;
  }

  private cleanup(): void {
    // Удаляем устаревшие записи
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        URL.revokeObjectURL(entry.url);
        this.cache.delete(key);
      }
    }

    // Если кеш все еще слишком большой, удаляем самые старые записи
    if (this.cache.size > this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, entries.length - this.maxSize);
      for (const [key, entry] of toDelete) {
        URL.revokeObjectURL(entry.url);
        this.cache.delete(key);
      }
    }
  }

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry || this.isExpired(entry)) {
      if (entry) {
        URL.revokeObjectURL(entry.url);
        this.cache.delete(key);
      }
      return null;
    }
    return entry.url;
  }

  async set(key: string, dataUrl: string): Promise<string> {
    try {
      // Проверяем, есть ли уже такая запись с тем же содержимым
      const existingEntry = this.cache.get(key);
      if (existingEntry && !this.isExpired(existingEntry)) {
        return existingEntry.url;
      }

      // Конвертируем data URL в blob
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Создаем object URL
      const objectUrl = URL.createObjectURL(blob);
      
      // Удаляем старую запись если есть
      if (existingEntry) {
        URL.revokeObjectURL(existingEntry.url);
      }
      
      // Добавляем новую запись
      this.cache.set(key, {
        url: objectUrl,
        blob,
        timestamp: Date.now()
      });
      
      // Очищаем кеш
      this.cleanup();
      
      return objectUrl;
    } catch (error) {
      console.error('Error caching image:', error);
      return dataUrl; // Возвращаем оригинальный URL в случае ошибки
    }
  }

  clear(): void {
    for (const entry of this.cache.values()) {
      URL.revokeObjectURL(entry.url);
    }
    this.cache.clear();
  }

  // Принудительное обновление записи в кеше
  async forceUpdate(key: string, dataUrl: string): Promise<string> {
    // Удаляем старую запись
    const oldEntry = this.cache.get(key);
    if (oldEntry) {
      URL.revokeObjectURL(oldEntry.url);
      this.cache.delete(key);
    }
    
    // Добавляем новую
    return await this.set(key, dataUrl);
  }
}

// Глобальный экземпляр кеша
const imageCache = new ImageCache();

export const useImageCache = (dataUrl: string | null | undefined, cacheKey: string) => {
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDataUrl, setLastDataUrl] = useState<string | null>(null);

  const loadImage = useCallback(async (url: string, key: string, forceUpdate = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let objectUrl: string;
      
      if (forceUpdate) {
        // Принудительное обновление кеша
        objectUrl = await imageCache.forceUpdate(key, url);
      } else {
        // Проверяем кеш
        const cached = imageCache.get(key);
        if (cached) {
          setCachedUrl(cached);
          setIsLoading(false);
          return;
        }

        // Если не в кеше, кешируем
        objectUrl = await imageCache.set(key, url);
      }
      
      setCachedUrl(objectUrl);
    } catch (err) {
      console.error('Error loading image:', err);
      setError('Ошибка загрузки изображения');
      setCachedUrl(url); // Используем оригинальный URL как fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dataUrl && cacheKey) {
      // Сбрасываем состояние ошибки при изменении URL
      setError(null);
      
      // Проверяем, изменился ли URL (это означает обновление аватара)
      const forceUpdate = lastDataUrl !== null && lastDataUrl !== dataUrl;
      
      loadImage(dataUrl, cacheKey, forceUpdate);
      setLastDataUrl(dataUrl);
    } else {
      setCachedUrl(null);
      setIsLoading(false);
      setError(null);
      setLastDataUrl(null);
    }
  }, [dataUrl, cacheKey, loadImage, lastDataUrl]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      // Не очищаем кеш при размонтировании, так как он глобальный
    };
  }, []);

  return {
    cachedUrl,
    isLoading,
    error,
    clearCache: () => imageCache.clear()
  };
};

export default useImageCache;
