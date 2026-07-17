import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const STAFF_URL = `${API.VENDORS}/vendors/staff`;

export const getStaff = () => fetchWithAuth(STAFF_URL);

export const createStaff = (data) =>
  fetchWithAuth(STAFF_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateStaff = (staffId, data) =>
  fetchWithAuth(`${STAFF_URL}/${staffId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteStaff = (staffId) =>
  fetchWithAuth(`${STAFF_URL}/${staffId}`, {
    method: "DELETE",
  });
