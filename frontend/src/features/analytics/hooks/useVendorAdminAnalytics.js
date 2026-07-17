import { useState, useEffect, useCallback, useRef } from "react";
import { getVendorAnalyticsData } from "../services/analytics.service";
import { getUser } from "../../../app/auth";
import { normalizeError } from "../../../shared/utils/normalizeError";

export default function useVendorAdminAnalytics() {
    const user = getUser();
    const vendorId = user?.vendorId;

    const [data, setData] = useState({
        kpis: [],
        trends: [],
        ordersTrend: [],
        categories: [],
        topProducts: [],
        insights: [],
        trendHistory: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cacheRef = useRef({});

    const load = useCallback(async () => {
        const filterKey = vendorId ? `vendor_${vendorId}` : "no_vendor";
        if (cacheRef.current[filterKey]) {
            const cached = cacheRef.current[filterKey];
            setData(cached);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const filters = vendorId ? { vendor_id: vendorId } : {};
            const res = await getVendorAnalyticsData(filters);

            const mapped = {
                kpis: Array.isArray(res.summary) ? res.summary : [],
                trends: Array.isArray(res.comparisonTrends) ? res.comparisonTrends : [],
                ordersTrend: Array.isArray(res.ordersTrend) ? res.ordersTrend : [],
                categories: Array.isArray(res.categories) ? res.categories : [],
                topProducts: Array.isArray(res.topProducts) ? res.topProducts : [],
                insights: Array.isArray(res.insights) ? res.insights : [],
                trendHistory: Array.isArray(res.trendHistory) ? res.trendHistory : [],
            };

            setData(mapped);
            cacheRef.current[filterKey] = mapped;
        } catch (err) {
            console.error("[useVendorAdminAnalytics] Error:", err);
            setError(normalizeError(err));
            setData({
                kpis: [],
                trends: [],
                ordersTrend: [],
                categories: [],
                topProducts: [],
                insights: [],
                trendHistory: [],
            });
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        const timeout = setTimeout(load, 300);
        return () => clearTimeout(timeout);
    }, [load]);

    const reload = useCallback(() => {
        cacheRef.current = {};
        load();
    }, [load]);

    return {
        ...data,
        loading,
        error,
        reload,
    };
}
