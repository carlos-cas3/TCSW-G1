import { useState, useEffect, useCallback, useMemo } from "react";
import { getUser } from "../../../app/auth";
import {
    mapDashboardMetrics,
    mapGrowthSummary,
    mapRevenueTrendWithComparison,
    mapOrdersTrend,
    mapCategories,
} from "../mappers/analytics.mapper";
import {
    MOCK_DASHBOARD_METRICS_VENDOR,
    MOCK_DASHBOARD_METRICS_VENDOR_PREV,
    MOCK_VENDOR_TRENDS,
    MOCK_VENDOR_ORDERS_TREND,
    MOCK_VENDOR_CATEGORIES,
    MOCK_VENDOR_PRODUCTS,
} from "./mockData";

const defaultFilters = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const s = (d) => d.toISOString().split("T")[0];

    return {
        startDate: s(new Date(year, month, 1)),
        endDate: s(now),
        previousStartDate: s(new Date(year, month - 1, 1)),
        previousEndDate: s(new Date(year, month - 1, now.getDate())),
        category: "",
    };
};

function filterByDateRange(arr, startDate, endDate) {
    if (!startDate && !endDate) return arr;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return arr.filter((m) => {
        const d = new Date(m.date);
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
    });
}

function vendorEnhanceInsights(currentMetrics, previousMetrics, categoriesData, productsData) {
    const insights = [];

    const calcGrowth = (curr, prev) => {
        if (!prev || prev === 0) return curr > 0 ? 100 : 0;
        return Math.round(((curr - prev) / prev) * 100);
    };

    const revGrowth = calcGrowth(currentMetrics?.totalRevenue, previousMetrics?.totalRevenue);
    if (revGrowth > 10) {
        insights.push({ type: "positive", title: "Ingresos en crecimiento", description: `Tus ingresos crecieron +${revGrowth}% vs el per\u00edodo anterior.` });
    } else if (revGrowth < -5) {
        insights.push({ type: "critical", title: "Ca\u00edda de ingresos", description: `Tus ingresos cayeron ${Math.abs(revGrowth)}% vs el per\u00edodo anterior. Revisa tus estrategias.` });
    }

    const ordGrowth = calcGrowth(currentMetrics?.totalOrders, previousMetrics?.totalOrders);
    if (ordGrowth > 10) {
        insights.push({ type: "positive", title: "M\u00e1s pedidos", description: `Tus pedidos aumentaron +${ordGrowth}% vs el per\u00edodo anterior.` });
    } else if (ordGrowth < -5) {
        insights.push({ type: "warning", title: "Menos pedidos", description: `Tus pedidos disminuyeron ${Math.abs(ordGrowth)}% vs el per\u00edodo anterior.` });
    }

    if (categoriesData?.length > 0) {
        const sorted = [...categoriesData].sort((a, b) => b.percentage - a.percentage);
        const top = sorted[0];
        insights.push({ type: "info", title: "Categor\u00eda l\u00edder", description: `${top.category} concentra el ${top.percentage}% de tus ingresos.` });
        if (top.percentage > 40) {
            insights.push({ type: "warning", title: "Alta concentraci\u00f3n", description: `${top.category} representa >40% del revenue. Eval\u00faa diversificar.` });
        }
    }

    if (productsData?.length > 0) {
        const sorted = [...productsData].sort((a, b) => b.growth - a.growth);
        const best = sorted[0];
        if (best?.growth > 15) {
            insights.push({ type: "positive", title: "Producto estrella", description: `${best.productName} creci\u00f3 +${best.growth}% este per\u00edodo.` });
        }
        const worst = sorted[sorted.length - 1];
        if (worst?.growth < -10) {
            insights.push({ type: "critical", title: "Producto en declive", description: `${worst.productName} cay\u00f3 ${Math.abs(worst.growth)}%. Revisa su rendimiento.` });
        }
    }

    return insights.slice(0, 6);
}

export const useMockVendorAnalytics = () => {
    const user = getUser();
    const role = user?.roleId;

    const [filters, setFiltersState] = useState(defaultFilters);
    const [kpis, setKpis] = useState([]);
    const [trendHistory, setTrendHistory] = useState([]);
    const [trends, setTrends] = useState([]);
    const [ordersTrend, setOrdersTrend] = useState([]);
    const [categories, setCategories] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const metrics = useMemo(() => mapDashboardMetrics(role || 2, MOCK_DASHBOARD_METRICS_VENDOR), [role]);
    const prevMetrics = useMemo(() => mapDashboardMetrics(role || 2, MOCK_DASHBOARD_METRICS_VENDOR_PREV), [role]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        await new Promise((r) => setTimeout(r, 400));

        try {
            const currentMetrics = metrics;
            const previousMetrics = prevMetrics;

            setKpis(mapGrowthSummary(currentMetrics, previousMetrics));

            const filteredOrders = filterByDateRange(MOCK_VENDOR_ORDERS_TREND, filters.startDate, filters.endDate);
            setOrdersTrend(mapOrdersTrend(filteredOrders.length > 0 ? filteredOrders : MOCK_VENDOR_ORDERS_TREND));

            const currentTrend = MOCK_VENDOR_TRENDS.map((t) => ({ month: t.month, revenue: t.current }));
            const previousTrend = MOCK_VENDOR_TRENDS.map((t) => ({ month: t.month, revenue: t.previous }));
            setTrends(mapRevenueTrendWithComparison(currentTrend, previousTrend));

            setTrendHistory(MOCK_VENDOR_TRENDS.slice(-6).map((t) => ({ month: t.month, value: t.current })));

            const totalRevenue = currentMetrics.totalRevenue || 0;
            setCategories(mapCategories(MOCK_VENDOR_CATEGORIES, totalRevenue));

            const filteredCategory = filters.category;
            const products = filteredCategory
                ? MOCK_VENDOR_PRODUCTS
                : MOCK_VENDOR_PRODUCTS;
            setTopProducts(products);

            setInsights(vendorEnhanceInsights(currentMetrics, previousMetrics, MOCK_VENDOR_CATEGORIES, MOCK_VENDOR_PRODUCTS));
        } catch {
            setError(new Error("No se pudieron cargar los datos anal\u00edticos"));
        } finally {
            setLoading(false);
        }
    }, [filters.startDate, filters.endDate, filters.category, metrics, prevMetrics]);

    useEffect(() => {
        const timeout = setTimeout(load, 400);
        return () => clearTimeout(timeout);
    }, [load]);

    const setFilters = useCallback((updater) => {
        setFiltersState((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            return { ...prev, ...next };
        });
    }, []);

    const reload = useCallback(() => {
        load();
    }, [load]);

    return {
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
    };
};
