import { useState } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { getUser } from "../../../app/auth";
import { useBranches } from "../hooks/useBranches";
import { useBranchFilters } from "../hooks/useBranchFilters";
import BranchTable from "../components/BranchTable";
import BranchFilters from "../components/BranchFilters";
import BranchFormModal from "../components/BranchFormModal";
import "../styles/layout.css";
import "../styles/buttons.css";

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
    const { filters, filteredBranches, cities, updateFilter, resetFilters } =
        useBranchFilters(branches, "user");
    const [rowErrors, setRowErrors] = useState({});

    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: "create",
        branch: null,
    });

    const handleStatusChange = async (branchId, newStatus) => {
        setRowErrors((prev) => ({ ...prev, [branchId]: null }));
        try {
            await changeStatus(branchId, newStatus);
        } catch (err) {
            setRowErrors((prev) => ({
                ...prev,
                [branchId]: err.message || "Error al actualizar estado",
            }));
        }
    };

    const handleOpenCreate = () => {
        setModalState({ isOpen: true, mode: "create", branch: null });
    };

    const handleOpenEdit = (branch) => {
        setModalState({ isOpen: true, mode: "edit", branch });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, mode: "create", branch: null });
    };

    const handleSubmit = async (branchData) => {
        if (modalState.mode === "create") {
            const result = await createBranch(vendorId, branchData);
            if (!result.success) {
                throw new Error(result.error);
            }
        } else {
            const result = await updateBranch(modalState.branch.branch_id, branchData);
            if (!result.success) {
                throw new Error(result.error);
            }
        }
    };

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

            <BranchFilters
                mode="user"
                filters={filters}
                cities={cities}
                vendors={[]}
                onFilterChange={updateFilter}
                onReset={resetFilters}
            />

            <div className="branches-table-container">
                <BranchTable
                    mode="user"
                    branches={filteredBranches}
                    loading={loading}
                    changingId={changingId}
                    onStatusChange={handleStatusChange}
                    onDelete={deleteBranch}
                    onEdit={handleOpenEdit}
                    rowErrors={rowErrors}
                />
            </div>

            <BranchFormModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                branch={modalState.branch}
            />
        </div>
    );
}