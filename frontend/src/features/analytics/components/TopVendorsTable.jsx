import DataTable from "../../../shared/table/DataTable";
import { createTextColumn } from "../../../shared/table/columns/text.column";
import { createMoneyColumn } from "../../../shared/table/columns/money.column";
import { createStatusColumn } from "../../../shared/table/columns/status.column";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const columns = [
    createTextColumn({ key: "vendorName", label: "Vendedor", sortable: true }),
    createMoneyColumn({ key: "totalRevenue", label: "Ingresos Totales", sortable: true }),
    createTextColumn({ key: "orders", label: "Órdenes", sortable: true, skeletonWidth: "40%" }),
    createStatusColumn({ key: "status", label: "Estado" }),
];

export default function TopVendorsTable({ data, loading, error, onRetry }) {
    if (error) return <ErrorState error={error} onRetry={onRetry} />;

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Mejores Vendedores</h3>
            </div>
            <DataTable
                columns={columns}
                data={data || []}
                loading={loading}
                pageSizeKey="topVendors"
                emptyMessage="No hay vendedores registrados"
                emptyFilterMessage="No se encontraron vendedores con los filtros actuales"
                skeletonRows={5}
            />
        </div>
    );
}
