import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const ORDERS_URL = `${API.ORDERS}/api/v1/ordenes`;

export const getOrders = () => fetchWithAuth(ORDERS_URL);

export const getVendorOrders = (vendorId) => fetchWithAuth(`${ORDERS_URL}/vendedor/${vendorId}`);
