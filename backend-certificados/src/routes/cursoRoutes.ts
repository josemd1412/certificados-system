import { Router } from 'express';
import * as cursoController from '../controllers/cursoController';
import { uploadCertificados } from '../middlewares/upload';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - nombre
 *         - folder_id_drive
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del curso
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del curso
 *           example: Curso IA
 *         descripcion:
 *           type: string
 *           description: Descripción del curso
 *           example: Inteligencia Artificial 2024
 *         folder_id_drive:
 *           type: string
 *           description: ID de la carpeta en Google Drive
 *           example: 1abc...xyz
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Obtiene todos los cursos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 */
router.get('/', cursoController.obtenerTodos);

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Obtiene un curso por ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso no encontrado
 */
router.get('/:id', cursoController.obtenerPorId);

/**
 * @swagger
 * /api/cursos/{id}/certificados:
 *   get:
 *     summary: Obtiene certificados de un curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Lista de certificados del curso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Certificado'
 */
router.get('/:id/certificados', cursoController.obtenerCertificados);

/**
 * @swagger
 * /api/cursos/{id}/estadisticas:
 *   get:
 *     summary: Obtiene estadísticas de un curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estadísticas del curso
 */
router.get('/:id/estadisticas', cursoController.obtenerEstadisticas);

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crea un nuevo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Curso IA
 *               descripcion:
 *                 type: string
 *                 example: Inteligencia Artificial 2024
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Error de validación
 */
router.post('/', cursoController.crearCurso);

/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     summary: Actualiza un curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Curso actualizado
 *       404:
 *         description: Curso no encontrado
 */
router.put('/:id', cursoController.actualizarCurso);

/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     summary: Elimina un curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Curso eliminado
 *       404:
 *         description: Curso no encontrado
 */
router.delete('/:id', cursoController.eliminarCurso);

/**
 * @swagger
 * /api/cursos/{id}/certificados/masivo:
 *   post:
 *     summary: Carga masiva de certificados (hasta 50 PDFs)
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del curso
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - pdfs
 *               - excel
 *             properties:
 *               pdfs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Archivos PDF (máximo 50)
 *               excel:
 *                 type: string
 *                 format: binary
 *                 description: Archivo Excel con datos de alumnos
 *     responses:
 *       200:
 *         description: Resumen de la carga
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exitosos:
 *                   type: integer
 *                 fallidos:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 detalles:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Curso no encontrado
 */
router.post('/:id/certificados/masivo', uploadCertificados, cursoController.cargarCertificadosMasivo);

export default router;
