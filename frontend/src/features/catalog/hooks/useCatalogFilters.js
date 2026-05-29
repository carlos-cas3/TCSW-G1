import { useState, useMemo } from "react";
import { filterProducts, getStats } from "../utils/catalogHelpers";

export function useCatalogFilters(products) {
  const [filters, setFilters] = useState({ search: "", status: "all" });

  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [products, filters]);

  const stats = useMemo(() => {
    return getStats(filteredProducts);
  }, [filteredProducts]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ search: "", status: "all" });
  };

  return {
    filters,
    filteredProducts,
    stats,
    updateFilter,
    resetFilters,
  };
}
