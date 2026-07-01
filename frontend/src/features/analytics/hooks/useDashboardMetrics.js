import { useState, useEffect, useCallback } from "react";
import { getDashboardMetrics } from "../services/analytics.service";
import { mapDashboardMetrics } from "../mappers/analytics.mapper";
import { getUser } from "../../../app/auth";
import { normalizeError } from "../../../shared/utils/normalizeError";

export const useDashboardMetrics = () => {
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = getUser();
    const role = user?.roleId;

    const loadMetrics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const filters = role === 2 ? { vendorId: user?.vendorId } : {};
            const res = await getDashboardMetrics(filters);
            setMetrics(mapDashboardMetrics(role, res));
        } catch (err) {
            console.error("DashboardMetrics error:", err);
            setError(normalizeError(err));
        } finally {
            setLoading(false);
        }
    }, [role, user?.vendorId]);

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
