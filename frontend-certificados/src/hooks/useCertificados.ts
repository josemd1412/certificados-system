import { useState } from 'react';
import type { Certificado, FiltrosBusqueda } from '../types/certificado';
import { certificadoApi } from '../services/certificadoApi';

export const useCertificados = () => {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarCertificados = async (filtros: FiltrosBusqueda) => {
    setLoading(true);
    setError(null);

    try {
      const resultados = await certificadoApi.buscarCertificados(filtros);
      setCertificados(resultados);
    } catch (err) {
      setError('Error al buscar certificados. Por favor, intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarResultados = () => {
    setCertificados([]);
    setError(null);
  };

  return {
    certificados,
    loading,
    error,
    buscarCertificados,
    limpiarResultados,
  };
};