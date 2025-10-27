import React from 'react';
import styles from '../page.module.css';

const advantagesData = [
  {
    id: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: 'Премиальное качество',
    description: 'Только сертифицированная продукция от ведущих европейских производителей'
  },
  {
    id: 2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Персональный консультант',
    description: 'Индивидуальный подход и профессиональная консультация на всех этапах'
  },
  {
    id: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 18V6a2 2 0 0 0-2-2c-1.1 0-2 .9-2 2v12"/>
        <path d="M15 18h-6"/>
        <path d="M19 9h-3v9h3a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2z"/>
        <path d="M5 15h3V9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z"/>
      </svg>
    ),
    title: 'Профессиональный монтаж',
    description: 'Установка и подключение силами сертифицированных специалистов'
  },
  {
    id: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: 'Расширенная гарантия',
    description: 'До 5 лет гарантии на продукцию и 2 года на монтажные работы'
  }
];

export default function AdvantagesSection() {
  return (
    <section className={styles.advantages}>
      <div className={styles.container}>
        <div className={styles.advantagesGrid}>
          {advantagesData.map((advantage) => (
            <div key={advantage.id} className={styles.advantage}>
              <div className={styles.advantageIcon}>
                {advantage.icon}
              </div>
              <h3>{advantage.title}</h3>
              <p>{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
