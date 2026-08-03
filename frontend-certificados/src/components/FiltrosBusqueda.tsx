import { useState } from 'react';
import type { FormEvent } from 'react';
import type { FiltrosBusqueda as FiltrosType } from '../types/certificado';

interface Props {
  onBuscar: (filtros: FiltrosType) => void;
  loading: boolean;
}

export const FiltrosBusqueda = ({ onBuscar, loading }: Props) => {
  const [codigo, setCodigo] = useState('');
  const [dni, setDni] = useState('');
  const [curso, setCurso] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validar que al menos un campo esté lleno
    if (!codigo && !dni && !curso && !fechaInicio && !fechaFin) {
      alert('Por favor, ingrese al menos un criterio de búsqueda');
      return;
    }

    // Validar que si hay fechaInicio, también haya fechaFin y viceversa
    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
      alert('Por favor, ingrese ambas fechas para el rango');
      return;
    }

    const filtros: FiltrosType = {};
    if (codigo) filtros.codigo = codigo;
    if (dni) filtros.dni = dni;
    if (curso) filtros.curso = curso;
    if (fechaInicio) filtros.fechaInicio = fechaInicio;
    if (fechaFin) filtros.fechaFin = fechaFin;

    onBuscar(filtros);
  };

  const handleLimpiar = () => {
    setCodigo('');
    setDni('');
    setCurso('');
    setFechaInicio('');
    setFechaFin('');
  };

  return (
    <div className="filtros-busqueda">
      <h2>Búsqueda de Certificados</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="codigo">Código de Certificado</label>
            <input
              type="text"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej: CERT-2024-001"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dni">DNI del Alumno</label>
            <input
              type="text"
              id="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ej: 12345678"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="curso">Nombre del Curso</label>
            <input
              type="text"
              id="curso"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              placeholder="Ej: Curso de React"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaInicio">Fecha Inicio</label>
            <input
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaFin">Fecha Fin</label>
            <input
              type="date"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleLimpiar} disabled={loading}>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};