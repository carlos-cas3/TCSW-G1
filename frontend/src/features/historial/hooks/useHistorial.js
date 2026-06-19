import { useState, useEffect, useCallback } from "react";
import { getUser } from "../../../app/auth";
import { getAdminVendorOrders } from "../services/historial.service";

export const useHistorial = () => {
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

      const data = await getAdminVendorOrders(user.vendorId);
      setSubOrdenes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al cargar el historial");
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

  return { subOrdenes, loading, error, reload: loadOrders };
};
