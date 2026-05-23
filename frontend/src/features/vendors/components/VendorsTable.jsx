import { useState, useMemo } from "react";
import { Eye, Pencil, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import VendorStatusSelect from "./VendorStatusSelect";
import VendorConfirmModal from "./VendorConfirmModal";
import VendorSkeletonRow from "./VendorSkeletonRow";
import { sortVendors } from "../utils/vendorHelpers";

const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const TABLE_HEADERS = [
    { key: "vendorName", label: "Empresa", sortable: true },
    { key: "ruc", label: "RUC" },
    { key: "categories", label: "Categorías" },
    { key: "status", label: "Status" },
    { key: "products", label: "Productos", sortable: true },
    { key: "branches", label: "Sucursales", sortable: true },
    { key: "createdAt", label: "Fecha Ingreso", sortable: true },
    { key: "actions", label: "Acciones" },
];

export default function VendorsTable({
    vendors, loading, changingId, changeStatus, rowErrors, onView,
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [pendingStatuses, setPendingStatuses] = useState({});
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState(null);

    const PAGE_SIZE_KEY = "vendors_page_size";
    const [pageSize, setPageSize] = useState(() => {
        const saved = localStorage.getItem(PAGE_SIZE_KEY);
        return saved ? parseInt(saved, 10) : 10;
    });
    const [currentPage, setCurrentPage] = useState(1);

    const sortedVendors = useMemo(() =>
        sortVendors(vendors, sortKey, sortDir),
        [vendors, sortKey, sortDir]
    );

    const totalPages = Math.ceil(sortedVendors.length / pageSize);

    const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

    const paginatedVendors = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;
        return sortedVendors.slice(start, start + pageSize);
    }, [sortedVendors, safeCurrentPage, pageSize]);

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
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {TABLE_HEADERS.map(({ key, label }) => (
                                <th
                                    key={key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[...Array(4)].map((_, i) => (
                            <VendorSkeletonRow key={i} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const handleStatusChange = (vendor, newStatus) => {
        setPendingStatuses(prev => ({ ...prev, [vendor.vendor_id]: newStatus }));
        setModalData({ vendor, newStatus });
        setModalOpen(true);
    };

    const handleConfirm = async () => {
        if (modalData) {
            await changeStatus(modalData.vendor.vendor_id, modalData.newStatus);
            setPendingStatuses(prev => {
                const next = { ...prev };
                delete next[modalData.vendor.vendor_id];
                return next;
            });
            setModalOpen(false);
            setModalData(null);
        }
    };

    const handleCancel = () => {
        setPendingStatuses(prev => {
            const next = { ...prev };
            if (modalData) delete next[modalData.vendor.vendor_id];
            return next;
        });
        setModalOpen(false);
        setModalData(null);
    };

    if (vendors.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No hay vendedores registrados</p>
            </div>
        );
    }

    if (sortedVendors.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron resultados con los filtros actuales</p>
            </div>
        );
    }

    const pageStart = sortedVendors.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    const pageEnd = Math.min(safeCurrentPage * pageSize, sortedVendors.length);

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
            <div className="overflow-x-auto">
                <div className="flex items-center justify-end px-6 py-3 bg-white border-b border-gray-200">
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
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {TABLE_HEADERS.map(({ key, label, sortable }) => (
                                <th
                                    key={key}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable ? "cursor-pointer select-none hover:text-gray-700 hover:bg-gray-100" : ""}`}
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
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedVendors.map((vendor) => (
                            <tr key={vendor.vendor_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {vendor.vendor_name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {vendor.vendor_email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 font-mono">
                                        {vendor.vendor_ruc || "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1">
                                        {vendor.vendor_categories?.slice(0, 2).map((cat, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                                            >
                                                {cat.categories?.category_name}
                                            </span>
                                        ))}
                                        {vendor.vendor_categories?.length > 2 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                +{vendor.vendor_categories.length - 2} más
                                            </span>
                                        )}
                                        {!vendor.vendor_categories?.length && "—"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <VendorStatusSelect
                                        currentStatus={vendor.vendor_status}
                                        pendingStatus={pendingStatuses[vendor.vendor_id]}
                                        onChange={(newStatus) => handleStatusChange(vendor, newStatus)}
                                        disabled={changingId === vendor.vendor_id}
                                    />
                                    {rowErrors[vendor.vendor_id] && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {rowErrors[vendor.vendor_id]}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-500">—</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">
                                        {vendor.branches?.length || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-500">
                                        {formatDate(vendor.created_at)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onView?.(vendor.vendor_id)}
                                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                            title="Ver más información"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => console.log("Edit:", vendor.vendor_id)}
                                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sortedVendors.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
                        <span className="text-sm text-gray-600">
                            Mostrando {pageStart}–{pageEnd} de {sortedVendors.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-3 py-1 text-sm rounded ${
                                        page === currentPage
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <VendorConfirmModal
                isOpen={modalOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                vendorName={modalData?.vendor?.vendor_name}
                currentStatus={modalData?.vendor?.vendor_status}
                newStatus={modalData?.newStatus}
                isLoading={changingId !== null}
            />
        </>
    );
}
