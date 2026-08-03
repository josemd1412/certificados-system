import type { Curso, CreateCursoDto, ResumenCarga } from '../types/curso';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const cursoService = {
  /**
   * Obtiene todos los cursos
   */
  async obtenerTodos(): Promise<Curso[]> {
    const response = await fetch(`${API_URL}/cursos`);
    if (!response.ok) {
      throw new Error('Error al obtener cursos');
    }
    return response.json();
  },

  /**
   * Obtiene un curso por ID
   */
  async obtenerPorId(id: number): Promise<Curso> {
    const response = await fetch(`${API_URL}/cursos/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener curso');
    }
    return response.json();
  },

  /**
   * Crea un nuevo curso
   */
  async crear(datos: CreateCursoDto): Promise<Curso> {
    const response = await fetch(`${API_URL}/cursos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear curso');
    }

    return response.json();
  },

  /**
   * Carga masiva de certificados
   */
  async cargarCertificadosMasivo(
    cursoId: number,
    pdfs: File[],
    excel: File
  ): Promise<ResumenCarga> {
    const formData = new FormData();

    // Agregar PDFs
    pdfs.forEach((pdf) => {
      formData.append('pdfs', pdf);
    });

    // Agregar Excel
    formData.append('excel', excel);

    const response = await fetch(`${API_URL}/cursos/${cursoId}/certificados/masivo`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la carga masiva');
    }

    return response.json();
  },
};
