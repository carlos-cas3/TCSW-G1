import { useState } from "react";
import { UserCheck, UserCog } from "lucide-react";
import DataTable from "../../../shared/table/DataTable";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import TableActions from "../../../shared/components/TableActions";
import { ROLE_MAP } from "../constants/staffConstants";

const TABLE_HEADERS = [
  { key: "first_name", label: "Nombre", sortable: true },
  { key: "last_name", label: "Apellido", sortable: true },
  { key: "role_id", label: "Rol", sortable: true },
  { key: "contact", label: "Contacto" },
  { key: "actions", label: "Acciones" },
];

const sortStaff = (data, sortKey, sortDir) => {
  if (!sortKey || !sortDir) return data;
  return [...data].sort((a, b) => {
    const aVal = a[sortKey] ?? "";
    const bVal = b[sortKey] ?? "";
    const cmp =
      typeof aVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
    return sortDir === "asc" ? cmp : -cmp;
  });
};

export default function StaffTable({ staff, loading }) {
  const [confirmModal, setConfirmModal] = useState(null);

  const columns = TABLE_HEADERS.map((col) => {
    if (col.key === "role_id") {
      return {
        ...col,
        render: (item) => {
          const label = ROLE_MAP[item.role_id] ?? "—";
          const isSupervisor = item.role_id === 4;
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
              {isSupervisor ? (
                <UserCog className="w-3.5 h-3.5" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
              {label}
            </span>
          );
        },
      };
    }

    if (col.key === "contact") {
      return {
        ...col,
        render: (item) => (
          <div className="text-sm">
            <p className="text-gray-900">{item.email}</p>
            <p className="text-gray-500 text-xs">{item.personal_phone}</p>
          </div>
        ),
      };
    }

    if (col.key === "actions") {
      return {
        ...col,
        render: () => (
          <TableActions
            show={["edit", "delete"]}
            disabled
          />
        ),
      };
    }

    return col;
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={staff}
        loading={loading}
        sortFn={sortStaff}
        pageSizeKey="staff_page_size"
        emptyMessage="No hay miembros del staff"
      />

      {confirmModal && (
        <ConfirmModal
          isOpen={!!confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={async () => {
            await confirmModal.onConfirm();
            setConfirmModal(null);
          }}
          title={confirmModal.title}
          message={confirmModal.message}
          variant={confirmModal.variant}
          confirmLabel={confirmModal.confirmLabel}
        />
      )}
    </>
  );
}
