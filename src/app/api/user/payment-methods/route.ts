import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
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

// Функция для маскировки номера карты
function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) return cardNumber;
  const lastFour = cardNumber.slice(-4);
  return `**** **** **** ${lastFour}`;
}

// GET - получить способы оплаты пользователя
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT id, type, card_number, card_holder, card_expiry, is_default, created_at 
       FROM user_payment_methods 
       WHERE user_id = $1 
       ORDER BY is_default DESC, created_at DESC`,
      [tokenData.userId]
    ) as { rows: Array<{
      id: string;
      type: string;
      card_number: string;
      card_holder: string;
      card_expiry: string;
      is_default: boolean;
      created_at: string;
    }> };

    const paymentMethods = result.rows.map(method => ({
      id: method.id,
      type: method.type,
      cardNumber: method.card_number ? maskCardNumber(method.card_number) : null,
      cardHolder: method.card_holder,
      cardExpiry: method.card_expiry,
      isDefault: method.is_default,
      createdAt: method.created_at
    }));

    return NextResponse.json({ paymentMethods });

  } catch (error) {
    console.error('Payment methods get error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST - добавить новый способ оплаты
export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { type, cardNumber, cardHolder, cardExpiry, isDefault } = await request.json();

    if (!type || !['card', 'cash', 'online'].includes(type)) {
      return NextResponse.json(
        { error: 'Некорректный тип способа оплаты' },
        { status: 400 }
      );
    }

    // Для карт проверяем обязательные поля
    if (type === 'card') {
      if (!cardNumber || !cardHolder || !cardExpiry) {
        return NextResponse.json(
          { error: 'Для карты необходимо указать номер, держателя и срок действия' },
          { status: 400 }
        );
      }

      // Простая валидация номера карты (16 цифр)
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleanCardNumber)) {
        return NextResponse.json(
          { error: 'Номер карты должен содержать 16 цифр' },
          { status: 400 }
        );
      }

      // Валидация срока действия (MM/YYYY)
      if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(cardExpiry)) {
        return NextResponse.json(
          { error: 'Срок действия должен быть в формате MM/YYYY' },
          { status: 400 }
        );
      }
    }

    // Если это способ по умолчанию, сбрасываем флаг у других
    if (isDefault) {
      await query(
        'UPDATE user_payment_methods SET is_default = FALSE WHERE user_id = $1',
        [tokenData.userId]
      );
    }

    // Добавляем новый способ оплаты
    const result = await query(
      `INSERT INTO user_payment_methods (user_id, type, card_number, card_holder, card_expiry, is_default)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, type, card_number, card_holder, card_expiry, is_default, created_at`,
      [
        tokenData.userId,
        type,
        type === 'card' ? cardNumber.replace(/\s/g, '') : null,
        type === 'card' ? cardHolder : null,
        type === 'card' ? cardExpiry : null,
        isDefault || false
      ]
    ) as { rows: Array<{
      id: string;
      type: string;
      card_number: string;
      card_holder: string;
      card_expiry: string;
      is_default: boolean;
      created_at: string;
    }> };

    const newMethod = result.rows[0];

    return NextResponse.json({
      message: 'Способ оплаты успешно добавлен',
      paymentMethod: {
        id: newMethod.id,
        type: newMethod.type,
        cardNumber: newMethod.card_number ? maskCardNumber(newMethod.card_number) : null,
        cardHolder: newMethod.card_holder,
        cardExpiry: newMethod.card_expiry,
        isDefault: newMethod.is_default,
        createdAt: newMethod.created_at
      }
    });

  } catch (error) {
    console.error('Payment method add error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE - удалить способ оплаты
export async function DELETE(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const methodId = searchParams.get('id');

    if (!methodId) {
      return NextResponse.json(
        { error: 'ID способа оплаты не указан' },
        { status: 400 }
      );
    }

    // Проверяем, что способ оплаты принадлежит пользователю
    const checkResult = await query(
      'SELECT id FROM user_payment_methods WHERE id = $1 AND user_id = $2',
      [methodId, tokenData.userId]
    ) as { rows: Array<{ id: string }> };

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Способ оплаты не найден' },
        { status: 404 }
      );
    }

    // Удаляем способ оплаты
    await query(
      'DELETE FROM user_payment_methods WHERE id = $1 AND user_id = $2',
      [methodId, tokenData.userId]
    );

    return NextResponse.json({ message: 'Способ оплаты успешно удален' });

  } catch (error) {
    console.error('Payment method delete error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
