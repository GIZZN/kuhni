import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { 
  ChefHat,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.column}>
            <div className={styles.logoSection}>
              <h3>ПрофКухня</h3>  
              <div className={styles.logoIcon}>
                <ChefHat size={24} />
              </div>
            </div>
            <p>Премиальные кухни и кухонная техника. Европейское качество, индивидуальный дизайн, профессиональная сборка. Ваш надежный партнер в создании кухни мечты.</p>
            <div className={styles.social}>
              <a href="#" aria-label="Вконтакте">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.707-1.033-1.033-1.49-1.172-1.744-1.172-.356 0-.458.102-.458.593v1.563c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 7.715c0-.254.102-.491.593-.491h1.744c.441 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.169-.407.441-.407h2.744c.373 0 .508.203.508.643v3.473c0 .373.169.508.271.508.22 0 .407-.135.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.254 1.217-2.615 4.32-2.615 4.32-.203.322-.271.458 0 .78.203.254.864.847 1.287 1.364.779.932 1.371 1.717 1.523 2.268.169.593-.085.898-.593.898z"/>
                </svg>
              </a>
              <a href="#" aria-label="Телеграм">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.61 7.594c-.121.567-.444.707-.902.439l-2.507-1.849-1.21 1.166c-.134.134-.246.246-.506.246l.18-2.562 4.663-4.208c.203-.18-.044-.281-.315-.101L9.739 13.16l-2.506-.784c-.544-.17-.555-.544.114-.806l9.795-3.775c.454-.17.852.101.426.806z"/>
                </svg>
              </a>
              <a href="#" aria-label="Инстаграм">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className={styles.column}>
            <h4>Каталог кухонь</h4>
            <ul>
              <li><Link href="/catalog?category=faucets">Смесители</Link></li>
              <li><Link href="/catalog?category=sinks">Мойки</Link></li>
              <li><Link href="/catalog?category=kitchen-sets">Кухонные гарнитуры</Link></li>
              <li><Link href="/catalog?category=built-in-appliances">Встраиваемая техника</Link></li>
              <li><Link href="/catalog?category=countertops">Столешницы</Link></li>
              <li><Link href="/catalog?category=hoods">Вытяжки</Link></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h4>Услуги</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Дизайн кухни</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Изготовление кухонь</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Сборка и установка</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Гарантийное обслуживание</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Консультации дизайнера</a></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h4>Контакты</h4>
            <address className={styles.contacts}>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <p>Москва, ул. Кухонная, д. 25</p>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <p><a href="tel:+74951234567">+7 (495) 123-45-67</a></p>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <p><a href="mailto:info@akvaproffi.ru">info@akvaproffi.ru</a></p>
              </div>
              <div className={styles.contactItem}>
                <Clock size={16} />
                <p>Пн-Вс с 9:00 до 20:00</p>
              </div>
            </address>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © 2025 ПрофКухня. Все права защищены.  
          </div>
          <div className={styles.policy}>
            <a href="#" onClick={(e) => e.preventDefault()}>Политика конфиденциальности</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Пользовательское соглашение</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 