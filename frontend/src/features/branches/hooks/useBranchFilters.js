import { useState, useMemo } from "react";
import { filterBranches, getBranchStats } from "../utils/branchFilters";

export function useBranchFilters(branches) {
    const [filters, setFilters] = useState({ search: "", status: "all" });

    const filteredBranches = useMemo(() => {
        return filterBranches(branches, filters);
    }, [branches, filters]);

    const stats = useMemo(() => {
        return getBranchStats(filteredBranches);
    }, [filteredBranches]);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetFilters = () => {
        setFilters({ search: "", status: "all" });
    };

    return {
        filters,
        filteredBranches,
        stats,
        updateFilter,
        resetFilters,
    };
}