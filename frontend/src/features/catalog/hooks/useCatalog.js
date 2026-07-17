import { useEffect, useState } from "react";

import {
  getProducts,
} from "../services/catalog.service";

export function useCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getProducts();

      if (Array.isArray(result)) {
        setProducts(result);
      } else if (Array.isArray(result.data)) {
        setProducts(result.data);
      } else {
        setProducts([]);
      }
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