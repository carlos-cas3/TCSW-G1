import { useState, useEffect, useCallback } from "react";
import { mapDashboardMetrics } from "../mappers/analytics.mapper";
import {
    MOCK_DASHBOARD_METRICS_VENDOR,
    MOCK_VENDOR_TRENDS,
    MOCK_VENDOR_CATEGORIES,
    MOCK_VENDOR_ALERTS,
    MOCK_ORDERS_DISTRIBUTION,
    MOCK_TOP_PRODUCTS,
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
    };
};

function buildVendorRevenueMonthly(trends) {
    const items = trends.map((t, i) => ({
        quarter: t.month,
        revenue: t.current,
        date: `2026-${String(i + 1).padStart(2, "0")}-15`,
    }));
    return { 2026: items };
}

function filterMonthlyByPeriod(data, startDate, endDate) {
    if (!startDate && !endDate) return data;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const filtered = {};
    for (const year of Object.keys(data)) {
        const items = data[year].filter((m) => {
            const d = new Date(m.date);
            if (start && d < start) return false;
            if (end && d > end) return false;
            return true;
        });
        if (items.length > 0) {
            filtered[year] = items;
        }
    }
    return Object.keys(filtered).length > 0 ? filtered : data;
}

export const useMockVendorDashboard = () => {
    const [filters, setFiltersState] = useState(defaultFilters);
    const [metrics, setMetrics] = useState({});
    const [revenueMonthly, setRevenueMonthly] = useState({});
    const [ordersDistribution, setOrdersDistribution] = useState({});
    const [topProducts, setTopProducts] = useState([]);
    const [vendorCategories, setVendorCategories] = useState([]);
    const [vendorAlerts, setVendorAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        await new Promise((r) => setTimeout(r, 400));

        try {
            setMetrics(mapDashboardMetrics(2, MOCK_DASHBOARD_METRICS_VENDOR));

            const rawMonthly = buildVendorRevenueMonthly(MOCK_VENDOR_TRENDS);
            setRevenueMonthly(filterMonthlyByPeriod(rawMonthly, filters.startDate, filters.endDate));

            setOrdersDistribution({
                pending: MOCK_ORDERS_DISTRIBUTION.pending,
                completed: MOCK_ORDERS_DISTRIBUTION.completed,
                cancelled: MOCK_ORDERS_DISTRIBUTION.cancelled,
            });
            setTopProducts(MOCK_TOP_PRODUCTS);
            setVendorCategories(MOCK_VENDOR_CATEGORIES);
            setVendorAlerts(MOCK_VENDOR_ALERTS);
        } catch {
            setError(new Error("No se pudieron cargar los datos del dashboard"));
        } finally {
            setLoading(false);
        }
    }, [filters.startDate, filters.endDate]);

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
    };
};
