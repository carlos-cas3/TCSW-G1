import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { formatPEN } from "../../../shared/utils/formatCurrency";
import { TrendingUp } from "lucide-react";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

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
                <TrendingUp size={40} className="mb-3" />
                <p className="text-sm font-medium">Sin datos de ingresos</p>
                <p className="text-xs mt-1">No hay ingresos registrados para el período seleccionado</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-900">
                {formatPEN(payload[0].value)}
            </p>
        </div>
    );
}

export default function QuarterlyRevenueChart({ data, loading, error, onRetry }) {
    const years = useMemo(() => {
        if (!data) return [];
        return Object.keys(data).sort();
    }, [data]);

    const [selectedYear, setSelectedYear] = useState(years[0] || "");

    const chartData = useMemo(() => {
        if (!data || !selectedYear) return [];
        return data[selectedYear] || [];
    }, [data, selectedYear]);

    const isMonthly = useMemo(() => {
        if (!chartData.length) return false;
        const labels = chartData.map((d) => d.quarter);
        const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
        return !labels.some((l) => quarterLabels.includes(l));
    }, [chartData]);

    if (loading) return <ChartSkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;

    const hasData = chartData.some((d) => d.revenue > 0);

    const title = isMonthly ? "Ingresos Mensuales" : "Ingresos por Trimestre";

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                {years.length > 0 && (
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                )}
            </div>

            {!hasData ? <ChartEmpty /> : (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="quarter"
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
                        <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
