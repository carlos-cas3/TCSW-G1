import { useState } from "react";
import { X, Search, Package } from "lucide-react";

const CATALOGO_MOCK = [
  { id: "SKU-001", nombre: "Zapatillas Running Pro", precio: 189.90, talla: "42" },
  { id: "SKU-002", nombre: "Zapatillas Trail X", precio: 159.90, talla: "41" },
  { id: "SKU-003", nombre: "Polo Deportivo M", precio: 49.90, talla: "M" },
  { id: "SKU-004", nombre: "Short Running L", precio: 39.90, talla: "L" },
  { id: "SKU-005", nombre: "Gorra Deportiva", precio: 29.90, talla: "Única" },
  { id: "SKU-006", nombre: "Medias Antiampolla", precio: 19.90, talla: "Única" },
];

export default function CambioProductoModal({ creditoDisponible, onClose, onSelect }) {
  const [busqueda, setBusqueda] = useState("");

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const filtrados = CATALOGO_MOCK.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">Catálogo de Productos</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <span className="px-3 text-gray-400"><Search size={18} /></span>
            <input
              type="text"
              placeholder="Buscar producto por nombre o SKU..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 py-2.5 px-1 outline-none text-sm"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Crédito disponible: <strong className="text-emerald-600">S/ {creditoDisponible.toFixed(2)}</strong>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtrados.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No se encontraron productos.</p>
          ) : (
            filtrados.map((producto) => (
              <button
                key={producto.id}
                onClick={() => onSelect(producto)}
                className="w-full text-left border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{producto.nombre}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    SKU: {producto.id} | Talla: {producto.talla}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-bold text-gray-900">S/ {producto.precio.toFixed(2)}</p>
                  {producto.precio <= creditoDisponible ? (
                    <span className="text-xs text-emerald-600 font-medium">Cubre crédito</span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">Excede crédito</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
