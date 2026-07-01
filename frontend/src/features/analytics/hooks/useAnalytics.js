import { useState, useEffect, useCallback, useRef } from "react";
import { getUser } from "../../../app/auth";
import {
    getRevenueSeries,
    getOrdersDistribution,
    getTopProducts,
    getTopVendors,
} from "../services/analytics.service";
import {
    mapRevenueSeries,
    mapOrdersDistribution,
    mapTopProducts,
    mapTopVendors,
} from "../mappers/analytics.mapper";
import { normalizeError } from "../../../shared/utils/normalizeError";

const STORAGE_KEY = "analytics_filters";
const DEBOUNCE_MS = 400;

const defaultFilters = (role) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
        startDate: "",
        endDate: "",
        status: "all",
        category: "",
        ...(role === 2 ? {} : { vendorId: "all" }),
    };
};

export const useAnalytics = () => {
    const user = getUser();
    const role = user?.roleId;
    const vendorId = user?.vendorId;

    const cacheRef = useRef({});

    const [filters, setFiltersState] = useState(() => defaultFilters(role));

    const [revenueSeries, setRevenueSeries] = useState([]);
    const [ordersDistribution, setOrdersDistribution] = useState({ pending: 0, completed: 0, cancelled: 0 });
    const [topProducts, setTopProducts] = useState([]);
    const [topVendors, setTopVendors] = useState([]);

    const [loadingCharts, setLoadingCharts] = useState(true);
    const [loadingTables, setLoadingTables] = useState(true);
    const [errorCharts, setErrorCharts] = useState(null);
    const [errorTables, setErrorTables] = useState(null);

    const buildApiFilters = useCallback(() => {
        const apiFilters = { ...filters };
        if (apiFilters.vendorId === "all") delete apiFilters.vendorId;
        if (apiFilters.status === "all") delete apiFilters.status;
        if (apiFilters.category === "" || apiFilters.category === "all") delete apiFilters.category;
        if (!apiFilters.startDate) delete apiFilters.startDate;
        if (!apiFilters.endDate) delete apiFilters.endDate;
        if (role === 2 && vendorId) apiFilters.vendorId = vendorId;
        return apiFilters;
    }, [filters, role, vendorId]);

    const loadAll = useCallback(async () => {
        const apiFilters = buildApiFilters();
        const cacheKey = JSON.stringify(apiFilters);

        if (cacheRef.current[cacheKey]) {
            const cached = cacheRef.current[cacheKey];
            setRevenueSeries(cached.revenueSeries);
            setOrdersDistribution(cached.ordersDistribution);
            setTopProducts(cached.topProducts);
            setTopVendors(cached.topVendors);
            setLoadingCharts(false);
            setLoadingTables(false);
            return;
        }

        setLoadingCharts(true);
        setLoadingTables(true);
        setErrorCharts(null);
        setErrorTables(null);

        const [revenueRes, distRes, productsRes, vendorsRes] = await Promise.allSettled([
            getRevenueSeries(apiFilters),
            getOrdersDistribution(apiFilters),
            getTopProducts(apiFilters),
            getTopVendors(apiFilters),
        ]);

        let chartsOk = true;
        let tablesOk = true;

        const chartsErrorRef = { current: null };
        const tablesErrorRef = { current: null };

        if (revenueRes.status === "fulfilled") {
            setRevenueSeries(mapRevenueSeries(revenueRes.value));
        } else {
            console.error("RevenueChart error:", revenueRes.reason);
            setRevenueSeries([]);
            chartsErrorRef.current = normalizeError(revenueRes.reason);
            chartsOk = false;
        }

        if (distRes.status === "fulfilled") {
            setOrdersDistribution(mapOrdersDistribution(distRes.value));
        } else {
            console.error("OrdersChart error:", distRes.reason);
            setOrdersDistribution({ pending: 0, completed: 0, cancelled: 0 });
            if (!chartsErrorRef.current) chartsErrorRef.current = normalizeError(distRes.reason);
            chartsOk = false;
        }

        if (productsRes.status === "fulfilled") {
            setTopProducts(mapTopProducts(productsRes.value));
        } else {
            console.error("TopProducts error:", productsRes.reason);
            setTopProducts([]);
            tablesErrorRef.current = normalizeError(productsRes.reason);
            tablesOk = false;
        }

        if (vendorsRes.status === "fulfilled") {
            setTopVendors(mapTopVendors(vendorsRes.value));
        } else {
            console.error("TopVendors error:", vendorsRes.reason);
            setTopVendors([]);
            if (!tablesErrorRef.current) tablesErrorRef.current = normalizeError(vendorsRes.reason);
            tablesOk = false;
        }

        if (chartsOk) setErrorCharts(null);
        else if (chartsErrorRef.current) setErrorCharts(chartsErrorRef.current);
        if (tablesOk) setErrorTables(null);
        else if (tablesErrorRef.current) setErrorTables(tablesErrorRef.current);

        if (chartsOk) setErrorCharts(null);
        if (tablesOk) setErrorTables(null);

        cacheRef.current[cacheKey] = {
            revenueSeries: revenueRes.status === "fulfilled" ? mapRevenueSeries(revenueRes.value) : [],
            ordersDistribution: distRes.status === "fulfilled" ? mapOrdersDistribution(distRes.value) : { pending: 0, completed: 0, cancelled: 0 },
            topProducts: productsRes.status === "fulfilled" ? mapTopProducts(productsRes.value) : [],
            topVendors: vendorsRes.status === "fulfilled" ? mapTopVendors(vendorsRes.value) : [],
        };

        setLoadingCharts(false);
        setLoadingTables(false);
    }, [buildApiFilters]);

    useEffect(() => {
        const timeout = setTimeout(loadAll, DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [loadAll]);

    const setFilters = useCallback((updater) => {
        setFiltersState((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const resetFilters = useCallback(() => {
        const defaults = {
            startDate: "",
            endDate: "",
            status: "all",
            category: "",
            ...(role === 2 ? {} : { vendorId: "all" }),
        };
        setFilters(defaults);
        localStorage.removeItem(STORAGE_KEY);
    }, [role, setFilters]);

    const reload = useCallback(() => {
        cacheRef.current = {};
        loadAll();
    }, [loadAll]);

    return {
        revenueSeries,
        ordersDistribution,
        topProducts,
        topVendors,
        loadingCharts,
        loadingTables,
        errorCharts,
        errorTables,
        filters,
        setFilters,
        resetFilters,
        reload,
    };
};
