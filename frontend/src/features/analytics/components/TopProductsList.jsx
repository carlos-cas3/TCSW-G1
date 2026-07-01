import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatPEN } from "../../../shared/utils/formatCurrency";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const columns = [
    { key: "name", label: "Producto", sortable: true },
    { key: "category", label: "Categoría", sortable: true, skeletonWidth: "60%" },
    { key: "sales", label: "Ventas", sortable: true, skeletonWidth: "40%" },
    { key: "revenue", label: "Ingresos", sortable: true },
];

function SkeletonRow({ rows = 5 }) {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {columns.map((col, j) => (
                        <td key={j} className="px-4 py-4 whitespace-nowrap">
                            <div
                                className="h-4 bg-gray-200 rounded"
                                style={{ width: col.skeletonWidth || "80%" }}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

function SortIcon({ active, direction }) {
    if (!active) {
        return (
            <span className="inline-flex flex-col items-center leading-none opacity-30">
                <ArrowUp className="w-3 h-3" />
                <ArrowDown className="w-3 h-3 -mt-1" />
            </span>
        );
    }
    return (
        <span className="inline-flex flex-col items-center leading-none">
            {direction === "asc" ? (
                <ArrowUp className="w-3 h-3 text-blue-600" />
            ) : (
                <ArrowDown className="w-3 h-3 text-blue-600 -mt-1" />
            )}
        </span>
    );
}

export default function TopProductsList({ data, loading, error, onRetry, maxRows = 5, title = "Top Productos Más Vendidos" }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState(null);

    const handleSort = (key) => {
        if (key !== sortKey) {
            setSortKey(key);
            setSortDir("asc");
        } else if (sortDir === "asc") {
            setSortDir("desc");
        } else {
            setSortKey(null);
            setSortDir(null);
        }
    };

    const effectiveSortKey = sortKey || "sales";
    const effectiveSortDir = sortDir || "desc";

    const displayData = useMemo(() => {
        const list = data || [];
        if (list.length === 0) return [];
        const sorted = [...list].sort((a, b) => {
            const aVal = a[effectiveSortKey];
            const bVal = b[effectiveSortKey];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === "string") {
                return effectiveSortDir === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            return effectiveSortDir === "asc" ? aVal - bVal : bVal - aVal;
        });
        return sorted.slice(0, maxRows);
    }, [data, effectiveSortKey, effectiveSortDir, maxRows]);

    if (error) return <ErrorState error={error} onRetry={onRetry} />;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            </div>

            {loading ? (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <SkeletonRow rows={maxRows} />
                    </tbody>
                </table>
            ) : displayData.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-500">
                    <p>No hay productos registrados</p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => {
                                const active = col.sortable && col.key === effectiveSortKey;
                                return (
                                    <th
                                        key={col.key}
                                        className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                                            col.sortable
                                                ? "cursor-pointer select-none hover:text-gray-700 hover:bg-gray-100"
                                                : ""
                                        }`}
                                        onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            {col.label}
                                            {col.sortable && <SortIcon active={active} direction={effectiveSortDir} />}
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayData.map((row, i) => (
                            <tr key={row.id ?? row.key ?? i} className="hover:bg-gray-50 transition-colors">
                                {columns.map((col) => {
                                    const value = col.key === "revenue" ? formatPEN(row.revenue) : row[col.key] ?? "—";
                                    return (
                                        <td key={col.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
