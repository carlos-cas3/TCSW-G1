import { useState, useMemo } from "react";
import { filterStaff, getStaffStats } from "../utils/staffHelpers";

export const useStaffFilters = (staff) => {
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
  });

  const filteredStaff = useMemo(() => {
    return filterStaff(staff, filters);
  }, [staff, filters]);

  const stats = useMemo(() => {
    return getStaffStats(filteredStaff);
  }, [filteredStaff]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ search: "", role: "all" });
  };

  return {
    filters,
    filteredStaff,
    stats,
    updateFilter,
    resetFilters,
  };
};
