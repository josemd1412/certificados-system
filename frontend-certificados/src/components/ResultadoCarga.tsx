import type { ResumenCarga } from '../types/curso';

interface Props {
  resultados: ResumenCarga;
  onCerrar: () => void;
  onNuevaCarga: () => void;
}

export const ResultadoCarga = ({ resultados, onCerrar, onNuevaCarga }: Props) => {
  const { exitosos, fallidos, total, detalles } = resultados;

  const descargarReporte = () => {
    const csv = [
      ['DNI', 'Nombre', 'Archivo', 'Código', 'Estado', 'Mensaje'],
      ...detalles.map(d => [
        d.dni || '',
        d.nombre || '',
        d.archivo,
        d.codigo || '',
        d.status === 'ok' ? 'Exitoso' : 'Error',
        d.mensaje || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-carga-${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="resultado-carga">
      {/* Resumen */}
      <div className="resumen-cards">
        <div className="resumen-card total">
          <div className="resumen-numero">{total}</div>
          <div className="resumen-label">Total Procesados</div>
        </div>
        <div className="resumen-card exitoso">
          <div className="resumen-numero">{exitosos}</div>
          <div className="resumen-label">Exitosos</div>
        </div>
        <div className="resumen-card fallido">
          <div className="resumen-numero">{fallidos}</div>
          <div className="resumen-label">Fallidos</div>
        </div>
      </div>

      {/* Mensaje de éxito/error */}
      {exitosos === total ? (
        <div className="alert alert-success">
          <strong>🎉 ¡Carga completada exitosamente!</strong>
          <p>Todos los certificados fueron procesados correctamente.</p>
        </div>
      ) : fallidos === total ? (
        <div className="alert alert-error">
          <strong>❌ Error en la carga</strong>
          <p>Ningún certificado pudo ser procesado. Revisa los detalles abajo.</p>
        </div>
      ) : (
        <div className="alert alert-warning">
          <strong>⚠️ Carga parcial</strong>
          <p>{exitosos} certificados fueron procesados, pero {fallidos} tuvieron errores.</p>
        </div>
      )}

      {/* Tabla de detalles */}
      <div className="detalles-container">
        <div className="detalles-header">
          <h4>Detalles de la Carga</h4>
          <button className="btn btn-secondary btn-sm" onClick={descargarReporte}>
            📥 Descargar Reporte CSV
          </button>
        </div>

        <div className="tabla-wrapper">
          <table className="tabla-resultados">
            <thead>
              <tr>
                <th>Estado</th>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Archivo</th>
                <th>Código</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index} className={detalle.status}>
                  <td>
                    {detalle.status === 'ok' ? (
                      <span className="badge badge-success">✓ OK</span>
                    ) : (
                      <span className="badge badge-error">✗ Error</span>
                    )}
                  </td>
                  <td>{detalle.dni || '-'}</td>
                  <td>{detalle.nombre || '-'}</td>
                  <td className="archivo-col">{detalle.archivo}</td>
                  <td className="codigo-col">{detalle.codigo || '-'}</td>
                  <td className="mensaje-col">{detalle.mensaje || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCerrar}>
          Cerrar
        </button>
        <button className="btn btn-primary" onClick={onNuevaCarga}>
          Nueva Carga
        </button>
      </div>
    </div>
  );
};
