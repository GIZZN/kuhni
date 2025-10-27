import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { updateUser } from '@/lib/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1 GB в байтах

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

// Функция для конвертации файла в base64
async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

// POST - загрузить аватар
export async function POST(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Проверка размера файла
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Размер файла превышает 1 ГБ' },
        { status: 400 }
      );
    }

    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Недопустимый тип файла. Разрешены: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      );
    }

    // Конвертируем файл в base64
    const base64Avatar = await fileToBase64(file);

    // Сохраняем аватар в базу данных
    const updatedUser = await updateUser(tokenData.userId, { avatar: base64Avatar });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Ошибка обновления пользователя' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Аватар успешно загружен',
      avatar: base64Avatar
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE - удалить аватар
export async function DELETE(request: NextRequest) {
  try {
    const tokenData = verifyToken(request);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    // Удаляем аватар из базы данных
    const updatedUser = await updateUser(tokenData.userId, { avatar: null });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Ошибка обновления пользователя' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Аватар успешно удален'
    });

  } catch (error) {
    console.error('Avatar delete error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
