import { useState, useEffect } from 'react';
import { cursoService } from '../services/cursoService';
import type { Curso } from '../types/curso';

interface Props {
  onSeleccionar: (curso: Curso) => void;
}

export const SeleccionCurso = ({ onSeleccionar }: Props) => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursoService.obtenerTodos();
      setCursos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearCurso = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoNombre.trim()) {
      alert('El nombre del curso es requerido');
      return;
    }

    try {
      setCreando(true);
      const nuevoCurso = await cursoService.crear({
        nombre: nuevoNombre.trim(),
        descripcion: nuevaDescripcion.trim() || undefined,
      });

      // Agregar a la lista y seleccionar
      setCursos([nuevoCurso, ...cursos]);
      onSeleccionar(nuevoCurso);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreando(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={cargarCursos}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="seleccion-curso">
      {!mostrarFormulario ? (
        <>
          <div className="cursos-grid">
            {cursos.map((curso) => (
              <div
                key={curso.id}
                className="curso-card"
                onClick={() => onSeleccionar(curso)}
              >
                <div className="curso-icon">📚</div>
                <h3>{curso.nombre}</h3>
                {curso.descripcion && <p>{curso.descripcion}</p>}
                <div className="curso-meta">
                  Creado: {new Date(curso.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}

            <div
              className="curso-card curso-nuevo"
              onClick={() => setMostrarFormulario(true)}
            >
              <div className="curso-icon">➕</div>
              <h3>Crear Nuevo Curso</h3>
              <p>Click para crear un curso nuevo</p>
            </div>
          </div>
        </>
      ) : (
        <div className="formulario-curso">
          <h3>Crear Nuevo Curso</h3>
          <form onSubmit={handleCrearCurso}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Curso *</label>
              <input
                id="nombre"
                type="text"
                className="form-control"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Ej: Curso de Inteligencia Artificial"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción (opcional)</label>
              <textarea
                id="descripcion"
                className="form-control"
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
                placeholder="Descripción del curso..."
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setMostrarFormulario(false)}
                disabled={creando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={creando}
              >
                {creando ? 'Creando...' : 'Crear Curso'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
