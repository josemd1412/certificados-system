import type { Certificado, FiltrosBusqueda } from '../types/certificado';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const certificadoApi = {
  /**
   * Buscar certificados con filtros
   */
  buscarCertificados: async (filtros: FiltrosBusqueda): Promise<Certificado[]> => {
    const params = new URLSearchParams();

    if (filtros.codigo) params.append('codigo', filtros.codigo);
    if (filtros.dni) params.append('dni', filtros.dni);
    if (filtros.curso) params.append('curso', filtros.curso);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

    const response = await fetch(`${API_URL}/certificados/buscar?${params}`);
    if (!response.ok) {
      throw new Error('Error al buscar certificados');
    }
    return response.json();
  },

  /**
   * Obtener todos los certificados
   */
  obtenerTodos: async (): Promise<Certificado[]> => {
    const response = await fetch(`${API_URL}/certificados`);
    if (!response.ok) {
      throw new Error('Error al obtener certificados');
    }
    return response.json();
  },

  /**
   * Obtener certificado por código
   */
  obtenerPorCodigo: async (codigo: string): Promise<Certificado | null> => {
    const response = await fetch(`${API_URL}/certificados/${codigo}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Error al obtener certificado');
    }
    return response.json();
  },

  /**
   * Obtener certificados por rango de fechas
   */
  obtenerPorRangoFechas: async (fechaInicio: string, fechaFin: string): Promise<Certificado[]> => {
    const response = await fetch(
      `${API_URL}/certificados/masivo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
    );
    if (!response.ok) {
      throw new Error('Error al obtener certificados');
    }
    return response.json();
  },

  /**
   * Crear un nuevo certificado
   */
  crear: async (certificado: Omit<Certificado, 'id' | 'created_at' | 'updated_at'>): Promise<Certificado> => {
    const response = await fetch(`${API_URL}/certificados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certificado),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear certificado');
    }

    return response.json();
  },
};