import { useMemo } from "react";
import { RefreshCw, DollarSign, ShoppingCart, Store, Users, Receipt } from "lucide-react";
import createStatsCards from "../../../shared/components/createStatsCards";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import { useMockDashboardMetrics as useDashboardMetrics } from "../mocks/useMockDashboardMetrics";
import { useMockAnalytics as useAnalytics } from "../mocks/useMockAnalytics";
import RevenueChart from "../components/RevenueChart";
import OrdersChart from "../components/OrdersChart";
import TopProductsTable from "../components/TopProductsTable";

const StatsCards = createStatsCards([
    { label: "Ingresos Totales", valueKey: "totalRevenue", icon: DollarSign, color: "green" },
    { label: "Órdenes Totales", valueKey: "totalOrders", icon: ShoppingCart, color: "blue" },
    { label: "Total Vendedores", valueKey: "totalVendors", icon: Store, color: "purple" },
    { label: "Vendedores Activos", valueKey: "activeVendors", icon: Users, color: "indigo" },
    { label: "Ticket Promedio", valueKey: "avgOrderValue", icon: Receipt, color: "yellow" },
]);

export default function SuperAdminDashboard() {
    const { metrics, loading: metricsLoading, error: metricsError, reload: reloadMetrics } = useDashboardMetrics();
    const {
        revenueSeries,
        ordersDistribution,
        topProducts,
        loadingCharts,
        loadingTables,
        errorCharts,
        reload: reloadAnalytics,
    } = useAnalytics();

    const stats = useMemo(() => ({ ...metrics }), [metrics]);

    const handleReload = () => {
        reloadMetrics();
        reloadAnalytics();
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="page-header-start">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Resumen general del sistema</p>
                </div>
                <div className="page-actions">
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

            <div className="mb-6">
                <RevenueChart
                    data={revenueSeries}
                    loading={loadingCharts}
                    error={errorCharts}
                    onRetry={reloadAnalytics}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <OrdersChart
                    data={ordersDistribution}
                    loading={loadingCharts}
                    error={errorCharts}
                    onRetry={reloadAnalytics}
                />
                <TopProductsTable
                    data={topProducts}
                    loading={loadingTables}
                />
            </div>
        </div>
    );
}
