'use client';

import React from 'react';
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Wrench, 
  Award, 
  Truck,
  Shield
} from 'lucide-react';

// Types
import type { Product } from './types';
import { productsData, categoriesData } from './data/products';

export default function Home() {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  };

  const featuredProducts = productsData.slice(0, 6);
  const mainCategories = categoriesData.slice(0, 4);

  return (
    <div className={styles.page}>
      <Header />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <span className={styles.heroLabel}>Премиальные кухни</span>
              <h1 className={styles.heroTitle}>
                Создаем кухни
                <span className={styles.heroTitleAccent}>вашей мечты</span>
              </h1>
              <p className={styles.heroDescription}>
                Более 15 лет мы проектируем и изготавливаем кухни высочайшего качества 
                от ведущих мировых производителей для самых взыскательных клиентов
              </p>
              <div className={styles.heroActions}>
                <Link href="/catalog" className={styles.heroButtonPrimary}>Каталог кухонь</Link>
                <Link href="/consultation" className={styles.heroButtonSecondary}>Консультация</Link>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroImageContainer}>
                <Image 
                  src="/images/logo.png" 
                  alt="ПрофКухня"
                  width={200} 
                  height={200}
                  className={styles.heroLogo}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>15+</div>
              <div className={styles.statLabel}>Лет опыта</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>2000+</div>
              <div className={styles.statLabel}>Кухонь изготовлено</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>30+</div>
              <div className={styles.statLabel}>Брендов</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>5 лет</div>
              <div className={styles.statLabel}>Гарантия</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Категории кухонь</h2>
            <p className={styles.sectionSubtitle}>
              Полный спектр кухонных решений от эконом до премиум класса
            </p>
          </div>
          <div className={styles.categoriesGrid}>
            {mainCategories.map((category, index) => (
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>
                  {category.icon}
                </div>
                <h3 className={styles.categoryTitle}>{category.name}</h3>
                <p className={styles.categoryDescription}>
                  Профессиональные кухонные решения высочайшего качества
                </p>
                <div className={styles.categoryNumber}>0{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.products}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Популярные кухни</h2>
            <p className={styles.sectionSubtitle}>
              Тщательно отобранные кухонные решения от лучших производителей
            </p>
          </div>
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImageWrapper}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productContent}>
                    <span className={styles.productCategory}>{product.category}</span>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                  </div>
                  <div className={styles.productBottom}>
                    <div className={styles.productRating}>
                      <div className={styles.ratingStars}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                      <span className={styles.ratingText}>{product.rating}</span>
                    </div>
                    <div className={styles.productPrice}>
                      {product.price.toLocaleString()} ₽
                    </div>
                    <div className={styles.productActions}>
                      <button 
                        className={styles.addToCartBtn}
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={18} />
                        В корзину
                      </button>
                      <button 
                        className={`${styles.favoriteBtn} ${isFavorite(product.id) ? styles.favoriteActive : ''}`}
                        onClick={() => handleToggleFavorite(product)}
                      >
                        <Heart size={20} fill={isFavorite(product.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Наши преимущества</h2>
            <p className={styles.sectionSubtitle}>
              Почему клиенты выбирают наши кухни
            </p>
          </div>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Shield size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Гарантия качества</h3>
              <p className={styles.serviceDescription}>
                Официальная гарантия на все кухни и комплектующие от производителей
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Wrench size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Профессиональная сборка</h3>
              <p className={styles.serviceDescription}>
                Установка и сборка кухонь сертифицированными специалистами
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Award size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Индивидуальный дизайн</h3>
              <p className={styles.serviceDescription}>
                Персональные проекты кухонь под ваши потребности и стиль
              </p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Truck size={32} />
              </div>
              <h3 className={styles.serviceTitle}>Быстрая доставка</h3>
              <p className={styles.serviceDescription}>
                Доставка кухонь по Москве и области в течение 3-5 рабочих дней
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
