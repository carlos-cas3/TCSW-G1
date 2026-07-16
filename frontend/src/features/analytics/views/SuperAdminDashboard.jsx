import { useState, useMemo, useCallback, useEffect } from "react";
import { RefreshCw, DollarSign, ShoppingCart, Store, Receipt } from "lucide-react";
import createStatsCards from "../../../shared/components/createStatsCards";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import { useMockAnalytics as useAnalytics } from "../mocks/useMockAnalytics";
import PeriodSelector from "../components/PeriodSelector";
import QuarterlyRevenueChart from "../components/QuarterlyRevenueChart";
import OrdersChart from "../components/OrdersChart";
import TopProductsList from "../components/TopProductsList";
import OperationalAlerts from "../components/OperationalAlerts";

const StatsCards = createStatsCards([
    { label: "Ingresos Totales", valueKey: "totalRevenue", icon: DollarSign, color: "green" },
    { label: "\u00d3rdenes Totales", valueKey: "totalOrders", icon: ShoppingCart, color: "blue" },
    { label: "Total Vendedores", valueKey: "totalVendors", icon: Store, color: "purple" },
    { label: "Ticket Promedio", valueKey: "avgOrderValue", icon: Receipt, color: "yellow" },
]);

export default function SuperAdminDashboard() {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedPeriod, setSelectedPeriod] = useState("mtd");
    const {
        metrics,
        loadingMetrics,
        errorMetrics,
        revenueQuarterly,
        ordersDistribution,
        topProducts,
        operationalAlerts,
        loadingCharts,
        loadingTables,
        errorCharts,
        setFilters,
        reload,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stats = useMemo(() => ({ ...metrics }), [metrics]);

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

            {errorMetrics && (
                <div className="mb-6">
                    <ErrorState error={errorMetrics} onRetry={reload} />
                </div>
            )}

            <StatsCards stats={stats} loading={loadingMetrics} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <QuarterlyRevenueChart
                    data={revenueQuarterly}
                    loading={loadingCharts}
                    error={errorCharts}
                    onRetry={reload}
                />
                <OrdersChart
                    data={ordersDistribution}
                    loading={loadingCharts}
                    error={errorCharts}
                    onRetry={reload}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <TopProductsList
                    data={topProducts}
                    loading={loadingTables}
                    maxRows={5}
                    fitHeight
                />
                <OperationalAlerts
                    alerts={operationalAlerts}
                    loading={loadingTables}
                />
            </div>
        </div>
    );
}
