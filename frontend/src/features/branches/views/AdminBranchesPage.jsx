import { useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { useBranches } from "../hooks/useBranches";
import { useBranchFilters } from "../hooks/useBranchFilters";
import { extractVendors, extractCities } from "../utils/branchFilters";
import BranchTable from "../components/BranchTable";
import BranchFilters from "../components/BranchFilters";
import createStatsCards from "../../../shared/components/createStatsCards";
import { Store, CircleCheck, CircleX, Settings } from "lucide-react";

const BranchStatsCards = createStatsCards([
  { label: "Total Sucursales", valueKey: "total", icon: Store, color: "blue" },
  { label: "Activas", valueKey: "active", icon: CircleCheck, color: "green" },
  { label: "Inactivas", valueKey: "inactive", icon: CircleX, color: "red" },
  { label: "En Mantenimiento", valueKey: "maintaining", icon: Settings, color: "yellow" },
]);
import "../styles/layout.css";
import "../styles/buttons.css";

export default function AdminBranchesPage() {
    const { branches, loading, error, reload } = useBranches({ mode: "admin" });
    const { filters, filteredBranches, stats, updateFilter, resetFilters } =
        useBranchFilters(branches);

    const vendors = useMemo(() => extractVendors(branches), [branches]);
    const cities = useMemo(() => extractCities(branches), [branches]);

    const handleView = (branchId) => {
        console.log("View branch", branchId);
    };

    return (
        <div className="branches-page">
            <div className="branches-page-header">
                <div className="branches-page-header-start">
                    <h1 className="branches-page-title">Gestión de Sucursales</h1>
                    <p className="branches-page-subtitle">
                        {filteredBranches.length} sucursal
                        {filteredBranches.length !== 1 ? "es" : ""} de {branches.length} total
                    </p>
                </div>
                <div className="branches-page-actions">
                    <button
                        onClick={reload}
                        disabled={loading}
                        className="branches-btn branches-btn-secondary"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Actualizar
                    </button>
                </div>
            </div>

            {error && (
                <div className="branches-error-banner">
                    <div className="branches-error-content">
                        <p className="branches-error-message">{error}</p>
                        <button onClick={reload} className="branches-error-btn">
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            <BranchStatsCards stats={stats} />

            <BranchTable
                mode="admin"
                branches={filteredBranches}
                loading={loading}
                onView={handleView}
                toolbar={
                    <BranchFilters
                        filters={filters}
                        onFilterChange={updateFilter}
                        onReset={resetFilters}
                        showInactive={true}
                        showVendorFilter={true}
                        vendors={vendors}
                        showCityFilter={true}
                        cities={cities}
                    />
                }
            />
        </div>
    );
}
