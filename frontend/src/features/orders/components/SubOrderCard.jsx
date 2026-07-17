import { MapPin } from 'lucide-react';
import { formatIdSubOrden, formatIdItem, getBadgeEstado, getBadgeItem, renderEstadoVendedor, renderEstadoItem } from '../utils/formatters';

export default function SubOrderCard({ sub, index }) {
  return (
    <div key={sub.idSOrden || index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {sub.nombreVendedor ? `${sub.nombreVendedor} (ID: ${sub.idVendedor})` : `Vendedor #${sub.idVendedor}`}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            {formatIdSubOrden(sub.idSOrden)}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getBadgeEstado(sub.estadoParcialVendedor)}`}>
            {renderEstadoVendedor(sub.estadoParcialVendedor)}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-900">Subtotal: S/ {sub.montoSubTotalVendedor}</span>
      </div>

      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gray-400" />
            <span className="font-medium text-gray-700">Envío:</span>
            <span>{sub.direccionEnvio} ({sub.distritoEnvio})</span>
          </div>
          <div className="sm:ml-auto flex gap-3">
            <span><span className="font-medium text-gray-700">Método:</span> {sub.metodoEnvio}</span>
            <span><span className="font-medium text-gray-700">Telf:</span> {sub.telefonoContacto || "No registrado"}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left font-medium text-gray-500 pb-2 pr-3 whitespace-nowrap">ID Ítem</th>
                <th className="text-left font-medium text-gray-500 pb-2 pr-3 whitespace-nowrap">Producto</th>
                <th className="text-center font-medium text-gray-500 pb-2 pr-3 whitespace-nowrap">Cant.</th>
                <th className="text-center font-medium text-gray-500 pb-2 pr-3 whitespace-nowrap">Devuelto</th>
                <th className="text-center font-medium text-gray-500 pb-2 pr-3 whitespace-nowrap">Neto</th>
                <th className="text-center font-medium text-gray-500 pb-2 pr-3 whitespace-nowrap">Estado</th>
                <th className="text-right font-medium text-gray-500 pb-2 pr-3 whitespace-nowrap">P. Unitario</th>
                <th className="text-right font-medium text-gray-500 pb-2 whitespace-nowrap">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {sub.items.map((item, itemIdx) => (
                  <tr key={item.idOItem || itemIdx} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pr-3 font-semibold text-gray-500 text-[11px]">{formatIdItem(item.idOItem)}</td>
                    <td className="py-2 pr-3 font-medium text-gray-900">{item.idProducto}</td>
                    <td className="py-2 pr-3 text-center">{item.cantidad}</td>
                    <td className="py-2 pr-3 text-center text-red-500 font-medium">{item.cantidadDevuelta || 0}</td>
                    <td className="py-2 pr-3 text-center font-medium text-gray-900">
                      {item.estadoItem === 2 ? 0 : (item.cantidad - (item.cantidadDevuelta || 0))}
                    </td>
                    <td className="py-2 pr-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getBadgeItem(item.estadoItem)}`}>
                        {renderEstadoItem(item.estadoItem)}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-right text-gray-500">S/ {item.precioUnitario}</td>
                    <td className="py-2 text-right font-medium text-gray-900">
                      S/ {item.estadoItem === 2 ? '0.00' : ((item.cantidad - (item.cantidadDevuelta || 0)) * item.precioUnitario).toFixed(2)}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
