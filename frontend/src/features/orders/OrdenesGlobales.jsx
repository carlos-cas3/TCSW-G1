import { useState } from 'react';
import { formatIdOrden, getBadgeEstado, renderEstadoOrden } from './utils/formatters';
import FilterBar from './components/FilterBar';
import EmptyState from './components/EmptyState';
import OrderDetailModal from './components/OrderDetailModal';

const ESTADOS_ORDEN = [1, 2, 3, 4, 5];

export default function OrdenesGlobales({ ordenes }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroFechaOrdenes, setFiltroFechaOrdenes] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('all');
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirDetalles = (orden) => {
    setOrdenSeleccionada(orden);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setOrdenSeleccionada(null);
  };

  const ordenesFiltradas = ordenes.filter(orden => {
    const termino = terminoBusqueda.toLowerCase().trim();
    const cumpleTexto = !termino ? true : (
      orden.idOMaestra.toString().includes(termino) ||
      formatIdOrden(orden.idOMaestra).toLowerCase().includes(termino) ||
      (orden.clienteNombre && orden.clienteNombre.toLowerCase().includes(termino)) ||
      (orden.clienteDni && orden.clienteDni.includes(termino))
    );

    let cumpleFecha = true;
    if (filtroFechaOrdenes) {
      const fechaOrdenStr = orden.fechaCreacion.split('T')[0];
      cumpleFecha = fechaOrdenStr === filtroFechaOrdenes;
    }

    const cumpleEstado = filtroEstado === 'all' || orden.estadoGlobal === parseInt(filtroEstado);

    return cumpleTexto && cumpleFecha && cumpleEstado;
  });

  const headerClass = "text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3";
  const cellClass = "px-4 py-3 text-sm";

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 pb-0 flex flex-wrap items-end gap-3">
          <FilterBar
            terminoBusqueda={terminoBusqueda}
            setTerminoBusqueda={setTerminoBusqueda}
            filtroFechaOrdenes={filtroFechaOrdenes}
            setFiltroFechaOrdenes={setFiltroFechaOrdenes}
          />
          <div className="flex items-center gap-2 pb-[1px]">
            <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Estado:</label>
            <select
              className="text-sm px-3 py-[7px] rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="all">Todos</option>
              {ESTADOS_ORDEN.map((est) => (
                <option key={est} value={est}>{renderEstadoOrden(est)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 pt-0">
          {ordenes.length === 0 && (
            <EmptyState mensaje="No hay órdenes registradas todavía." />
          )}

          {ordenes.length > 0 && ordenesFiltradas.length === 0 && (
            <EmptyState mensaje="No se encontraron órdenes que coincidan con los filtros aplicados." />
          )}

          {ordenesFiltradas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className={headerClass}>ID Orden Maestra</th>
                    <th className={headerClass}>Fecha</th>
                    <th className={headerClass}>Cliente</th>
                    <th className={headerClass}>DNI</th>
                    <th className={headerClass}>Estado Logístico</th>
                    <th className={headerClass}>Monto Total</th>
                    <th className={`${headerClass} text-right`}> Detalles </th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesFiltradas.map(orden => (
                    <tr key={orden.idOMaestra} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className={`${cellClass} font-semibold text-gray-900`}>{formatIdOrden(orden.idOMaestra)}</td>
                      <td className={`${cellClass} text-gray-500`}>
                        {new Date(orden.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className={`${cellClass} text-gray-700`}>{orden.clienteNombre}</td>
                      <td className={`${cellClass} text-gray-500`}>{orden.clienteDni}</td>
                      <td className={cellClass}>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeEstado(orden.estadoGlobal)}`}>
                          {renderEstadoOrden(orden.estadoGlobal)}
                        </span>
                      </td>
                      <td className={`${cellClass} font-medium text-emerald-600`}>S/ {orden.montoTotalMaestro}</td>
                      <td className={`${cellClass} text-right`}>
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={() => abrirDetalles(orden)}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {mostrarModal && ordenSeleccionada && (
        <OrderDetailModal orden={ordenSeleccionada} onClose={cerrarModal} />
      )}
    </>
  );
}
