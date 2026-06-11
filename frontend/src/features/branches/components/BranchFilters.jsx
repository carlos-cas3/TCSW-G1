import { useMemo } from "react";
import FilterBar from "../../../shared/components/FilterBar";
import { getStatusLabel } from "../utils/statusColors";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: getStatusLabel("ACTIVE") },
  { value: "INACTIVE", label: getStatusLabel("INACTIVE") },
  { value: "MAINTENANCE", label: getStatusLabel("MAINTENANCE") },
];

export default function BranchFilters({
  filters,
  onFilterChange,
  onReset,
  showInactive = false,
  showVendorFilter = false,
  vendors = [],
  showCityFilter = false,
  cities = [],
}) {
  const filterConfig = useMemo(() => {
    const config = [
      {
        key: "search",
        type: "search",
        placeholder: "Nombre, dirección, vendedor o ciudad...",
        value: filters.search,
        onChange: (v) => onFilterChange("search", v),
      },
      {
        key: "status",
        type: "select",
        label: "Estado",
        value: filters.status,
        onChange: (v) => onFilterChange("status", v),
        options: STATUS_OPTIONS.filter(
          (opt) => showInactive || opt.value !== "INACTIVE"
        ),
        allLabel: "Todos los estados",
      },
    ];

    if (showVendorFilter) {
      config.push({
        key: "vendor",
        type: "select",
        label: "Vendedor",
        value: filters.vendor,
        onChange: (v) => onFilterChange("vendor", v),
        options: vendors.map((v) => ({
          value: String(v.vendor_id),
          label: v.vendor_name,
        })),
      });
    }

    if (showCityFilter) {
      config.push({
        key: "city",
        type: "select",
        label: "Ciudad",
        value: filters.city,
        onChange: (v) => onFilterChange("city", v),
        options: cities.map((c) => ({
          value: String(c.city_id),
          label: c.city_name,
        })),
      });
    }

    return config;
  }, [
    filters.search,
    filters.status,
    filters.vendor,
    filters.city,
    showInactive,
    showVendorFilter,
    showCityFilter,
    vendors,
    cities,
    onFilterChange,
  ]);

  const hasFilters =
    filters.search ||
    filters.status !== "all" ||
    (filters.vendor && filters.vendor !== "all") ||
    (filters.city && filters.city !== "all");

  return <FilterBar filters={filterConfig} onReset={onReset} hasFilters={hasFilters} />;
}
