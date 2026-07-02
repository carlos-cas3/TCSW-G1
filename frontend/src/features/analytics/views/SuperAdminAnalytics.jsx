import { useState, useCallback, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useMockAnalytics as useAnalytics } from "../mocks/useMockAnalytics";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import PeriodSelector from "../components/PeriodSelector";
import GrowthKPI from "../components/GrowthKPI";
import RevenueTrendChart from "../components/RevenueTrendChart";
import OrdersTrendChart from "../components/OrdersTrendChart";
import CategoryChart from "../components/CategoryChart";
import VendorRanking from "../components/VendorRanking";
import InsightsPanel from "../components/InsightsPanel";

export default function SuperAdminAnalytics() {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedPeriod, setSelectedPeriod] = useState("hoy");
    const {
        summary,
        trends,
        ordersTrend,
        categories,
        insights,
        topVendors,
        loadingAnalytics,
        errorAnalytics,
        filters,
        setFilters,
        reload,
    } = useAnalytics();

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setFilters((prev) => ({ ...prev, startDate: today, endDate: today }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePeriodChange = useCallback(({ period, startDate, endDate }) => {
        setSelectedPeriod(period);
        setFilters((prev) => ({ ...prev, startDate, endDate }));
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

    return (
        <div className="page">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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

            {errorAnalytics && (
                <div className="mb-6">
                    <ErrorState error={errorAnalytics} onRetry={reload} />
                </div>
            )}

            <div className="mb-6">
                <GrowthKPI
                    summary={summary}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RevenueTrendChart
                    data={trends}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
                />
                <OrdersTrendChart
                    data={ordersTrend}
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
                />
                <VendorRanking
                    data={filters.vendorId && filters.vendorId !== "all" ? [] : topVendors}
                    loading={loadingAnalytics}
                    error={errorAnalytics}
                    onRetry={reload}
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
