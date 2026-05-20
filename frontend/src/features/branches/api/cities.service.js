import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const VENDORS_URL = API.VENDORS;

export const getCities = () =>
    fetchWithAuth(`${VENDORS_URL}/vendors/cities`);