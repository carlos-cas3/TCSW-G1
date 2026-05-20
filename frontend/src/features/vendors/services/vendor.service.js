import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const VENDOR_URL = `${API.VENDORS}/vendors`;

export const getAllVendors = () => fetchWithAuth(VENDOR_URL);

export const getVendorBranches = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/branches`);

export const getVendorCategories = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/categories`);

export const updateVendorStatus = (vendorId, status) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
