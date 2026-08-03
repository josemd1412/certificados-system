import type { Certificado } from '../types/certificado';

interface Props {
  certificado: Certificado;
  onSeleccionar?: (id: number, seleccionado: boolean) => void;
  seleccionado?: boolean;
  modoSeleccion?: boolean;
}

export const TarjetaCertificado = ({
  certificado,
  onSeleccionar,
  seleccionado = false,
  modoSeleccion = false,
}: Props) => {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDescargar = () => {
    window.open(certificado.url_drive, '_blank');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSeleccionar) {
      onSeleccionar(certificado.id, e.target.checked);
    }
  };

  return (
    <div className={`tarjeta-certificado ${seleccionado ? 'seleccionada' : ''}`}>
      {modoSeleccion && (
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={seleccionado}
            onChange={handleCheckboxChange}
            id={`cert-${certificado.id}`}
          />
          <label htmlFor={`cert-${certificado.id}`}></label>
        </div>
      )}

      <div className="certificado-header">
        <h3>{certificado.nombre_curso}</h3>
        <span className="codigo-badge">{certificado.codigo}</span>
      </div>

      <div className="certificado-info">
        <div className="info-row">
          <span className="label">Alumno:</span>
          <span className="value">{certificado.nombre_alumno}</span>
        </div>
        <div className="info-row">
          <span className="label">DNI:</span>
          <span className="value">{certificado.dni}</span>
        </div>
        <div className="info-row">
          <span className="label">Fecha de Emisión:</span>
          <span className="value">{formatearFecha(certificado.fecha_emision)}</span>
        </div>
      </div>

      <div className="certificado-actions">
        <button className="btn-download" onClick={handleDescargar}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 11L4 7h2.5V2h3v5H12L8 11z"
              fill="currentColor"
            />
            <path
              d="M2 12h12v2H2v-2z"
              fill="currentColor"
            />
          </svg>
          Descargar Certificado
        </button>
      </div>
    </div>
  );
};