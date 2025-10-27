'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { productsData } from '@/app/data/products';
import { ChevronRight, ChevronLeft, CheckCircle, Package, ArrowRight, Star } from 'lucide-react';
import styles from './page.module.css';

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: {
    id: string;
    text: string;
    weight: { [key: string]: string | number };
  }[];
}

interface ProductScore {
  product: typeof productsData[0];
  score: number;
  matchReasons: string[];
}

const questions: Question[] = [
  {
    id: 'budget',
    text: 'Какой у вас бюджет на покупку?',
    type: 'single',
    options: [
      {
        id: 'low',
        text: 'До 20 000 ₽',
        weight: { budget: 1 }
      },
      {
        id: 'medium',
        text: '20 000 - 50 000 ₽',
        weight: { budget: 2 }
      },
      {
        id: 'high',
        text: 'Свыше 50 000 ₽',
        weight: { budget: 3 }
      }
    ]
  },
  {
    id: 'category',
    text: 'Что именно вас интересует?',
    type: 'single',
    options: [
      {
        id: 'faucets',
        text: 'Смесители и краны',
        weight: { category: 'Смесители' }
      },
      {
        id: 'sinks',
        text: 'Мойки и раковины',
        weight: { category: 'Мойки' }
      },
      {
        id: 'kitchen-sets',
        text: 'Кухонные гарнитуры',
        weight: { category: 'Кухонные гарнитуры' }
      },
      {
        id: 'appliances',
        text: 'Встраиваемая техника',
        weight: { category: 'Встраиваемая техника' }
      },
      {
        id: 'accessories',
        text: 'Аксессуары и фурнитура',
        weight: { category: 'Аксессуары' }
      }
    ]
  },
  {
    id: 'style',
    text: 'Какой стиль кухни вам нравится?',
    type: 'single',
    options: [
      {
        id: 'modern',
        text: 'Современный минимализм',
        weight: { style: 'modern' }
      },
      {
        id: 'classic',
        text: 'Классический',
        weight: { style: 'classic' }
      },
      {
        id: 'loft',
        text: 'Лофт и индустриальный',
        weight: { style: 'loft' }
      },
      {
        id: 'scandinavian',
        text: 'Скандинавский',
        weight: { style: 'scandinavian' }
      }
    ]
  },
  {
    id: 'priority',
    text: 'Что для вас важнее всего?',
    type: 'multiple',
    options: [
      {
        id: 'quality',
        text: 'Высокое качество',
        weight: { priority: 'quality' }
      },
      {
        id: 'price',
        text: 'Доступная цена',
        weight: { priority: 'price' }
      },
      {
        id: 'design',
        text: 'Красивый дизайн',
        weight: { priority: 'design' }
      },
      {
        id: 'functionality',
        text: 'Функциональность',
        weight: { priority: 'functionality' }
      }
    ]
  },
  {
    id: 'usage',
    text: 'Как часто вы готовите дома?',
    type: 'single',
    options: [
      {
        id: 'rarely',
        text: 'Редко, в основном разогреваю',
        weight: { usage: 'light' }
      },
      {
        id: 'sometimes',
        text: 'Несколько раз в неделю',
        weight: { usage: 'medium' }
      },
      {
        id: 'often',
        text: 'Каждый день, люблю готовить',
        weight: { usage: 'heavy' }
      },
      {
        id: 'professional',
        text: 'Готовлю профессионально',
        weight: { usage: 'professional' }
      }
    ]
  }
];

export default function Consultation() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<ProductScore[]>([]);

  const handleAnswer = (questionId: string, optionId: string, isMultiple: boolean) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter(id => id !== optionId)
          : [...currentAnswers, optionId];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateRecommendations();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateRecommendations = () => {
    const productScores: ProductScore[] = [];

    productsData.forEach(product => {
      let score = 0;
      const matchReasons: string[] = [];

      // Проверяем бюджет
      const budgetAnswer = answers.budget?.[0];
      if (budgetAnswer) {
        if (budgetAnswer === 'low' && product.price <= 20000) {
          score += 30;
          matchReasons.push('Подходит по бюджету');
        } else if (budgetAnswer === 'medium' && product.price > 20000 && product.price <= 50000) {
          score += 30;
          matchReasons.push('Подходит по бюджету');
        } else if (budgetAnswer === 'high' && product.price > 50000) {
          score += 30;
          matchReasons.push('Премиум качество');
        }
      }

      // Проверяем категорию
      const categoryAnswer = answers.category?.[0];
      if (categoryAnswer) {
        const question = questions.find(q => q.id === 'category');
        const option = question?.options.find(o => o.id === categoryAnswer);
        if (option && product.category === option.weight.category) {
          score += 40;
          matchReasons.push('Соответствует выбранной категории');
        }
      }

      // Проверяем рейтинг для качества
      const priorityAnswers = answers.priority || [];
      if (priorityAnswers.includes('quality') && product.rating >= 4.5) {
        score += 20;
        matchReasons.push('Высокий рейтинг качества');
      }

      if (priorityAnswers.includes('price') && product.price <= 25000) {
        score += 15;
        matchReasons.push('Доступная цена');
      }

      // Проверяем использование
      const usageAnswer = answers.usage?.[0];
      if (usageAnswer === 'professional' && product.price > 40000) {
        score += 25;
        matchReasons.push('Профессиональный уровень');
      } else if (usageAnswer === 'light' && product.price <= 30000) {
        score += 15;
        matchReasons.push('Оптимально для редкого использования');
      }

      if (score > 0) {
        productScores.push({ product, score, matchReasons });
      }
    });

    // Сортируем по убыванию рейтинга
    productScores.sort((a, b) => b.score - a.score);
    
    setRecommendations(productScores.slice(0, 3));
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations([]);
  };

  const currentQ = questions[currentQuestion];
  const currentAnswers = answers[currentQ?.id] || [];
  const canProceed = currentAnswers.length > 0;

  if (showResults) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.resultsHeader}>
              <CheckCircle className={styles.successIcon} size={64} />
              <h1>Персональные рекомендации</h1>
              <p>На основе ваших предпочтений наши эксперты подобрали эксклюзивные решения для вашей кухни</p>
            </div>

            <div className={styles.recommendations}>
              {recommendations.length > 0 ? (
                recommendations.map((item, index) => (
                  <div key={item.product.id} className={styles.recommendationCard}>
                    <div className={styles.cardRank}>#{index + 1}</div>
                    <div className={styles.cardImage}>
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name}
                        width={250}
                        height={200}
                        style={{ objectFit: 'contain' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/products/placeholder1.jpg';
                        }}
                      />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>{item.product.name}</h3>
                      <p className={styles.cardPrice}>{item.product.price.toLocaleString()} ₽</p>
                      <div className={styles.cardRating}>
                        <div className={styles.ratingStars}>
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < Math.floor(item.product.rating) ? "currentColor" : "none"}
                              color={i < Math.floor(item.product.rating) ? "#fbbf24" : "#d1d5db"}
                            />
                          ))}
                        </div>
                        <span>{item.product.rating}</span>
                      </div>
                      <div className={styles.matchReasons}>
                        <h4>Почему это подходит вам:</h4>
                        <ul>
                          {item.matchReasons.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.cardActions}>
                        <button 
                          className={styles.viewButton}
                          onClick={() => router.push(`/catalog?search=${encodeURIComponent(item.product.name)}`)}
                        >
                          Подробнее
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  <Package size={48} />
                  <h3>К сожалению, не удалось найти подходящие товары</h3>
                  <p>Попробуйте изменить критерии поиска</p>
                </div>
              )}
            </div>

            <div className={styles.resultsActions}>
              <button className={styles.restartButton} onClick={restartQuiz}>
                Новая консультация
              </button>
              <button 
                className={styles.catalogButton}
                onClick={() => router.push('/catalog')}
              >
                Весь каталог
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.quizHeader}>
            <h1>Персональная консультация</h1>
            <p>Ответьте на несколько вопросов, и наши эксперты подберут идеальные решения для кухни вашей мечты</p>
            
            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {currentQuestion + 1} из {questions.length}
              </span>
            </div>
          </div>

          {currentQ && (
            <div className={styles.questionCard}>
              <h2 className={styles.questionText}>{currentQ.text}</h2>
              
              <div className={styles.options}>
                {currentQ.options.map(option => (
                  <button
                    key={option.id}
                    className={`${styles.option} ${
                      currentAnswers.includes(option.id) ? styles.optionSelected : ''
                    }`}
                    onClick={() => handleAnswer(currentQ.id, option.id, currentQ.type === 'multiple')}
                  >
                    <div className={styles.optionContent}>
                      <span>{option.text}</span>
                      {currentAnswers.includes(option.id) && (
                        <CheckCircle className={styles.optionCheck} size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {currentQ.type === 'multiple' && (
                <p className={styles.multipleHint}>
                  Можно выбрать несколько вариантов
                </p>
              )}
            </div>
          )}

          <div className={styles.navigation}>
            <button
              className={styles.navButton}
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft size={20} />
              Назад
            </button>
            
            <button
              className={`${styles.navButton} ${styles.navButtonPrimary}`}
              onClick={nextQuestion}
              disabled={!canProceed}
            >
              {currentQuestion === questions.length - 1 ? 'Получить рекомендации' : 'Продолжить'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
