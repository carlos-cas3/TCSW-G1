import { useState } from 'react';
import { formatIdOrden, formatIdSubOrden, getBadgeEstado, renderEstadoVendedor, getBadgeItem } from '../../orders/utils/formatters';
import FilterBar from '../../orders/components/FilterBar';
import EmptyState from '../../orders/components/EmptyState';
import HistorialModal from './HistorialModal';

const ESTADOS = [
  { value: 1, label: 'PENDIENTE' },
  { value: 2, label: 'PREPARACIÓN' },
  { value: 3, label: 'DESPACHADO' },
  { value: 4, label: 'ENTREGADO' },
];

export default function HistorialOrdenes({ subOrdenes = [] }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('all');
  const [subSeleccionada, setSubSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirDetalles = (sub) => {
    setSubSeleccionada(sub);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setSubSeleccionada(null);
  };

  const subOrdenesFiltradas = subOrdenes.filter((sub) => {
    const termino = terminoBusqueda.toLowerCase().trim();
    const cumpleTexto = !termino ? true : (
      sub.idSOrden.toString().includes(termino) ||
      formatIdSubOrden(sub.idSOrden).toLowerCase().includes(termino) ||
      (sub.idOMaestra && sub.idOMaestra.toString().includes(termino)) ||
      (sub.idOMaestra && formatIdOrden(sub.idOMaestra).toLowerCase().includes(termino)) ||
      (sub.distritoEnvio && sub.distritoEnvio.toLowerCase().includes(termino))
    );

    let cumpleFecha = true;
    if (filtroFecha) {
      const fechaStr = sub.fechaCreacionSub?.split('T')[0];
      cumpleFecha = fechaStr === filtroFecha;
    }

    const cumpleEstado = filtroEstado === 'all' || sub.estadoParcialVendedor === parseInt(filtroEstado);

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
            filtroFechaOrdenes={filtroFecha}
            setFiltroFechaOrdenes={setFiltroFecha}
            placeholder="Buscar por ID sub-orden, ID orden o destino..."
          />
          <div className="flex items-center gap-2 pb-[1px]">
            <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Estado:</label>
            <select
              className="text-sm px-3 py-[7px] rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="all">Todos</option>
              {ESTADOS.map((est) => (
                <option key={est.value} value={est.value}>{est.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 pt-0">
          {subOrdenes.length === 0 && (
            <EmptyState mensaje="No hay sub-órdenes en el historial." />
          )}

          {subOrdenes.length > 0 && subOrdenesFiltradas.length === 0 && (
            <EmptyState mensaje="No se encontraron sub-órdenes que coincidan con los filtros aplicados." />
          )}

          {subOrdenesFiltradas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className={headerClass}>ID Suborden</th>
                    <th className={headerClass}>ID Orden</th>
                    <th className={headerClass}>Fecha</th>
                    <th className={headerClass}>Destino</th>
                    <th className={headerClass}>Estado Logístico</th>
                    <th className={headerClass}>Activo</th>
                    <th className={headerClass}>Ingreso Total</th>
                    <th className={`${headerClass} text-right`}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {subOrdenesFiltradas.map((sub) => {
                    const activa = sub.activo;
                    return (
                      <tr key={sub.idSOrden} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className={`${cellClass} font-semibold text-gray-900`}>{formatIdSubOrden(sub.idSOrden)}</td>
                        <td className={`${cellClass} font-medium text-gray-500`}>
                          {sub.idOMaestra ? formatIdOrden(sub.idOMaestra) : 'N/A'}
                        </td>
                        <td className={`${cellClass} text-gray-500`}>
                          {new Date(sub.fechaCreacionSub).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className={`${cellClass} text-gray-700`}>{sub.distritoEnvio}</td>
                        <td className={cellClass}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeEstado(sub.estadoParcialVendedor)}`}>
                            {renderEstadoVendedor(sub.estadoParcialVendedor)}
                          </span>
                        </td>
                        <td className={cellClass}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeItem(activa ? 1 : 2)}`}>
                            {activa ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td className={`${cellClass} font-medium text-emerald-600`}>S/ {sub.montoSubTotalVendedor}</td>
                        <td className={`${cellClass} text-right`}>
                          <button
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                            onClick={() => abrirDetalles(sub)}
                          >
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {mostrarModal && subSeleccionada && (
        <HistorialModal
          subOrden={subOrdenes.find(s => s.idSOrden === subSeleccionada.idSOrden) ?? subSeleccionada}
          onClose={cerrarModal}
        />
      )}
    </>
  );
}
