import { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { formatIdOrden, formatIdSubOrden, getBadgeEstado, renderEstadoVendedor } from '../utils/formatters';
import { getAdminVendorOrders, getVendorOrdersByName } from '../services/orders.service';
import VendorOrderDetailModal from '../components/VendorOrderDetailModal';

const INPUT_STYLE = "w-full bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
const ICON_STYLE = "flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-400";

export default function VendorOrdersPortal() {
  const [idVendedorBusqueda, setIdVendedorBusqueda] = useState('');
  const [ordenesVendedor, setOrdenesVendedor] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [subOrdenSeleccionada, setSubOrdenSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [buscando, setBuscando] = useState(false);

  const buscarPorVendedor = async () => {
    const valor = idVendedorBusqueda.trim();
    if (!valor) return;

    setBuscando(true);
    setBusquedaRealizada(true);
    setFiltroFecha('');

    try {
      const esNumero = /^\d+$/.test(valor);
      const data = esNumero
        ? await getAdminVendorOrders(valor)
        : await getVendorOrdersByName(valor);

      setOrdenesVendedor(Array.isArray(data) ? data : []);
    } catch {
      setOrdenesVendedor([]);
    } finally {
      setBuscando(false);
    }
  };

  const abrirDetalles = (sub) => {
    setSubOrdenSeleccionada(sub);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setSubOrdenSeleccionada(null);
  };

  const subOrdenesFiltradas = ordenesVendedor.filter((sub) => {
    if (!filtroFecha) return true;
    const fechaStr = sub.fechaCreacionSub?.split('T')[0];
    return fechaStr === filtroFecha;
  });

  const headerClass = "text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3";
  const cellClass = "px-4 py-3 text-sm";

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Portal de Vendedores</h2>
          <p className="text-sm text-gray-500 mt-1">Consulta las ventas específicas asignadas a cada tienda</p>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex grow items-center min-w-[280px] max-w-[400px]">
              <span className={`${ICON_STYLE} border-r-0 rounded-l-lg px-3 h-9`}>
                <Search size={16} />
              </span>
              <input
                type="text"
                className={`${INPUT_STYLE} border-l-0 rounded-r-lg px-3 h-9`}
                placeholder="Ingresa el ID o nombre del vendedor..."
                value={idVendedorBusqueda}
                onChange={(e) => setIdVendedorBusqueda(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscarPorVendedor()}
              />
            </div>
            <button
              className="inline-flex items-center px-4 py-[7px] text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={buscarPorVendedor}
              disabled={!idVendedorBusqueda.trim() || buscando}
            >
              {buscando ? 'Buscando...' : 'Buscar'}
            </button>

            {busquedaRealizada && (
              <div className="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  className={`${INPUT_STYLE} rounded-lg px-3 h-9 cursor-pointer`}
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
                {filtroFecha && (
                  <button
                    className="text-red-400 hover:text-red-600 p-1 font-bold"
                    onClick={() => setFiltroFecha('')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {busquedaRealizada && (
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
                    <th className={`${headerClass} text-right`}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {subOrdenesFiltradas.length > 0 ? (
                    subOrdenesFiltradas.map((sub) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                        {buscando ? 'Buscando...' : 'No se encontraron ventas para esta búsqueda.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {mostrarModal && subOrdenSeleccionada && (
        <VendorOrderDetailModal orden={subOrdenSeleccionada} onClose={cerrarModal} />
      )}
    </>
  );
}
