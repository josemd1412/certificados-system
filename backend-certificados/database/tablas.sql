CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) UNIQUE NOT NULL,
  descripcion TEXT,
  folder_id_drive VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificados (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  dni VARCHAR(20) NOT NULL,
  nombre_alumno VARCHAR(255) NOT NULL,
  nombre_curso VARCHAR(255) NOT NULL,
  fecha_emision DATE NOT NULL,
  url_drive VARCHAR(500) NOT NULL,
  file_id_drive VARCHAR(100),
  curso_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_codigo ON certificados(codigo);
CREATE INDEX IF NOT EXISTS idx_dni ON certificados(dni);
CREATE INDEX IF NOT EXISTS idx_curso ON certificados(nombre_curso);
CREATE INDEX IF NOT EXISTS idx_fecha ON certificados(fecha_emision);
CREATE INDEX IF NOT EXISTS idx_curso_id ON certificados(curso_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_cursos_updated_at ON cursos;
CREATE TRIGGER update_cursos_updated_at
    BEFORE UPDATE ON cursos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_certificados_updated_at ON certificados;
CREATE TRIGGER update_certificados_updated_at
    BEFORE UPDATE ON certificados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
