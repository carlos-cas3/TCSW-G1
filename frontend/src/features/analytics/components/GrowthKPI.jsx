import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { formatPEN } from "../../../shared/utils/formatCurrency";
import ErrorState from "../../../shared/components/Feedback/ErrorState";

function Sparkline({ data, color }) {
    if (!data || data.length < 2) return null;
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const w = 72;
    const h = 24;
    const points = values.map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 4) - 2;
        return `${x},${y}`;
    });
    const polyline = points.join(" ");

    const areaPoints = `0,${h} ${points} ${w},${h}`;

    return (
        <svg width={w} height={h} className="shrink-0" viewBox={`0 0 ${w} ${h}`}>
            <polygon points={areaPoints} fill={`${color}15`} />
            <polyline
                points={polyline}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

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

function DetailTooltip({ item }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs space-y-1 max-w-[200px]">
            <p className="font-semibold text-gray-900">{item.label}</p>
            <p className="text-gray-600">Actual: {formatValue(item.value, item.prefix)}</p>
            {item.previousValue !== undefined && (
                <p className="text-gray-500">
                    Anterior: {formatValue(item.previousValue, item.prefix)}
                </p>
            )}
            {item.diffValue !== undefined && (
                <p className={item.growth >= 0 ? "text-green-600" : "text-red-600"}>
                    Diferencia: {item.growth >= 0 ? "+" : ""}
                    {formatValue(Math.abs(item.diffValue), item.prefix)}
                </p>
            )}
        </div>
    );
}

export default function GrowthKPI({ summary, trendHistory, loading, error, onRetry, periodLabel }) {
    const items = useMemo(() => summary || [], [summary]);
    const [tooltipIdx, setTooltipIdx] = useState(null);

    if (loading) return <KPISkeleton />;
    if (error) return <ErrorState error={error} onRetry={onRetry} />;
    if (!items.length) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {items.map((item, idx) => (
                <div
                    key={item.label}
                    className="bg-white rounded-lg border border-gray-200 p-5 relative"
                    onMouseEnter={() => setTooltipIdx(idx)}
                    onMouseLeave={() => setTooltipIdx(null)}
                >
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {item.label}
                        </p>
                        <Info size={14} className="text-gray-300 cursor-help" />
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-2xl font-bold text-gray-900">
                            {formatValue(item.value, item.prefix)}
                        </p>
                        <Sparkline
                            data={trendHistory}
                            color={item.growth >= 0 ? "#16a34a" : "#dc2626"}
                        />
                    </div>
                    {(periodLabel || item.growth !== 0) && (
                        <div className="flex items-center gap-1.5 mt-2">
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
                            <span className="text-xs text-gray-400">{periodLabel || "vs. período anterior"}</span>
                        </div>
                    )}
                    {tooltipIdx === idx && (
                        <div className="absolute top-12 right-4 z-10">
                            <DetailTooltip item={item} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
