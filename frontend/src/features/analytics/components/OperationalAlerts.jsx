import { AlertTriangle, Ticket } from "lucide-react";

const severityStyles = {
    high: "bg-red-400",
    medium: "bg-amber-400",
    low: "bg-blue-400",
};

function AlertSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg" />
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <AlertTriangle size={32} className="mb-2" />
            <p className="text-sm font-medium">Sin tickets recientes</p>
            <p className="text-xs mt-1">No hay tickets registrados en el sistema</p>
        </div>
    );
}

export default function OperationalAlerts({ alerts, loading }) {
    if (loading) return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
                <Ticket size={16} className="text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">Últimos Tickets</h3>
            </div>
            <AlertSkeleton />
        </div>
    );

    const alertList = (alerts || []).slice(0, 3);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
                <Ticket size={16} className="text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">Últimos Tickets</h3>
            </div>

            {alertList.length === 0 ? <EmptyState /> : (
                <div className="space-y-2">
                    {alertList.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <span
                                className={`w-1 h-8 rounded-full mt-0.5 shrink-0 ${
                                    severityStyles[alert.severity] || severityStyles.low
                                }`}
                            />
                            <p className="text-sm text-gray-700 leading-relaxed">{alert.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
