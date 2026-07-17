import { useState, useEffect, useCallback, useRef } from "react";
import { getDashboardMetrics } from "../services/analytics.service";
import { mapDashboardMetrics } from "../mappers/analytics.mapper";
import { normalizeError } from "../../../shared/utils/normalizeError";

const defaultFilters = {
    startDate: "",
    endDate: "",
    previousStartDate: "",
    previousEndDate: "",
};

export default function useSuperAdminDashboard() {
    const [filters, setFiltersState] = useState(defaultFilters);

    const [metrics, setMetrics] = useState({});
    const [revenueQuarterly, setRevenueQuarterly] = useState({});
    const [ordersDistribution, setOrdersDistribution] = useState({ pending: 0, completed: 0, cancelled: 0 });
    const [topProducts, setTopProducts] = useState([]);
    const [operationalAlerts, setOperationalAlerts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cacheRef = useRef({});

    const loadDashboard = useCallback(async () => {
        const cacheKey = JSON.stringify(filters);
        if (cacheRef.current[cacheKey]) {
            const cached = cacheRef.current[cacheKey];
            setMetrics(cached.metrics);
            setRevenueQuarterly(cached.revenueQuarterly);
            setOrdersDistribution(cached.ordersDistribution);
            setTopProducts(cached.topProducts);
            setOperationalAlerts(cached.operationalAlerts);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getDashboardMetrics(filters);

            const mappedMetrics = mapDashboardMetrics(1, data.metrics || {});
            setMetrics(mappedMetrics);

            setRevenueQuarterly(data.revenueQuarterly || {});

            setOrdersDistribution({
                pending: data.ordersDistribution?.pending ?? 0,
                completed: data.ordersDistribution?.completed ?? 0,
                cancelled: data.ordersDistribution?.cancelled ?? 0,
            });

            setTopProducts(Array.isArray(data.topProducts) ? data.topProducts : []);
            setOperationalAlerts(Array.isArray(data.operationalAlerts) ? data.operationalAlerts : []);

            cacheRef.current[cacheKey] = {
                metrics: mappedMetrics,
                revenueQuarterly: data.revenueQuarterly || {},
                ordersDistribution: {
                    pending: data.ordersDistribution?.pending ?? 0,
                    completed: data.ordersDistribution?.completed ?? 0,
                    cancelled: data.ordersDistribution?.cancelled ?? 0,
                },
                topProducts: Array.isArray(data.topProducts) ? data.topProducts : [],
                operationalAlerts: Array.isArray(data.operationalAlerts) ? data.operationalAlerts : [],
            };
        } catch (err) {
            console.error("[useSuperAdminDashboard] Error:", err);
            const normalized = normalizeError(err);
            setError(normalized);
            setMetrics({});
            setRevenueQuarterly({});
            setOrdersDistribution({ pending: 0, completed: 0, cancelled: 0 });
            setTopProducts([]);
            setOperationalAlerts([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const timeout = setTimeout(loadDashboard, 300);
        return () => clearTimeout(timeout);
    }, [loadDashboard]);

    const setFilters = useCallback((updater) => {
        setFiltersState((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            return next;
        });
    }, []);

    const reload = useCallback(() => {
        cacheRef.current = {};
        loadDashboard();
    }, [loadDashboard]);

    return {
        metrics,
        loadingMetrics: loading,
        errorMetrics: error,
        revenueQuarterly,
        ordersDistribution,
        topProducts,
        operationalAlerts,
        loadingCharts: loading,
        loadingTables: loading,
        errorCharts: error,
        errorTables: error,
        setFilters,
        reload,
    };
}
