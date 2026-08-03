// ============================================
// CURSOS
// ============================================

export interface Curso {
  id?: number;
  nombre: string;
  descripcion?: string;
  folder_id_drive: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCursoDto {
  nombre: string;
  descripcion?: string;
}

// ============================================
// CERTIFICADOS
// ============================================

export interface Certificado {
  id?: number;
  codigo: string;
  dni: string;
  nombre_alumno: string;
  nombre_curso: string;
  fecha_emision: string;
  url_drive: string;
  file_id_drive?: string;
  curso_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FiltrosBusqueda {
  codigo?: string;
  dni?: string;
  curso?: string;
  curso_id?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface CreateCertificadoDto {
  codigo: string;
  dni: string;
  nombre_alumno: string;
  nombre_curso: string;
  fecha_emision: string;
  url_drive: string;
  file_id_drive?: string;
  curso_id?: number;
}

// ============================================
// CARGA MASIVA
// ============================================

export interface DatosAlumno {
  dni: string;
  nombre_alumno: string;
  fecha_emision: string;
  email?: string;
  observaciones?: string;
}

export interface ResultadoCarga {
  dni?: string;
  nombre?: string;
  archivo: string;
  codigo?: string;
  status: 'ok' | 'error';
  mensaje?: string;
}
