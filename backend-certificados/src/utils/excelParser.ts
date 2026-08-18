import * as XLSX from 'xlsx';
import { DatosAlumno } from '../types';

/**
 * Lee un archivo Excel y extrae los datos de los alumnos
 */
export const leerExcel = (buffer: Buffer): DatosAlumno[] => {
  try {
    // cellDates: true hace que las celdas con formato de fecha se lean como
    // objetos Date en vez del número serial interno de Excel (ej. "46...").
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    return data.map(row => {
      const fechaRaw = row.fecha_emision || row.fecha;
      const fecha_emision = fechaRaw instanceof Date
        ? fechaRaw.toISOString().split('T')[0]
        : fechaRaw
          ? String(fechaRaw).trim()
          : new Date().toISOString().split('T')[0];

      return {
        dni: String(row.dni || row.DNI || '').trim(),
        nombre_alumno: String(row.nombre_alumno || row.nombre || '').trim(),
        fecha_emision,
        email: row.email || undefined,
        observaciones: row.observaciones || undefined
      };
    }).filter(alumno => alumno.dni && alumno.nombre_alumno);
  } catch (error) {
    console.error('Error al leer Excel:', error);
    throw new Error('Error al procesar el archivo Excel');
  }
};

/**
 * Extrae el DNI del nombre de un archivo PDF
 * Patrones soportados:
 * - 48053804-Nombre Alumno-Curso.pdf → 48053804
 * - certificadoa75162043.pdf → 75162043
 * - certificado75162043.pdf → 75162043
 * - 75162043.pdf → 75162043
 */
export const extraerDNIdePDF = (nombreArchivo: string): string | null => {
  try {
    // Remover extensión
    const sinExtension = nombreArchivo.replace(/\.pdf$/i, '');

    // Intentar varios patrones
    const patrones = [
      /^(\d{8,})/,               // 48053804-Nombre-Curso (DNI al inicio)
      /certificadoa?(\d+)$/i,  // certificadoa75162043 o certificado75162043
      /^(\d+)$/,                // 75162043
      /(\d{8,})$/               // Cualquier secuencia de 8+ dígitos al final
    ];

    for (const patron of patrones) {
      const match = sinExtension.match(patron);
      if (match) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error('Error al extraer DNI del nombre del archivo:', error);
    return null;
  }
};

/**
 * Valida el formato del nombre de un archivo PDF
 */
export const validarNombrePDF = (nombreArchivo: string): boolean => {
  return /\.pdf$/i.test(nombreArchivo) && extraerDNIdePDF(nombreArchivo) !== null;
};

/**
 * Genera un código único para un certificado
 */
export const generarCodigoCertificado = (
  nombreCurso: string,
  dni: string
): string => {
  const timestamp = Date.now();
  const cursoSlug = nombreCurso
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes (VISION + tilde -> VISION)
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 20); // limitar largo para no exceder codigo VARCHAR(100)

  return `CERT-${cursoSlug}-${timestamp}-${dni}`;
};

export default {
  leerExcel,
  extraerDNIdePDF,
  validarNombrePDF,
  generarCodigoCertificado
};
