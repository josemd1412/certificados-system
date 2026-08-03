export interface Curso {
  id: number;
  nombre: string;
  descripcion?: string;
  folder_id_drive: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCursoDto {
  nombre: string;
  descripcion?: string;
}

export interface ResultadoCarga {
  dni?: string;
  nombre?: string;
  archivo: string;
  codigo?: string;
  status: 'ok' | 'error';
  mensaje?: string;
}

export interface ResumenCarga {
  exitosos: number;
  fallidos: number;
  total: number;
  detalles: ResultadoCarga[];
}
