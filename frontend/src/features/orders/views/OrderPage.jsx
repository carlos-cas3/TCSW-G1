import { useOrders } from "../hooks/useOrders";
import OrdenesGlobales from "../OrdenesGlobales";
import { RefreshCw, AlertCircle, Loader2 } from "lucide-react";

export default function OrderPage() {
  const { ordenes, loading, error, reload } = useOrders();

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
        <Loader2 size={40} className="mb-3 text-primary animate-spin" />
        <p className="mb-0">Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="mb-4 p-4 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-4 d-flex align-items-center gap-3">
          <AlertCircle size={24} className="text-danger flex-shrink-0" />
          <div>
            <p className="fw-semibold text-danger mb-1">Error al cargar las órdenes</p>
            <p className="text-secondary mb-0 small">{error}</p>
          </div>
        </div>
        <button className="btn btn-outline-primary rounded-3 px-4 d-flex align-items-center gap-2" onClick={reload}>
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    );
  }

  return <OrdenesGlobales ordenes={ordenes} />;
}
