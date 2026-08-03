import { useState } from 'react';
import { SeleccionCurso } from './SeleccionCurso';
import { SubirArchivos } from './SubirArchivos';
import { ResultadoCarga } from './ResultadoCarga';
import type { Curso, ResumenCarga } from '../types/curso';
import '../styles/CargaCertificados.css';

interface Props {
  onCerrar: () => void;
}

export const CargaCertificados = ({ onCerrar }: Props) => {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [resultados, setResultados] = useState<ResumenCarga | null>(null);

  const handleCursoSeleccionado = (curso: Curso) => {
    setCursoSeleccionado(curso);
    setPaso(2);
  };

  const handleCargaCompletada = (resumen: ResumenCarga) => {
    setResultados(resumen);
    setPaso(3);
  };

  const handleReiniciar = () => {
    setPaso(1);
    setCursoSeleccionado(null);
    setResultados(null);
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {paso === 1 && '📚 Seleccionar Curso'}
            {paso === 2 && '📤 Subir Certificados'}
            {paso === 3 && '✅ Resultados de la Carga'}
          </h2>
          <button className="btn-close" onClick={onCerrar}>×</button>
        </div>

        {/* Indicador de pasos */}
        <div className="steps-indicator">
          <div className={`step ${paso >= 1 ? 'active' : ''} ${paso > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Curso</div>
          </div>
          <div className={`step-line ${paso > 1 ? 'active' : ''}`}></div>
          <div className={`step ${paso >= 2 ? 'active' : ''} ${paso > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Archivos</div>
          </div>
          <div className={`step-line ${paso > 2 ? 'active' : ''}`}></div>
          <div className={`step ${paso >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Resultado</div>
          </div>
        </div>

        <div className="modal-body">
          {paso === 1 && (
            <SeleccionCurso onSeleccionar={handleCursoSeleccionado} />
          )}

          {paso === 2 && cursoSeleccionado && (
            <SubirArchivos
              curso={cursoSeleccionado}
              onCompletado={handleCargaCompletada}
              onVolver={() => setPaso(1)}
            />
          )}

          {paso === 3 && resultados && (
            <ResultadoCarga
              resultados={resultados}
              onCerrar={onCerrar}
              onNuevaCarga={handleReiniciar}
            />
          )}
        </div>
      </div>
    </div>
  );
};
