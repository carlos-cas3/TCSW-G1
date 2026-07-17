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
import { formatPEN } from "../../../shared/utils/formatCurrency";
import { TrendingUp } from "lucide-react";
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
                <TrendingUp size={40} className="mb-3" />
                <p className="text-sm font-medium">Sin datos de tendencia</p>
                <p className="text-xs mt-1">No hay ingresos registrados en el período seleccionado</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const currentItem = payload.find((p) => p.dataKey === "current");
    const previousItem = payload.find((p) => p.dataKey === "previous");

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[180px]">
            <p className="text-xs text-gray-500 mb-1.5 font-medium">{label}</p>
            {currentItem && (
                <p className="text-sm font-semibold text-gray-900">
                    Actual: {formatPEN(currentItem.value)}
                </p>
            )}
            {previousItem && (
                <p className="text-xs text-gray-500 mt-0.5">
                    Período anterior: {formatPEN(previousItem.value)}
                </p>
            )}
            {payload[0]?.payload?.diffPercent !== undefined && (
                <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                    <span
                        className={`text-xs font-semibold ${
                            payload[0].payload.diffPercent >= 0
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {payload[0].payload.diffPercent >= 0 ? "+" : ""}
                        {payload[0].payload.diffPercent}% vs período anterior
                    </span>
                </div>
            )}
        </div>
    );
}

const RevenueTrendChart = ({ data, loading, error, onRetry }) => {
    const chartData = useMemo(() => data || [], [data]);

    if (loading) return <ChartSkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!chartData.length) return <ChartEmpty />;

    const hasComparison = chartData.some((d) => d.previous !== undefined && d.previous > 0);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
                Tendencia de Ingresos
                {hasComparison && (
                    <span className="ml-2 text-xs font-normal text-gray-400">
                        (con comparación interanual)
                    </span>
                )}
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
                        tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                    />
                    {hasComparison && (
                        <Line
                            type="monotone"
                            dataKey="previous"
                            stroke="#9ca3af"
                            strokeWidth={1.5}
                            strokeDasharray="5 5"
                            name="Período anterior"
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    )}
                    <Line
                        type="monotone"
                        dataKey="current"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Período actual"
                        dot={{ r: 3, fill: "#2563eb" }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueTrendChart;
