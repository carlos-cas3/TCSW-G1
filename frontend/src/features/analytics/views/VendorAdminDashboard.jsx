import { useState, useCallback } from "react";
import { RefreshCw, DollarSign, ShoppingCart, Package, Receipt } from "lucide-react";
import createStatsCards from "../../../shared/components/createStatsCards";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import { useMockVendorDashboard } from "../mocks/useMockVendorDashboard";
import PeriodSelector from "../components/PeriodSelector";
import QuarterlyRevenueChart from "../components/QuarterlyRevenueChart";
import OrdersChart from "../components/OrdersChart";
import TopProductsList from "../components/TopProductsList";
import CategoryPerformanceChart from "../components/CategoryPerformanceChart";
import VendorAlertsPanel from "../components/VendorAlertsPanel";

const StatsCards = createStatsCards([
    { label: "Ingresos", valueKey: "totalRevenue", icon: DollarSign, color: "green" },
    { label: "Pedidos", valueKey: "totalOrders", icon: ShoppingCart, color: "blue" },
    { label: "Productos Activos", valueKey: "activeProducts", icon: Package, color: "purple" },
    { label: "Ticket Promedio", valueKey: "avgOrderValue", icon: Receipt, color: "yellow" },
]);

export default function VendorAdminDashboard() {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [selectedPeriod, setSelectedPeriod] = useState("mtd");
    const [activeCategory, setActiveCategory] = useState(null);

    const {
        metrics,
        revenueMonthly,
        ordersDistribution,
        topProducts,
        vendorCategories,
        vendorAlerts,
        loading,
        error,
        setFilters,
        reload,
    } = useMockVendorDashboard();

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
        setActiveCategory((prev) => (prev === categoryName ? null : categoryName));
    }, []);

    const handleReload = () => {
        reload();
        setLastUpdated(new Date());
    };

    const timeStr = lastUpdated.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const chartLoading = loading;
    const chartError = error;

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

            {error && (
                <div className="mb-6">
                    <ErrorState error={error} onRetry={reload} />
                </div>
            )}

            <div className="mb-6">
                <StatsCards stats={metrics} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <QuarterlyRevenueChart
                    data={revenueMonthly}
                    loading={chartLoading}
                    error={chartError}
                    onRetry={reload}
                    title="Ingresos"
                />
                <OrdersChart
                    data={ordersDistribution}
                    loading={chartLoading}
                    error={chartError}
                    onRetry={reload}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TopProductsList
                    data={topProducts}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                    maxRows={5}
                    highlightFirst
                />
                <CategoryPerformanceChart
                    data={vendorCategories}
                    loading={chartLoading}
                    error={chartError}
                    onRetry={reload}
                    onCategoryClick={handleCategoryClick}
                    activeCategory={activeCategory}
                />
            </div>

            <div className="mb-6">
                <VendorAlertsPanel
                    alerts={vendorAlerts}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                />
            </div>
        </div>
    );
}
