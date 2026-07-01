import { useState, useEffect, useCallback } from "react";
import { getUser } from "../../../app/auth";
import {
    mapRevenueSeries,
    mapOrdersDistribution,
    mapTopProducts,
    mapTopVendors,
} from "../mappers/analytics.mapper";
import {
    MOCK_REVENUE_SERIES,
    MOCK_ORDERS_DISTRIBUTION,
    MOCK_TOP_PRODUCTS,
    MOCK_TOP_VENDORS,
} from "./mockData";

const defaultFilters = (role) => ({
    startDate: "",
    endDate: "",
    status: "all",
    category: "",
    ...(role === 2 ? {} : { vendorId: "all" }),
});

export const useMockAnalytics = () => {
    const user = getUser();
    const role = user?.roleId;

    const [filters, setFiltersState] = useState(() => defaultFilters(role));
    const [revenueSeries, setRevenueSeries] = useState([]);
    const [ordersDistribution, setOrdersDistribution] = useState({ pending: 0, completed: 0, cancelled: 0 });
    const [topProducts, setTopProducts] = useState([]);
    const [topVendors, setTopVendors] = useState([]);
    const [loadingCharts, setLoadingCharts] = useState(true);
    const [loadingTables, setLoadingTables] = useState(true);
    const [errorCharts, setErrorCharts] = useState(null);
    const [errorTables, setErrorTables] = useState(null);

    const loadAll = useCallback(async () => {
        setLoadingCharts(true);
        setLoadingTables(true);
        setErrorCharts(null);
        setErrorTables(null);

        await new Promise((r) => setTimeout(r, 400));

        setRevenueSeries(mapRevenueSeries(MOCK_REVENUE_SERIES));
        setOrdersDistribution(mapOrdersDistribution(MOCK_ORDERS_DISTRIBUTION));
        setTopProducts(mapTopProducts(MOCK_TOP_PRODUCTS));
        setTopVendors(mapTopVendors(MOCK_TOP_VENDORS));

        setLoadingCharts(false);
        setLoadingTables(false);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            if (!cancelled) await loadAll();
        };
        init();
        return () => { cancelled = true; };
    }, [loadAll]);

    const setFilters = useCallback((updater) => {
        setFiltersState((prev) =>
            typeof updater === "function" ? updater(prev) : updater
        );
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState(defaultFilters(role));
    }, [role]);

    const reload = useCallback(() => {
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
