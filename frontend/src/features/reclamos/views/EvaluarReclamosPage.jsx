import { useState, useEffect } from "react";
import {
  FileText, Loader2, AlertCircle, RefreshCw, Search,
  CheckCircle, XCircle, ClipboardList, MessageSquare,
  Package
} from "lucide-react";
import { getUser } from "../../../app/auth";
import { listarTicketsPorVendedor, aprobarTicket, rechazarTicket, obtenerDetalleItems } from "../services/reclamos.service";

const style = document.createElement("style");
style.textContent = `
  @keyframes slide-out-right {
    0% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateX(100%); }
  }
  .animate-slide-out {
    animation: slide-out-right 0.35s ease-in-out forwards;
    pointer-events: none;
  }
`;
document.head.appendChild(style);

const tipoLabels = {
  1: "Devolución de Dinero",
  2: "Cambio de Talla",
  3: "Cambio por Otro Producto",
  4: "Anulación",
};

const estadoBadge = (estado) => {
  switch (estado) {
    case 1: return "bg-amber-100 text-amber-800 border-amber-300";
    case 2: return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case 3: return "bg-red-100 text-red-800 border-red-300";
    default: return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

const estadoLabel = {
  1: "Pendiente",
  2: "Aprobado",
  3: "Rechazado",
};

const numFormatter = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatter = (value) => "S/ " + numFormatter.format(value);

export default function EvaluarReclamosPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detalleItems, setDetalleItems] = useState(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [actionComment, setActionComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [filterEstado, setFilterEstado] = useState("");
  const [removingTicketId, setRemovingTicketId] = useState(null);

  const user = getUser();
  const vendorId = user?.vendorId;

  const loadTickets = async () => {
    if (!vendorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listarTicketsPorVendedor(vendorId);
      setTickets(data || []);
    } catch (err) {
      setError(err.message || "Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadTickets();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  useEffect(() => {
    (async () => {
      if (!selectedTicket) {
        setDetalleItems(null);
        return;
      }
      if (selectedTicket.items?.length > 0) {
        setDetalleItems(null);
        return;
      }
      const ids = selectedTicket.itemsAAnular;
      if (!ids || ids.length === 0) {
        setDetalleItems(null);
        return;
      }
      setDetalleLoading(true);
      try {
        const data = await obtenerDetalleItems(ids);
        setDetalleItems(data || []);
      } catch {
        setDetalleItems([]);
      } finally {
        setDetalleLoading(false);
      }
    })();
  }, [selectedTicket]);

  const calcularTotalTicket = (ticket) => {
    if (!ticket.items) return 0;
    return ticket.items.reduce((sum, item) => sum + (item.montoAfectado || 0) * item.cantidadAfectada, 0);
  };

  const handleAprobar = async () => {
    if (!selectedTicket) return;
    setActionLoading(true);
    try {
      await aprobarTicket(selectedTicket.idTicket, {
        idAdminAccion: user.id,
        comentario: actionComment || "Aprobado por el vendedor",
      });
      const removedId = selectedTicket.idTicket;
      setSelectedTicket(null);
      setActionComment("");
      setRemovingTicketId(removedId);
      setTimeout(() => {
        setTickets((prev) => prev.filter((t) => t.idTicket !== removedId));
        setRemovingTicketId(null);
      }, 350);
    } catch (err) {
      alert("Error al aprobar: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!selectedTicket) return;
    setActionLoading(true);
    try {
      await rechazarTicket(selectedTicket.idTicket, {
        idAdminAccion: user.id,
        comentario: actionComment || "Rechazado por el vendedor",
      });
      const removedId = selectedTicket.idTicket;
      setSelectedTicket(null);
      setActionComment("");
      setRemovingTicketId(removedId);
      setTimeout(() => {
        setTickets((prev) => prev.filter((t) => t.idTicket !== removedId));
        setRemovingTicketId(null);
      }, 350);
    } catch (err) {
      alert("Error al rechazar: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Combina items del ticket + items obtenidos del backend (para tickets viejos sin items)
  const getItemsParaMostrar = () => {
    if (!selectedTicket) return [];
    if (selectedTicket.items?.length > 0) return selectedTicket.items;
    if (detalleItems?.length > 0) {
      return detalleItems.map((d) => ({
        idOItemRef: d.idOItem,
        nombreProducto: `Producto (SKU: ${d.idProducto})`,
        sku: d.idProducto,
        cantidadAfectada: d.cantidad,
        montoAfectado: d.precioUnitario,
      }));
    }
    return [];
  };

  const filtrados = tickets.filter((t) => {
    if (filterEstado && t.estadoTicket !== Number(filterEstado)) return false;
    return true;
  });

  if (!vendorId) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 font-medium">No se encontró información del vendedor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList size={28} className="text-amber-600 shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-amber-800">Reclamos por Atender</h2>
            <p className="text-sm text-amber-600">Evalúa y aprueba o rechaza los tickets de reclamo</p>
          </div>
        </div>
        <button
          onClick={loadTickets}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-white border border-amber-200 rounded-lg px-4 py-2 hover:bg-amber-100 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Recargar
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Loader2 size={40} className="mb-4 text-amber-600 animate-spin" />
          <p className="text-base font-medium">Cargando tickets...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 mb-4">
            <AlertCircle size={24} className="text-red-500 shrink-0" />
            <p className="font-semibold text-red-700">{error}</p>
          </div>
          <button
            onClick={loadTickets}
            className="bg-white border border-gray-300 rounded-lg px-5 py-2 flex items-center gap-2 font-medium hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} /> Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 text-gray-400"><Search size={16} /></span>
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="py-2 px-2 outline-none text-sm bg-white"
              >
                <option value="">Todos los estados</option>
                <option value="1">Pendiente</option>
                <option value="2">Aprobado</option>
                <option value="3">Rechazado</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {filtrados.length} de {tickets.length} tickets
            </span>
          </div>

          <div className="space-y-3">
            {filtrados.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 font-medium">No hay tickets que evaluar</p>
              </div>
            ) : (
                filtrados.map((ticket) => {
                const totalTicket = calcularTotalTicket(ticket);
                const isRemoving = removingTicketId === ticket.idTicket;
                return (
                <div
                  key={ticket.idTicket}
                  onClick={() => !isRemoving && setSelectedTicket(ticket)}
                  className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all cursor-pointer ${
                    isRemoving ? "animate-slide-out" : ""
                  } ${
                    ticket.estadoTicket === 1 ? "border-amber-300 hover:border-amber-500" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                            #{ticket.idTicket}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoBadge(ticket.estadoTicket)}`}>
                            {estadoLabel[ticket.estadoTicket]}
                          </span>
                          <span className="text-xs text-gray-400">|</span>
                          <span className="text-xs font-semibold text-gray-700">{tipoLabels[ticket.tipoSolicitud] || `Tipo ${ticket.tipoSolicitud}`}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Orden <strong>#{ticket.idOMaestraRef}</strong> — 
                          {ticket.fechaApertura ? ` ${new Date(ticket.fechaApertura).toLocaleDateString("es-ES")}` : " —"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Motivo</p>
                        <p className="text-sm text-gray-700 max-w-[200px] truncate">{ticket.motivoReclamo || "—"}</p>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap mb-2">
                      {ticket.items?.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {ticket.items.reduce((s, i) => s + i.cantidadAfectada, 0)} unidades afectadas ({ticket.items.length} items)
                        </span>
                      )}
                      {ticket.subOrdenesAAnular?.length > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          {ticket.subOrdenesAAnular.length} sub-orden(es) a anular
                        </span>
                      )}
                      {ticket.itemsAAnular?.length > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          {ticket.itemsAAnular.length} item(s) a anular
                        </span>
                      )}
                      {totalTicket > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          {formatter(totalTicket)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-amber-600 font-medium">Click para ver detalle</p>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </>
      )}

      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setSelectedTicket(null); setActionComment(""); } }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList size={20} />
                Evaluar Ticket #{selectedTicket.idTicket}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {tipoLabels[selectedTicket.tipoSolicitud]} — {estadoLabel[selectedTicket.estadoTicket]}
                {selectedTicket.dniCliente && <span> — DNI: <strong>{selectedTicket.dniCliente}</strong></span>}
              </p>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MessageSquare size={12} /> Motivo del reclamo
                </p>
                <p className="text-sm text-gray-800">{selectedTicket.motivoReclamo || "Sin motivo"}</p>
              </div>

              {detalleLoading ? (
                <div className="flex items-center justify-center py-4 text-gray-500">
                  <Loader2 size={20} className="animate-spin mr-2" /> Cargando detalle de productos...
                </div>
              ) : (
                <>
                  {/* Tabla de productos */}
                  {getItemsParaMostrar().length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                        <Package size={12} /> Productos afectados
                      </p>
                      <table className="w-full text-xs border border-gray-100 rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left px-3 py-2 font-semibold text-gray-600">Producto</th>
                            <th className="text-left px-3 py-2 font-semibold text-gray-600">SKU</th>
                            <th className="text-center px-3 py-2 font-semibold text-gray-600">Cant.</th>
                            <th className="text-right px-3 py-2 font-semibold text-gray-600">P. Unit.</th>
                            <th className="text-right px-3 py-2 font-semibold text-gray-600">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {getItemsParaMostrar().map((item, i) => (
                            <tr key={i}>
                              <td className="px-3 py-2 font-medium text-gray-700">{item.nombreProducto || `Producto #${item.idOItemRef}`}</td>
                              <td className="px-3 py-2 text-gray-500">{item.sku || "—"}</td>
                              <td className="px-3 py-2 text-center text-gray-600">{item.cantidadAfectada}</td>
                              <td className="px-3 py-2 text-right text-gray-600">{item.montoAfectado != null ? formatter(item.montoAfectado) : "—"}</td>
                              <td className="px-3 py-2 text-right font-semibold text-gray-800">{item.montoAfectado != null ? formatter(item.montoAfectado * item.cantidadAfectada) : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Si no hay items y se están cargando */}
                  {getItemsParaMostrar().length === 0 && selectedTicket.itemsAAnular?.length > 0 && (
                    <p className="text-xs text-gray-500 italic">Cargando detalles de productos anulados...</p>
                  )}
                </>
              )}

              {selectedTicket.subOrdenesAAnular?.length > 0 && (
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 mb-1">Sub-órdenes a anular:</p>
                  <p className="text-sm text-red-600">{selectedTicket.subOrdenesAAnular.join(", ")}</p>
                </div>
              )}

              {selectedTicket.itemsAAnular?.length > 0 && (
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 mb-1">Items a anular:</p>
                  <p className="text-sm text-red-600">{selectedTicket.itemsAAnular.join(", ")}</p>
                </div>
              )}

              {(selectedTicket.tipoSolicitud === 1 || selectedTicket.tipoSolicitud === 4) && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1">
                    Saldo a generar
                  </p>
                  <p className="text-sm text-emerald-800">
                    Al aprobar se generará un saldo a favor del cliente por{" "}
                    <strong className="text-emerald-700">{formatter(calcularTotalTicket(selectedTicket))}</strong>
                  </p>
                </div>
              )}

              {selectedTicket.estadoTicket === 1 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Comentario</label>
                  <textarea
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-400 resize-none"
                    placeholder="Opcional: agregar un comentario..."
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button
                onClick={() => { setSelectedTicket(null); setActionComment(""); }}
                className="flex-1 py-2.5 font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cerrar
              </button>
              {selectedTicket.estadoTicket === 1 && (
                <>
                  <button
                    onClick={handleAprobar}
                    disabled={actionLoading || detalleLoading}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Aprobar
                  </button>
                  <button
                    onClick={handleRechazar}
                    disabled={actionLoading || detalleLoading}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                    Rechazar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}