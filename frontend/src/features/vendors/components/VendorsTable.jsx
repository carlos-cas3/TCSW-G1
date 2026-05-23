import { useState, useMemo } from "react";
import { Eye, Pencil, ArrowUp, ArrowDown } from "lucide-react";
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

    const sortedVendors = useMemo(() =>
        sortVendors(vendors, sortKey, sortDir),
        [vendors, sortKey, sortDir]
    );

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

    return (
        <>
            <div className="overflow-x-auto">
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
                        {sortedVendors.map((vendor) => (
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
