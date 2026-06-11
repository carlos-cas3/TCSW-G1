import FilterBar from "../../../shared/components/FilterBar";
import CategoryMultiSelect from "./CategoryMultiSelect";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "ACTIVE", label: "Activo" },
  { value: "INACTIVE", label: "Inactivo" },
  { value: "SUSPENDED", label: "Suspendido" },
];

export default function VendorFilters({ filters, onFilterChange, onReset, allCategories }) {
  const filterConfig = [
    {
      key: "search",
      type: "search",
      placeholder: "Buscar por empresa, RUC, email...",
      value: filters.search,
      onChange: (v) => onFilterChange("search", v),
    },
    {
      key: "status",
      type: "select",
      label: "Estado",
      value: filters.status,
      onChange: (v) => onFilterChange("status", v),
      options: STATUS_OPTIONS,
      allLabel: "Todos los estados",
    },
    {
      key: "rucType",
      type: "select",
      label: "RUC",
      value: filters.rucType,
      onChange: (v) => onFilterChange("rucType", v),
      options: [
        { value: "10", label: "RUC 10 (Persona Natural)" },
        { value: "20", label: "RUC 20 (Persona Jurídica)" },
      ],
    },
    {
      key: "categories",
      type: "custom",
      render: () => (
        <div className="filter-bar-field">
          <label className="filter-bar-label">Categorías</label>
          <CategoryMultiSelect
            categories={allCategories ?? []}
            selectedIds={filters.categories}
            onChange={(ids) => onFilterChange("categories", ids)}
          />
        </div>
      ),
    },
  ];

  const hasFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.rucType !== "all" ||
    filters.categories.length > 0;

  return <FilterBar filters={filterConfig} onReset={onReset} hasFilters={hasFilters} />;
}
