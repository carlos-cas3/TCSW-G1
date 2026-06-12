import { useVendorOrders } from "../hooks/useVendorOrders";
import VendorOrdenes from "../components/VendorOrdenes";
import { RefreshCw, AlertCircle, Loader2 } from "lucide-react";

export default function VendorOrdersPage() {
  const { ordenesVendedor, loading, error, reload } = useVendorOrders();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 size={40} className="mb-4 text-blue-600 animate-spin" />
        <p className="text-base font-medium">Cargando tus ventas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 max-w-md">
          <AlertCircle size={28} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-700 mb-1">Error al cargar las ventas</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
        <button 
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-5 py-2.5 flex items-center gap-2 font-medium transition-colors shadow-sm" 
          onClick={reload}
        >
          <RefreshCw size={18} />
          Reintentar
        </button>
      </div>
    );
  }

  return <VendorOrdenes ordenes={ordenesVendedor} />;
}