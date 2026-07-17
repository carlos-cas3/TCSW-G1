import {} from "lucide-react";
import DataTable from "../table/DataTable";
import { createTextColumn } from "../table/columns/text.column";
import { createStatusColumn } from "../table/columns/status.column";
import { createActionsColumn } from "../table/columns/actions.column";
import { createDateColumn } from "../table/columns/date.column";
import { createMoneyColumn } from "../table/columns/money.column";
import FilterBar from "../components/FilterBar";

const MOCK_DATA = [
  {
    id: 1,
    name: "Distribuidora del Sur",
    ruc: "20123456789",
    status: "ACTIVE",
    category: "Alimentos",
    price: 1250.5,
    stock: 42,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Importaciones Norte S.A.C.",
    ruc: "20234567890",
    status: "PENDING",
    category: "Electrónica",
    price: 8900,
    stock: 18,
    createdAt: "2025-03-22T08:30:00Z",
  },
  {
    id: 3,
    name: "Comercial del Este E.I.R.L.",
    ruc: "20345678901",
    status: "INACTIVE",
    category: "Textiles",
    price: 340.75,
    stock: 200,
    createdAt: "2024-11-01T14:00:00Z",
  },
  {
    id: 4,
    name: "Servicios Centrales S.A.",
    ruc: "20456789012",
    status: "SUSPENDED",
    category: "Servicios",
    price: 5670,
    stock: 0,
    createdAt: "2024-06-10T09:15:00Z",
  },
  {
    id: 5,
    name: "Tecnología Aplicada S.R.L.",
    ruc: "20567890123",
    status: "ACTIVE",
    category: "Tecnología",
    price: 15200,
    stock: 7,
    createdAt: "2025-05-30T16:45:00Z",
  },
  {
    id: 6,
    name: "Logística Global Perú",
    ruc: "20678901234",
    status: "ACTIVE",
    category: "Logística",
    price: 2340,
    stock: 55,
    createdAt: "2025-02-18T11:20:00Z",
  },
];

const BASE_COLUMNS = [
  createTextColumn({ key: "name", label: "Empresa", sortable: true }),
  createTextColumn({ key: "ruc", label: "RUC" }),
  createTextColumn({ key: "category", label: "Categoría", sortable: true }),
  createStatusColumn({
    key: "status",
    label: "Estado (badge)",
    variant: "badge",
  }),
  createStatusColumn({
    key: "status",
    label: "Estado (dropdown)",
    variant: "dropdown",
    onChange: (row, newValue) =>
      console.log(`[Playground] ${row.name}: ${row.status} → ${newValue}`),
    options: ["ACTIVE", "PENDING", "INACTIVE", "SUSPENDED"],
    labels: {
      ACTIVE: "Activo",
      PENDING: "Pendiente",
      INACTIVE: "Inactivo",
      SUSPENDED: "Suspendido",
    },
  }),
  createDateColumn({ key: "createdAt", label: "Fecha Ingreso", sortable: true }),
  createMoneyColumn({ key: "price", label: "Precio", sortable: true }),
  createActionsColumn({
    actions: ["view", "edit", "delete"],
    handlers: {
      onView: (row) => console.log("[Playground] Ver:", row.name),
      onEdit: (row) => console.log("[Playground] Editar:", row.name),
      onDelete: (row) => console.log("[Playground] Eliminar:", row.name),
    },
  }),
];

const SORT_FN = (data, sortKey, sortDir) => {
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

const filterBarFilters = [
  {
    key: "search",
    type: "search",
    placeholder: "Buscar empresa...",
    value: "",
    onChange: () => {},
  },
  {
    key: "status",
    type: "select",
    label: "Estado",
    value: "all",
    options: [
      { value: "ACTIVE", label: "Activo" },
      { value: "PENDING", label: "Pendiente" },
      { value: "INACTIVE", label: "Inactivo" },
      { value: "SUSPENDED", label: "Suspendido" },
    ],
    onChange: () => {},
  },
];

export default function DataTablePlayground() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">DataTable Playground</h1>

      {/* ── Normal ── */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Data normal (fixedHeight=false)</h2>
        <DataTable
          columns={BASE_COLUMNS}
          data={MOCK_DATA}
          sortFn={SORT_FN}
          pageSizeKey="dev_playground"
        />
      </section>

      {/* ── Normal con toolbar ── */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-blue-700">fixedHeight=false con toolbar</h2>
        <DataTable
          columns={BASE_COLUMNS}
          data={MOCK_DATA}
          sortFn={SORT_FN}
          pageSizeKey="dev_playground"
          toolbar={
            <FilterBar
              filters={filterBarFilters}
              onReset={() => console.log("[Playground] Reset filters")}
            />
          }
        />
      </section>

      {/* ── Fixed Height ── */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-green-700">fixedHeight=true con toolbar</h2>
        <DataTable
          columns={BASE_COLUMNS}
          data={MOCK_DATA}
          sortFn={SORT_FN}
          pageSizeKey="dev_playground_fixed"
          fixedHeight={true}
          toolbar={
            <FilterBar
              filters={filterBarFilters}
              onReset={() => console.log("[Playground] Reset filters")}
            />
          }
        />
      </section>

      {/* ── Loading with fixedHeight ── */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-blue-600">Loading con fixedHeight=true</h2>
        <DataTable
          columns={BASE_COLUMNS}
          data={[]}
          loading
          sortFn={SORT_FN}
          pageSizeKey="dev_playground"
          skeletonRows={4}
          fixedHeight={true}
        />
      </section>

      {/* ── Empty ── */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-orange-600">Empty state (sin datos)</h2>
        <DataTable
          columns={BASE_COLUMNS}
          data={[]}
          sortFn={SORT_FN}
          pageSizeKey="dev_playground"
          emptyMessage="No hay registros disponibles"
        />
      </section>

      {/* ── Empty Filter ── */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-red-600">Empty filter (data existe, filtro da 0)</h2>
        <DataTable
          columns={BASE_COLUMNS}
          data={MOCK_DATA}
          sortFn={() => []}
          pageSizeKey="dev_playground"
          emptyFilterMessage="No se encontraron resultados con los filtros actuales"
        />
      </section>
    </div>
  );
}
