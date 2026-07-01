import { useState, useMemo, useCallback } from "react";
import { RefreshCw, DollarSign, ShoppingCart, Store, Receipt } from "lucide-react";
import createStatsCards from "../../../shared/components/createStatsCards";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import { useMockDashboardMetrics as useDashboardMetrics } from "../mocks/useMockDashboardMetrics";
import { useMockAnalytics as useAnalytics } from "../mocks/useMockAnalytics";
import PeriodSelector from "../components/PeriodSelector";
import QuarterlyRevenueChart from "../components/QuarterlyRevenueChart";
import OrdersChart from "../components/OrdersChart";
import TopProductsList from "../components/TopProductsList";
import OperationalAlerts from "../components/OperationalAlerts";
const StatsCards = createStatsCards([
    { label: "Ingresos Totales", valueKey: "totalRevenue", icon: DollarSign, color: "green" },
    { label: "Órdenes Totales", valueKey: "totalOrders", icon: ShoppingCart, color: "blue" },
    { label: "Total Vendedores", valueKey: "totalVendors", icon: Store, color: "purple" },
    { label: "Ticket Promedio", valueKey: "avgOrderValue", icon: Receipt, color: "yellow" },
]);

export default function SuperAdminDashboard() {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedPeriod, setSelectedPeriod] = useState("full");
    const { metrics, loading: metricsLoading, error: metricsError, reload: reloadMetrics } = useDashboardMetrics();
    const {
        revenueQuarterly,
        ordersDistribution,
        topProducts,
        operationalAlerts,
        loadingCharts,
        loadingTables,
        errorCharts,
        setFilters,
        reload: reloadAnalytics,
    } = useAnalytics();

    const stats = useMemo(() => ({ ...metrics }), [metrics]);

    const handlePeriodChange = useCallback(({ period, startDate, endDate }) => {
        setSelectedPeriod(period);
        setFilters((prev) => ({ ...prev, startDate, endDate }));
    }, [setFilters]);

    const handleReload = () => {
        reloadMetrics();
        reloadAnalytics();
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
                <div className="flex items-center gap-4">
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

            {metricsError && (
                <div className="mb-6">
                    <ErrorState error={metricsError} onRetry={reloadMetrics} />
                </div>
            )}

            <StatsCards stats={stats} loading={metricsLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <QuarterlyRevenueChart
                    data={revenueQuarterly}
                    loading={loadingCharts}
                    error={errorCharts}
                    onRetry={reloadAnalytics}
                />
                <OrdersChart
                    data={ordersDistribution}
                    loading={loadingCharts}
                    error={errorCharts}
                    onRetry={reloadAnalytics}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <TopProductsList
                    data={topProducts}
                    loading={loadingTables}
                    maxRows={5}
                />
                <OperationalAlerts
                    alerts={operationalAlerts}
                    loading={loadingTables}
                />
            </div>
        </div>
    );
}
