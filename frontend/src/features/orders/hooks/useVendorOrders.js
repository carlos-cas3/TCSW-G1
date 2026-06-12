import { useState, useEffect, useCallback } from "react";
import { getUser } from "../../../app/auth";
import { getVendorOrders } from "../services/orders.service";

export const useVendorOrders = () => {
  const [ordenesVendedor, setOrdenesVendedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getUser();

      if (!user || !user.vendorId) {
        setOrdenesVendedor([]);
        setLoading(false);
        return;
      }

      const res = await getVendorOrders(user.vendorId);
      setOrdenesVendedor(res ?? []);
    } catch (err) {
      setError(err.message || "Error al cargar las ventas de la tienda");
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

  return { ordenesVendedor, loading, error, reload: loadOrders };
};