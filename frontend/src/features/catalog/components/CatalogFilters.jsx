import FilterBar from "../../../shared/components/FilterBar";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Activo" },
  { value: "INACTIVE", label: "Inactivo" },
];

export default function CatalogFilters({ filters, onFilterChange, onReset }) {
  const filterConfig = [
    {
      key: "search",
      type: "search",
      placeholder: "Buscar por nombre o marca...",
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
    },
  ];

  return <FilterBar filters={filterConfig} onReset={onReset} />;
}
