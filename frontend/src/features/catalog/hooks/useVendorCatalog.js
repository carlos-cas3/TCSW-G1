import { useEffect, useState } from "react";
import { getVendorProducts } from "../services/vendorProducts.service";

export function useVendorCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(
        localStorage.getItem("tcsw_user") ||
        sessionStorage.getItem("tcsw_user") ||
        "{}"
      );

      const vendorId =
        user?.vendor_id ||
        user?.vendorId ||
        user?.vendor?.vendor_id ||
        user?.vendor?.vendorId;

      if (!vendorId) {
        setProducts([]);
        return;
      }

      const result = await getVendorProducts(vendorId);
      setProducts(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      setError(err.message || "Error al cargar productos");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadProducts();
    })();
  }, []);

  return {
    products,
    loading,
    error,
    reload: loadProducts,
  };
}
