import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ShoppingBag } from "lucide-react";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

function ChartSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-5">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-[400px] bg-gray-100 rounded" />
        </div>
    );
}

function ChartEmpty() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                <ShoppingBag size={40} className="mb-3" />
                <p className="text-sm font-medium">Sin datos de pedidos</p>
                <p className="text-xs mt-1">No hay pedidos registrados en el período seleccionado</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            {payload.map((entry) => (
                <p key={entry.name} className="text-sm font-medium" style={{ color: entry.color }}>
                    {entry.name}: {entry.value}
                </p>
            ))}
        </div>
    );
}

export default function OrdersTrendChart({ data, loading, error, onRetry }) {
    const chartData = useMemo(() => data || [], [data]);

    if (loading) return <ChartSkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!chartData.length) return <ChartEmpty />;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
                Tendencia de Pedidos
            </h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#16a34a"
                        strokeWidth={2}
                        name="Completados"
                        dot={{ r: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="pending"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="Pendientes"
                        dot={{ r: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="cancelled"
                        stroke="#dc2626"
                        strokeWidth={2}
                        name="Cancelados"
                        dot={{ r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
