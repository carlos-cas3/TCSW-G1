import { useState, useEffect, useCallback, useRef } from "react";
import { getVendorDashboardMetrics } from "../services/analytics.service";
import { mapDashboardMetrics } from "../mappers/analytics.mapper";
import { getUser } from "../../../app/auth";
import { normalizeError } from "../../../shared/utils/normalizeError";

export default function useVendorAdminDashboard() {
    const user = getUser();
    const vendorId = user?.vendorId;

    const [metrics, setMetrics] = useState({});
    const [revenueMonthly, setRevenueMonthly] = useState({});
    const [ordersDistribution, setOrdersDistribution] = useState({ pending: 0, completed: 0, cancelled: 0 });
    const [topProducts, setTopProducts] = useState([]);
    const [vendorAlerts, setVendorAlerts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cacheRef = useRef({});

    const loadDashboard = useCallback(async () => {
        const filterKey = vendorId ? `vendor_${vendorId}` : "no_vendor";
        if (cacheRef.current[filterKey]) {
            const cached = cacheRef.current[filterKey];
            setMetrics(cached.metrics);
            setRevenueMonthly(cached.revenueMonthly);
            setOrdersDistribution(cached.ordersDistribution);
            setTopProducts(cached.topProducts);
            setVendorAlerts(cached.vendorAlerts);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const filters = vendorId ? { vendor_id: vendorId } : {};
            const data = await getVendorDashboardMetrics(filters);

            setMetrics(mapDashboardMetrics(2, data.metrics || {}));
            setRevenueMonthly(data.revenueMonthly || {});
            setOrdersDistribution({
                pending: data.ordersDistribution?.pending ?? 0,
                completed: data.ordersDistribution?.completed ?? 0,
                cancelled: data.ordersDistribution?.cancelled ?? 0,
            });
            setTopProducts(Array.isArray(data.topProducts) ? data.topProducts : []);
            setVendorAlerts(Array.isArray(data.vendorAlerts) ? data.vendorAlerts : []);

            cacheRef.current[filterKey] = {
                metrics: mapDashboardMetrics(2, data.metrics || {}),
                revenueMonthly: data.revenueMonthly || {},
                ordersDistribution: {
                    pending: data.ordersDistribution?.pending ?? 0,
                    completed: data.ordersDistribution?.completed ?? 0,
                    cancelled: data.ordersDistribution?.cancelled ?? 0,
                },
                topProducts: Array.isArray(data.topProducts) ? data.topProducts : [],
                vendorAlerts: Array.isArray(data.vendorAlerts) ? data.vendorAlerts : [],
            };
        } catch (err) {
            console.error("[useVendorAdminDashboard] Error:", err);
            const normalized = normalizeError(err);
            setError(normalized);
            setMetrics({});
            setRevenueMonthly({});
            setOrdersDistribution({ pending: 0, completed: 0, cancelled: 0 });
            setTopProducts([]);
            setVendorAlerts([]);
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        const timeout = setTimeout(loadDashboard, 300);
        return () => clearTimeout(timeout);
    }, [loadDashboard]);

    const reload = useCallback(() => {
        cacheRef.current = {};
        loadDashboard();
    }, [loadDashboard]);

    return {
        metrics,
        revenueMonthly,
        ordersDistribution,
        topProducts,
        vendorAlerts,
        loading,
        error,
        reload,
    };
}
