import { useState } from 'react';
import { FiltrosBusqueda } from './components/FiltrosBusqueda';
import { DescargaMasiva } from './components/DescargaMasiva';
import { VisorPDF } from './components/VisorPDF';
import { CargaCertificados } from './components/CargaCertificados';
import { useCertificados } from './hooks/useCertificados';
import type { Certificado } from './types/certificado';
import './App.css';

function App() {
  const { certificados, loading, error, buscarCertificados } = useCertificados();
  const [certificadoVisor, setCertificadoVisor] = useState<Certificado | null>(null);
  const [mostrarCarga, setMostrarCarga] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Sistema de Gestión de Certificados</h1>
          <p className="subtitle">Busca y descarga certificados de cursos</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="toolbar">
            <button
              className="btn btn-primary btn-cargar"
              onClick={() => setMostrarCarga(true)}
            >
              📤 Cargar Certificados
            </button>
          </div>

          <FiltrosBusqueda onBuscar={buscarCertificados} loading={loading} />

          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M8 4v4M8 10v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {!loading && !error && certificados.length === 0 && (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="12" y="8" width="40" height="48" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20h24M20 28h24M20 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3>No hay resultados</h3>
              <p>Utiliza los filtros de búsqueda para encontrar certificados</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Buscando certificados...</p>
            </div>
          )}

          {!loading && certificados.length > 0 && (
            <DescargaMasiva certificados={certificados} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Sistema de Certificados. Todos los derechos reservados.</p>
        </div>
      </footer>

      {certificadoVisor && (
        <VisorPDF certificado={certificadoVisor} onCerrar={() => setCertificadoVisor(null)} />
      )}

      {mostrarCarga && (
        <CargaCertificados onCerrar={() => setMostrarCarga(false)} />
      )}
    </div>
  );
}

export default App;