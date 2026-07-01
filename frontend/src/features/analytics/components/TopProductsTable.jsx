import DataTable from "../../../shared/table/DataTable";
import { createTextColumn } from "../../../shared/table/columns/text.column";
import { createMoneyColumn } from "../../../shared/table/columns/money.column";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const columns = [
    createTextColumn({ key: "name", label: "Producto", sortable: true }),
    createTextColumn({ key: "category", label: "Categoría", sortable: true, skeletonWidth: "60%" }),
    createTextColumn({ key: "sales", label: "Ventas", sortable: true, skeletonWidth: "40%" }),
    createMoneyColumn({ key: "revenue", label: "Ingresos", sortable: true }),
];

export default function TopProductsTable({ data, loading, error, onRetry }) {
    if (error) return <ErrorState error={error} onRetry={onRetry} />;

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Productos Más Vendidos</h3>
            </div>
            <DataTable
                columns={columns}
                data={data || []}
                loading={loading}
                pageSizeKey="topProducts"
                emptyMessage="No hay productos registrados"
                emptyFilterMessage="No se encontraron productos con los filtros actuales"
                skeletonRows={5}
            />
        </div>
    );
}
