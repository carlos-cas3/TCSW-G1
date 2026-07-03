import { useMemo } from "react";
import { AlertTriangle, TrendingUp, CheckCircle, Bell } from "lucide-react";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const SEVERITY_ORDER = { critical: 0, warning: 1, positive: 2 };

const STYLES = {
    critical: {
        container: "bg-red-50 border-red-200",
        icon: "text-red-600",
        iconComponent: AlertTriangle,
    },
    warning: {
        container: "bg-amber-50 border-amber-200",
        icon: "text-amber-600",
        iconComponent: AlertTriangle,
    },
    positive: {
        container: "bg-green-50 border-green-200",
        icon: "text-green-600",
        iconComponent: TrendingUp,
    },
};

function SkeletonRow() {
    return (
        <div className="animate-pulse flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
            <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <CheckCircle size={40} className="mb-3" />
            <p className="text-sm font-medium">Sin alertas</p>
            <p className="text-xs mt-1">Tu negocio marcha bien</p>
        </div>
    );
}

export default function VendorAlertsPanel({ alerts, loading, error, onRetry }) {
    const sortedAlerts = useMemo(() => {
        if (!alerts) return [];
        return [...alerts]
            .sort((a, b) => (SEVERITY_ORDER[a.type] ?? 99) - (SEVERITY_ORDER[b.type] ?? 99))
            .slice(0, 5);
    }, [alerts]);

    if (error) return <ErrorState error={error} onRetry={onRetry} />;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-gray-700" />
                <h3 className="text-base font-semibold text-gray-900">Alertas de mi negocio</h3>
            </div>

            {loading ? (
                <div className="space-y-3">
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                </div>
            ) : sortedAlerts.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="space-y-3">
                    {sortedAlerts.map((alert) => {
                        const style = STYLES[alert.type] || STYLES.warning;
                        const Icon = style.iconComponent;
                        return (
                            <div
                                key={alert.id}
                                className={`flex items-start gap-3 p-4 border rounded-lg ${style.container}`}
                            >
                                <Icon size={18} className={`shrink-0 mt-0.5 ${style.icon}`} />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">{alert.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
