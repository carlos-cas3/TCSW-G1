import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useVendors } from "../hooks/useVendors";
import { useVendorFilters } from "../hooks/useVendorFilters";
import { getAllCategories } from "../services/vendor.service";
import VendorsTable from "../components/VendorsTable";
import VendorFilters from "../components/VendorFilters";
import VendorStatsCards from "../components/VendorStatsCards";
import { getStats } from "../utils/vendorHelpers";
import "../styles/stats.css";

export default function AdminVendorsPage() {
    const navigate = useNavigate();
    const { vendors, loading, error, reload, changeStatus, changingId } = useVendors();
    const [rowErrors, setRowErrors] = useState({});
    const [allCategories, setAllCategories] = useState([]);

    const { filters, filteredVendors, updateFilter, resetFilters } = useVendorFilters(vendors);

    useEffect(() => {
        getAllCategories().then(({ data }) => {
            setAllCategories(data ?? []);
        }).catch(() => {});
    }, []);

    const stats = getStats(filteredVendors);

    const handleStatusChange = async (vendorId, newStatus) => {
        setRowErrors((prev) => ({ ...prev, [vendorId]: null }));
        try {
            await changeStatus(vendorId, newStatus);
        } catch (err) {
            setRowErrors((prev) => ({
                ...prev,
                [vendorId]: err.message || "Error al actualizar estado",
            }));
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Vendedores</h1>
                    <p className="text-gray-500 mt-1">
                        {filteredVendors.length} vendedor{filteredVendors.length !== 1 ? "es" : ""} registrado{filteredVendors.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={reload}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={reload}
                            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            <VendorStatsCards stats={stats} />

            <VendorFilters
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                allCategories={allCategories}
            />

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <VendorsTable
                    vendors={filteredVendors}
                    loading={loading}
                    changingId={changingId}
                    changeStatus={handleStatusChange}
                    rowErrors={rowErrors}
                    onView={(id) => navigate(`/admin/vendors/${id}`)}
                />
            </div>
        </div>
    );
}
