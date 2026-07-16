import { useState } from "react";
import { Search, FileText, ArrowLeft, User, Phone, Mail, Package, Loader2, AlertCircle } from "lucide-react";
import { buscarOrdenesPorDni, crearTicket } from "../services/reclamos.service";
import { formatIdOrden, formatIdSubOrden, formatIdItem, getBadgeEstado, renderEstadoOrden, renderEstadoVendedor, getBadgeItem, renderEstadoItem } from "../../orders/utils/formatters";
import CambioProductoModal from "../components/CambioProductoModal";

const estadosGlobal = {
  1: "Pendiente",
  2: "En Preparación",
  3: "Parcialmente Despachado",
  4: "Parcialmente Entregado",
  5: "Entregado",
};

const tipoSolicitudLabels = {
  1: "Devolución de Dinero",
  2: "Cambio de Talla",
  3: "Cambio por Otro Producto",
  4: "Anulación",
};

export default function NuevoReclamoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [ordenesCliente, setOrdenesCliente] = useState([]);
  const [filterFecha, setFilterFecha] = useState("");
  const [filterOrdenId, setFilterOrdenId] = useState("");
  const [ordenEncontrada, setOrdenEncontrada] = useState(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState({});
  const [subOrdenesAnuladas, setSubOrdenesAnuladas] = useState({});
  const [itemsAnulados, setItemsAnulados] = useState({});
  const [tipoSolicitud, setTipoSolicitud] = useState("");
  const [motivo, setMotivo] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [showCambioModal, setShowCambioModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);
    try {
      const data = await buscarOrdenesPorDni(searchQuery);
      if (!data || data.length === 0) {
        setError(`No se encontraron órdenes para el DNI: ${searchQuery}`);
        return;
      }
      const ordenesMapeadas = data.map((orden) => ({
        id: formatIdOrden(orden.idOMaestra),
        idOMaestra: orden.idOMaestra,
        clienteNombre: orden.clienteNombre,
        clienteDni: orden.clienteDni,
        clienteTelefono: orden.subOrdenes[0]?.telefonoContacto || "No registrado",
        clienteEmail: `${orden.clienteNombre.split(" ")[0].toLowerCase()}@email.com`,
        estadoGlobalNumero: orden.estadoGlobal,
        estadoLogistico: renderEstadoOrden(orden.estadoGlobal),
        fecha: new Date(orden.fechaCreacion),
        montoTotalMaestro: Number(orden.montoTotalMaestro),
        subOrdenes: orden.subOrdenes.map((sub) => ({
          id: formatIdSubOrden(sub.idSOrden),
          idSOrden: sub.idSOrden,
          idVendedor: sub.idVendedor,
          vendedor: sub.nombreVendedor,
          estado: renderEstadoVendedor(sub.estadoParcialVendedor),
          estadoParcialVendedor: sub.estadoParcialVendedor,
          productos: sub.items.map((item) => ({
            id: String(item.idOItem),
            idOItem: item.idOItem,
            nombre: `Producto (SKU: ${item.idProducto})`,
            sku: item.idProducto,
            cantidadComprada: item.cantidad,
            precioUnitario: Number(item.precioUnitario),
            estadoItem: item.estadoItem,
          })),
        })),
      }));

      setClienteEncontrado({
        nombre: ordenesMapeadas[0].clienteNombre,
        dni: ordenesMapeadas[0].clienteDni,
        telefono: ordenesMapeadas[0].clienteTelefono,
        email: ordenesMapeadas[0].clienteEmail,
      });
      setOrdenesCliente(ordenesMapeadas);
      setCurrentStep(1.5);
    } catch (err) {
      setError(err.message || "Error al conectar con el servicio");
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarOrden = (orden) => {
    setOrdenEncontrada(orden);
    setCurrentStep(2);
  };

  const ordenesFiltered = ordenesCliente.filter((orden) => {
    if (filterFecha) {
      const month = String(orden.fecha.getMonth() + 1).padStart(2, "0");
      const day = String(orden.fecha.getDate()).padStart(2, "0");
      const year = orden.fecha.getFullYear();
      if (`${year}-${month}-${day}` !== filterFecha) return false;
    }
    if (filterOrdenId) {
      if (!orden.id.toLowerCase().includes(filterOrdenId.toLowerCase())) return false;
    }
    return true;
  });

  const toggleProducto = (productoId) => {
    setProductosSeleccionados((prev) => {
      if (prev[productoId]?.seleccionado) {
        const next = { ...prev };
        delete next[productoId];
        return next;
      }
      return { ...prev, [productoId]: { seleccionado: true, cantidad: 1 } };
    });
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    setProductosSeleccionados((prev) => ({
      ...prev,
      [productoId]: { ...prev[productoId], cantidad: nuevaCantidad },
    }));
  };

  const toggleSubOrdenAnulacion = (idSOrden) => {
    setSubOrdenesAnuladas((prev) => {
      const nuevo = { ...prev };
      if (nuevo[idSOrden]) {
        delete nuevo[idSOrden];
      } else {
        nuevo[idSOrden] = true;
      }
      return nuevo;
    });
  };

  const toggleItemAnulacion = (idOItem) => {
    setItemsAnulados((prev) => {
      const nuevo = { ...prev };
      if (nuevo[idOItem]) {
        delete nuevo[idOItem];
      } else {
        nuevo[idOItem] = true;
      }
      return nuevo;
    });
  };

  const calcularSubtotal = () => {
    if (!ordenEncontrada) return 0;
    let total = 0;
    ordenEncontrada.subOrdenes.forEach((sub) => {
      sub.productos.forEach((prod) => {
        if (productosSeleccionados[prod.id]?.seleccionado) {
          total += prod.precioUnitario * productosSeleccionados[prod.id].cantidad;
        }
      });
    });
    return total;
  };

  const handleCrearTicket = async () => {
    try {
      const ticketData = {
        idOMaestraRef: ordenEncontrada.idOMaestra,
        dniCliente: ordenEncontrada.clienteDni,
        tipoSolicitud,
        motivoReclamo: comentarios,
        nuevaTalla: null,
        idProductoNuevoRef: null,
        items: Object.entries(productosSeleccionados)
          .filter(([_, v]) => v.seleccionado)
          .map(([idOItem, v]) => {
            const prod = encontrarProductoPorId(Number(idOItem));
            return {
              idOItemRef: Number(idOItem),
              cantidadAfectada: v.cantidad,
              montoAfectado: prod?.precioUnitario ?? 0,
              nombreProducto: prod?.nombre || `Producto #${idOItem}`,
              sku: prod?.sku || null,
            };
          }),
        subOrdenesAAnular: Object.keys(subOrdenesAnuladas).map(Number),
        itemsAAnular: Object.keys(itemsAnulados).map(Number),
      };
      await crearTicket(ticketData);

      alert(`Ticket creado exitosamente!\nTipo: ${tipoSolicitudLabels[tipoSolicitud] || tipoSolicitud}\nMonto: S/ ${calcularSubtotal().toFixed(2)}`);
      resetForm();
    } catch (err) {
      alert("Error al crear el ticket: " + err.message);
    }
  };

  const handleCrearTicketAnulacion = async () => {
    try {
      const itemsData = [];
      for (const idOItem of Object.keys(itemsAnulados)) {
        const prod = encontrarProductoPorId(Number(idOItem));
        if (prod) {
          itemsData.push({
            idOItemRef: Number(idOItem),
            cantidadAfectada: prod.cantidadComprada,
            montoAfectado: prod.precioUnitario,
            nombreProducto: prod.nombre,
            sku: prod.sku,
          });
        }
      }
      for (const idSOrden of Object.keys(subOrdenesAnuladas)) {
        const sub = ordenEncontrada.subOrdenes.find(s => s.idSOrden === Number(idSOrden));
        if (sub) {
          for (const prod of sub.productos) {
            if (!itemsData.some(i => i.idOItemRef === prod.idOItem)) {
              itemsData.push({
                idOItemRef: prod.idOItem,
                cantidadAfectada: prod.cantidadComprada,
                montoAfectado: prod.precioUnitario,
                nombreProducto: prod.nombre,
                sku: prod.sku,
              });
            }
          }
        }
      }

      const ticketData = {
        idOMaestraRef: ordenEncontrada.idOMaestra,
        dniCliente: ordenEncontrada.clienteDni,
        tipoSolicitud: 4,
        motivoReclamo: "Anulación solicitada por el cliente",
        nuevaTalla: null,
        idProductoNuevoRef: null,
        items: itemsData,
        subOrdenesAAnular: Object.keys(subOrdenesAnuladas).map(Number),
        itemsAAnular: Object.keys(itemsAnulados).map(Number),
      };
      await crearTicket(ticketData);

      const totalSub = Object.keys(subOrdenesAnuladas).length;
      const totalItems = Object.keys(itemsAnulados).length;
      alert(`Ticket de Anulación creado exitosamente!\n${totalSub > 0 ? `Sub-órdenes a anular: ${totalSub}\n` : ""}${totalItems > 0 ? `Items a anular: ${totalItems}` : ""}`);
      resetForm();
    } catch (err) {
      alert("Error al crear el ticket de anulación: " + err.message);
    }
  };

  const encontrarProductoPorId = (idOItem) => {
    for (const sub of (ordenEncontrada?.subOrdenes || [])) {
      const prod = sub.productos.find(p => p.idOItem === idOItem);
      if (prod) return prod;
    }
    return null;
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSearchQuery("");
    setClienteEncontrado(null);
    setOrdenesCliente([]);
    setOrdenEncontrada(null);
    setProductosSeleccionados({});
    setSubOrdenesAnuladas({});
    setItemsAnulados({});
    setTipoSolicitud("");
    setComentarios("");
  };

  const unidadesSeleccionadas = Object.values(productosSeleccionados)
    .filter((v) => v.seleccionado)
    .reduce((sum, v) => sum + v.cantidad, 0);

  const itemsCountSeleccionados = Object.values(productosSeleccionados).filter((v) => v.seleccionado).length;

  const stepCircle = (num, active) => (
    <div
      className={`w-[42px] h-[42px] rounded-full flex items-center justify-center font-bold text-base shrink-0 ${
        active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
      }`}
    >
      {num}
    </div>
  );

  const stepDivider = (complete) => (
    <div className="flex-1 mx-4">
      <div className="h-[3px] rounded bg-gray-200">
        <div className={`h-full rounded bg-blue-600 transition-all ${complete ? "w-full" : "w-0"}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={28} className="text-blue-600 shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-blue-800">Nueva Gestión de Reclamo (PQR)</h2>
            <p className="text-sm text-blue-600">Sistema guiado para atención telefónica y postventa</p>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentStep(1);
            setSearchQuery("");
            setClienteEncontrado(null);
            setOrdenesCliente([]);
            setOrdenEncontrada(null);
            setProductosSeleccionados({});
            setError(null);
          }}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-full px-4 py-2 hover:bg-blue-100 transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </button>
      </div>

      {/* Stepper */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {stepCircle(1, currentStep >= 1)}
            <div>
              <p className="font-bold text-gray-900 text-sm">Buscar Orden</p>
              <p className="text-xs text-gray-500">Identificar cliente</p>
            </div>
          </div>
          {stepDivider(currentStep >= 2)}
          <div className="flex items-center gap-3">
            {stepCircle(2, currentStep >= 2)}
            <div>
              <p className="font-bold text-gray-900 text-sm">Seleccionar Productos</p>
              <p className="text-xs text-gray-500">Ítems afectados</p>
            </div>
          </div>
          {stepDivider(currentStep >= 3)}
          <div className="flex items-center gap-3">
            {stepCircle(3, currentStep >= 3)}
            <div>
              <p className="font-bold text-gray-900 text-sm">Detalle y Resolución</p>
              <p className="text-xs text-gray-500">Configurar ticket</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 - Search DNI */}
      {currentStep === 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Paso 1: Buscar Cliente por DNI</h3>
          <div className="max-w-xl">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Ingrese el DNI del Cliente</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-4 shadow-sm">
              <span className="px-4 text-gray-400">
                <Search size={22} />
              </span>
              <input
                type="text"
                placeholder="Ingrese DNI del cliente (ej: 12345678)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                className="flex-1 py-3 px-2 outline-none text-base"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            <button
              onClick={handleBuscar}
              disabled={!searchQuery || loading}
              className={`w-full py-3 font-bold rounded-lg text-base ${
                searchQuery && !loading
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  Buscando...
                </span>
              ) : (
                "Buscar Cliente"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 1.5 - Client info + orders */}
      {currentStep === 1.5 && clienteEncontrado && (
        <div className="space-y-4">
          {/* Client card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 mb-3 text-base">Cliente Encontrado</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: User, label: "Nombre", value: clienteEncontrado.nombre },
                { icon: FileText, label: "DNI", value: clienteEncontrado.dni },
                { icon: Phone, label: "Teléfono", value: clienteEncontrado.telefono },
                { icon: Mail, label: "Email", value: clienteEncontrado.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={22} className="text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-semibold text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders list */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-900 mb-4">Órdenes del Cliente</h4>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pb-3 border-b border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Buscar por ID de Orden</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <span className="px-3 text-gray-400"><Search size={16} /></span>
                  <input
                    type="text"
                    className="flex-1 py-2 px-1 outline-none text-sm"
                    placeholder="Ej: ORD-1001"
                    value={filterOrdenId}
                    onChange={(e) => setFilterOrdenId(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Filtrar desde fecha</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 outline-none text-sm text-gray-600"
                  value={filterFecha}
                  onChange={(e) => setFilterFecha(e.target.value)}
                />
              </div>
            </div>

            {/* Order cards */}
            <div className="space-y-3">
              {ordenesFiltered.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No se encontraron órdenes con los filtros aplicados.</p>
              ) : (
                ordenesFiltered.map((orden) => {
                  const totalProductos = orden.subOrdenes.reduce((sum, so) => sum + so.productos.length, 0);
                  return (
                    <div
                      key={orden.id}
                      onClick={() => handleSeleccionarOrden(orden)}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                              {orden.id}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeEstado(orden.estadoGlobalNumero)}`}>
                              {orden.estadoLogistico}
                            </span>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>Fecha: <strong className="text-gray-900 font-medium">{orden.fecha.toLocaleDateString("es-ES", { timeZone: "UTC" })}</strong></span>
                            <span>Sub-órdenes: <strong className="text-gray-900 font-medium">{orden.subOrdenes.length}</strong></span>
                            <span>Productos: <strong className="text-gray-900 font-medium">{totalProductos}</strong></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-0.5">Monto Total</p>
                          <h4 className="font-bold text-emerald-600 text-lg">S/ {orden.montoTotalMaestro.toFixed(2)}</h4>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* New search button */}
            <button
              onClick={() => {
                setCurrentStep(1);
                setClienteEncontrado(null);
                setOrdenesCliente([]);
                setSearchQuery("");
                setFilterOrdenId("");
                setFilterFecha("");
                setError(null);
              }}
              className="w-full mt-4 py-3 font-bold rounded-lg text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors text-base"
            >
              Nueva Búsqueda
            </button>
          </div>
        </div>
      )}

      {/* Step 2 - Select Products */}
      {currentStep === 2 && ordenEncontrada && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-bold text-gray-900 mb-4">Paso 2: Seleccione los Productos Afectados</h3>

          {ordenEncontrada.subOrdenes.map((subOrden) => {
            const subAnulada = !!subOrdenesAnuladas[subOrden.idSOrden];
            const puedeAnularItems = subOrden.estadoParcialVendedor === 1 || subOrden.estadoParcialVendedor === 2;
            return (
            <div key={subOrden.id} className={`border rounded-xl mb-4 overflow-hidden shadow-sm ${subAnulada ? "border-red-300" : "border-gray-200"}`}>
              <div className={`border-b p-3 flex justify-between items-center ${subAnulada ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    {subOrden.vendedor} <span className="text-gray-500 font-normal ml-2">({subOrden.id})</span>
                  </span>
                  {puedeAnularItems && (
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-red-400 text-red-600 shrink-0 cursor-pointer accent-red-600"
                        checked={subAnulada}
                        onChange={() => toggleSubOrdenAnulacion(subOrden.idSOrden)}
                      />
                      <span className={`text-xs font-bold ${subAnulada ? "text-red-700" : "text-red-500"}`}>
                        Anular Sub-Orden
                      </span>
                    </label>
                  )}
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeEstado(subOrden.estadoParcialVendedor)}`}>
                  {subOrden.estado}
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {subOrden.productos.map((producto) => {
                  const seleccionado = !!productosSeleccionados[producto.id]?.seleccionado;
                  const cantidad = productosSeleccionados[producto.id]?.cantidad || 1;
                  const itemAnulado = !!itemsAnulados[producto.idOItem];
                  const estaAnulado = subAnulada || itemAnulado;
                  return (
                    <div key={producto.id} className={`p-4 ${seleccionado && !estaAnulado ? "bg-blue-50" : estaAnulado ? "bg-red-50" : ""}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-400 text-blue-600 shrink-0 cursor-pointer accent-blue-600"
                            checked={seleccionado}
                            disabled={estaAnulado}
                            onChange={() => !estaAnulado && toggleProducto(producto.id)}
                          />
                          {puedeAnularItems && !subAnulada && (
                            <input
                              type="checkbox"
                              className="w-5 h-5 rounded border-red-400 text-red-600 shrink-0 cursor-pointer accent-red-600"
                              checked={itemAnulado}
                              onChange={() => toggleItemAnulacion(producto.idOItem)}
                            />
                          )}
                          {puedeAnularItems && !subAnulada && (
                            <span className={`text-xs font-bold ${itemAnulado ? "text-red-700" : "text-red-400"}`}>
                              Anular
                            </span>
                          )}
                          {estaAnulado && (
                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                              ANULADO
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className={`font-semibold text-sm truncate ${estaAnulado ? "text-red-500 line-through" : "text-gray-900"}`}>{producto.nombre}</p>
                            <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                              <span className="font-medium">SKU: {producto.sku}</span>
                              <span>•</span>
                              <span>Comprado: <strong>{producto.cantidadComprada}</strong></span>
                              <span>•</span>
                              <span>P/U: <strong>S/ {producto.precioUnitario.toFixed(2)}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          {seleccionado && !estaAnulado && producto.cantidadComprada > 1 && (
                            <div className="text-right">
                              <p className="text-xs text-blue-600 font-bold mb-1">A Reclamar</p>
                              <select
                                className="border border-blue-300 rounded-lg py-1.5 px-2 text-sm font-bold text-blue-700 bg-white shadow-sm cursor-pointer"
                                value={cantidad}
                                onChange={(e) => actualizarCantidad(producto.id, parseInt(e.target.value))}
                              >
                                {[...Array(producto.cantidadComprada)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div className="text-right min-w-[110px]">
                            <p className={`text-xs ${estaAnulado ? "text-red-500" : seleccionado ? "text-blue-600" : "text-gray-500"}`}>
                              {estaAnulado ? "Anulado" : seleccionado ? "Total Reclamo" : "Total Comprado"}
                            </p>
                            <p className={`font-bold text-base ${estaAnulado ? "text-red-500 line-through" : seleccionado ? "text-blue-600" : "text-gray-900"}`}>
                              S/ {(producto.precioUnitario * (seleccionado ? cantidad : producto.cantidadComprada)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })}

          <div className="flex gap-3 mt-4 pt-2">
            <button
              onClick={() => setCurrentStep(1.5)}
              className="px-5 py-3 font-bold rounded-lg text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={unidadesSeleccionadas === 0}
              className={`flex-1 py-3 font-bold rounded-lg text-base ${
                unidadesSeleccionadas > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } transition-colors`}
            >
              Continuar a Resolución ({unidadesSeleccionadas} unid.{itemsCountSeleccionados > 1 ? `, ${itemsCountSeleccionados} items` : ""})
            </button>
            {(Object.keys(subOrdenesAnuladas).length > 0 || Object.keys(itemsAnulados).length > 0) && (
              <button
                onClick={handleCrearTicketAnulacion}
                className="px-5 py-3 font-bold rounded-lg text-base bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors shrink-0"
              >
                Crear Ticket de Anulación
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 3 - Configure Ticket */}
      {currentStep === 3 && ordenEncontrada && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-4">Paso 3: Configurar el Ticket</h3>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Solicitud</label>
              <select
                value={tipoSolicitud}
                onChange={(e) => setTipoSolicitud(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-3 text-base outline-none focus:border-blue-400"
              >
                <option value="">Seleccione el tipo de solicitud...</option>
                <option value={1}>Devolución de Dinero</option>
                <option value={2}>Cambio de Talla</option>
                <option value={3}>Cambio por Otro Producto</option>
              </select>
            </div>

            {tipoSolicitud === "Cambio por Otro Producto" && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Package size={16} /> Producto de Reemplazo
                </h4>
                <button
                  onClick={() => setShowCambioModal(true)}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  {productoSeleccionado ? `Cambiar a: ${productoSeleccionado.nombre}` : "Abrir Catálogo de Productos"}
                </button>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Comentarios del Cliente</label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:border-blue-400 resize-none"
                placeholder="Detalle el problema reportado por el cliente..."
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 font-bold rounded-lg text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Atrás
              </button>
              <button
                onClick={handleCrearTicket}
                disabled={!tipoSolicitud}
                className={`flex-1 py-3 font-bold rounded-lg text-base ${
                  tipoSolicitud
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } transition-colors`}
              >
                Generar Ticket Oficial
              </button>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-fit">
            <h4 className="font-bold text-gray-900 mb-4">Resumen de Impacto</h4>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
              <span className="text-gray-500">Unidades Afectadas</span>
              <span className="font-bold">{unidadesSeleccionadas}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
              <span className="text-gray-500">Items Seleccionados</span>
              <span className="font-bold">{itemsCountSeleccionados}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
              <span className="text-gray-500">Sub-Órdenes a Anular</span>
              <span className="font-bold text-red-600">{Object.keys(subOrdenesAnuladas).length}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
              <span className="text-gray-500">Items a Anular</span>
              <span className="font-bold text-red-600">{Object.keys(itemsAnulados).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">Monto Calculado</span>
              <span className="text-xl font-bold text-red-600">S/ {calcularSubtotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Cambio Producto Modal */}
      {showCambioModal && (
        <CambioProductoModal
          creditoDisponible={calcularSubtotal()}
          onClose={() => setShowCambioModal(false)}
          onSelect={(producto) => {
            setProductoSeleccionado(producto);
            setShowCambioModal(false);
          }}
        />
      )}
    </div>
  );
}
