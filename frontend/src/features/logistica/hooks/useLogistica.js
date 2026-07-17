import { useState, useEffect, useCallback } from "react";
import { getUser } from "../../../app/auth";
import { getVendorOrders, getMasterOrders, updateSubOrderStatus } from "../services/logistica.service";

export const useLogistica = () => {
  const [subOrdenes, setSubOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getUser();

      if (!user || !user.vendorId) {
        setSubOrdenes([]);
        setLoading(false);
        return;
      }

      const [vendorSubs, allOrders] = await Promise.all([
        getVendorOrders(user.vendorId),
        getMasterOrders(),
      ]);

      const dniMap = {};
      for (const orden of allOrders ?? []) {
        dniMap[orden.idOMaestra] = {
          clienteDni: orden.clienteDni,
          clienteNombre: orden.clienteNombre,
        };
      }

      const enriched = (vendorSubs ?? []).map((sub) => ({
        ...sub,
        clienteDni: dniMap[sub.idOMaestra]?.clienteDni ?? "",
        clienteNombre: dniMap[sub.idOMaestra]?.clienteNombre ?? "",
      }));

      setSubOrdenes(enriched);
    } catch (err) {
      setError(err.message || "Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      if (!cancelled) await loadOrders();
    };
    init();
    return () => {
      cancelled = true;
    };
  }, [loadOrders]);

  const cambiarEstado = async (idSubOrden, nuevoEstado) => {
    setSubOrdenes((prev) =>
      prev.map((sub) =>
        sub.idSOrden === idSubOrden
          ? { ...sub, estadoParcialVendedor: nuevoEstado }
          : sub
      )
    );

    updateSubOrderStatus(idSubOrden, nuevoEstado).catch((err) =>
      console.error("Error al actualizar el estado:", err)
    );
  };

  return { subOrdenes, loading, error, reload: loadOrders, cambiarEstado };
};
