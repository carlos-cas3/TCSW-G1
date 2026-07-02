import { useState, useEffect, useCallback } from "react";
import { getUser } from "../../../app/auth";
import {
    mapRevenueSeries,
    mapOrdersDistribution,
    mapTopProducts,
    mapTopVendors,
    mapDashboardMetrics,
    mapGrowthSummary,
    mapRevenueTrend,
    mapOrdersTrend,
    mapCategories,
    generateInsights,
} from "../mappers/analytics.mapper";
import {
    MOCK_REVENUE_SERIES,
    MOCK_REVENUE_MONTHLY,
    MOCK_ORDERS_DISTRIBUTION_BY_Q,
    MOCK_TOP_PRODUCTS_BY_Q,
    MOCK_TOP_VENDORS,
    MOCK_OPERATIONAL_ALERTS,
    MOCK_DASHBOARD_METRICS_BY_Q,
    MOCK_TRENDS_MONTHLY,
    MOCK_CATEGORIES,
} from "./mockData";

const defaultFilters = (role) => ({
    startDate: "",
    endDate: "",
    status: "all",
    category: "",
    ...(role === 2 ? {} : { vendorId: "all" }),
});

function filterByDateRange(monthlyData, startDate, endDate) {
    if (!startDate && !endDate) return monthlyData;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return monthlyData.filter((m) => {
        const d = new Date(m.date);
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
    });
}

function buildQuarterlyData(monthlyData) {
    if (monthlyData.length === 0) return {};

    const quarters = [...new Set(monthlyData.map((m) => m.quarter))];

    if (quarters.length === 1) {
        return {
            2026: monthlyData.map((m) => ({
                quarter: m.month,
                revenue: m.revenue,
            })),
        };
    }

    const qAgg = {};
    monthlyData.forEach((m) => {
        qAgg[m.quarter] = (qAgg[m.quarter] || 0) + m.revenue;
    });

    return {
        2026: ["Q1", "Q2", "Q3", "Q4"]
            .filter((q) => qAgg[q] !== undefined)
            .map((q) => ({ quarter: q, revenue: qAgg[q] })),
    };
}

function getOrdersForPeriod(monthlyData) {
    if (monthlyData.length === 0) return { pending: 0, completed: 0, cancelled: 0 };
    const quarters = [...new Set(monthlyData.map((m) => m.quarter))];
    if (quarters.length === 1) {
        return MOCK_ORDERS_DISTRIBUTION_BY_Q[quarters[0]] || MOCK_ORDERS_DISTRIBUTION_BY_Q.full;
    }
    return MOCK_ORDERS_DISTRIBUTION_BY_Q.full;
}

function getTopProductsForPeriod(monthlyData) {
    if (monthlyData.length === 0) return [];
    const quarters = [...new Set(monthlyData.map((m) => m.quarter))];
    if (quarters.length === 1) {
        return MOCK_TOP_PRODUCTS_BY_Q[quarters[0]] || MOCK_TOP_PRODUCTS_BY_Q.full;
    }
    return MOCK_TOP_PRODUCTS_BY_Q.full;
}

function getMetricsForPeriod(monthlyData) {
    if (monthlyData.length === 0) return { totalRevenue: 0, totalOrders: 0, totalVendors: 48, activeVendors: 36, avgOrderValue: 0 };
    const quarters = [...new Set(monthlyData.map((m) => m.quarter))];
    if (quarters.length === 1) {
        return MOCK_DASHBOARD_METRICS_BY_Q[quarters[0]] || MOCK_DASHBOARD_METRICS_BY_Q.full;
    }
    return MOCK_DASHBOARD_METRICS_BY_Q.full;
}

function getPreviousMetrics(quarter) {
    const Q_ORDER = ["Q1", "Q2", "Q3", "Q4"];
    const idx = Q_ORDER.indexOf(quarter);
    if (idx > 0) {
        return MOCK_DASHBOARD_METRICS_BY_Q[Q_ORDER[idx - 1]];
    }
    return null;
}

function filterTrendsByPeriod(trendsData, startDate, endDate) {
    if (!startDate && !endDate) return trendsData;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return trendsData.filter((m) => {
        const d = new Date(m.date + "-01");
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
    });
}

export const useMockAnalytics = () => {
    const user = getUser();
    const role = user?.roleId;

    const [filters, setFiltersState] = useState(() => defaultFilters(role));
    const [revenueSeries, setRevenueSeries] = useState([]);
    const [revenueQuarterly, setRevenueQuarterly] = useState({});
    const [ordersDistribution, setOrdersDistribution] = useState({ pending: 0, completed: 0, cancelled: 0 });
    const [topProducts, setTopProducts] = useState([]);
    const [topVendors, setTopVendors] = useState([]);
    const [operationalAlerts, setOperationalAlerts] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [errorMetrics, setErrorMetrics] = useState(null);
    const [loadingCharts, setLoadingCharts] = useState(true);
    const [loadingTables, setLoadingTables] = useState(true);
    const [errorCharts, setErrorCharts] = useState(null);
    const [errorTables, setErrorTables] = useState(null);

    const [summary, setSummary] = useState([]);
    const [trends, setTrends] = useState([]);
    const [ordersTrend, setOrdersTrend] = useState([]);
    const [categories, setCategories] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [errorAnalytics, setErrorAnalytics] = useState(null);

    const loadAll = useCallback(async () => {
        setLoadingMetrics(true);
        setLoadingCharts(true);
        setLoadingTables(true);
        setLoadingAnalytics(true);
        setErrorMetrics(null);
        setErrorCharts(null);
        setErrorTables(null);
        setErrorAnalytics(null);

        await new Promise((r) => setTimeout(r, 400));

        const filteredMonthly = filterByDateRange(MOCK_REVENUE_MONTHLY, filters.startDate, filters.endDate);
        const filteredTrends = filterTrendsByPeriod(MOCK_TRENDS_MONTHLY, filters.startDate, filters.endDate);

        const currentMetrics = getMetricsForPeriod(filteredMonthly);
        const quarters = [...new Set(filteredMonthly.map((m) => m.quarter))];
        const currentQuarter = quarters.length === 1 ? quarters[0] : null;
        const previousMetrics = currentQuarter ? getPreviousMetrics(currentQuarter) : null;

        setMetrics(mapDashboardMetrics(1, currentMetrics));
        setRevenueSeries(mapRevenueSeries(MOCK_REVENUE_SERIES));
        setRevenueQuarterly(buildQuarterlyData(filteredMonthly));
        setOrdersDistribution(mapOrdersDistribution(getOrdersForPeriod(filteredMonthly)));
        setTopProducts(mapTopProducts(getTopProductsForPeriod(filteredMonthly)));
        setTopVendors(mapTopVendors(MOCK_TOP_VENDORS));
        setOperationalAlerts(MOCK_OPERATIONAL_ALERTS);

        setSummary(mapGrowthSummary(currentMetrics, previousMetrics));
        setTrends(mapRevenueTrend(filteredTrends));
        setOrdersTrend(mapOrdersTrend(filteredTrends));
        setCategories(mapCategories(MOCK_CATEGORIES, filteredTrends.reduce((s, m) => s + m.revenue, 0)));
        setInsights(generateInsights(
            mapRevenueTrend(filteredTrends),
            mapCategories(MOCK_CATEGORIES),
            currentMetrics,
            previousMetrics,
        ));

        setLoadingMetrics(false);
        setLoadingCharts(false);
        setLoadingTables(false);
        setLoadingAnalytics(false);
    }, [filters.startDate, filters.endDate]);

    useEffect(() => {
        const timeout = setTimeout(loadAll, 400);
        return () => clearTimeout(timeout);
    }, [loadAll]);

    const setFilters = useCallback((updater) => {
        setFiltersState((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            return next;
        });
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(defaultFilters(role));
    }, [role]);

    const reload = useCallback(() => {
        loadAll();
    }, [loadAll]);

    return {
        metrics,
        loadingMetrics,
        errorMetrics,
        revenueSeries,
        revenueQuarterly,
        ordersDistribution,
        topProducts,
        topVendors,
        operationalAlerts,
        loadingCharts,
        loadingTables,
        errorCharts,
        errorTables,
        filters,
        setFilters,
        resetFilters,
        reload,
        summary,
        trends,
        ordersTrend,
        categories,
        insights,
        loadingAnalytics,
        errorAnalytics,
    };
};
