import { Request, Response } from 'express';
import * as cursoService from '../services/cursoService';
import * as driveService from '../services/googleDriveService';
import * as certificadoService from '../services/certificadoService';
import { leerExcel, extraerDNIdePDF, generarCodigoCertificado } from '../utils/excelParser';
import { ResultadoCarga } from '../types';

/**
 * GET /api/cursos
 * Obtiene todos los cursos
 */
export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const cursos = await cursoService.obtenerTodos();
    res.json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
};

/**
 * GET /api/cursos/:id
 * Obtiene un curso por ID
 */
export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const curso = await cursoService.obtenerPorId(parseInt(id));

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json(curso);
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({ error: 'Error al obtener curso' });
  }
};

/**
 * GET /api/cursos/:id/certificados
 * Obtiene certificados de un curso
 */
export const obtenerCertificados = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificados = await certificadoService.buscarCertificados({
      curso_id: parseInt(id)
    });

    res.json(certificados);
  } catch (error) {
    console.error('Error al obtener certificados del curso:', error);
    res.status(500).json({ error: 'Error al obtener certificados' });
  }
};

/**
 * GET /api/cursos/:id/estadisticas
 * Obtiene estadísticas de un curso
 */
export const obtenerEstadisticas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await cursoService.obtenerEstadisticas(parseInt(id));
    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

/**
 * POST /api/cursos
 * Crea un nuevo curso
 */
export const crearCurso = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del curso es requerido' });
    }

    // Verificar si ya existe un curso con ese nombre
    const existente = await cursoService.obtenerPorNombre(nombre);
    if (existente) {
      return res.status(400).json({ error: 'Ya existe un curso con ese nombre' });
    }

    // Crear carpeta en Drive
    const folderId = await driveService.crearCarpeta(nombre);

    // Crear curso en BD
    const curso = await cursoService.crearCurso({ nombre, descripcion }, folderId);

    res.status(201).json(curso);
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ error: 'Error al crear curso' });
  }
};

/**
 * PUT /api/cursos/:id
 * Actualiza un curso
 */
export const actualizarCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const curso = await cursoService.actualizarCurso(parseInt(id), { nombre, descripcion });

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json(curso);
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ error: 'Error al actualizar curso' });
  }
};

/**
 * DELETE /api/cursos/:id
 * Elimina un curso
 */
export const eliminarCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const eliminado = await cursoService.eliminarCurso(parseInt(id));

    if (!eliminado) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error al eliminar curso' });
  }
};

/**
 * POST /api/cursos/:id/certificados/masivo
 * Carga masiva de certificados
 */
export const cargarCertificadosMasivo = async (req: Request, res: Response) => {
  try {
    const { id: cursoId } = req.params;
    const files = req.files as { pdfs?: Express.Multer.File[], excel?: Express.Multer.File[] };

    // Validaciones
    if (!files.pdfs || !files.excel) {
      return res.status(400).json({ error: 'Faltan archivos (PDFs o Excel)' });
    }

    if (files.pdfs.length > 50) {
      return res.status(400).json({ error: 'Máximo 50 certificados por carga' });
    }

    if (files.pdfs.length === 0) {
      return res.status(400).json({ error: 'Debes subir al menos un certificado PDF' });
    }

    // Obtener curso
    const curso = await cursoService.obtenerPorId(parseInt(cursoId));
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Leer Excel
    const datosAlumnos = leerExcel(files.excel[0].buffer);
    if (datosAlumnos.length === 0) {
      return res.status(400).json({ error: 'El archivo Excel está vacío o no tiene el formato correcto' });
    }

    const alumnosPorDNI = new Map(datosAlumnos.map(a => [a.dni, a]));

    // Procesar cada PDF
    const resultados: ResultadoCarga[] = [];
    for (const pdf of files.pdfs) {
      const dni = extraerDNIdePDF(pdf.originalname);

      if (!dni) {
        resultados.push({
          archivo: pdf.originalname,
          status: 'error',
          mensaje: 'No se pudo extraer DNI del nombre del archivo'
        });
        continue;
      }

      const alumno = alumnosPorDNI.get(dni);
      if (!alumno) {
        resultados.push({
          dni,
          archivo: pdf.originalname,
          status: 'error',
          mensaje: 'DNI no encontrado en Excel'
        });
        continue;
      }

      try {
        // Subir a Drive
        const { fileId, webViewLink } = await driveService.subirArchivo(
          pdf.buffer,
          pdf.originalname,
          curso.folder_id_drive,
          'application/pdf'
        );

        // Generar código único
        const codigo = generarCodigoCertificado(curso.nombre, dni);

        // Guardar en BD
        await certificadoService.crearCertificado({
          codigo,
          dni,
          nombre_alumno: alumno.nombre_alumno,
          nombre_curso: curso.nombre,
          fecha_emision: alumno.fecha_emision,
          url_drive: webViewLink,
          file_id_drive: fileId,
          curso_id: curso.id
        });

        resultados.push({
          dni,
          nombre: alumno.nombre_alumno,
          archivo: pdf.originalname,
          codigo,
          status: 'ok'
        });
      } catch (error: any) {
        resultados.push({
          dni,
          archivo: pdf.originalname,
          status: 'error',
          mensaje: error.message || 'Error al procesar certificado'
        });
      }
    }

    // Resumen
    const exitosos = resultados.filter(r => r.status === 'ok').length;
    const fallidos = resultados.filter(r => r.status === 'error').length;

    res.json({
      exitosos,
      fallidos,
      total: resultados.length,
      detalles: resultados
    });

  } catch (error: any) {
    console.error('Error en carga masiva:', error);
    res.status(500).json({ error: 'Error en la carga masiva: ' + error.message });
  }
};

export default {
  obtenerTodos,
  obtenerPorId,
  obtenerCertificados,
  obtenerEstadisticas,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  cargarCertificadosMasivo
};
