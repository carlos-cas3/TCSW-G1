import { useState } from "react";
import BranchStatusBadge from "./BranchStatusBadge";
import BranchStatusSelect from "./BranchStatusSelect";
import BranchActions from "./BranchActions";
import BranchSkeletonRow from "./BranchSkeletonRow";
import BranchConfirmModal from "./BranchConfirmModal";
import "../styles/table.css";
import "../styles/shared.css";
import "../styles/modal.css";

const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const TABLE_HEADERS_ADMIN = [
    { key: "branchName", label: "Sucursal" },
    { key: "vendorName", label: "Vendedor" },
    { key: "address", label: "Dirección" },
    { key: "city", label: "Ciudad" },
    { key: "status", label: "Estado" },
    { key: "createdAt", label: "Fecha Creación" },
];

const TABLE_HEADERS_USER = [
    { key: "branchName", label: "Sucursal" },
    { key: "address", label: "Dirección" },
    { key: "city", label: "Ciudad" },
    { key: "status", label: "Estado" },
    { key: "createdAt", label: "Fecha Creación" },
    { key: "actions", label: "Acciones" },
];

export default function BranchTable({
    mode,
    branches,
    loading,
    changingId,
    onStatusChange,
    onDelete,
    onEdit,
    rowErrors,
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    const isAdmin = mode === "admin";
    const headers = isAdmin ? TABLE_HEADERS_ADMIN : TABLE_HEADERS_USER;

    const showSkeleton = loading;

    if (showSkeleton) {
        return (
            <div className="branches-table-scroll">
                <table className="branches-table">
                    <thead className="branches-table-head">
                        <tr>
                            {headers.map(({ key, label }) => (
                                <th
                                    key={key}
                                    className="branches-table-header"
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="branches-table-body">
                        {[...Array(5)].map((_, i) => (
                            <BranchSkeletonRow key={i} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const handleStatusChange = (branch, newStatus) => {
        setModalData({ branch, newStatus, mode: "status" });
        setModalOpen(true);
    };

    const handleDelete = (branch) => {
        setModalData({ branch, mode: "delete" });
        setModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!modalData) return;

        if (modalData.mode === "status") {
            await onStatusChange(modalData.branch.branch_id, modalData.newStatus);
        } else if (modalData.mode === "delete") {
            await onDelete(modalData.branch.branch_id);
        }

        setModalOpen(false);
        setModalData(null);
    };

    const handleCancel = () => {
        setModalOpen(false);
        setModalData(null);
    };

    const handleEdit = (branch) => {
        if (onEdit) {
            onEdit(branch);
        }
    };

    if (branches.length === 0) {
        return (
            <div className="branches-table-empty">
                <p>No hay sucursales registradas</p>
            </div>
        );
    }

    return (
        <>
            <div className="branches-table-scroll">
                <table className="branches-table">
                    <thead className="branches-table-head">
                        <tr>
                            {headers.map(({ key, label }) => (
                                <th
                                    key={key}
                                    className="branches-table-header"
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="branches-table-body">
                        {branches.map((branch) => (
                            <tr key={branch.branch_id} className="branches-table-row">
                                <td className="branches-table-cell">
                                    <div className="branches-table-cell-primary">
                                        {branch.branch_name}
                                    </div>
                                </td>
                                {isAdmin && (
                                    <td className="branches-table-cell">
                                        <span className="branches-table-cell-text">
                                            {branch.vendor_name || "—"}
                                        </span>
                                    </td>
                                )}
                                <td className="branches-table-cell">
                                    <span className="branches-table-cell-address">
                                        {branch.branch_address || "—"}
                                    </span>
                                </td>
                                <td className="branches-table-cell">
                                    <span className="branches-table-cell-text">
                                        {branch.cities?.city_name || "—"}
                                    </span>
                                </td>
                                <td className="branches-table-cell">
                                    {isAdmin ? (
                                        <BranchStatusBadge status={branch.branch_status} />
                                    ) : (
                                        <>
                                            <BranchStatusSelect
                                                currentStatus={branch.branch_status}
                                                onChange={(newStatus) => handleStatusChange(branch, newStatus)}
                                                disabled={changingId === branch.branch_id}
                                            />
                                            {rowErrors?.[branch.branch_id] && (
                                                <p className="branches-form-error">
                                                    {rowErrors[branch.branch_id]}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </td>
                                <td className="branches-table-cell">
                                    <span className="branches-table-cell-text">
                                        {formatDate(branch.created_at)}
                                    </span>
                                </td>
                                {!isAdmin && (
                                    <td className="branches-table-cell">
                                        <BranchActions
                                            branch={branch}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            disabled={changingId === branch.branch_id}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <BranchConfirmModal
                isOpen={modalOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                branchName={modalData?.branch?.branch_name}
                currentStatus={modalData?.mode === "status" ? modalData?.branch?.branch_status : null}
                newStatus={modalData?.mode === "status" ? modalData?.newStatus : null}
                isLoading={changingId !== null}
                mode={modalData?.mode || "status"}
            />
        </>
    );
}