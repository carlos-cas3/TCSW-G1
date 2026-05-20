import { useState, useMemo } from "react";
import { filterBranches, getBranchStats, extractCities, extractVendors } from "../utils/branchFilters";

export function useBranchFilters(branches, mode) {
    const initialFilters = mode === "admin"
        ? { search: "", vendor: "all", city: "all", status: "all" }
        : { search: "", city: "all", status: "all" };

    const [filters, setFilters] = useState(initialFilters);

    const filteredBranches = useMemo(() => {
        return filterBranches(branches, filters);
    }, [branches, filters]);

    const stats = useMemo(() => {
        return getBranchStats(filteredBranches);
    }, [filteredBranches]);

    const cities = useMemo(() => {
        return extractCities(branches);
    }, [branches]);

    const vendors = useMemo(() => {
        return extractVendors(branches);
    }, [branches]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    return {
        filters,
        filteredBranches,
        stats,
        cities,
        vendors,
        updateFilter,
        resetFilters,
    };
}