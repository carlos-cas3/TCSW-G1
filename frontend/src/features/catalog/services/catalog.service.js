import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";

const PRODUCT_URL = `${API.CATALOG}/api/products`;

export const getProducts = async () => {

    const response =
        await fetchWithAuth(PRODUCT_URL);

    return response.data || [];
};

export const createProduct = async (data) => {

    return await fetchWithAuth(PRODUCT_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

};

export const updateProduct = async (id, data) => {

    return await fetchWithAuth(
        `${PRODUCT_URL}/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );

};

export const deleteProduct = async (id) => {

    return await fetchWithAuth(
        `${PRODUCT_URL}/${id}`,
        {
            method: "DELETE",
        }
    );

};

export const getCategories = async () => {

    const response =
        await fetchWithAuth(
            `${API.CATALOG}/api/categories`
        );

    return response.data || [];
};

export const getProductsByVendor = async (vendorId) => {

    const response =
        await fetchWithAuth(
            `${API.CATALOG}/api/vendors/${vendorId}/products`
        );

    return response.data?.products || [];
};