import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const ORDERS_URL = `${API.ORDERS}/api/v1/ordenes`;

export const getAdminVendorOrders = (vendorId) => fetchWithAuth(`${ORDERS_URL}/admin/vendedor/${vendorId}`);
