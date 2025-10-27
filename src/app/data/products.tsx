import React from 'react';
import type { Product, Category } from '../types';
import { 
  ChefHat,
  Utensils,
  Refrigerator,
  Microwave,
  Coffee,
  Zap,
  Package,
  Settings
} from 'lucide-react';

// Централизованное хранилище товаров для всего приложения
export const productsData: Product[] = [
  {
    id: 1,
    name: 'Кухонный смеситель GROHE Eurosmart',
    price: 15999,
    image: '/images/products/placeholder1.jpg',
    category: 'Смесители',
    rating: 4.8,
    slug: 'grohe-eurosmart-kitchen-faucet'
  },
  {
    id: 2,
    name: 'Кухонная мойка Blanco из нержавейки',
    price: 24999,
    image: '/images/products/placeholder2.jpg',
    category: 'Мойки',
    rating: 4.6,
    slug: 'blanco-stainless-kitchen-sink'
  },
  {
    id: 3,
    name: 'Кухонный гарнитур "Милан"',
    price: 35999,
    image: '/images/products/placeholder3.jpg',
    category: 'Кухонные гарнитуры',
    rating: 4.9,
    slug: 'milan-kitchen-set'
  },
  {
    id: 4,
    name: 'Встраиваемая духовка Bosch',
    price: 48999,
    image: '/images/products/placeholder4.jpg',
    category: 'Встраиваемая техника',
    rating: 4.7,
    slug: 'bosch-built-in-oven'
  },
  {
    id: 5,
    name: 'Кухонный измельчитель отходов',
    price: 8999,
    image: '/images/products/placeholder5.jpg',
    category: 'Аксессуары',
    rating: 4.5,
    slug: 'kitchen-waste-disposer'
  },
  {
    id: 6,
    name: 'Кухонная столешница из кварца',
    price: 8999,
    image: '/images/products/placeholder6.jpg',
    category: 'Столешницы',
    rating: 4.4,
    slug: 'quartz-kitchen-countertop'
  },
  {
    id: 7,
    name: 'Кухонный смеситель с выдвижным изливом',
    price: 32999,
    image: '/images/products/placeholder7.jpg',
    category: 'Смесители',
    rating: 4.7,
    slug: 'pull-out-kitchen-faucet'
  },
  {
    id: 8,
    name: 'Кухонный вытяжной зонт Kuppersbusch',
    price: 18999,
    image: '/images/products/placeholder9.jpg',
    category: 'Вытяжки',
    rating: 4.6,
    slug: 'kuppersbusch-kitchen-hood'
  },
  {
    id: 9,
    name: 'Кухонный гарнитур "Неаполь"',
    price: 12999,
    image: '/images/products/placeholder8.jpg',
    category: 'Кухонные гарнитуры',
    rating: 4.8,
    slug: 'naples-kitchen-set'
  },
  {
    id: 10,
    name: 'Кухонный смеситель с фильтром',
    price: 45999,
    image: '/images/products/placeholder10.jpg',
    category: 'Смесители',
    rating: 4.9,
    slug: 'filtered-kitchen-faucet'
  },
  {
    id: 11,
    name: 'Кухонная мойка из гранита',
    price: 14999,
    image: '/images/products/placeholder11.jpg',
    category: 'Мойки',
    rating: 4.5,
    slug: 'granite-kitchen-sink'
  },
  {
    id: 12,
    name: 'Кухонная мойка из нержавейки Blanco',
    price: 7999,
    image: '/images/products/placeholder12.jpg',
    category: 'Мойки',
    rating: 4.3,
    slug: 'blanco-stainless-sink'
  }
];

// Категории товаров
export const categoriesData: Category[] = [
  { 
    id: 1, 
    name: 'Смесители', 
    slug: 'faucets',
    icon: <Utensils size={32} />
  },
  { 
    id: 2, 
    name: 'Мойки', 
    slug: 'sinks',
    icon: <ChefHat size={32} />
  },
  { 
    id: 3, 
    name: 'Кухонные гарнитуры', 
    slug: 'kitchen-sets',
    icon: <Package size={32} />
  },
  { 
    id: 4, 
    name: 'Встраиваемая техника', 
    slug: 'built-in-appliances',
    icon: <Refrigerator size={32} />
  },
  { 
    id: 5, 
    name: 'Столешницы', 
    slug: 'countertops',
    icon: <Settings size={32} />
  },
  { 
    id: 6, 
    name: 'Вытяжки', 
    slug: 'hoods',
    icon: <Zap size={32} />
  },
  { 
    id: 7, 
    name: 'Аксессуары', 
    slug: 'accessories',
    icon: <Coffee size={32} />
  },
  { 
    id: 8, 
    name: 'Микроволновки', 
    slug: 'microwaves',
    icon: <Microwave size={32} />
  }
];

// Список названий категорий для фильтров
export const categoryNames = ['Все', ...categoriesData.map(cat => cat.name)];

// Мапинг слагов к названиям категорий
export const categorySlugMap: { [key: string]: string } = {
  'faucets': 'Смесители',
  'sinks': 'Мойки',
  'kitchen-sets': 'Кухонные гарнитуры',
  'built-in-appliances': 'Встраиваемая техника',
  'countertops': 'Столешницы',
  'hoods': 'Вытяжки',
  'accessories': 'Аксессуары',
  'microwaves': 'Микроволновки'
};

// Функции для работы с данными
export const getProductById = (id: number): Product | undefined => {
  return productsData.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'Все') {
    return productsData;
  }
  return productsData.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  return productsData.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
};

export const getCategoryBySlug = (slug: string): string => {
  return categorySlugMap[slug] || 'Все';
};
