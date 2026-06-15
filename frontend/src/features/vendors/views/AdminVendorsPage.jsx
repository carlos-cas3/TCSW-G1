import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Plus } from "lucide-react";
import { useVendors } from "../hooks/useVendors";
import { useVendorFilters } from "../hooks/useVendorFilters";
import { getAllCategories } from "../services/vendor.service";
import VendorsTable from "../components/VendorsTable";
import VendorFilters from "../components/VendorFilters";
import createStatsCards from "../../../shared/components/createStatsCards";
import { Store, CircleCheck, Clock, Ban } from "lucide-react";

const VendorStatsCards = createStatsCards([
  { label: "Total Vendedores", valueKey: "total", icon: Store, color: "blue" },
  { label: "Activos", valueKey: "active", icon: CircleCheck, color: "green" },
  { label: "Pendientes", valueKey: "pending", icon: Clock, color: "yellow" },
  { label: "Suspendidos", valueKey: "suspended", icon: Ban, color: "red" },
]);
import CreateVendorModal from "../components/CreateVendorModal";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { getStats } from "../utils/vendorHelpers";

export default function AdminVendorsPage() {
    const navigate = useNavigate();
    const { vendors, loading, error, reload, changeStatus, changingId } = useVendors();
    const [rowErrors, setRowErrors] = useState({});
    const [allCategories, setAllCategories] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [pendingStatuses, setPendingStatuses] = useState({});
    const [modalData, setModalData] = useState(null);

    const handleCreateSuccess = (response) => {
        console.log("Contraseña temporal del vendedor:", response?.data?.temp_password);
        setIsCreateModalOpen(false);
        reload();
    };

    const { filters, filteredVendors, updateFilter, resetFilters } = useVendorFilters(vendors);

    useEffect(() => {
        getAllCategories().then(({ data }) => {
            setAllCategories(data ?? []);
        }).catch(() => {});
    }, []);

    const stats = getStats(filteredVendors);

    const handleStatusChange = (vendor, newStatus) => {
        setPendingStatuses((prev) => ({ ...prev, [vendor.vendor_id]: newStatus }));
        setModalData({ vendor, newStatus });
    };

    const handleConfirm = async () => {
        if (!modalData) return;
        const { vendor, newStatus } = modalData;
        setRowErrors((prev) => ({ ...prev, [vendor.vendor_id]: null }));
        try {
            await changeStatus(vendor.vendor_id, newStatus);
            setPendingStatuses((prev) => {
                const next = { ...prev };
                delete next[vendor.vendor_id];
                return next;
            });
        } catch (err) {
            setRowErrors((prev) => ({
                ...prev,
                [vendor.vendor_id]: err.message || "Error al actualizar estado",
            }));
        }
        setModalData(null);
    };

    const handleCancel = () => {
        if (modalData) {
            setPendingStatuses((prev) => {
                const next = { ...prev };
                delete next[modalData.vendor.vendor_id];
                return next;
            });
        }
        setModalData(null);
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
                <div className="flex items-center gap-3">
                    <button
                        onClick={reload}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Actualizar
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Crear Vendedor
                    </button>
                </div>
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

            <VendorsTable
                vendors={filteredVendors}
                loading={loading}
                changingId={changingId}
                pendingStatuses={pendingStatuses}
                onStatusChange={handleStatusChange}
                rowErrors={rowErrors}
                onView={(id) => navigate(`/admin/vendors/${id}`)}
                toolbar={
                    <VendorFilters
                        filters={filters}
                        onFilterChange={updateFilter}
                        onReset={resetFilters}
                        allCategories={allCategories}
                    />
                }
            />

            <ConfirmModal
                isOpen={!!modalData}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                variant="warning"
                title="¿Confirmar cambio de estado?"
                message={
                    <>
                        Estás a punto de cambiar el estado de <strong>{modalData?.vendor?.vendor_name}</strong> de{" "}
                        <strong>{modalData?.vendor?.vendor_status}</strong> a <strong>{modalData?.newStatus}</strong>.
                        ¿Deseas continuar?
                    </>
                }
                confirmLabel="Confirmar"
                loadingLabel="Procesando..."
                isLoading={changingId !== null}
            />

            <CreateVendorModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
}
