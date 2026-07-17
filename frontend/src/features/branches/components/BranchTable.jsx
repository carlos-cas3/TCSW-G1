import DataTable from "../../../shared/table/DataTable";
import StatusDropdown from "../../../shared/table/components/StatusDropdown";
import { createActionsColumn } from "../../../shared/table/columns/actions.column";
import { BRANCH_STATUS_OPTIONS } from "../constants/branchConstants";
import { sortBranches } from "../utils/branchFilters";

const BRANCH_STATUS_LABELS = {
  ACTIVE: "Activo",
  INACTIVE: "Inactiva",
  MAINTENANCE: "En mantenimiento",
};

export default function BranchTable({
  mode,
  branches,
  loading,
  changingId,
  pendingStatuses,
  onStatusChange,
  onDelete,
  onEdit,
  onView,
  rowErrors,
  toolbar,
}) {
  const isAdmin = mode === "admin";

  const buildAdminColumns = () => [
    {
      key: "branchName",
      label: "Sucursal",
      sortable: true,
      render: (branch) => (
        <div className="text-sm font-medium text-gray-900">{branch.branch_name}</div>
      ),
    },
    {
      key: "vendorName",
      label: "Vendedor",
      sortable: true,
      render: (branch) => (
        <span className="text-sm text-gray-600">{branch.vendor_name || "—"}</span>
      ),
    },
    {
      key: "address",
      label: "Dirección",
      render: (branch) => (
        <span className="text-sm text-gray-600 max-w-[150px] truncate block">
          {branch.branch_address || "—"}
        </span>
      ),
    },
    {
      key: "city",
      label: "Ciudad",
      render: (branch) => (
        <span className="text-sm text-gray-600">{branch.cities?.city_name || "—"}</span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (branch) => (
        <StatusDropdown variant="badge" value={branch.branch_status} />
      ),
    },
    {
      key: "createdAt",
      label: "Fecha Creación",
      sortable: true,
      render: (branch) => {
        if (!branch.created_at) return "—";
        return new Date(branch.created_at).toLocaleDateString("es-PE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    createActionsColumn({
      actions: ["view"],
      handlers: {
        onView: (branch) => onView(branch.branch_id),
      },
    }),
  ];

  const buildUserColumns = () => [
    {
      key: "branchName",
      label: "Sucursal",
      sortable: true,
      render: (branch) => (
        <div className="text-sm font-medium text-gray-900">{branch.branch_name}</div>
      ),
    },
    {
      key: "address",
      label: "Dirección",
      render: (branch) => (
        <span className="text-sm text-gray-600 max-w-[150px] truncate block">
          {branch.branch_address || "—"}
        </span>
      ),
    },
    {
      key: "city",
      label: "Ciudad",
      render: (branch) => (
        <span className="text-sm text-gray-600">{branch.cities?.city_name || "—"}</span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (branch) => (
        <>
          <StatusDropdown
            variant="dropdown"
            value={branch.branch_status}
            pendingValue={pendingStatuses?.[branch.branch_id]}
            onChange={(newValue) => onStatusChange(branch, newValue)}
            disabled={changingId === branch.branch_id}
            options={BRANCH_STATUS_OPTIONS}
            labels={BRANCH_STATUS_LABELS}
          />
          {rowErrors?.[branch.branch_id] && (
            <p className="mt-1 text-xs text-red-500">{rowErrors[branch.branch_id]}</p>
          )}
        </>
      ),
    },
    {
      key: "createdAt",
      label: "Fecha Creación",
      sortable: true,
      render: (branch) => {
        if (!branch.created_at) return "—";
        return new Date(branch.created_at).toLocaleDateString("es-PE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    createActionsColumn({
      actions: ["edit", "delete"],
      handlers: {
        onEdit: (branch) => onEdit(branch),
        onDelete: (branch) => onDelete(branch),
      },
    }),
  ];

  const columns = isAdmin ? buildAdminColumns() : buildUserColumns();

  return (
    <DataTable
      columns={columns}
      data={branches}
      loading={loading}
      sortFn={sortBranches}
      pageSizeKey="branches_page_size"
      emptyMessage="No hay sucursales registradas"
      emptyFilterMessage="No se encontraron resultados con los filtros actuales"
      toolbar={toolbar}
    />
  );
}
