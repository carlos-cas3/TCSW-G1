import { useMemo, useCallback } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { formatPEN } from "../../../shared/utils/formatCurrency";
import { PieChart } from "lucide-react";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#8b5cf6"];

function ChartSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 p-5">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-[320px] bg-gray-100 rounded" />
        </div>
    );
}

function ChartEmpty() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex flex-col items-center justify-center h-[320px] text-gray-400">
                <PieChart size={40} className="mb-3" />
                <p className="text-sm font-medium">Sin datos de categorías</p>
                <p className="text-xs mt-1">No hay datos de categorías para este período</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-900">
                {formatPEN(item.revenue)}
            </p>
            <p className="text-xs text-gray-500">{item.percentage}% del total</p>
        </div>
    );
}

export default function CategoryPerformanceChart({ data, loading, error, onRetry, onCategoryClick, activeCategory }) {
    const chartData = useMemo(() => data || [], [data]);

    const handleClick = useCallback((entry) => {
        if (onCategoryClick && entry?.category) {
            onCategoryClick(entry.category);
        }
    }, [onCategoryClick]);

    if (loading) return <ChartSkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!chartData.length) return <ChartEmpty />;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
                Ingresos por Categoría
                {activeCategory && (
                    <span className="ml-2 text-xs font-normal text-blue-600">
                        (seleccionado: {activeCategory})
                    </span>
                )}
            </h3>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    onClick={(e) => {
                        if (e?.activePayload?.[0]?.payload) {
                            handleClick(e.activePayload[0].payload);
                        }
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis
                        type="number"
                        tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                        type="category"
                        dataKey="category"
                        tick={{ fontSize: 12, fill: "#374151" }}
                        tickLine={false}
                        axisLine={false}
                        width={90}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="revenue"
                        radius={[0, 4, 4, 0]}
                        cursor={onCategoryClick ? "pointer" : "default"}
                    >
                        {chartData.map((entry, idx) => (
                            <Cell
                                key={entry.category}
                                fill={
                                    activeCategory === entry.category
                                        ? COLORS[idx % COLORS.length]
                                        : `${COLORS[idx % COLORS.length]}40`
                                }
                                stroke={
                                    activeCategory === entry.category
                                        ? COLORS[idx % COLORS.length]
                                        : "transparent"
                                }
                                strokeWidth={2}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
