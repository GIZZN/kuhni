import React from 'react';
import styles from '../page.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroOverlay}></div>
      </div>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className={styles.heroSubtitle}>Премиальные кухни</span>
            <h1 className={styles.heroTitle}>ПрофКухня</h1>  
            <p className={styles.heroDescription}>
              Эксклюзивные решения для вашего дома. Европейское качество, безупречный сервис, 
              индивидуальный подход к каждому клиенту.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>15+</span>
                <span className={styles.statText}>лет опыта</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>5000+</span>
                <span className={styles.statText}>довольных клиентов</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statText}>гарантия качества</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardInner}>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 2h8v4l-2 2v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8l-2-2V2z"/>
                  <path d="M6 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2"/>
                  <circle cx="12" cy="18" r="1"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
