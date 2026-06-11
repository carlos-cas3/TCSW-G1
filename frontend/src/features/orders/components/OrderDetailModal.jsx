import { X } from 'lucide-react';
import { formatIdOrden, getBadgeEstado, renderEstadoOrden } from '../utils/formatters';
import SubOrderCard from './SubOrderCard';

export default function OrderDetailModal({ orden, onClose }) {
  if (!orden) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Detalles de la Orden {formatIdOrden(orden.idOMaestra)}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Fecha de creación: {new Date(orden.fechaCreacion).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 bg-gray-50 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Datos del Cliente</h3>
                <p className="text-sm mb-1">
                  <span className="font-semibold text-gray-700">Nombre:</span> {orden.clienteNombre}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-gray-700">DNI:</span> {orden.clienteDni}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Método de Pago:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {orden.metodoPago}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Estado Global:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeEstado(orden.estadoGlobal)}`}>
                    {renderEstadoOrden(orden.estadoGlobal)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
                  <span className="text-sm font-semibold text-gray-700">Total Pagado:</span>
                  <span className="text-xl font-bold text-emerald-600">S/ {orden.montoTotalMaestro}</span>
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-0.5">
              Desglose por Vendedor ({orden.subOrdenes.length})
            </h3>

            <div className="flex flex-col gap-3">
              {orden.subOrdenes.map((sub, index) => (
                <SubOrderCard key={sub.idSOrden || index} sub={sub} index={index} />
              ))}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Cerrar Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
