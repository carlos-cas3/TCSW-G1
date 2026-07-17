import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Award } from "lucide-react";
import { formatPEN } from "../../../shared/utils/formatCurrency";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const RANK_COLORS = {
    1: "bg-yellow-400 text-yellow-900",
    2: "bg-gray-300 text-gray-700",
    3: "bg-orange-300 text-orange-800",
};

function SkeletonRow({ rows = 8 }) {
    return (
        <>
            {[...Array(rows)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-6 w-6 bg-gray-200 rounded-full mx-auto" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </td>
                </tr>
            ))}
        </>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Award size={40} className="mb-3" />
            <p className="text-sm font-medium">Sin productos</p>
            <p className="text-xs mt-1">No hay productos registrados para este per\u00edodo</p>
        </div>
    );
}

function GrowthBadge({ growth }) {
    if (growth > 0) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                <TrendingUp size={12} />
                +{growth}%
            </span>
        );
    }
    if (growth < 0) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                <TrendingDown size={12} />
                {growth}%
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
            <Minus size={12} />
            0%
        </span>
    );
}

const columns = [
    { key: "rank", label: "#", width: "w-10" },
    { key: "productName", label: "Producto" },
    { key: "orders", label: "Ventas" },
    { key: "revenue", label: "Ingresos" },
    { key: "growth", label: "Crecimiento" },
];

export default function TopProductsPerformance({ data, loading, error, onRetry }) {
    const sortedData = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 8);
    }, [data]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">Rendimiento de Productos</h3>
                </div>
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
                        <SkeletonRow />
                    </tbody>
                </table>
            </div>
        );
    }

    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!sortedData.length) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">Rendimiento de Productos</h3>
                </div>
                <EmptyState />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Rendimiento de Productos</h3>
            </div>
            <div className="overflow-x-auto">
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
                        {sortedData.map((item, idx) => {
                            const rank = idx + 1;
                            const rankColor = RANK_COLORS[rank] || "bg-gray-100 text-gray-600";
                            return (
                                <tr key={item.productName} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankColor}`}>
                                            {rank}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {item.productName}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                        {item.orders?.toLocaleString("es-PE") ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {formatPEN(item.revenue)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <GrowthBadge growth={item.growth ?? 0} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
