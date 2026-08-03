import { pool } from '../config/database';
import { Certificado, FiltrosBusqueda, CreateCertificadoDto } from '../types';

/**
 * Busca certificados con múltiples filtros
 */
export const buscarCertificados = async (filtros: FiltrosBusqueda): Promise<Certificado[]> => {
  let query = 'SELECT * FROM certificados WHERE 1=1';
  const params: any[] = [];
  let paramCounter = 1;

  if (filtros.codigo) {
    query += ` AND codigo = $${paramCounter++}`;
    params.push(filtros.codigo);
  }

  if (filtros.dni) {
    query += ` AND dni = $${paramCounter++}`;
    params.push(filtros.dni);
  }

  if (filtros.curso) {
    query += ` AND nombre_curso ILIKE $${paramCounter++}`;
    params.push(`%${filtros.curso}%`);
  }

  if (filtros.curso_id) {
    query += ` AND curso_id = $${paramCounter++}`;
    params.push(filtros.curso_id);
  }

  if (filtros.fechaInicio) {
    query += ` AND fecha_emision >= $${paramCounter++}`;
    params.push(filtros.fechaInicio);
  }

  if (filtros.fechaFin) {
    query += ` AND fecha_emision <= $${paramCounter++}`;
    params.push(filtros.fechaFin);
  }

  query += ' ORDER BY fecha_emision DESC';

  const result = await pool.query(query, params);
  return result.rows;
};

/**
 * Obtiene un certificado por código único
 */
export const obtenerPorCodigo = async (codigo: string): Promise<Certificado | null> => {
  const result = await pool.query('SELECT * FROM certificados WHERE codigo = $1', [codigo]);
  return result.rows[0] || null;
};

/**
 * Crea un nuevo certificado
 */
export const crearCertificado = async (datos: CreateCertificadoDto): Promise<Certificado> => {
  const query = `
    INSERT INTO certificados (codigo, dni, nombre_alumno, nombre_curso, fecha_emision, url_drive, file_id_drive, curso_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const result = await pool.query(query, [
    datos.codigo,
    datos.dni,
    datos.nombre_alumno,
    datos.nombre_curso,
    datos.fecha_emision,
    datos.url_drive,
    datos.file_id_drive || null,
    datos.curso_id || null
  ]);

  return result.rows[0];
};

/**
 * Obtiene certificados por rango de fechas (para carga masiva)
 */
export const obtenerPorRangoFechas = async (fechaInicio: string, fechaFin: string): Promise<Certificado[]> => {
  const query = `
    SELECT * FROM certificados
    WHERE fecha_emision BETWEEN $1 AND $2
    ORDER BY fecha_emision DESC
  `;
  const result = await pool.query(query, [fechaInicio, fechaFin]);
  return result.rows;
};

/**
 * Obtiene todos los certificados
 */
export const obtenerTodos = async (): Promise<Certificado[]> => {
  const result = await pool.query('SELECT * FROM certificados ORDER BY fecha_emision DESC');
  return result.rows;
};

export default {
  buscarCertificados,
  obtenerPorCodigo,
  crearCertificado,
  obtenerPorRangoFechas,
  obtenerTodos
};
