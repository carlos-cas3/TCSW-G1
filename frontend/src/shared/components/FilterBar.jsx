import { Search, X } from "lucide-react";
import "../styles/filters.css";

function FilterField({ filter }) {
  if (filter.type === "search") {
    return (
      <div className="filter-bar-field">
        {filter.label && <label className="filter-bar-label">{filter.label}</label>}
        <div className="filter-bar-search-wrapper">
          <Search className="filter-bar-search-icon" />
          <input
            type="text"
            placeholder={filter.placeholder || "Buscar..."}
            value={filter.value || ""}
            onChange={(e) => filter.onChange(e.target.value)}
            className="filter-bar-input"
          />
        </div>
      </div>
    );
  }

  if (filter.type === "select") {
    return (
      <div className="filter-bar-field-narrow">
        {filter.label && <label className="filter-bar-label">{filter.label}</label>}
        <select
          value={filter.value || "all"}
          onChange={(e) => filter.onChange(e.target.value)}
          className="filter-bar-select"
        >
          <option value="all">{filter.allLabel || "Todos"}</option>
          {(filter.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (filter.type === "custom") {
    return filter.render();
  }

  return null;
}

export default function FilterBar({ filters = [], onReset, hasFilters }) {
  const anyValue = (filter) => {
    if (filter.type === "search") return filter.value && filter.value !== "";
    if (filter.type === "select") return filter.value && filter.value !== "all";
    return false;
  };

  const showReset = hasFilters ?? filters.some(anyValue);

  return (
    <div className="filter-bar">
      <div className="filter-bar-row">
        {filters.map((filter) => (
          <FilterField key={filter.key} filter={filter} />
        ))}
        {showReset && (
          <button onClick={onReset} className="filter-bar-reset-btn">
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
