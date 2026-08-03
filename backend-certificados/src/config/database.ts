import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Probar conexión
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ Error al conectar con PostgreSQL:', err);
  } else {
    console.log('✓ PostgreSQL conectado correctamente');
  }
});

export default pool;
