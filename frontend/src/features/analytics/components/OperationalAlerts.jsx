import { AlertTriangle, Package, Lock } from "lucide-react";

const alertIcons = {
    password: Lock,
    stock: Package,
};

const severityColors = {
    high: {
        bg: "bg-red-50 border-red-200",
        icon: "text-red-500",
        text: "text-red-800",
        desc: "text-red-600",
    },
    medium: {
        bg: "bg-amber-50 border-amber-200",
        icon: "text-amber-500",
        text: "text-amber-800",
        desc: "text-amber-600",
    },
    low: {
        bg: "bg-blue-50 border-blue-200",
        icon: "text-blue-500",
        text: "text-blue-800",
        desc: "text-blue-600",
    },
};

function AlertSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
                    <div className="w-5 h-5 bg-gray-200 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <AlertTriangle size={32} className="mb-2" />
            <p className="text-sm font-medium">Sin tickets</p>
            <p className="text-xs mt-1">No hay tickets recientes</p>
        </div>
    );
}

export default function OperationalAlerts({ alerts, loading }) {
    if (loading) return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Últimos Tickets</h3>
            <AlertSkeleton />
        </div>
    );

    const alertList = alerts || [];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Últimos Tickets</h3>

            {alertList.length === 0 ? <EmptyState /> : (
                <div className="space-y-2">
                    {alertList.map((alert) => {
                        const Icon = alertIcons[alert.type] || AlertTriangle;
                        const colors = severityColors[alert.severity] || severityColors.low;
                        const title = alert.vendorName || alert.productName || "—";

                        return (
                            <div
                                key={alert.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${colors.bg}`}
                            >
                                <Icon size={18} className={`mt-0.5 flex-shrink-0 ${colors.icon}`} />
                                <div>
                                    <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
                                    <p className={`text-xs ${colors.desc}`}>{alert.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
