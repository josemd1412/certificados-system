import { useState, useEffect } from 'react';
import type { Certificado } from '../types/certificado';
import { TarjetaCertificado } from './TarjetaCertificado';

interface Props {
  certificados: Certificado[];
}

export const DescargaMasiva = ({ certificados }: Props) => {
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    setSeleccionados(new Set());
  }, [certificados]);

  const handleSeleccionar = (id: number, seleccionado: boolean) => {
    const nuevosSeleccionados = new Set(seleccionados);
    if (seleccionado) {
      nuevosSeleccionados.add(id);
    } else {
      nuevosSeleccionados.delete(id);
    }
    setSeleccionados(nuevosSeleccionados);
  };

  const handleSeleccionarTodos = () => {
    if (seleccionados.size === certificados.length) {
      setSeleccionados(new Set());
    } else {
      setSeleccionados(new Set(certificados.map((c) => c.id)));
    }
  };

  const handleDescargarSeleccionados = async () => {
    if (seleccionados.size === 0) {
      alert('Por favor, seleccione al menos un certificado');
      return;
    }

    setDescargando(true);

    const certificadosSeleccionados = certificados.filter((c) =>
      seleccionados.has(c.id)
    );

    // Abrir cada certificado en una nueva pestaña con un pequeño delay
    for (let i = 0; i < certificadosSeleccionados.length; i++) {
      setTimeout(() => {
        window.open(certificadosSeleccionados[i].url_drive, '_blank');
      }, i * 500); // 500ms entre cada descarga para evitar bloqueos del navegador
    }

    setTimeout(() => {
      setDescargando(false);
      setSeleccionados(new Set());
    }, certificadosSeleccionados.length * 500 + 1000);
  };

  if (certificados.length === 0) {
    return null;
  }

  const todosSeleccionados = seleccionados.size === certificados.length;

  return (
    <div className="descarga-masiva">
      <div className="descarga-header">
        <div className="descarga-info">
          <h2>Resultados de Búsqueda</h2>
          <p>
            {certificados.length} certificado{certificados.length !== 1 ? 's' : ''} encontrado
            {certificados.length !== 1 ? 's' : ''}
            {seleccionados.size > 0 && ` · ${seleccionados.size} seleccionado${seleccionados.size !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="descarga-actions">
          <button
            className="btn-secondary"
            onClick={handleSeleccionarTodos}
            disabled={descargando}
          >
            {todosSeleccionados ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
          </button>
          <button
            className="btn-primary"
            onClick={handleDescargarSeleccionados}
            disabled={seleccionados.size === 0 || descargando}
          >
            {descargando ? 'Descargando...' : `Descargar ${seleccionados.size > 0 ? `(${seleccionados.size})` : ''}`}
          </button>
        </div>
      </div>

      <div className="certificados-grid">
        {certificados.map((certificado) => (
          <TarjetaCertificado
            key={certificado.id}
            certificado={certificado}
            onSeleccionar={handleSeleccionar}
            seleccionado={seleccionados.has(certificado.id)}
            modoSeleccion={true}
          />
        ))}
      </div>
    </div>
  );
};