import { Pool, PoolClient } from 'pg';
import { getDatabaseConfig, getSSLConfig, dbLogger } from '../config/database';

// Получаем конфигурацию базы данных
const dbConfig = getDatabaseConfig();

// Конфигурация подключения к PostgreSQL
export const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password,
  port: dbConfig.port,
  ssl: getSSLConfig(dbConfig.host),
  // Настройки пула соединений
  max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.POSTGRES_CONNECTION_TIMEOUT || '2000'),
});

// Обработка ошибок пула
pool.on('error', (err) => {
  dbLogger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Функция для получения клиента (для сложных операций)
export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

// Функция для закрытия пула соединений (для graceful shutdown)
export async function closePool(): Promise<void> {
  await pool.end();
  dbLogger.info('Database pool closed');
}

// Логирование конфигурации при инициализации
dbLogger.config('PostgreSQL Configuration:');
dbLogger.config(`Host: ${dbConfig.host}:${dbConfig.port}`);
dbLogger.config(`Database: ${dbConfig.database}`);
dbLogger.config(`User: ${dbConfig.user}`);
dbLogger.config(`SSL: ${JSON.stringify(getSSLConfig(dbConfig.host))}`);

export default pool;
