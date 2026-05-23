import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const VENDOR_URL = `${API.VENDORS}/vendors`;

export const getAllVendors = () => fetchWithAuth(VENDOR_URL);

export const getVendorBranches = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/branches`);

export const getVendorCategories = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/categories`);

export const getAllCategories = () =>
    fetchWithAuth(`${VENDOR_URL}/categories`);

export const updateVendorCategories = (vendorId, categoryIds) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/categories`, {
        method: "PUT",
        body: JSON.stringify({ category_ids: categoryIds }),
    });

export const updateVendorStatus = (vendorId, status) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });

export const getVendorById = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}`);

export const updateVendor = async (vendorId, data) => {
    const result = await fetchWithAuth(`${VENDOR_URL}/${vendorId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
    return result;
};

export const getVendorPolicy = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/policy`);

export const updateVendorPolicy = (vendorId, description) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/policy`, {
        method: "PUT",
        body: JSON.stringify({ description }),
    });

export const uploadVendorLogo = (vendorId, file) => {
    const formData = new FormData();
    formData.append("logo", file);

    return fetchWithAuth(`${VENDOR_URL}/${vendorId}/logo`, {
        method: "POST",
        body: formData,
    });
};

export const getPaymentMethods = () =>
    fetchWithAuth(`${VENDOR_URL}/payment-methods`);

export const getVendorPaymentMethods = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/payment-methods`);

export const updateVendorPaymentMethods = (vendorId, paymentMethodIds) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/payment-methods`, {
        method: "PUT",
        body: JSON.stringify({
            payment_method_ids: paymentMethodIds,
        }),
    });

// Commission endpoints
export const getVendorCommission = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/commission`);

export const createVendorCommission = (vendorId, commission_rate) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/commission`, {
        method: "POST",
        body: JSON.stringify({ commission_rate }),
    });

export const updateVendorCommission = (configId, commission_rate) =>
    fetchWithAuth(`${VENDOR_URL}/commission/${configId}`, {
        method: "PUT",
        body: JSON.stringify({ commission_rate }),
    });

// Auth endpoints (admin)
const AUTH_URL = `${API.AUTH}/admin`;

export const getUserByVendorId = (vendorId) =>
    fetchWithAuth(`${AUTH_URL}/vendors/${vendorId}/user`);

export const updateVendorUser = (userId, data) =>
    fetchWithAuth(`${AUTH_URL}/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });