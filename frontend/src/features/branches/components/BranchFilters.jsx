import { Search, X } from "lucide-react";
import { STATUS_OPTIONS, getStatusLabel } from "../utils/statusColors";
import "../styles/filters.css";

export default function BranchFilters({
    filters,
    onFilterChange,
    onReset,
    showInactive = false,
}) {
    const hasActiveFilters = filters.search !== "" || filters.status !== "all";

    return (
        <div className="branches-filters-container">
            <div className="branches-filters-row">
                <div className="branches-filters-field-search">
                    <label className="branches-filters-label">
                        Buscar
                    </label>
                    <div className="branches-filters-search-wrapper">
                        <Search className="branches-filters-search-icon" />
                        <input
                            type="text"
                            placeholder="Nombre, dirección, vendedor o ciudad..."
                            value={filters.search}
                            onChange={(e) => onFilterChange("search", e.target.value)}
                            className="branches-filters-input"
                        />
                    </div>
                </div>

                <div className="branches-filters-field-status">
                    <label className="branches-filters-label">
                        Estado
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange("status", e.target.value)}
                        className="branches-filters-select"
                    >
                        <option value="all">Todos</option>
                        {STATUS_OPTIONS.filter((s) => showInactive || s !== "INACTIVE").map((s) => (
                            <option key={s} value={s}>
                                {getStatusLabel(s)}
                            </option>
                        ))}
                    </select>
                </div>

                {hasActiveFilters && (
                    <div className="branches-filters-actions">
                        <button
                            onClick={onReset}
                            className="branches-filters-reset-btn"
                        >
                            <X className="w-4 h-4" />
                            Limpiar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}