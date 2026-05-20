import { Search, X } from "lucide-react";
import { STATUS_OPTIONS, getStatusLabel } from "../utils/statusColors";
import "../styles/filters.css";

export default function BranchFilters({
    mode,
    filters,
    cities,
    vendors,
    onFilterChange,
    onReset,
}) {
    const isAdmin = mode === "admin";

    return (
        <div className="branches-filters-container">
            <div className="branches-filters-row">
                <div className="branches-filters-field">
                    <label className="branches-filters-label">
                        Buscar
                    </label>
                    <div className="branches-filters-search-wrapper">
                        <Search className="branches-filters-search-icon" />
                        <input
                            type="text"
                            placeholder="Nombre o dirección..."
                            value={filters.search}
                            onChange={(e) => onFilterChange("search", e.target.value)}
                            className="branches-filters-input"
                        />
                    </div>
                </div>

                {isAdmin && (
                    <div className="branches-filters-field">
                        <label className="branches-filters-label">
                            Vendedor
                        </label>
                        <select
                            value={filters.vendor}
                            onChange={(e) => onFilterChange("vendor", e.target.value)}
                            className="branches-filters-select"
                        >
                            <option value="all">Todos</option>
                            {vendors.map((v) => (
                                <option key={v.vendor_id} value={v.vendor_id}>
                                    {v.vendor_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="branches-filters-field">
                    <label className="branches-filters-label">
                        Ciudad
                    </label>
                    <select
                        value={filters.city}
                        onChange={(e) => onFilterChange("city", e.target.value)}
                        className="branches-filters-select"
                    >
                        <option value="all">Todas</option>
                        {cities.map((c) => (
                            <option key={c.city_id} value={c.city_id}>
                                {c.city_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="branches-filters-field">
                    <label className="branches-filters-label">
                        Estado
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange("status", e.target.value)}
                        className="branches-filters-select"
                    >
                        <option value="all">Todos</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {getStatusLabel(s)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="branches-filters-actions">
                    <button
                        onClick={onReset}
                        className="branches-filters-reset-btn"
                    >
                        <X className="w-4 h-4" />
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    );
}