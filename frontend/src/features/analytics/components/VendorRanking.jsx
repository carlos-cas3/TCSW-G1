import { useMemo, useCallback } from "react";
import { formatPEN } from "../../../shared/utils/formatCurrency";
import { Store } from "lucide-react";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

function RankingSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-5">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                        <div className="h-2 bg-gray-200 rounded w-1/4" />
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
            ))}
        </div>
    );
}

const POSITION_COLORS = {
    1: "bg-yellow-100 text-yellow-700 border-yellow-300",
    2: "bg-gray-100 text-gray-600 border-gray-300",
    3: "bg-orange-100 text-orange-700 border-orange-300",
};

const VendorRanking = ({ data, loading, error, onRetry, onVendorClick, activeVendor }) => {
    const ranked = useMemo(() => {
        if (!Array.isArray(data)) return [];
        return [...data]
            .sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0))
            .slice(0, 8);
    }, [data]);

    const handleClick = useCallback((vendor) => {
        if (onVendorClick && vendor?.vendorName) {
            onVendorClick(vendor.vendorName);
        }
    }, [onVendorClick]);

    if (loading) return <RankingSkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!ranked.length) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Store size={40} className="mb-3" />
                    <p className="text-sm font-medium">Sin vendedores</p>
                    <p className="text-xs mt-1">No hay vendedores disponibles para esta categoría</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
                Ranking de Vendedores
                {activeVendor && (
                    <span className="ml-2 text-xs font-normal text-green-600">
                        (seleccionado: {activeVendor})
                    </span>
                )}
            </h3>
            <div className="space-y-0">
                {ranked.map((vendor, idx) => {
                    const isActive = activeVendor === vendor.vendorName;
                    return (
                        <div
                            key={vendor.vendorName}
                            onClick={() => handleClick(vendor)}
                            className={`flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 transition-colors ${
                                onVendorClick ? "cursor-pointer hover:bg-gray-50" : ""
                            } ${isActive ? "bg-green-50 -mx-5 px-5 border-green-200 relative" : ""}`}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r" />
                            )}
                            <span
                                className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full border shrink-0 ${
                                    POSITION_COLORS[idx + 1] || "bg-gray-50 text-gray-400 border-gray-200"
                                } ${isActive ? "ring-2 ring-green-300" : ""}`}
                            >
                                {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {vendor.vendorName}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {vendor.orders ?? 0} pedidos
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                {formatPEN(vendor.totalRevenue ?? 0)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VendorRanking;
