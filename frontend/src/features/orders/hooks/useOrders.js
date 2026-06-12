import { useState, useEffect, useCallback } from "react";
import { getOrders } from "../services/orders.service";

export const useOrders = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders();
      setOrdenes(res ?? []);
    } catch (err) {
      setError(err.message || "Error al cargar órdenes");
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

  return { ordenes, loading, error, reload: loadOrders };
};
