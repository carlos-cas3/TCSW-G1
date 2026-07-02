import { useMemo } from "react";
import { Lightbulb, TrendingUp, AlertTriangle, Info } from "lucide-react";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const TYPE_CONFIG = {
    positive: {
        icon: TrendingUp,
        bg: "bg-green-50 border-green-200",
        iconColor: "text-green-600",
        titleColor: "text-green-800",
    },
    warning: {
        icon: AlertTriangle,
        bg: "bg-yellow-50 border-yellow-200",
        iconColor: "text-yellow-600",
        titleColor: "text-yellow-800",
    },
    critical: {
        icon: AlertTriangle,
        bg: "bg-red-50 border-red-200",
        iconColor: "text-red-600",
        titleColor: "text-red-800",
    },
    info: {
        icon: Info,
        bg: "bg-blue-50 border-blue-200",
        iconColor: "text-blue-600",
        titleColor: "text-blue-800",
    },
};

function InsightsSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-5">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded" />
                ))}
            </div>
        </div>
    );
}

function InsightsEmpty() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Lightbulb size={40} className="mb-3" />
                <p className="text-sm font-medium">Sin insights</p>
                <p className="text-xs mt-1">No hay suficientes datos para generar insights</p>
            </div>
        </div>
    );
}

export default function InsightsPanel({ insights, loading, error, onRetry }) {
    const items = useMemo(() => insights || [], [insights]);

    if (loading) return <InsightsSkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!items.length) return <InsightsEmpty />;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-amber-500" />
                <h3 className="text-base font-semibold text-gray-900">Insights</h3>
            </div>
            <div className="space-y-3">
                {items.map((insight, idx) => {
                    const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info;
                    const Icon = config.icon;
                    return (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg}`}
                        >
                            <Icon size={18} className={`shrink-0 mt-0.5 ${config.iconColor}`} />
                            <div>
                                <p className={`text-sm font-semibold ${config.titleColor}`}>
                                    {insight.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
