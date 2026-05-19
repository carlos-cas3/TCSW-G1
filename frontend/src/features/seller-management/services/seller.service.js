import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const VENDOR_URL = `${API.VENDORS}/vendors`;

export const getVendorById = (vendorId) =>
    fetchWithAuth(`${VENDOR_URL}/${vendorId}`);

export const updateVendor = async (vendorId, data) => {
    console.log("updateVendor llamado con:", { vendorId, data });
    const result = await fetchWithAuth(`${VENDOR_URL}/${vendorId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    console.log("respuesta updateVendor:", result);
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
