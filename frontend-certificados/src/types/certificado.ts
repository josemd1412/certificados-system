export interface Certificado {
  id: number;
  codigo: string;
  dni: string;
  nombre_alumno: string;
  nombre_curso: string;
  fecha_emision: string;
  url_drive: string;
  file_id_drive?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FiltrosBusqueda {
  codigo?: string;
  dni?: string;
  curso?: string;
  fechaInicio?: string;
  fechaFin?: string;
}