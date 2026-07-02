import { useState, useEffect, useCallback, useMemo } from "react";
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
    mapRevenueTrendWithComparison,
    mapVendorCategories,
    mapVendorMonthly,
    enhanceInsights,
} from "../mappers/analytics.mapper";
import {
    MOCK_REVENUE_SERIES,
    MOCK_REVENUE_MONTHLY,
    MOCK_ORDERS_DISTRIBUTION_BY_Q,
    MOCK_TOP_PRODUCTS_BY_Q,
    MOCK_TOP_VENDORS,
    MOCK_OPERATIONAL_ALERTS,
    MOCK_DASHBOARD_METRICS_ADMIN,
    MOCK_TRENDS_MONTHLY,
    MOCK_TRENDS_PREVIOUS,
    MOCK_CATEGORIES,
    MOCK_CATEGORY_VENDORS,
    MOCK_VENDOR_MONTHLY,
} from "./mockData";

const defaultFilters = (role) => ({
    startDate: "",
    endDate: "",
    previousStartDate: "",
    previousEndDate: "",
    category: "",
    ...(role === 2 ? {} : { vendorId: "all" }),
});

const defaultSelection = {
    category: null,
    vendorId: null,
};

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

function computeMetricsFromRange(trendsData, startDate, endDate) {
    if (!startDate && !endDate) {
        return {
            totalRevenue: MOCK_DASHBOARD_METRICS_ADMIN.totalRevenue,
            totalOrders: MOCK_DASHBOARD_METRICS_ADMIN.totalOrders,
            totalVendors: 48,
            activeVendors: 36,
            avgOrderValue: MOCK_DASHBOARD_METRICS_ADMIN.avgOrderValue,
        };
    }
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matched = trendsData.filter((m) => {
        const queryYear = start ? start.getFullYear() : (end ? end.getFullYear() : new Date().getFullYear());
        const d = new Date(m.date + "-01");
        const monthStart = new Date(queryYear, d.getMonth(), 1);
        const monthEnd = new Date(queryYear, d.getMonth() + 1, 0);
        if (start && monthEnd < start) return false;
        if (end && monthStart > end) return false;
        return true;
    });

    const totalRevenue = matched.reduce((s, m) => s + (m.revenue || 0), 0);
    const totalOrders = matched.reduce((s, m) => s + (m.completed || 0), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

    return {
        totalRevenue,
        totalOrders,
        totalVendors: 48,
        activeVendors: 36,
        avgOrderValue,
    };
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
    const [selection, setSelectionState] = useState(defaultSelection);
    const [revenueSeries, setRevenueSeries] = useState([]);
    const [revenueQuarterly, setRevenueQuarterly] = useState({});
    const [ordersDistribution, setOrdersDistribution] = useState({ pending: 0, completed: 0, cancelled: 0 });
    const [topProducts, setTopProducts] = useState([]);
    const [operationalAlerts, setOperationalAlerts] = useState([]);
    const [metrics, setMetrics] = useState({});
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [errorMetrics, setErrorMetrics] = useState(null);
    const [loadingCharts, setLoadingCharts] = useState(true);
    const [loadingTables, setLoadingTables] = useState(true);
    const [errorCharts, setErrorCharts] = useState(null);
    const [errorTables, setErrorTables] = useState(null);

    const [summary, setSummary] = useState([]);
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
        const currentMetrics = computeMetricsFromRange(MOCK_TRENDS_MONTHLY, filters.startDate, filters.endDate);
        const previousMetrics = computeMetricsFromRange(MOCK_TRENDS_PREVIOUS, filters.previousStartDate, filters.previousEndDate);

        setMetrics(mapDashboardMetrics(1, currentMetrics));
        setRevenueSeries(mapRevenueSeries(MOCK_REVENUE_SERIES));
        setRevenueQuarterly(buildQuarterlyData(filteredMonthly));
        setOrdersDistribution(mapOrdersDistribution(getOrdersForPeriod(filteredMonthly)));
        setTopProducts(mapTopProducts(getTopProductsForPeriod(filteredMonthly)));
        setOperationalAlerts(MOCK_OPERATIONAL_ALERTS);

        setSummary(mapGrowthSummary(currentMetrics, previousMetrics));

        setLoadingMetrics(false);
        setLoadingCharts(false);
        setLoadingTables(false);
        setLoadingAnalytics(false);
    }, [filters.startDate, filters.endDate, filters.previousStartDate, filters.previousEndDate]);

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

    const setSelection = useCallback((updater) => {
        setSelectionState((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            return next;
        });
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(defaultFilters(role));
    }, [role]);

    const resetSelection = useCallback(() => {
        setSelectionState(defaultSelection);
    }, []);

    const reload = useCallback(() => {
        loadAll();
    }, [loadAll]);

    const baseTrends = useMemo(() => {
        const filtered = filterTrendsByPeriod(MOCK_TRENDS_MONTHLY, filters.startDate, filters.endDate);
        return mapRevenueTrend(filtered);
    }, [filters.startDate, filters.endDate]);

    const baseOrdersTrend = useMemo(() => {
        const filtered = filterTrendsByPeriod(MOCK_TRENDS_MONTHLY, filters.startDate, filters.endDate);
        return mapOrdersTrend(filtered);
    }, [filters.startDate, filters.endDate]);

    const baseCategories = useMemo(() => {
        const filtered = filterTrendsByPeriod(MOCK_TRENDS_MONTHLY, filters.startDate, filters.endDate);
        return mapCategories(MOCK_CATEGORIES, filtered.reduce((s, m) => s + m.revenue, 0));
    }, [filters.startDate, filters.endDate]);

    const baseTopVendors = useMemo(() => mapTopVendors(MOCK_TOP_VENDORS), []);

    const categoryFiltered = filters.category && filters.category !== "all";
    const vendorFiltered = filters.vendorId && filters.vendorId !== "all";

    const selCategoryActive = selection.category && !categoryFiltered;
    const selVendorActive = selection.vendorId && !vendorFiltered;

    const vendorList = useMemo(() => {
        if (selCategoryActive) {
            const catVendors = mapVendorCategories(MOCK_CATEGORY_VENDORS, selection.category);
            if (catVendors.length > 0) return catVendors;
        }
        return baseTopVendors;
    }, [baseTopVendors, selCategoryActive, selection.category]);

    const currentTrends = useMemo(() => {
        if (selVendorActive) {
            return mapVendorMonthly(MOCK_VENDOR_MONTHLY, selection.vendorId);
        }
        if (vendorFiltered) {
            return mapVendorMonthly(MOCK_VENDOR_MONTHLY, filters.vendorId);
        }
        return baseTrends;
    }, [baseTrends, selVendorActive, vendorFiltered, selection.vendorId, filters.vendorId]);

    const currentOrdersTrend = useMemo(() => {
        if (selVendorActive) {
            const vendorData = mapVendorMonthly(MOCK_VENDOR_MONTHLY, selection.vendorId);
            return vendorData.map((m) => ({
                month: m.month,
                completed: m.completed ?? 0,
                pending: m.pending ?? 0,
                cancelled: m.cancelled ?? 0,
            }));
        }
        if (vendorFiltered) {
            const vendorData = mapVendorMonthly(MOCK_VENDOR_MONTHLY, filters.vendorId);
            return vendorData.map((m) => ({
                month: m.month,
                completed: m.completed ?? 0,
                pending: m.pending ?? 0,
                cancelled: m.cancelled ?? 0,
            }));
        }
        return baseOrdersTrend;
    }, [baseOrdersTrend, selVendorActive, vendorFiltered, selection.vendorId, filters.vendorId]);

    const comparisonTrends = useMemo(() => {
        const prevFiltered = filterTrendsByPeriod(MOCK_TRENDS_PREVIOUS, filters.previousStartDate, filters.previousEndDate);
        const mapped = mapRevenueTrendWithComparison(currentTrends, prevFiltered);
        return mapped;
    }, [currentTrends, filters.previousStartDate, filters.previousEndDate]);

    const trendHistory = useMemo(() => {
        if (selVendorActive) {
            const vd = MOCK_VENDOR_MONTHLY[selection.vendorId];
            if (vd) return vd.slice(-6).map((m) => ({ month: m.month, value: m.revenue }));
            return [];
        }
        if (vendorFiltered) {
            const vd = MOCK_VENDOR_MONTHLY[filters.vendorId];
            if (vd) return vd.slice(-6).map((m) => ({ month: m.month, value: m.revenue }));
            return [];
        }
        const filtered = filterTrendsByPeriod(MOCK_TRENDS_MONTHLY, filters.startDate, filters.endDate);
        return filtered.slice(-6).map((m) => ({ month: m.month, value: m.revenue }));
    }, [filters.startDate, filters.endDate, selVendorActive, vendorFiltered, selection.vendorId, filters.vendorId]);

    const insights = useMemo(() => {
        const filteredMonthly = filterTrendsByPeriod(MOCK_TRENDS_MONTHLY, filters.startDate, filters.endDate);
        const monthlyData = mapRevenueTrend(filteredMonthly);
        const metricsForPrev = computeMetricsFromRange(MOCK_TRENDS_PREVIOUS, filters.previousStartDate, filters.previousEndDate);

        return enhanceInsights({
            trendsData: monthlyData,
            categoriesData: baseCategories,
            currentMetrics: metrics,
            previousMetrics: metricsForPrev,
            vendorMonthly: MOCK_VENDOR_MONTHLY,
            categoryVendors: MOCK_CATEGORY_VENDORS,
        });
    }, [filters.startDate, filters.endDate, filters.previousStartDate, filters.previousEndDate, baseCategories, metrics]);

    const hasConflict = useMemo(() => {
        if (selection.category && categoryFiltered && selection.category !== filters.category) return true;
        if (selection.vendorId && vendorFiltered && selection.vendorId !== filters.vendorId) return true;
        return false;
    }, [selection, filters, categoryFiltered, vendorFiltered]);

    return {
        metrics,
        loadingMetrics,
        errorMetrics,
        revenueSeries,
        revenueQuarterly,
        ordersDistribution,
        topProducts,
        topVendors: vendorList,
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
        trends: currentTrends,
        ordersTrend: currentOrdersTrend,
        categories: baseCategories,
        insights,
        loadingAnalytics,
        errorAnalytics,
        comparisonTrends,
        trendHistory,
        selection,
        setSelection,
        resetSelection,
        hasConflict,
    };
};
