import { useState } from "react";
import { RefreshCw } from "lucide-react";
import useSuperAdminAnalytics from "../hooks/useSuperAdminAnalytics";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import GrowthKPI from "../components/GrowthKPI";
import RevenueTrendChart from "../components/RevenueTrendChart";
import OrdersTrendChart from "../components/OrdersTrendChart";
import CategoryChart from "../components/CategoryChart";
import VendorRanking from "../components/VendorRanking";

export default function SuperAdminAnalytics() {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const {
        summary,
        comparisonTrends,
        ordersTrend,
        categories,
        topVendors,
        trendHistory,
        loading,
        error,
        reload,
    } = useSuperAdminAnalytics();

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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div />
                <div className="page-actions ml-auto">
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

            {error && (
                <div className="mb-6">
                    <ErrorState error={error} onRetry={reload} />
                </div>
            )}

            <div className="mb-6">
                <GrowthKPI
                    summary={summary}
                    trendHistory={trendHistory}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <RevenueTrendChart
                    data={comparisonTrends}
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
                />
                <VendorRanking
                    data={topVendors}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                />
            </div>
        </div>
    );
}
