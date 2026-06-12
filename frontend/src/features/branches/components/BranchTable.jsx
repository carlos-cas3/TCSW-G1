import { useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import StatusBadge from "../../../shared/components/StatusBadge";
import StatusSelect from "../../../shared/components/StatusSelect";
import TableActions from "../../../shared/components/TableActions";
import { formatDate } from "../../../shared/utils/formatDate";
import { BRANCH_STATUS_OPTIONS } from "../constants/branchConstants";
import { sortBranches } from "../utils/branchFilters";

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
  const isAdmin = mode === "admin";
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [pendingStatuses, setPendingStatuses] = useState({});

  const columns = isAdmin ? TABLE_HEADERS_ADMIN : TABLE_HEADERS_USER;

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
    } else {
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

  const dataColumns = columns.map((col) => {
    if (col.key === "branchName") {
      return {
        ...col,
        render: (branch) => (
          <div className="text-sm font-medium text-gray-900">{branch.branch_name}</div>
        ),
      };
    }
    if (col.key === "vendorName") {
      return {
        ...col,
        render: (branch) => (
          <span className="text-sm text-gray-600">{branch.vendor_name || "—"}</span>
        ),
      };
    }
    if (col.key === "address") {
      return {
        ...col,
        render: (branch) => (
          <span className="text-sm text-gray-600 max-w-[150px] truncate block">
            {branch.branch_address || "—"}
          </span>
        ),
      };
    }
    if (col.key === "city") {
      return {
        ...col,
        render: (branch) => (
          <span className="text-sm text-gray-600">{branch.cities?.city_name || "—"}</span>
        ),
      };
    }
    if (col.key === "status") {
      return {
        ...col,
        render: (branch) => {
          if (isAdmin) {
            return <StatusBadge status={branch.branch_status} />;
          }
          return (
            <>
              <StatusSelect
                currentStatus={branch.branch_status}
                pendingStatus={pendingStatuses[branch.branch_id]}
                onChange={(newStatus) => handleStatusChange(branch, newStatus)}
                disabled={changingId === branch.branch_id}
                options={BRANCH_STATUS_OPTIONS}
                optionsConfig={{
                  labels: { ACTIVE: "Activo", INACTIVE: "Inactiva", MAINTENANCE: "En mantenimiento" },
                }}
              />
              {rowErrors?.[branch.branch_id] && (
                <p className="mt-1 text-xs text-red-500">{rowErrors[branch.branch_id]}</p>
              )}
            </>
          );
        },
      };
    }
    if (col.key === "createdAt") {
      return {
        ...col,
        render: (branch) => (
          <span className="text-sm text-gray-600">{formatDate(branch.created_at)}</span>
        ),
      };
    }
    if (col.key === "actions") {
      return {
        ...col,
        render: (branch) => (
          <TableActions
            show={["edit", "delete"]}
            onEdit={() => onEdit(branch)}
            onDelete={() => handleDelete(branch)}
            disabled={changingId === branch.branch_id}
          />
        ),
      };
    }
    return col;
  });

  const isStatusModal = modalData?.mode === "status";

  return (
    <>
      <DataTable
        columns={dataColumns}
        data={branches}
        loading={loading}
        sortFn={sortBranches}
        pageSizeKey="branches_page_size"
        emptyMessage="No hay sucursales registradas"
        emptyFilterMessage="No se encontraron resultados con los filtros actuales"
      />
      <ConfirmModal
        isOpen={modalOpen}
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
    </>
  );
}
