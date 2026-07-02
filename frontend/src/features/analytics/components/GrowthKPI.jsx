import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatPEN } from "../../../shared/utils/formatCurrency";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

function KPISkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 p-5">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
            ))}
        </div>
    );
}

function GrowthIcon({ growth }) {
    if (growth > 0) return <TrendingUp size={16} className="text-green-600" />;
    if (growth < 0) return <TrendingDown size={16} className="text-red-600" />;
    return <Minus size={16} className="text-gray-400" />;
}

function formatValue(value, prefix) {
    if (prefix === "S/") return formatPEN(value);
    return Number(value).toLocaleString("es-PE");
}

export default function GrowthKPI({ summary, loading, error, onRetry }) {
    const items = useMemo(() => summary || [], [summary]);

    if (loading) return <KPISkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!items.length) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {items.map((item) => (
                <div key={item.label} className="bg-white rounded-lg border border-gray-200 p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {item.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                        {formatValue(item.value, item.prefix)}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <GrowthIcon growth={item.growth} />
                        <span
                            className={`text-sm font-medium ${
                                item.growth > 0
                                    ? "text-green-600"
                                    : item.growth < 0
                                        ? "text-red-600"
                                        : "text-gray-400"
                            }`}
                        >
                            {item.growth > 0 ? "+" : ""}
                            {item.growth}%
                        </span>
                        <span className="text-xs text-gray-400">vs. período anterior</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
