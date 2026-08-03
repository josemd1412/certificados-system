import { useState } from 'react';
import type { Certificado } from '../types/certificado';

interface Props {
  certificado: Certificado | null;
  onCerrar: () => void;
}

export const VisorPDF = ({ certificado, onCerrar }: Props) => {
  const [cargando, setCargando] = useState(true);

  if (!certificado) return null;

  const handleLoad = () => {
    setCargando(false);
  };

  const handleDescargar = () => {
    window.open(certificado.url_drive, '_blank');
  };

  // Extraer el file_id para generar URL de vista previa
  const getPreviewUrl = (url: string) => {
    // Convertir URL de Drive a formato de vista previa
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/[-\w]{25,}/)?.[0];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return url;
  };

  return (
    <div className="visor-pdf-overlay" onClick={onCerrar}>
      <div className="visor-pdf-container" onClick={(e) => e.stopPropagation()}>
        <div className="visor-header">
          <div className="visor-info">
            <h3>{certificado.nombre_curso}</h3>
            <p>{certificado.nombre_alumno}</p>
          </div>
          <div className="visor-actions">
            <button className="btn-icon" onClick={handleDescargar} title="Descargar">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 11L4 7h2.5V2h3v5H12L8 11z" fill="currentColor" />
                <path d="M2 12h12v2H2v-2z" fill="currentColor" />
              </svg>
            </button>
            <button className="btn-icon" onClick={onCerrar} title="Cerrar">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="visor-content">
          {cargando && (
            <div className="visor-loading">
              <div className="spinner"></div>
              <p>Cargando certificado...</p>
            </div>
          )}
          <iframe
            src={getPreviewUrl(certificado.url_drive)}
            title="Vista previa del certificado"
            onLoad={handleLoad}
            style={{ display: cargando ? 'none' : 'block' }}
          />
        </div>
      </div>
    </div>
  );
};