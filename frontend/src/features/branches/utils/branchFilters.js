

export const extractCities = (branches) => {
    const cityMap = new Map();

    branches.forEach((branch) => {
        if (branch.cities?.city_id && branch.cities?.city_name) {
            cityMap.set(branch.cities.city_id, {
                city_id: branch.cities.city_id,
                city_name: branch.cities.city_name,
            });
        }
    });

    return Array.from(cityMap.values()).sort((a, b) =>
        a.city_name.localeCompare(b.city_name)
    );
};

export const extractVendors = (branches) => {
    const vendorMap = new Map();

    branches.forEach((branch) => {
        if (branch.vendor_id && branch.vendor_name) {
            vendorMap.set(branch.vendor_id, {
                vendor_id: branch.vendor_id,
                vendor_name: branch.vendor_name,
            });
        }
    });

    return Array.from(vendorMap.values()).sort((a, b) =>
        a.vendor_name.localeCompare(b.vendor_name)
    );
};

export const filterBranches = (branches, filters) => {
    return branches.filter((branch) => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                branch.branch_name?.toLowerCase().includes(searchLower) ||
                branch.branch_address?.toLowerCase().includes(searchLower) ||
                branch.vendor_name?.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        if (filters.vendor && filters.vendor !== "all") {
            if (branch.vendor_id !== parseInt(filters.vendor)) return false;
        }

        if (filters.city && filters.city !== "all") {
            if (branch.cities?.city_id !== parseInt(filters.city)) return false;
        }

        if (filters.status && filters.status !== "all") {
            if (branch.branch_status !== filters.status) return false;
        }

        return true;
    });
};

export const getBranchStats = (branches) => {
    return {
        total: branches.length,
        active: branches.filter((b) => b.branch_status === "ACTIVE").length,
        inactive: branches.filter((b) => b.branch_status === "INACTIVE").length,
        maintaining: branches.filter((b) => b.branch_status === "MAINTAINING").length,
    };
};