import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import BranchStatusBadge from "./BranchStatusBadge";
import BranchStatusSelect from "./BranchStatusSelect";
import BranchActions from "./BranchActions";
import BranchSkeletonRow from "./BranchSkeletonRow";
import BranchConfirmModal from "./BranchConfirmModal";
import { sortBranches } from "../utils/branchFilters";
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
    { key: "branchName", label: "Sucursal", sortable: true },
    { key: "vendorName", label: "Vendedor", sortable: true },
    { key: "address", label: "Dirección" },
    { key: "city", label: "Ciudad" },
    { key: "status", label: "Estado" },
    { key: "createdAt", label: "Fecha Creación", sortable: true },
];

const TABLE_HEADERS_USER = [
    { key: "branchName", label: "Sucursal", sortable: true },
    { key: "address", label: "Dirección" },
    { key: "city", label: "Ciudad" },
    { key: "status", label: "Estado" },
    { key: "createdAt", label: "Fecha Creación", sortable: true },
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
    const [pendingStatuses, setPendingStatuses] = useState({});
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState(null);

    const PAGE_SIZE_KEY = "branches_page_size";
    const [pageSize, setPageSize] = useState(() => {
        const saved = localStorage.getItem(PAGE_SIZE_KEY);
        return saved ? parseInt(saved, 10) : 10;
    });
    const [currentPage, setCurrentPage] = useState(1);

    const isAdmin = mode === "admin";
    const headers = isAdmin ? TABLE_HEADERS_ADMIN : TABLE_HEADERS_USER;

    const sortedBranches = useMemo(() =>
        sortBranches(branches, sortKey, sortDir),
        [branches, sortKey, sortDir]
    );

    const totalPages = Math.ceil(sortedBranches.length / pageSize);

    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

    const paginatedBranches = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return sortedBranches.slice(start, start + pageSize);
    }, [sortedBranches, safeCurrentPage, pageSize]);

    const handleSort = (key) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir('asc');
        } else if (sortDir === 'asc') {
            setSortDir('desc');
        } else {
            setSortKey(null);
            setSortDir(null);
        }
    };

    const SortIcon = ({ columnKey }) => {
        const isAsc = sortKey === columnKey && sortDir === 'asc';
        const isDesc = sortKey === columnKey && sortDir === 'desc';
        const mute = "text-gray-400";
        const active = "text-blue-600";

        return (
            <div className="flex flex-col items-center leading-none">
                <ArrowUp className={`w-3 h-3 ${isAsc ? active : mute}`} />
                <ArrowDown className={`w-3 h-3 ${isDesc ? active : mute} -mt-1`} />
            </div>
        );
    };

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
        setPendingStatuses(prev => ({ ...prev, [branch.branch_id]: newStatus }));
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

        setPendingStatuses(prev => {
            const next = { ...prev };
            if (modalData.branch) delete next[modalData.branch.branch_id];
            return next;
        });
        setModalOpen(false);
        setModalData(null);
    };

    const handleCancel = () => {
        setPendingStatuses(prev => {
            const next = { ...prev };
            if (modalData?.branch) delete next[modalData.branch.branch_id];
            return next;
        });
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

    if (sortedBranches.length === 0) {
        return (
            <div className="branches-table-empty">
                <p>No se encontraron resultados con los filtros actuales</p>
            </div>
        );
    }

    const pageStart = sortedBranches.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    const pageEnd = Math.min(safeCurrentPage * pageSize, sortedBranches.length);

    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        localStorage.setItem(PAGE_SIZE_KEY, newSize);
        setCurrentPage(1);
    };

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <>
            <div className="branches-table-scroll">
                <div className="branches-pagination-top">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Mostrar</span>
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <span>por página</span>
                    </div>
                </div>
                <table className="branches-table">
                    <thead className="branches-table-head">
                        <tr>
                            {headers.map(({ key, label, sortable }) => (
                                <th
                                    key={key}
                                    className={`branches-table-header ${sortable ? "branches-table-header-sortable" : ""}`}
                                    onClick={sortable ? () => handleSort(key) : undefined}
                                >
                                    <div className="flex items-center gap-1">
                                        {label}
                                        {sortable && <SortIcon columnKey={key} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="branches-table-body">
                        {paginatedBranches.map((branch) => (
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
                                                pendingStatus={pendingStatuses[branch.branch_id]}
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
                {sortedBranches.length > 0 && (
                    <div className="branches-pagination-bottom">
                        <span className="text-sm text-gray-600">
                            Mostrando {pageStart}–{pageEnd} de {sortedBranches.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="branches-pagination-btn"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`branches-pagination-page ${
                                        page === currentPage ? "branches-pagination-page-active" : ""
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="branches-pagination-btn"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
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