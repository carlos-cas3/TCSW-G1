import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const BASE = `${API.BASE}/api/v1/analytics`;

const toParams = (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "" && value !== "all") {
            params.append(key, value);
        }
    });
    return params.toString();
};

export const getDashboardMetrics = (filters = {}) =>
    fetchWithAuth(`${BASE}/dashboard?${toParams(filters)}`);

export const getRevenueSeries = (filters = {}) =>
    fetchWithAuth(`${BASE}/revenue?${toParams(filters)}`);

export const getOrdersDistribution = (filters = {}) =>
    fetchWithAuth(`${BASE}/orders/distribution?${toParams(filters)}`);

export const getTopProducts = (filters = {}) =>
    fetchWithAuth(`${BASE}/products/top?${toParams(filters)}`);

export const getTopVendors = (filters = {}) =>
    fetchWithAuth(`${BASE}/vendors/top?${toParams(filters)}`);
