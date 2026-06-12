import { useState, useEffect, useCallback } from "react";
import { getUser, getToken } from "../../../app/auth";
import { obtenerOrdenesPorVendedor } from "../services/ordersService";

export const useVendorOrders = () => {
  const [ordenesVendedor, setOrdenesVendedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getUser();
      const token = getToken();
      
      if (!user || !user.vendorId) {
        setOrdenesVendedor([]);
        setLoading(false);
        return;
      }

      const res = await obtenerOrdenesPorVendedor(user.vendorId, token);
      // Usamos res directo o res.data dependiendo de si usas fetch o axios
      setOrdenesVendedor(res.data || res || []); 
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