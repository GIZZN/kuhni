import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { updateUser, findUserById } from '@/lib/database';

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

// GET - получить адрес пользователя
export async function GET(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const user = await findUserById(tokenData.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      address: {
        street: user.address || '',
        city: user.city || '',
        postalCode: user.postal_code || '',
        contactPerson: user.name
      }
    });

  } catch (error) {
    console.error('Address get error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// PUT - обновить адрес пользователя
export async function PUT(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { street, city, postalCode } = await request.json();

    if (!street || !city) {
      return NextResponse.json(
        { error: 'Адрес и город обязательны' },
        { status: 400 }
      );
    }

    // Обновляем адрес пользователя
    const updatedUser = await updateUser(tokenData.userId, {
      address: street,
      city: city,
      postal_code: postalCode
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Ошибка обновления адреса' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Адрес успешно обновлен',
      address: {
        street: updatedUser.address,
        city: updatedUser.city,
        postalCode: updatedUser.postal_code,
        contactPerson: updatedUser.name
      }
    });

  } catch (error) {
    console.error('Address update error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
