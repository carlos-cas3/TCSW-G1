import { useMemo } from "react";
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

export default function TopProductsTable({ data, loading, error, onRetry, maxRows }) {
    const displayData = useMemo(() => {
        if (!data) return [];
        if (maxRows && maxRows > 0) return data.slice(0, maxRows);
        return data;
    }, [data, maxRows]);

    if (error) return <ErrorState error={error} onRetry={onRetry} />;

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">
                    {maxRows ? `Top ${maxRows} Productos Más Vendidos` : "Productos Más Vendidos"}
                </h3>
            </div>
            <DataTable
                columns={columns}
                data={displayData}
                loading={loading}
                pageSizeKey={maxRows ? undefined : "topProducts"}
                emptyMessage="No hay productos registrados"
                emptyFilterMessage="No se encontraron productos con los filtros actuales"
                skeletonRows={maxRows || 5}
            />
        </div>
    );
}
