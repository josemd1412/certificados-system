import { pool } from '../config/database';
import { Curso, CreateCursoDto } from '../types';

/**
 * Obtiene todos los cursos
 */
export const obtenerTodos = async (): Promise<Curso[]> => {
  const result = await pool.query('SELECT * FROM cursos ORDER BY created_at DESC');
  return result.rows;
};

/**
 * Obtiene un curso por ID
 */
export const obtenerPorId = async (id: number): Promise<Curso | null> => {
  const result = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
  return result.rows[0] || null;
};

/**
 * Obtiene un curso por nombre
 */
export const obtenerPorNombre = async (nombre: string): Promise<Curso | null> => {
  const result = await pool.query('SELECT * FROM cursos WHERE nombre = $1', [nombre]);
  return result.rows[0] || null;
};

/**
 * Crea un nuevo curso
 */
export const crearCurso = async (datos: CreateCursoDto, folderId: string): Promise<Curso> => {
  const query = `
    INSERT INTO cursos (nombre, descripcion, folder_id_drive)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [
    datos.nombre,
    datos.descripcion || null,
    folderId
  ]);

  return result.rows[0];
};

/**
 * Actualiza un curso
 */
export const actualizarCurso = async (id: number, datos: Partial<CreateCursoDto>): Promise<Curso | null> => {
  const query = `
    UPDATE cursos
    SET nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `;

  const result = await pool.query(query, [
    datos.nombre,
    datos.descripcion,
    id
  ]);

  return result.rows[0] || null;
};

/**
 * Elimina un curso
 */
export const eliminarCurso = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM cursos WHERE id = $1', [id]);
  return result.rowCount !== null && result.rowCount > 0;
};

/**
 * Obtiene estadísticas de un curso
 */
export const obtenerEstadisticas = async (id: number) => {
  const query = `
    SELECT
      COUNT(*) as total_certificados,
      MIN(fecha_emision) as primera_emision,
      MAX(fecha_emision) as ultima_emision
    FROM certificados
    WHERE curso_id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export default {
  obtenerTodos,
  obtenerPorId,
  obtenerPorNombre,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  obtenerEstadisticas
};
