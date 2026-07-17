import DataTable from "../../../shared/table/DataTable";
import StatusDropdown from "../../../shared/table/components/StatusDropdown";
import { createDateColumn } from "../../../shared/table/columns/date.column";
import { createActionsColumn } from "../../../shared/table/columns/actions.column";
import { sortVendors } from "../utils/vendorHelpers";

const VENDOR_STATUS_OPTIONS = ["PENDING", "ACTIVE", "SUSPENDED"];

const VENDOR_STATUS_LABELS = {
  PENDING: "Pendiente",
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  SUSPENDED: "Suspendido",
};

export default function VendorsTable({
  vendors,
  loading,
  changingId,
  pendingStatuses,
  onStatusChange,
  rowErrors,
  onView,
  toolbar,
}) {
  const columns = [
    {
      key: "vendorName",
      label: "Empresa",
      sortable: true,
      render: (vendor) => (
        <>
          <div className="text-sm font-medium text-gray-900">{vendor.vendor_name}</div>
          <div className="text-sm text-gray-500">{vendor.vendor_email}</div>
        </>
      ),
    },
    {
      key: "ruc",
      label: "RUC",
      render: (vendor) => (
        <div className="text-sm text-gray-900 font-mono">{vendor.vendor_ruc || "—"}</div>
      ),
    },
    {
      key: "categories",
      label: "Categorías",
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
    },
    {
      key: "status",
      label: "Estado",
      render: (vendor) => (
        <>
          <StatusDropdown
            variant="dropdown"
            value={vendor.vendor_status}
            pendingValue={pendingStatuses?.[vendor.vendor_id]}
            onChange={(newValue) => onStatusChange(vendor, newValue)}
            disabled={changingId === vendor.vendor_id}
            options={VENDOR_STATUS_OPTIONS}
            labels={VENDOR_STATUS_LABELS}
          />
          {rowErrors?.[vendor.vendor_id] && (
            <p className="mt-1 text-xs text-red-600">{rowErrors[vendor.vendor_id]}</p>
          )}
        </>
      ),
    },
    {
      key: "products",
      label: "Productos",
      sortable: true,
      render: (vendor) => (
        <span className="text-sm text-gray-900">{vendor.products?.length ?? "—"}</span>
      ),
    },
    {
      key: "branches",
      label: "Sucursales",
      sortable: true,
      render: (vendor) => (
        <span className="text-sm text-gray-900">{vendor.branches?.length || 0}</span>
      ),
    },
    createDateColumn({ key: "created_at", label: "Fecha Ingreso", sortable: true }),
    createActionsColumn({
      actions: ["view"],
      handlers: {
        onView: (vendor) => onView(vendor.vendor_id),
      },
    }),
  ];

  return (
    <DataTable
      columns={columns}
      data={vendors}
      loading={loading}
      sortFn={sortVendors}
      pageSizeKey="vendors_page_size"
      emptyMessage="No hay vendedores registrados"
      emptyFilterMessage="No se encontraron resultados con los filtros actuales"
      toolbar={toolbar}
    />
  );
}
