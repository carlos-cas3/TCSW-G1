import { useState, useEffect, useCallback } from "react";
import { getUser } from "../../../app/auth";
import { mapDashboardMetrics } from "../mappers/analytics.mapper";
import {
    MOCK_DASHBOARD_METRICS_ADMIN,
    MOCK_DASHBOARD_METRICS_VENDOR,
} from "./mockData";

export const useMockDashboardMetrics = () => {
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = getUser();
    const role = user?.roleId;

    const loadMetrics = useCallback(async () => {
        setLoading(true);
        setError(null);
        await new Promise((r) => setTimeout(r, 300));
        const raw = role === 1 ? MOCK_DASHBOARD_METRICS_ADMIN : MOCK_DASHBOARD_METRICS_VENDOR;
        setMetrics(mapDashboardMetrics(role, raw));
        setLoading(false);
    }, [role]);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            if (!cancelled) await loadMetrics();
        };
        init();
        return () => { cancelled = true; };
    }, [loadMetrics]);

    return { metrics, loading, error, reload: loadMetrics };
};
