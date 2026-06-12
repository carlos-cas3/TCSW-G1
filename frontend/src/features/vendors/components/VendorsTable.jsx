import { useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import StatusSelect from "../../../shared/components/StatusSelect";
import TableActions from "../../../shared/components/TableActions";
import { formatDate } from "../../../shared/utils/formatDate";
import { sortVendors } from "../utils/vendorHelpers";

const VENDOR_STATUS_OPTIONS = ["PENDING", "ACTIVE", "INACTIVE", "SUSPENDED"];

const VENDOR_STATUS_LABELS = {
  PENDING: "Pendiente",
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  SUSPENDED: "Suspendido",
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
  vendors,
  loading,
  changingId,
  changeStatus,
  rowErrors,
  onView,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [pendingStatuses, setPendingStatuses] = useState({});

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

  const dataColumns = TABLE_HEADERS.map((col) => {
    if (col.key === "vendorName") {
      return {
        ...col,
        render: (vendor) => (
          <>
            <div className="text-sm font-medium text-gray-900">{vendor.vendor_name}</div>
            <div className="text-sm text-gray-500">{vendor.vendor_email}</div>
          </>
        ),
      };
    }
    if (col.key === "ruc") {
      return {
        ...col,
        render: (vendor) => (
          <div className="text-sm text-gray-900 font-mono">{vendor.vendor_ruc || "—"}</div>
        ),
      };
    }
    if (col.key === "categories") {
      return {
        ...col,
        render: (vendor) => (
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
        ),
      };
    }
    if (col.key === "status") {
      return {
        ...col,
        render: (vendor) => (
          <>
            <StatusSelect
              currentStatus={vendor.vendor_status}
              pendingStatus={pendingStatuses[vendor.vendor_id]}
              onChange={(newStatus) => handleStatusChange(vendor, newStatus)}
              disabled={changingId === vendor.vendor_id}
              options={VENDOR_STATUS_OPTIONS}
              optionsConfig={{ labels: VENDOR_STATUS_LABELS }}
            />
            {rowErrors?.[vendor.vendor_id] && (
              <p className="mt-1 text-xs text-red-600">{rowErrors[vendor.vendor_id]}</p>
            )}
          </>
        ),
      };
    }
    if (col.key === "products") {
      return {
        ...col,
        render: () => <span className="text-sm text-gray-500">—</span>,
      };
    }
    if (col.key === "branches") {
      return {
        ...col,
        render: (vendor) => (
          <span className="text-sm text-gray-900">{vendor.branches?.length || 0}</span>
        ),
      };
    }
    if (col.key === "createdAt") {
      return {
        ...col,
        render: (vendor) => (
          <span className="text-sm text-gray-500">{formatDate(vendor.created_at, "mmm dd, yyyy")}</span>
        ),
      };
    }
    if (col.key === "actions") {
      return {
        ...col,
        render: (vendor) => (
          <TableActions
            show={["view", "edit"]}
            onView={() => onView?.(vendor.vendor_id)}
            onEdit={() => console.log("Edit:", vendor.vendor_id)}
          />
        ),
      };
    }
    return col;
  });

  return (
    <>
      <DataTable
        columns={dataColumns}
        data={vendors}
        loading={loading}
        sortFn={sortVendors}
        pageSizeKey="vendors_page_size"
        emptyMessage="No hay vendedores registrados"
        emptyFilterMessage="No se encontraron resultados con los filtros actuales"
      />
      <ConfirmModal
        isOpen={modalOpen}
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
    </>
  );
}
