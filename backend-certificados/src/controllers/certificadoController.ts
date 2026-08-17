import { Request, Response } from 'express';
import * as certificadoService from '../services/certificadoService';
import * as driveService from '../services/googleDriveService';

/**
 * GET /api/certificados/buscar
 * Busca certificados con filtros
 */
export const buscarCertificados = async (req: Request, res: Response) => {
  try {
    const filtros = {
      codigo: req.query.codigo as string,
      dni: req.query.dni as string,
      curso: req.query.curso as string,
      fechaInicio: req.query.fechaInicio as string,
      fechaFin: req.query.fechaFin as string
    };

    const certificados = await certificadoService.buscarCertificados(filtros);
    res.json(certificados);
  } catch (error) {
    console.error('Error al buscar certificados:', error);
    res.status(500).json({ error: 'Error al buscar certificados' });
  }
};

/**
 * GET /api/certificados/:codigo
 * Obtiene un certificado por código
 */
export const obtenerPorCodigo = async (req: Request, res: Response) => {
  try {
    const codigo = req.params.codigo as string;
    const certificado = await certificadoService.obtenerPorCodigo(codigo);

    if (!certificado) {
      return res.status(404).json({ error: 'Certificado no encontrado' });
    }

    res.json(certificado);
  } catch (error) {
    console.error('Error al obtener certificado:', error);
    res.status(500).json({ error: 'Error al obtener certificado' });
  }
};

/**
 * POST /api/certificados
 * Crea un nuevo certificado
 */
export const crearCertificado = async (req: Request, res: Response) => {
  try {
    const datos = req.body;

    // Validaciones básicas
    if (!datos.codigo || !datos.dni || !datos.nombre_alumno || !datos.nombre_curso || !datos.fecha_emision || !datos.url_drive) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar si el código ya existe
    const existente = await certificadoService.obtenerPorCodigo(datos.codigo);
    if (existente) {
      return res.status(400).json({ error: 'El código ya existe' });
    }

    const certificado = await certificadoService.crearCertificado(datos);
    res.status(201).json(certificado);
  } catch (error) {
    console.error('Error al crear certificado:', error);
    res.status(500).json({ error: 'Error al crear certificado' });
  }
};

/**
 * GET /api/certificados/masivo
 * Obtiene certificados por rango de fechas (descarga masiva)
 */
export const obtenerMasivo = async (req: Request, res: Response) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Fechas de inicio y fin son requeridas' });
    }

    const certificados = await certificadoService.obtenerPorRangoFechas(
      fechaInicio as string,
      fechaFin as string
    );

    res.json(certificados);
  } catch (error) {
    console.error('Error al obtener certificados masivos:', error);
    res.status(500).json({ error: 'Error al obtener certificados' });
  }
};

/**
 * GET /api/certificados
 * Obtiene todos los certificados
 */
export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const certificados = await certificadoService.obtenerTodos();
    res.json(certificados);
  } catch (error) {
    console.error('Error al obtener todos los certificados:', error);
    res.status(500).json({ error: 'Error al obtener certificados' });
  }
};

/**
 * GET /api/certificados/drive/:fileId
 * Obtiene información de un archivo de Drive
 */
export const obtenerArchivoDrive = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.fileId as string;
    const file = await driveService.getFileById(fileId);
    res.json(file);
  } catch (error) {
    console.error('Error al obtener archivo de Drive:', error);
    res.status(500).json({ error: 'Error al obtener archivo de Drive' });
  }
};

export default {
  buscarCertificados,
  obtenerPorCodigo,
  crearCertificado,
  obtenerMasivo,
  obtenerTodos,
  obtenerArchivoDrive
};
