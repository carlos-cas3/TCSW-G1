import { useState, useEffect, useCallback, useRef } from "react";
import { getAnalyticsData } from "../services/analytics.service";
import { normalizeError } from "../../../shared/utils/normalizeError";

export default function useSuperAdminAnalytics() {
    const [data, setData] = useState({
        summary: [],
        comparisonTrends: [],
        ordersTrend: [],
        categories: [],
        topVendors: [],
        insights: [],
        trendHistory: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cacheRef = useRef({});

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await getAnalyticsData({});

            setData({
                summary: Array.isArray(res.summary) ? res.summary : [],
                comparisonTrends: Array.isArray(res.comparisonTrends) ? res.comparisonTrends : [],
                ordersTrend: Array.isArray(res.ordersTrend) ? res.ordersTrend : [],
                categories: Array.isArray(res.categories) ? res.categories : [],
                topVendors: Array.isArray(res.topVendors) ? res.topVendors : [],
                insights: Array.isArray(res.insights) ? res.insights : [],
                trendHistory: Array.isArray(res.trendHistory) ? res.trendHistory : [],
            });
        } catch (err) {
            console.error("[useSuperAdminAnalytics] Error:", err);
            setError(normalizeError(err));
            setData({
                summary: [],
                comparisonTrends: [],
                ordersTrend: [],
                categories: [],
                topVendors: [],
                insights: [],
                trendHistory: [],
            });
        } finally {
            setLoading(false);
        }
    }, []);

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
