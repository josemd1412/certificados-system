import { Router } from 'express';
import * as certificadoController from '../controllers/certificadoController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Certificado:
 *       type: object
 *       required:
 *         - codigo
 *         - dni
 *         - nombre_alumno
 *         - nombre_curso
 *         - fecha_emision
 *         - url_drive
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del certificado
 *           example: 1
 *         codigo:
 *           type: string
 *           description: Código único del certificado
 *           example: CERT-2024-001
 *         dni:
 *           type: string
 *           description: DNI del alumno
 *           example: "12345678"
 *         nombre_alumno:
 *           type: string
 *           description: Nombre completo del alumno
 *           example: Juan Pérez García
 *         nombre_curso:
 *           type: string
 *           description: Nombre del curso
 *           example: Programación en Python
 *         fecha_emision:
 *           type: string
 *           format: date
 *           description: Fecha de emisión del certificado
 *           example: "2024-01-15"
 *         url_drive:
 *           type: string
 *           description: URL del certificado en Google Drive
 *           example: https://drive.google.com/file/d/abc123/view
 *         file_id_drive:
 *           type: string
 *           description: ID del archivo en Google Drive
 *           example: abc123xyz
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación en la base de datos
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 */

/**
 * @swagger
 * /api/certificados:
 *   get:
 *     summary: Obtiene todos los certificados
 *     tags: [Certificados]
 *     responses:
 *       200:
 *         description: Lista de todos los certificados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Certificado'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', certificadoController.obtenerTodos);

/**
 * @swagger
 * /api/certificados/buscar:
 *   get:
 *     summary: Busca certificados con filtros
 *     tags: [Certificados]
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Código exacto del certificado
 *         example: CERT-2024-001
 *       - in: query
 *         name: dni
 *         schema:
 *           type: string
 *         description: DNI exacto del alumno
 *         example: "12345678"
 *       - in: query
 *         name: curso
 *         schema:
 *           type: string
 *         description: Nombre del curso (búsqueda parcial)
 *         example: Python
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio del rango
 *         example: "2024-01-01"
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha fin del rango
 *         example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Lista de certificados que coinciden con los filtros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Certificado'
 *       500:
 *         description: Error del servidor
 */
router.get('/buscar', certificadoController.buscarCertificados);

/**
 * @swagger
 * /api/certificados/masivo:
 *   get:
 *     summary: Obtiene certificados por rango de fechas (descarga masiva)
 *     tags: [Certificados]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio
 *         example: "2024-01-01"
 *       - in: query
 *         name: fechaFin
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha fin
 *         example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Lista de certificados en el rango
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Certificado'
 *       400:
 *         description: Fechas requeridas
 *       500:
 *         description: Error del servidor
 */
router.get('/masivo', certificadoController.obtenerMasivo);

/**
 * @swagger
 * /api/certificados/drive/{fileId}:
 *   get:
 *     summary: Obtiene información de un archivo de Google Drive
 *     tags: [Google Drive]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del archivo en Google Drive
 *         example: 1DwDbpIErdEqkU-4VGExxbT9noyjeimnh
 *     responses:
 *       200:
 *         description: Información del archivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 mimeType:
 *                   type: string
 *                 webViewLink:
 *                   type: string
 *                 webContentLink:
 *                   type: string
 *       500:
 *         description: Error al obtener archivo
 */
router.get('/drive/:fileId', certificadoController.obtenerArchivoDrive);

/**
 * @swagger
 * /api/certificados/{codigo}:
 *   get:
 *     summary: Obtiene un certificado por código único
 *     tags: [Certificados]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código único del certificado
 *         example: CERT-2024-001
 *     responses:
 *       200:
 *         description: Certificado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Certificado'
 *       404:
 *         description: Certificado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 */
router.get('/:codigo', certificadoController.obtenerPorCodigo);

/**
 * @swagger
 * /api/certificados:
 *   post:
 *     summary: Crea un nuevo certificado
 *     tags: [Certificados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - dni
 *               - nombre_alumno
 *               - nombre_curso
 *               - fecha_emision
 *               - url_drive
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: CERT-2024-005
 *               dni:
 *                 type: string
 *                 example: "55667788"
 *               nombre_alumno:
 *                 type: string
 *                 example: María González
 *               nombre_curso:
 *                 type: string
 *                 example: Node.js Avanzado
 *               fecha_emision:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-01"
 *               url_drive:
 *                 type: string
 *                 example: https://drive.google.com/file/d/abc123/view
 *               file_id_drive:
 *                 type: string
 *                 example: abc123xyz
 *     responses:
 *       201:
 *         description: Certificado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Certificado'
 *       400:
 *         description: Datos inválidos o código duplicado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 */
router.post('/', certificadoController.crearCertificado);

export default router;
