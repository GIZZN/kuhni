import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getCartItems, createOrder, clearCart } from '@/lib/database';
import { query } from '@/lib/db/queries';

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

// POST - создать заказ из корзины
export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Проверяем наличие способов оплаты
    const paymentMethodsResult = await query(
      'SELECT COUNT(*) as count FROM user_payment_methods WHERE user_id = $1',
      [tokenData.userId]
    ) as { rows: [{ count: string }] };

    const paymentMethodsCount = parseInt(paymentMethodsResult.rows[0].count);
    
    if (paymentMethodsCount === 0) {
      return NextResponse.json(
        { error: 'Добавьте способ оплаты в профиле для оформления заказа' },
        { status: 400 }
      );
    }

    // Получаем товары из корзины
    const cartItems = await getCartItems(tokenData.userId);
    
    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Корзина пуста' },
        { status: 400 }
      );
    }

    // Подготавливаем данные для заказа
    const orderItems = cartItems.map(item => ({
      name: item.product_name,
      quantity: item.quantity,
      price: Number(item.product_price)
    }));

    const totalAmount = cartItems.reduce((sum, item) => 
      sum + (Number(item.product_price) * item.quantity), 0
    );

    // Создаем заказ
    const newOrder = await createOrder({
      userId: tokenData.userId,
      items: orderItems,
      totalAmount
    });

    // Очищаем корзину после успешного создания заказа
    await clearCart(tokenData.userId);

    // Форматируем ответ для фронтенда
    const formattedOrder = {
      id: newOrder.order_number,
      date: newOrder.created_at.toISOString().split('T')[0],
      status: 'Обрабатывается',
      total: Number(newOrder.total_amount),
      items: newOrder.items?.map(item => ({
        name: item.product_name,
        quantity: item.quantity,
        price: Number(item.price)
      })) || []
    };

    return NextResponse.json({
      message: 'Заказ успешно создан',
      order: formattedOrder
    }, { status: 201 });

  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error instanceof Error && error.message.includes('не задан в переменных окружения')) {
      return NextResponse.json(
        { error: 'Ошибка конфигурации сервера' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
