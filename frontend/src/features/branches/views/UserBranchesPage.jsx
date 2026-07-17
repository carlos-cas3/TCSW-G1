import { useState } from "react";
import { RefreshCw, Plus, Store, CircleCheck, Settings } from "lucide-react";
import { getUser } from "../../../app/auth";
import { useBranches } from "../hooks/useBranches";
import { useBranchFilters } from "../hooks/useBranchFilters";
import createStatsCards from "../../../shared/components/createStatsCards";
import BranchTable from "../components/BranchTable";
import BranchFilters from "../components/BranchFilters";
import BranchFormModal from "../components/BranchFormModal";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import "../styles/layout.css";
import "../styles/buttons.css";

const BranchStatsCards = createStatsCards([
  { label: "Total Sucursales", valueKey: "total", icon: Store, color: "blue" },
  { label: "Activas", valueKey: "active", icon: CircleCheck, color: "green" },
  { label: "En Mantenimiento", valueKey: "maintaining", icon: Settings, color: "red" },
]);

export default function UserBranchesPage() {
    const vendorId = getUser()?.vendorId;
    const {
        branches,
        loading,
        error,
        reload,
        changeStatus,
        createBranch,
        updateBranch,
        deleteBranch,
        changingId,
    } = useBranches({ vendorId, mode: "user" });
    const { filters, filteredBranches, stats, updateFilter, resetFilters } =
        useBranchFilters(branches);
    const [rowErrors, setRowErrors] = useState({});
    const [pendingStatuses, setPendingStatuses] = useState({});
    const [modalData, setModalData] = useState(null);

    const [formModalState, setFormModalState] = useState({
        isOpen: false,
        mode: "create",
        branch: null,
    });

    const handleStatusChange = (branch, newStatus) => {
        setPendingStatuses(prev => ({ ...prev, [branch.branch_id]: newStatus }));
        setModalData({ branch, newStatus, mode: "status" });
    };

    const handleDelete = (branch) => {
        setModalData({ branch, mode: "delete" });
    };

    const handleConfirm = async () => {
        if (!modalData) return;
        const { branch, newStatus, mode } = modalData;
        if (mode === "status") {
            setRowErrors((prev) => ({ ...prev, [branch.branch_id]: null }));
            try {
                await changeStatus(branch.branch_id, newStatus);
                setPendingStatuses(prev => {
                    const next = { ...prev };
                    delete next[branch.branch_id];
                    return next;
                });
            } catch (err) {
                setRowErrors((prev) => ({
                    ...prev,
                    [branch.branch_id]: err.message || "Error al actualizar estado",
                }));
            }
        } else {
            await deleteBranch(branch.branch_id);
        }
        setModalData(null);
    };

    const handleCancel = () => {
        if (modalData) {
            setPendingStatuses(prev => {
                const next = { ...prev };
                delete next[modalData.branch.branch_id];
                return next;
            });
        }
        setModalData(null);
    };

    const handleOpenCreate = () => {
        setFormModalState({ isOpen: true, mode: "create", branch: null });
    };

    const handleOpenEdit = (branch) => {
        setFormModalState({ isOpen: true, mode: "edit", branch });
    };

    const handleCloseModal = () => {
        setFormModalState({ isOpen: false, mode: "create", branch: null });
    };

    const handleSubmit = async (branchData) => {
        if (formModalState.mode === "create") {
            const result = await createBranch(vendorId, branchData);
            if (!result.success) {
                throw new Error(result.error);
            }
        } else {
            const result = await updateBranch(formModalState.branch.branch_id, branchData);
            if (!result.success) {
                throw new Error(result.error);
            }
        }
    };

    const isStatusModal = modalData?.mode === "status";

    return (
        <div className="branches-page">
            <div className="branches-page-header">
                <div className="branches-page-header-start">
                    <h1 className="branches-page-title">Mis Sucursales</h1>
                    <p className="branches-page-subtitle">
                        {filteredBranches.length} sucursal
                        {filteredBranches.length !== 1 ? "es" : ""} de {branches.length} total
                    </p>
                </div>
                <div className="branches-page-actions">
                    <button
                        onClick={handleOpenCreate}
                        className="branches-btn branches-btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Sucursal
                    </button>
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

            <div className="branches-table-container">
                <BranchTable
                    mode="user"
                    branches={filteredBranches}
                    loading={loading}
                    changingId={changingId}
                    pendingStatuses={pendingStatuses}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onEdit={handleOpenEdit}
                    rowErrors={rowErrors}
                    toolbar={
                        <BranchFilters
                            filters={filters}
                            onFilterChange={updateFilter}
                            onReset={resetFilters}
                        />
                    }
                />
            </div>

            <BranchFormModal
                isOpen={formModalState.isOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                branch={formModalState.branch}
            />

            <ConfirmModal
                isOpen={modalData !== null}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                variant={isStatusModal ? "warning" : "danger"}
                title={isStatusModal ? "Confirmar cambio de estado" : "Confirmar eliminación"}
                message={
                    isStatusModal ? (
                        <>
                            ¿Cambiar el estado de <strong>{modalData?.branch?.branch_name}</strong> de{" "}
                            <strong>{modalData?.branch?.branch_status}</strong> a{" "}
                            <strong>{modalData?.newStatus}</strong>?
                        </>
                    ) : (
                        <>
                            ¿Estás seguro de que deseas eliminar la sucursal{" "}
                            <strong>{modalData?.branch?.branch_name}</strong>?
                            <br />
                            <span className="text-sm text-gray-500">La sucursal será marcada como inactiva.</span>
                        </>
                    )
                }
                confirmLabel={isStatusModal ? "Confirmar" : "Eliminar"}
                loadingLabel="Procesando..."
                isLoading={changingId !== null}
            />
        </div>
    );
}
