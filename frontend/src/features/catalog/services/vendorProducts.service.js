import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const VENDOR_PRODUCTS_URL =
  `${API.CATALOG}/api/vendor-products`;

// LISTAR POR VENDOR
export const getVendorProducts = async (vendorId) => {

  const res =
    await fetchWithAuth(
      `${VENDOR_PRODUCTS_URL}/${vendorId}`
    );

  return res.data || [];
};

// CREAR (AGREGAR PRODUCTO AL VENDOR)
export const createVendorProduct = async (data) => {

  return await fetchWithAuth(
    VENDOR_PRODUCTS_URL,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

};

// EDITAR (price, stock, status)
export const updateVendorProduct = async (id, data) => {

  return await fetchWithAuth(
    `${VENDOR_PRODUCTS_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

};

// ELIMINAR DEL CATÁLOGO DEL VENDOR
export const deleteVendorProduct = async (id) => {

  return await fetchWithAuth(
    `${VENDOR_PRODUCTS_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

};