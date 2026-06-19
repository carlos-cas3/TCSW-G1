import { X, MapPin } from 'lucide-react';
import { formatIdSubOrden, formatIdOrden, formatIdItem, getBadgeEstado, renderEstadoVendedor, getBadgeItem, renderEstadoItem } from '../../orders/utils/formatters';

const ESTADOS = [
  { value: 1, label: '1 - PENDIENTE' },
  { value: 2, label: '2 - PREPARACIÓN' },
  { value: 3, label: '3 - DESPACHADO' },
  { value: 4, label: '4 - ENTREGADO' },
];

export default function LogisticaModal({ subOrden, onClose, onCambiarEstado }) {
  if (!subOrden) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-start justify-between gap-4 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Sub-Orden {formatIdSubOrden(subOrden.idSOrden)}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-medium text-gray-500">
                Orden maestra: {formatIdOrden(subOrden.idOMaestra)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeEstado(subOrden.estadoParcialVendedor)}`}>
                {renderEstadoVendedor(subOrden.estadoParcialVendedor)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex-1">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Datos del Cliente</h4>
              <p className="text-sm mb-1"><span className="font-semibold">Nombre:</span> {subOrden.clienteNombre}</p>
              <p className="text-sm"><span className="font-semibold">DNI:</span> {subOrden.clienteDni}</p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl flex flex-col justify-center min-w-[180px]">
              <p className="text-sm text-emerald-800 font-medium mb-1">Subtotal:</p>
              <p className="text-3xl font-bold text-emerald-600">S/ {subOrden.montoSubTotalVendedor}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg mb-6">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-gray-400" />
              <span className="font-medium text-gray-700">Envío:</span>
              <span>{subOrden.direccionEnvio} ({subOrden.distritoEnvio})</span>
            </div>
            <div className="sm:ml-auto flex gap-3">
              <span><span className="font-medium text-gray-700">Método:</span> {subOrden.metodoEnvio}</span>
              <span><span className="font-medium text-gray-700">Telf:</span> {subOrden.telefonoContacto || "No registrado"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Items</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Estado:</span>
              <select
                className="text-xs font-bold px-2 py-1.5 rounded-lg border border-gray-300 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={subOrden.estadoParcialVendedor}
                onChange={(e) => {
                  onCambiarEstado(subOrden.idSOrden, parseInt(e.target.value));
                }}
              >
                {ESTADOS.map((est) => (
                  <option key={est.value} value={est.value}>{est.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">ID Ítem (Registro)</th>
                  <th className="px-4 py-3 font-medium">Producto</th>
                  <th className="px-4 py-3 font-medium text-center">Cant.</th>
                  <th className="px-4 py-3 font-medium text-center">Estado Ítem</th>
                  <th className="px-4 py-3 font-medium text-right">P. Unitario</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subOrden.items?.map((item, idx) => (
                  <tr key={item.idOItem || idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{formatIdItem(item.idOItem)}</td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{item.idProducto}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-semibold">{item.cantidad}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeItem(item.estadoItem)}`}>
                        {renderEstadoItem(item.estadoItem)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">S/ {item.precioUnitario}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      S/ {(item.cantidad * item.precioUnitario).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
