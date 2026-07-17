import { useState, useEffect } from "react";
import {
  FileText, Loader2, AlertCircle, RefreshCw, Search,
  ClipboardList, MessageSquare, Clock, CheckCircle,
  XCircle, Package, User, Calendar
} from "lucide-react";
import { listarTodosLosTickets, obtenerHistorial } from "../services/reclamos.service";

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
const dateFormatter = (d) => d ? new Date(d).toLocaleDateString("es-ES", { timeZone: "UTC" }) : "—";
const dateTimeFormatter = (d) => d ? new Date(d).toLocaleString("es-ES") : "—";

export default function HistorialReclamosPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstado, setFilterEstado] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarTodosLosTickets();
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
  }, []);

  const openHistorial = async (ticket) => {
    setSelectedTicket(ticket);
    setHistorialLoading(true);
    setHistorial([]);
    try {
      const data = await obtenerHistorial(ticket.idTicket);
      setHistorial(data || []);
    } catch {
      setHistorial([]);
    } finally {
      setHistorialLoading(false);
    }
  };

  const calcularTotalTicket = (ticket) => {
    if (!ticket.items) return 0;
    return ticket.items.reduce((sum, item) => sum + (item.montoAfectado || 0) * item.cantidadAfectada, 0);
  };

  const filtrados = tickets.filter((t) => {
    if (filterEstado && t.estadoTicket !== Number(filterEstado)) return false;
    if (searchText) {
      const q = searchText.toLowerCase();
      const matchId = String(t.idTicket).includes(q);
      const matchOrden = String(t.idOMaestraRef).includes(q);
      const matchDni = (t.dniCliente || "").includes(q);
      const matchMotivo = (t.motivoReclamo || "").toLowerCase().includes(q);
      if (!matchId && !matchOrden && !matchDni && !matchMotivo) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList size={28} className="text-blue-600 shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-blue-800">Historial de Reclamos</h2>
            <p className="text-sm text-blue-600">Todos los tickets y sus resoluciones</p>
          </div>
        </div>
        <button
          onClick={loadTickets}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-100 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Recargar
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Loader2 size={40} className="mb-4 text-blue-600 animate-spin" />
          <p className="text-base font-medium">Cargando tickets...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 mb-4">
            <AlertCircle size={24} className="text-red-500 shrink-0" />
            <p className="font-semibold text-red-700">{error}</p>
          </div>
          <button onClick={loadTickets} className="bg-white border border-gray-300 rounded-lg px-5 py-2 font-medium hover:bg-gray-50 transition-colors">
            <RefreshCw size={16} className="inline mr-1" /> Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-1 min-w-[200px]">
              <span className="px-3 text-gray-400"><Search size={16} /></span>
              <input
                type="text"
                placeholder="Buscar por #ID, orden o motivo..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1 py-2 px-1 outline-none text-sm"
              />
            </div>
            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-lg outline-none text-sm bg-white">
              <option value="">Todos los estados</option>
              <option value="1">Pendiente</option>
              <option value="2">Aprobado</option>
              <option value="3">Rechazado</option>
            </select>
            <span className="text-sm text-gray-500">{filtrados.length} de {tickets.length} tickets</span>
          </div>

          <div className="space-y-3">
            {filtrados.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 font-medium">No hay tickets registrados</p>
              </div>
            ) : (
              filtrados.map((ticket) => {
                const totalTicket = calcularTotalTicket(ticket);
                return (
                  <div
                    key={ticket.idTicket}
                    onClick={() => openHistorial(ticket)}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg">#{ticket.idTicket}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${estadoBadge(ticket.estadoTicket)}`}>
                              {estadoLabel[ticket.estadoTicket]}
                            </span>
                            <span className="text-xs text-gray-400">|</span>
                            <span className="text-xs font-semibold text-gray-700">{tipoLabels[ticket.tipoSolicitud] || `Tipo ${ticket.tipoSolicitud}`}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>Orden <strong>#{ticket.idOMaestraRef}</strong></span>
                            {ticket.dniCliente && <span>DNI: <strong>{ticket.dniCliente}</strong></span>}
                            <span className="flex items-center gap-1"><Calendar size={10} /> Creado: {dateFormatter(ticket.fechaApertura)}</span>
                            {ticket.fechaCierre && (
                              <span className="flex items-center gap-1"><Clock size={10} /> Cerrado: {dateFormatter(ticket.fechaCierre)}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Motivo</p>
                          <p className="text-sm text-gray-700 max-w-[200px] truncate">{ticket.motivoReclamo || "—"}</p>
                        </div>
                      </div>

                      <div className="flex gap-1 flex-wrap">
                        {ticket.items?.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {ticket.items.reduce((s, i) => s + i.cantidadAfectada, 0)} unidades ({ticket.items.length} items)
                          </span>
                        )}
                        {ticket.subOrdenesAAnular?.length > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{ticket.subOrdenesAAnular.length} sub-orden(es) a anular</span>
                        )}
                        {ticket.itemsAAnular?.length > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">{ticket.itemsAAnular.length} item(s) a anular</span>
                        )}
                        {totalTicket > 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            {formatter(totalTicket)}
                          </span>
                        )}
                      </div>
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
          onClick={(e) => { if (e.target === e.currentTarget) { setSelectedTicket(null); setHistorial([]); } }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList size={20} />
                Ticket #{selectedTicket.idTicket}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {tipoLabels[selectedTicket.tipoSolicitud]} — {estadoLabel[selectedTicket.estadoTicket]}
                {selectedTicket.dniCliente && <span> — DNI: <strong>{selectedTicket.dniCliente}</strong></span>}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1"><Calendar size={12} /> Creado: {dateTimeFormatter(selectedTicket.fechaApertura)}</span>
                {selectedTicket.fechaCierre && (
                  <span className="flex items-center gap-1"><Clock size={12} /> Cerrado: {dateTimeFormatter(selectedTicket.fechaCierre)}</span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MessageSquare size={12} /> Motivo</p>
                <p className="text-sm text-gray-800">{selectedTicket.motivoReclamo || "Sin motivo"}</p>
              </div>

              {selectedTicket.items?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1"><Package size={12} /> Productos</p>
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
                      {selectedTicket.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-medium text-gray-700">{item.nombreProducto || `Producto #${item.idOItemRef}`}</td>
                          <td className="px-3 py-2 text-gray-500">{item.sku || "—"}</td>
                          <td className="px-3 py-2 text-center text-gray-600">{item.cantidadAfectada}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{item.montoAfectado != null ? formatter(item.montoAfectado) : "—"}</td>
                          <td className="px-3 py-2 text-right font-semibold text-gray-800">
                            {item.montoAfectado != null ? formatter(item.montoAfectado * item.cantidadAfectada) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

              {selectedTicket.tipoSolicitud === 3 && selectedTicket.nuevoProductoNombre && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1">
                    Producto de reemplazo
                  </p>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Producto:</strong> {selectedTicket.nuevoProductoNombre}</p>
                    {selectedTicket.nuevoProductoPrecio != null && (
                      <p><strong>Precio:</strong> {formatter(selectedTicket.nuevoProductoPrecio)}</p>
                    )}
                    {selectedTicket.nuevoNombreVendedor && (
                      <p><strong>Vendedor:</strong> {selectedTicket.nuevoNombreVendedor}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1"><Clock size={12} /> Historial de resoluciones</p>
                {historialLoading ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm py-2"><Loader2 size={14} className="animate-spin" /> Cargando historial...</div>
                ) : historial.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Sin movimientos</p>
                ) : (
                  <div className="space-y-2">
                    {historial.map((h) => (
                      <div key={h.idTHistorial} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                          <User size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">Admin #{h.idAdminAccion}</span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{h.fechaCambio ? new Date(h.fechaCambio).toLocaleString("es-ES") : "—"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {h.estadoNuevo === 2 ? (
                            <CheckCircle size={14} className="text-emerald-600" />
                          ) : (
                            <XCircle size={14} className="text-red-600" />
                          )}
                          <span className="text-xs font-medium text-gray-700">
                            {h.estadoAnterior != null ? `${estadoLabel[h.estadoAnterior] || h.estadoAnterior} → ` : ""}
                            {estadoLabel[h.estadoNuevo] || h.estadoNuevo}
                          </span>
                        </div>
                        {h.comentario && <p className="text-xs text-gray-500 mt-1 ml-6">{h.comentario}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex">
              <button
                onClick={() => { setSelectedTicket(null); setHistorial([]); }}
                className="flex-1 py-2.5 font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}