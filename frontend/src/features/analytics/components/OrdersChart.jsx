import { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ShoppingBag } from "lucide-react";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const STATUS_COLORS = {
    pending: "#f59e0b",
    completed: "#10b981",
    cancelled: "#ef4444",
};

const STATUS_LABELS = {
    pending: "Pendientes",
    completed: "Completadas",
    cancelled: "Canceladas",
};

function ChartSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-5">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-64 bg-gray-100 rounded" />
        </div>
    );
}

function ChartEmpty() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <ShoppingBag size={40} className="mb-3" />
                <p className="text-sm font-medium">Sin datos de órdenes</p>
                <p className="text-xs mt-1">No hay órdenes en el período seleccionado</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-sm font-semibold text-gray-900">
                {entry.name}: {entry.value}
            </p>
            <p className="text-xs text-gray-500">
                {((entry.payload.percent || 0) * 100).toFixed(1)}% del total
            </p>
        </div>
    );
}

function renderLegend({ payload }) {
    return (
        <div className="flex justify-center gap-4 mt-3">
            {payload.map((entry) => (
                <div key={entry.value} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    {STATUS_LABELS[entry.value] || entry.value}
                </div>
            ))}
        </div>
    );
}

export default function OrdersChart({ data, loading, error, onRetry }) {
    const chartData = useMemo(() => {
        if (!data) return [];
        return Object.entries(data)
            .filter(([, value]) => value > 0)
            .map(([key, value]) => ({
                name: STATUS_LABELS[key] || key,
                value,
                color: STATUS_COLORS[key] || "#6b7280",
                percent: 0,
            }))
            .map((item, _, arr) => {
                const total = arr.reduce((sum, d) => sum + d.value, 0);
                return { ...item, percent: total ? item.value / total : 0 };
            });
    }, [data]);

    if (loading) return <ChartSkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!chartData.length) return <ChartEmpty />;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Distribución de Órdenes</h3>
            <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {chartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderLegend} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
