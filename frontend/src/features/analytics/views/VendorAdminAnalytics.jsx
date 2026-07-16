import { useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import { useMockVendorAnalytics } from "../mocks/useMockVendorAnalytics";
import PeriodSelector from "../components/PeriodSelector";
import GrowthKPI from "../components/GrowthKPI";
import RevenueTrendChart from "../components/RevenueTrendChart";
import OrdersTrendChart from "../components/OrdersTrendChart";
import CategoryChart from "../components/CategoryChart";
import TopProductsPerformance from "../components/TopProductsPerformance";
import InsightsPanel from "../components/InsightsPanel";

export default function VendorAdminAnalytics() {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedPeriod, setSelectedPeriod] = useState("mtd");
    const [selectedCategory, setSelectedCategory] = useState(null);

    const {
        kpis,
        trendHistory,
        trends,
        ordersTrend,
        categories,
        topProducts,
        insights,
        loading,
        error,
        filters,
        setFilters,
        reload,
    } = useMockVendorAnalytics();

    const handlePeriodChange = useCallback(({ period, current, previous }) => {
        setSelectedPeriod(period);
        setFilters({
            startDate: current.startDate,
            endDate: current.endDate,
            previousStartDate: previous.startDate,
            previousEndDate: previous.endDate,
        });
    }, [setFilters]);

    const handleCategoryClick = useCallback((categoryName) => {
        setSelectedCategory((prev) => (prev === categoryName ? null : categoryName));
    }, []);

    const handleCategoryFilter = useCallback((e) => {
        const val = e.target.value;
        setFilters((prev) => ({ ...prev, category: val }));
        if (val) {
            setSelectedCategory(null);
        }
    }, [setFilters]);

    const handleReload = () => {
        reload();
        setLastUpdated(new Date());
    };

    const timeStr = lastUpdated.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const periodLabel = (() => {
        switch (selectedPeriod) {
            case "mtd": return "vs mes anterior";
            case "q1":
            case "q2":
            case "q3":
            case "q4": {
                const year = filters.previousStartDate
                    ? new Date(filters.previousStartDate).getFullYear()
                    : new Date().getFullYear();
                return `vs ${selectedPeriod.toUpperCase()} ${year}`;
            }
            case "custom":
                return filters.previousStartDate && filters.previousEndDate
                    ? "vs per\u00edodo anterior equivalente"
                    : "vs per\u00edodo anterior";
            default:
                return "vs per\u00edodo anterior";
        }
    })();

    const categoryOptions = [
        { value: "", label: "Todas las categor\u00edas" },
        ...(categories || []).map((c) => ({ value: c.category, label: c.category })),
    ];

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
            </div>

            {error && (
                <div className="mb-6">
                    <ErrorState error={error} onRetry={reload} />
                </div>
            )}

            <div className="mb-6">
                <GrowthKPI
                    summary={kpis}
                    trendHistory={trendHistory}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                    periodLabel={periodLabel}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RevenueTrendChart
                    data={trends}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                />
                <OrdersTrendChart
                    data={ordersTrend}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <CategoryChart
                    data={categories}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                    onCategoryClick={handleCategoryClick}
                    selectedCategory={selectedCategory}
                />
                <TopProductsPerformance
                    data={topProducts}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                />
            </div>

            <div className="mb-6">
                <InsightsPanel
                    insights={insights}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                />
            </div>
        </div>
    );
}
