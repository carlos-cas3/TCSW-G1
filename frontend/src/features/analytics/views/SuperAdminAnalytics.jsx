import { useState, useCallback, useEffect, useMemo } from "react";
import { RefreshCw, RotateCcw } from "lucide-react";
import { useMockAnalytics as useAnalytics } from "../mocks/useMockAnalytics";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import PeriodSelector from "../components/PeriodSelector";
import GrowthKPI from "../components/GrowthKPI";
import RevenueTrendChart from "../components/RevenueTrendChart";
import OrdersTrendChart from "../components/OrdersTrendChart";
import CategoryChart from "../components/CategoryChart";
import VendorRanking from "../components/VendorRanking";
import InsightsPanel from "../components/InsightsPanel";
import { MOCK_CATEGORIES } from "../mocks/mockData";

const categoryOptions = [
    { value: "", label: "Todas las categorías" },
    ...MOCK_CATEGORIES.map((c) => ({ value: c.category, label: c.category })),
];

export default function SuperAdminAnalytics() {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedPeriod, setSelectedPeriod] = useState("mtd");
    const {
        summary,
        ordersTrend,
        categories,
        insights,
        topVendors,
        loadingAnalytics,
        errorAnalytics,
        filters,
        setFilters,
        reload,
        comparisonTrends,
        trendHistory,
        selection,
        setSelection,
        resetSelection,
        hasConflict,
    } = useAnalytics();

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const s = (d) => d.toISOString().split("T")[0];
        const startDate = s(new Date(year, month, 1));
        const endDate = s(now);
        const prevStart = s(new Date(year, month - 1, 1));
        const prevEnd = s(new Date(year, month - 1, now.getDate()));
        setFilters((prev) => ({
            ...prev,
            startDate,
            endDate,
            previousStartDate: prevStart,
            previousEndDate: prevEnd,
        }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePeriodChange = useCallback(({ period, current, previous }) => {
        setSelectedPeriod(period);
        setFilters((prev) => ({
            ...prev,
            startDate: current.startDate,
            endDate: current.endDate,
            previousStartDate: previous.startDate,
            previousEndDate: previous.endDate,
        }));
    }, [setFilters]);

    const handleCategoryFilter = useCallback((e) => {
        const val = e.target.value;
        setFilters((prev) => ({ ...prev, category: val }));
    }, [setFilters]);

    const handleCategoryClick = useCallback((categoryName) => {
        setSelection((prev) => ({
            ...prev,
            category: prev.category === categoryName ? null : categoryName,
        }));
    }, [setSelection]);

    const handleVendorClick = useCallback((vendorName) => {
        setSelection((prev) => ({
            ...prev,
            vendorId: prev.vendorId === vendorName ? null : vendorName,
        }));
    }, [setSelection]);

    const handleResetSelection = useCallback(() => {
        resetSelection();
        setFilters((prev) => ({ ...prev, category: "" }));
    }, [resetSelection, setFilters]);

    const handleReload = () => {
        reload();
        setLastUpdated(new Date());
    };

    const timeStr = lastUpdated.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const periodLabel = useMemo(() => {
        const fmt = (d) => new Date(d).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
        switch (selectedPeriod) {
            case "mtd": return "vs mes anterior";
            case "q1":
            case "q2":
            case "q3":
            case "q4": {
                const year = new Date(filters.previousStartDate).getFullYear();
                return `vs ${selectedPeriod.toUpperCase()} ${year}`;
            }
            case "custom":
                return filters.previousStartDate && filters.previousEndDate
                    ? `vs ${fmt(filters.previousStartDate)} - ${fmt(filters.previousEndDate)}`
                    : "vs periodo anterior equivalente";
            default:
                return "vs período anterior";
        }
    }, [selectedPeriod, filters.previousStartDate, filters.previousEndDate]);

    const hasActiveSelection = selection.category || selection.vendorId || !!filters.category;

    const effectiveTrends = useMemo(() => {
        if (hasConflict) return [];
        return comparisonTrends;
    }, [hasConflict, comparisonTrends]);

    const effectiveOrdersTrend = useMemo(() => {
        if (hasConflict) return [];
        return ordersTrend;
    }, [hasConflict, ordersTrend]);

    return (
        <div className="page">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <PeriodSelector
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                />
                <div className="page-actions">
                    <span className="text-sm text-gray-500">
                        Última actualización: {timeStr}
                    </span>
                    <button
                        onClick={handleReload}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Actualizar
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <select
                    value={filters.category || ""}
                    onChange={handleCategoryFilter}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {hasActiveSelection && (
                    <button
                        onClick={handleResetSelection}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RotateCcw size={14} />
                        Limpiar selección
                    </button>
                )}
            </div>

            {errorAnalytics && (
                <div className="mb-6">
                    <ErrorState error={errorAnalytics} onRetry={reload} />
                </div>
            )}

            {hasConflict && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    Los filtros actuales generan conflicto con la selección interactiva.
                    Limpie la selección o ajuste los filtros para visualizar los datos.
                </div>
            )}

            <div className="mb-6">
                <GrowthKPI
                    summary={summary}
                    trendHistory={trendHistory}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
                    periodLabel={periodLabel}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RevenueTrendChart
                    data={effectiveTrends}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
                />
                <OrdersTrendChart
                    data={effectiveOrdersTrend}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <CategoryChart
                    data={categories}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
                    onCategoryClick={handleCategoryClick}
                    selectedCategory={selection.category}
                />
                <VendorRanking
                    data={topVendors}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
                    onVendorClick={handleVendorClick}
                    activeVendor={selection.vendorId}
                />
            </div>

            <div className="mb-6">
                <InsightsPanel
                    insights={insights}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
                />
            </div>
        </div>
    );
}
