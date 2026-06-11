import { Search, Calendar } from 'lucide-react';

const INPUT_STYLE = "w-full bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
const ICON_STYLE = "flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-400";

export default function FilterBar({ terminoBusqueda, setTerminoBusqueda, filtroFechaOrdenes, setFiltroFechaOrdenes }) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex grow items-center min-w-[280px]">
        <span className={`${ICON_STYLE} border-r-0 rounded-l-lg px-3 h-9`}>
          <Search size={16} />
        </span>
        <input
          type="text"
          className={`${INPUT_STYLE} border-l-0 rounded-r-lg px-3 h-9`}
          placeholder="Buscar por ID de pedido, cliente o DNI..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
      </div>

      <div className="flex items-center">
        <span className={`${ICON_STYLE} border-r-0 rounded-l-lg px-3 h-9`}>
          <Calendar size={16} />
        </span>
        <input
          type="date"
          className={`${INPUT_STYLE} border-l-0 rounded-r-lg px-3 h-9 cursor-pointer`}
          value={filtroFechaOrdenes}
          onChange={(e) => setFiltroFechaOrdenes(e.target.value)}
        />
      </div>
    </div>
  );
}
