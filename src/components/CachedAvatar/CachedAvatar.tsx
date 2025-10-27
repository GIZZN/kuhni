import React, { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { useImageCache } from '@/hooks/useImageCache';

interface CachedAvatarProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackIcon?: React.ReactNode;
  priority?: boolean;
}

const CachedAvatar: React.FC<CachedAvatarProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackIcon,
  priority = false
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Создаем уникальный ключ кеша на основе содержимого изображения
  const cacheKey = src ? `avatar_${btoa(src.slice(-50)).slice(0, 20)}` : '';
  const { cachedUrl, isLoading, error } = useImageCache(src, cacheKey);

  // Сбрасываем ошибку изображения при изменении src
  React.useEffect(() => {
    setImageError(false);
  }, [src]);

  // Если нет изображения, показываем fallback
  if (!src) {
    return fallbackIcon || <User size={Math.min(width, height) * 0.6} />;
  }

  // Если ошибка загрузки или ошибка изображения, показываем fallback
  if (error || imageError) {
    return fallbackIcon || <User size={Math.min(width, height) * 0.6} />;
  }

  // Если загружается, показываем placeholder
  if (isLoading || !cachedUrl) {
    return (
      <div 
        style={{ 
          width, 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f3f4f6'
        }}
      >
        <User size={Math.min(width, height) * 0.6} color="#9ca3af" />
      </div>
    );
  }

  // Показываем кешированное изображение
  return (
    <Image
      src={cachedUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => {
        console.warn('Cached avatar load error, falling back to icon');
        setImageError(true);
      }}
    />
  );
};

export default CachedAvatar;
