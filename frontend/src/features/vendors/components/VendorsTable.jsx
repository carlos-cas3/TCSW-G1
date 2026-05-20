import { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import VendorStatusSelect from "./VendorStatusSelect";
import VendorConfirmModal from "./VendorConfirmModal";
import VendorSkeletonRow from "./VendorSkeletonRow";

const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const TABLE_HEADERS = [
    { key: "vendorName", label: "Empresa" },
    { key: "ruc", label: "RUC" },
    { key: "categories", label: "Categorías" },
    { key: "status", label: "Status" },
    { key: "products", label: "Productos" },
    { key: "branches", label: "Sucursales" },
    { key: "createdAt", label: "Fecha Ingreso" },
    { key: "actions", label: "Acciones" },
];

export default function VendorsTable({
    vendors, loading, changingId, changeStatus, rowErrors, onView,
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

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
        setModalData({ vendor, newStatus });
        setModalOpen(true);
    };

    const handleConfirm = async () => {
        if (modalData) {
            await changeStatus(modalData.vendor.vendor_id, modalData.newStatus);
            setModalOpen(false);
            setModalData(null);
        }
    };

    const handleCancel = () => {
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
                        {vendors.map((vendor) => (
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