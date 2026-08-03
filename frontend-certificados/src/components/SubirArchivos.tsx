import { useState, useRef } from 'react';
import { cursoService } from '../services/cursoService';
import type { Curso, ResumenCarga } from '../types/curso';

interface Props {
  curso: Curso;
  onCompletado: (resumen: ResumenCarga) => void;
  onVolver: () => void;
}

export const SubirArchivos = ({ curso, onCompletado, onVolver }: Props) => {
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [excel, setExcel] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const handlePdfsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 50) {
      alert('Máximo 50 certificados por carga');
      return;
    }

    // Validar que sean PDFs
    const pdfFiles = files.filter(f => f.type === 'application/pdf');
    if (pdfFiles.length !== files.length) {
      alert('Solo se permiten archivos PDF');
      return;
    }

    setPdfs(pdfFiles);
  };

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten archivos Excel (.xls, .xlsx)');
      return;
    }

    setExcel(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pdfs.length === 0) {
      alert('Debes seleccionar al menos un certificado PDF');
      return;
    }

    if (!excel) {
      alert('Debes seleccionar un archivo Excel');
      return;
    }

    try {
      setCargando(true);
      setProgreso(0);

      // Simular progreso
      const interval = setInterval(() => {
        setProgreso(prev => Math.min(prev + 10, 90));
      }, 200);

      const resumen = await cursoService.cargarCertificadosMasivo(
        curso.id!,
        pdfs,
        excel
      );

      clearInterval(interval);
      setProgreso(100);

      setTimeout(() => {
        onCompletado(resumen);
      }, 500);
    } catch (err: any) {
      alert(err.message);
      setCargando(false);
      setProgreso(0);
    }
  };

  const eliminarPdf = (index: number) => {
    setPdfs(pdfs.filter((_, i) => i !== index));
  };

  return (
    <div className="subir-archivos">
      <div className="curso-seleccionado">
        <strong>Curso seleccionado:</strong> {curso.nombre}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Subir PDFs */}
        <div className="upload-section">
          <h4>1. Certificados PDF (máximo 50)</h4>
          <div className="upload-zone">
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handlePdfsChange}
              disabled={cargando}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn btn-upload"
              onClick={() => pdfInputRef.current?.click()}
              disabled={cargando}
            >
              📁 Seleccionar PDFs
            </button>
            <p className="upload-hint">
              Los archivos PDF deben nombrarse como: certificadoa75162043.pdf
            </p>
          </div>

          {pdfs.length > 0 && (
            <div className="archivos-lista">
              <div className="archivos-header">
                <strong>{pdfs.length} archivo(s) seleccionado(s)</strong>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setPdfs([])}
                  disabled={cargando}
                >
                  Limpiar todo
                </button>
              </div>
              <div className="archivos-grid">
                {pdfs.slice(0, 10).map((pdf, index) => (
                  <div key={index} className="archivo-item">
                    <span className="archivo-nombre">{pdf.name}</span>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => eliminarPdf(index)}
                      disabled={cargando}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {pdfs.length > 10 && (
                  <div className="archivo-item mas">
                    +{pdfs.length - 10} más
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Subir Excel */}
        <div className="upload-section">
          <h4>2. Archivo Excel con datos de alumnos</h4>
          <div className="upload-zone">
            <input
              ref={excelInputRef}
              type="file"
              accept=".xls,.xlsx"
              onChange={handleExcelChange}
              disabled={cargando}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn btn-upload"
              onClick={() => excelInputRef.current?.click()}
              disabled={cargando}
            >
              📊 Seleccionar Excel
            </button>
            <p className="upload-hint">
              El Excel debe contener: dni, nombre_alumno, fecha_emision
            </p>
          </div>

          {excel && (
            <div className="archivo-seleccionado">
              <span>✅ {excel.name}</span>
              <button
                type="button"
                className="btn-remove"
                onClick={() => setExcel(null)}
                disabled={cargando}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Barra de progreso */}
        {cargando && (
          <div className="progreso-carga">
            <div className="progreso-barra">
              <div
                className="progreso-fill"
                style={{ width: `${progreso}%` }}
              ></div>
            </div>
            <p>Subiendo certificados... {progreso}%</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onVolver}
            disabled={cargando}
          >
            ← Volver
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={cargando || pdfs.length === 0 || !excel}
          >
            {cargando ? 'Cargando...' : `Subir ${pdfs.length} Certificado(s)`}
          </button>
        </div>
      </form>
    </div>
  );
};
