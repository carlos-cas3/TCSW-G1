import React from 'react';
import { 
  formatIdSubOrden, 
  formatIdItem, 
  getBadgeEstado, 
  renderEstadoVendedor,
  getBadgeItem,
  renderEstadoItem
} from '../utils/formatters';

export default function OrderDetailModal({ orden, onClose }) {
  // Si no hay orden, no dibujamos nada
  if (!orden) return null;

  // Permite cerrar el modal haciendo clic en el fondo oscuro
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* ================= HEADER ================= */}
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-start justify-between gap-4 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {orden.nombreVendedor} <span className="text-sm font-medium text-gray-500">(ID: {orden.idVendedor})</span>
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm">
                {formatIdSubOrden(orden.idSOrden)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeEstado(orden.estadoParcialVendedor)}`}>
                {renderEstadoVendedor(orden.estadoParcialVendedor)}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            
            {/* Caja de Subtotal */}
            <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-xl flex flex-col justify-center min-w-[220px]">
               <p className="text-sm text-emerald-800 font-medium mb-1">Subtotal:</p>
               <p className="text-3xl font-bold text-emerald-600">S/ {orden.montoSubTotalVendedor}</p>
            </div>

            {/* Caja de Envío */}
            <div className="flex-1 bg-blue-50/50 border border-blue-100 p-5 rounded-xl">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">
                Envío:
              </h4>
              <div className="space-y-1.5 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">
                  {orden.direccionEnvio} <span className="text-gray-500 font-normal">({orden.distritoEnvio})</span>
                </p>
                <p><span className="text-gray-500">Método:</span> {orden.metodoEnvio}</p>
                <p><span className="text-gray-500">Telf:</span> {orden.telefonoContacto || "No registrado"}</p>
              </div>
            </div>

          </div>

          {/* Tabla de Items */}
          <div>
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
                  {orden.items?.map((item, idx) => (
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

        </div>
        
        {/* ================= FOOTER ================= */}
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