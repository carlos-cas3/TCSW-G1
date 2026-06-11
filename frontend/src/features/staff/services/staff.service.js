import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const STAFF_URL = `${API.VENDORS}/vendors/staff`;

export const getStaff = () => fetchWithAuth(STAFF_URL);

export const createStaff = (data) =>
  fetchWithAuth(STAFF_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
