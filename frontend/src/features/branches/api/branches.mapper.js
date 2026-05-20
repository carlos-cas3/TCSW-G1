export const normalizeBranch = (branch) => ({
    branch_id: branch.branch_id,
    vendor_id: branch.vendor_id,
    vendor_name: branch.vendor_name,
    city_id: branch.city_id,
    branch_name: branch.branch_name,
    branch_address: branch.branch_address,
    branch_status: branch.branch_status,
    created_at: branch.created_at,
    updated_at: branch.updated_at,
    city: branch.cities ? {
        city_id: branch.cities.city_id,
        city_name: branch.cities.city_name,
    } : null,
});

export const normalizeBranches = (branches) =>
    (branches ?? []).map(normalizeBranch);