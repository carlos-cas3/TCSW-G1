import { Search, X } from "lucide-react";
import "../styles/filters.css";

export default function CatalogFilters({ filters, onFilterChange, onReset }) {
  const hasFilters = filters.search !== "" || filters.status !== "all";

  return (
    <div className="catalog-filters-container">
      <div className="catalog-filters-row">
        <div className="catalog-filters-field-search">
          <label className="catalog-filters-label">Buscar</label>
          <div className="catalog-filters-search-wrapper">
            <Search className="catalog-filters-search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o marca..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="catalog-filters-input"
            />
          </div>
        </div>

        <div className="catalog-filters-field-status">
          <label className="catalog-filters-label">Estado</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="catalog-filters-select"
          >
            <option value="all">Todos</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>

        {hasFilters && (
          <button onClick={onReset} className="catalog-filters-reset-btn">
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
