

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
                branch.vendor_name?.toLowerCase().includes(searchLower) ||
                branch.cities?.city_name?.toLowerCase().includes(searchLower);
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

export const sortBranches = (branches, sortKey, sortDir) => {
    if (!sortKey || !sortDir) return branches;

    return [...branches].sort((a, b) => {
        switch (sortKey) {
            case "branchName": {
                const valA = a.branch_name ?? "";
                const valB = b.branch_name ?? "";
                const cmp = valA.localeCompare(valB, "es", { sensitivity: "base" });
                return sortDir === "asc" ? cmp : -cmp;
            }
            case "vendorName": {
                const valA = a.vendor_name ?? "";
                const valB = b.vendor_name ?? "";
                const cmp = valA.localeCompare(valB, "es", { sensitivity: "base" });
                return sortDir === "asc" ? cmp : -cmp;
            }
            case "createdAt": {
                const valA = new Date(a.created_at).getTime();
                const valB = new Date(b.created_at).getTime();
                if (isNaN(valA)) return sortDir === "asc" ? -1 : 1;
                if (isNaN(valB)) return sortDir === "asc" ? 1 : -1;
                return sortDir === "asc" ? valA - valB : valB - valA;
            }
            default:
                return 0;
        }
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