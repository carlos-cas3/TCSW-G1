import { useState } from "react";
import { RefreshCw, DollarSign, ShoppingCart, Package, Receipt } from "lucide-react";
import createStatsCards from "../../../shared/components/createStatsCards";
import ErrorState from "../../../shared/components/Feedback/ErrorState";
import useVendorAdminDashboard from "../hooks/useVendorAdminDashboard";
import QuarterlyRevenueChart from "../components/QuarterlyRevenueChart";
import OrdersChart from "../components/OrdersChart";
import TopProductsList from "../components/TopProductsList";
import StaffPieChart from "../components/StaffPieChart";

const StatsCards = createStatsCards([
    { label: "Ingresos", valueKey: "totalRevenue", icon: DollarSign, color: "green" },
    { label: "Pedidos", valueKey: "totalOrders", icon: ShoppingCart, color: "blue" },
    { label: "Productos Activos", valueKey: "activeProducts", icon: Package, color: "purple" },
    { label: "Valor. Prom. Orden", valueKey: "avgOrderValue", icon: Receipt, color: "yellow" },
]);

export default function VendorAdminDashboard() {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const {
        metrics,
        revenueMonthly,
        ordersDistribution,
        topProducts,
        loading,
        error,
        reload,
    } = useVendorAdminDashboard();

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
                <StatsCards stats={metrics} loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <QuarterlyRevenueChart
                    data={revenueMonthly}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                    title="Ingresos"
                />
                <OrdersChart
                    data={ordersDistribution}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-start">
                <TopProductsList
                    data={topProducts}
                    loading={loading}
                    error={error}
                    onRetry={reload}
                    maxRows={5}
                    highlightFirst
                    fitHeight
                />
                <StaffPieChart />
            </div>
        </div>
    );
}
