import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db/queries';
import { productsData } from '@/app/data/products';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Функция для проверки токена
function verifyToken(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

// GET - получить статистику пользователя
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Получаем количество заказов
    const ordersResult = await query(
      'SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_spent FROM orders WHERE user_id = $1',
      [tokenData.userId]
    ) as { rows: [{ total_orders: string; total_spent: string }] };

    // Получаем количество товаров в избранном
    const favoritesResult = await query(
      'SELECT COUNT(*) as total_favorites FROM favorites WHERE user_id = $1',
      [tokenData.userId]
    ) as { rows: [{ total_favorites: string }] };

    // Получаем данные пользователя (рейтинг, бонусы, дата регистрации, статус)
    const userResult = await query(
      'SELECT rating, bonus_points, registration_date, status, created_at FROM users WHERE id = $1',
      [tokenData.userId]
    ) as { rows: [{ rating: number; bonus_points: number; registration_date: string; status: string; created_at: string }] };

    // Получаем последние активности (последние 5 заказов)
    const activitiesResult = await query(
      `SELECT 
        'order' as type,
        'Заказ #' || order_number as title,
        created_at,
        total_amount
      FROM orders 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5`,
      [tokenData.userId]
    ) as { rows: Array<{ type: string; title: string; created_at: string; total_amount: number }> };

    // Получаем рекомендации (популярные товары из избранного других пользователей, которых нет в избранном текущего пользователя)
    const recommendationsResult = await query(
      `SELECT 
        f.product_id,
        f.product_name,
        f.product_price,
        COUNT(*) as popularity
      FROM favorites f
      WHERE f.product_id NOT IN (
        SELECT product_id FROM favorites WHERE user_id = $1
      )
      AND f.user_id != $1
      GROUP BY f.product_id, f.product_name, f.product_price
      ORDER BY popularity DESC, f.product_price ASC
      LIMIT 3`,
      [tokenData.userId]
    ) as { rows: Array<{ product_id: string; product_name: string; product_price: number; popularity: number }> };

    // Если рекомендаций из БД мало, добавляем из статических данных
    let recommendations = recommendationsResult.rows.map(rec => ({
      id: rec.product_id,
      name: rec.product_name,
      price: parseFloat(String(rec.product_price)) || 0,
      popularity: parseInt(String(rec.popularity)) || 0
    }));

    // Если рекомендаций меньше 3, добавляем из статических данных
    if (recommendations.length < 3) {
      // Получаем ID товаров, которые уже в избранном у пользователя
      const userFavoritesResult = await query(
        'SELECT product_id FROM favorites WHERE user_id = $1',
        [tokenData.userId]
      ) as { rows: Array<{ product_id: string }> };
      
      const userFavoriteIds = userFavoritesResult.rows.map(f => f.product_id);
      const existingRecommendationIds = recommendations.map(r => r.id);
      
      // Фильтруем товары из статических данных
      const availableProducts = productsData
        .filter(product => 
          !userFavoriteIds.includes(String(product.id)) && 
          !existingRecommendationIds.includes(String(product.id))
        )
        .slice(0, 3 - recommendations.length)
        .map(product => ({
          id: String(product.id),
          name: product.name,
          price: product.price,
          popularity: 0
        }));
      
      recommendations = [...recommendations, ...availableProducts];
    }

    console.log('Recommendations debug:', {
      fromDB: recommendationsResult.rows.length,
      fromStatic: recommendations.length - recommendationsResult.rows.length,
      total: recommendations.length,
      recommendations: recommendations
    });

    const user = userResult.rows[0];
    const orders = ordersResult.rows[0];
    const favorites = favoritesResult.rows[0];

    // Вычисляем год регистрации
    const registrationYear = user.registration_date 
      ? new Date(user.registration_date).getFullYear()
      : new Date(user.created_at).getFullYear();

    return NextResponse.json({
      stats: {
        totalOrders: parseInt(orders.total_orders) || 0,
        totalSpent: parseFloat(orders.total_spent) || 0,
        totalFavorites: parseInt(favorites.total_favorites) || 0,
        rating: parseFloat(String(user.rating)) || 4.5,
        bonusPoints: parseInt(String(user.bonus_points)) || 0,
        status: user.status || 'VIP',
        registrationYear: registrationYear || new Date().getFullYear()
      },
      activities: activitiesResult.rows.map(activity => ({
        type: activity.type,
        title: activity.title,
        date: activity.created_at,
        amount: parseFloat(String(activity.total_amount)) || 0
      })),
      recommendations: recommendations
    });

  } catch (error) {
    console.error('User stats error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
