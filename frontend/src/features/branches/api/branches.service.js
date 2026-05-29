import { fetchWithAuth } from "../../../shared/api/httpClient";
import { API } from "../../../config/api";
import { getAllVendors } from "../../vendors/services/vendor.service";

const VENDORS_URL = API.VENDORS;

const CONCURRENCY_LIMIT = 5;

export const getVendorBranches = (vendorId) =>
    fetchWithAuth(`${VENDORS_URL}/vendors/${vendorId}/branches`);

export const getVendorActiveBranches = (vendorId) =>
    fetchWithAuth(`${VENDORS_URL}/vendors/${vendorId}/branches/active`);

export const getBranchById = (branchId) =>
    fetchWithAuth(`${VENDORS_URL}/vendors/branches/${branchId}`);

export const createBranch = (vendorId, branchData) =>
    fetchWithAuth(`${VENDORS_URL}/vendors/${vendorId}/branches`, {
        method: "POST",
        body: JSON.stringify(branchData),
    });

export const updateBranch = (branchId, branchData) =>
    fetchWithAuth(`${VENDORS_URL}/vendors/branches/${branchId}`, {
        method: "PATCH",
        body: JSON.stringify(branchData),
    });

export const changeBranchStatus = (branchId, status) =>
    fetchWithAuth(`${VENDORS_URL}/vendors/branches/${branchId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ branch_status: status }),
    });

export const deleteBranch = (branchId) =>
    fetchWithAuth(`${VENDORS_URL}/vendors/branches/${branchId}`, {
        method: "DELETE",
    });

async function fetchBranchesFromVendors(vendors, limit = CONCURRENCY_LIMIT) {
    const results = [];

    for (let i = 0; i < vendors.length; i += limit) {
        const chunk = vendors.slice(i, i + limit);

        const chunkResults = await Promise.allSettled(
            chunk.map(async (vendor) => {
                const result = await getVendorBranches(vendor.vendor_id);
                const branches = result.data ?? [];
                return branches.map((branch) => ({
                    ...branch,
                    vendor_name: vendor.vendor_name,
                    vendor_id: vendor.vendor_id,
                }));
            }),
        );

        chunkResults.forEach((res) => {
            if (res.status === "fulfilled") {
                results.push(...res.value);
            }
        });
    }

    return results;
}

export const fetchAllBranches = async () => {
    const { data: vendors, error: vendorsError } = await getAllVendors();

    if (vendorsError) throw new Error(vendorsError);

    return fetchBranchesFromVendors(vendors ?? []);
};