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


// revisar luego con claude 
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
