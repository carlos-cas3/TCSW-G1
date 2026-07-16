import { useState } from 'react';
import { formatIdOrden, formatIdSubOrden, getBadgeEstado, renderEstadoVendedor } from '../utils/formatters';
import FilterBar from './FilterBar';
import EmptyState from './EmptyState';
import VendorOrderDetailModal from './VendorOrderDetailModal';

export default function VendorOrdenes({ ordenes = [] }) {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroFechaOrdenes, setFiltroFechaOrdenes] = useState('');
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

  const ordenesFiltradas = ordenes.filter(sub => {
    const termino = terminoBusqueda.toLowerCase().trim();
    const cumpleTexto = !termino ? true : (
      sub.idSOrden.toString().includes(termino) ||
      formatIdSubOrden(sub.idSOrden).toLowerCase().includes(termino) ||
      (sub.idOMaestra && sub.idOMaestra.toString().includes(termino)) ||
      (sub.idOMaestra && formatIdOrden(sub.idOMaestra).toLowerCase().includes(termino)) ||
      (sub.distritoEnvio && sub.distritoEnvio.toLowerCase().includes(termino))
    );

    let cumpleFecha = true;
    if (filtroFechaOrdenes) {
      const fechaSubStr = sub.fechaCreacionSub.split('T')[0];
      cumpleFecha = fechaSubStr === filtroFechaOrdenes;
    }

    return cumpleTexto && cumpleFecha;
  });

  const headerClass = "text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3";
  const cellClass = "px-4 py-3 text-sm";

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mis Ventas</h2>
            <p className="text-sm text-gray-500 mt-1">Gestiona los despachos asignados a tu tienda</p>
          </div>
          <FilterBar
            placeholder="Buscar por ID sub-orden, ID orden maestra o destino..."
            terminoBusqueda={terminoBusqueda}
            setTerminoBusqueda={setTerminoBusqueda}
            filtroFechaOrdenes={filtroFechaOrdenes}
            setFiltroFechaOrdenes={setFiltroFechaOrdenes}
          />
        </div>

        <div className="p-0">
          {ordenes.length === 0 && (
            <div className="p-8">
               <EmptyState mensaje="No tienes ventas registradas actualmente." />
            </div>
          )}

          {ordenes.length > 0 && ordenesFiltradas.length === 0 && (
            <div className="p-8">
              <EmptyState mensaje="No se encontraron ventas que coincidan con los filtros aplicados." />
            </div>
          )}

          {ordenesFiltradas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className={headerClass}>ID Sub-Orden</th>
                    <th className={headerClass}>ID Orden Maestra</th>
                    <th className={headerClass}>Fecha</th>
                    <th className={headerClass}>Destino</th>
                    <th className={headerClass}>Estado Logístico</th>
                    <th className={headerClass}>Ingreso Total</th>
                    <th className={`${headerClass} text-right`}>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenesFiltradas.map(sub => (
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {mostrarModal && ordenSeleccionada && (
        <VendorOrderDetailModal orden={ordenSeleccionada} onClose={cerrarModal} />
      )}
    </>
  );
}