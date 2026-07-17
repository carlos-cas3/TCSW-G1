import { useMemo } from "react";
import FilterBar from "../../../shared/components/FilterBar";
import { useVendors } from "../../vendors/hooks/useVendors";

export default function AnalyticsFiltersBar({ filters, setFilters, onReset, role }) {
    const { vendors } = useVendors();

    const vendorOptions = useMemo(() => {
        if (!Array.isArray(vendors)) return [];
        return vendors.map((v) => ({
            value: v.id || v.vendor_id,
            label: v.name || v.businessName || v.business_name || `Vendor #${v.id}`,
        }));
    }, [vendors]);

    const filterConfig = useMemo(() => {
        const config = [
            {
                key: "status",
                type: "select",
                label: "Estado",
                value: filters.status || "all",
                onChange: (value) => setFilters((prev) => ({ ...prev, status: value })),
                allLabel: "Todos",
                options: [
                    { value: "pending", label: "Pendientes" },
                    { value: "completed", label: "Completadas" },
                    { value: "cancelled", label: "Canceladas" },
                ],
            },
        ];

        if (role === 1) {
            config.push({
                key: "vendorId",
                type: "select",
                label: "Vendedor",
                value: filters.vendorId || "all",
                onChange: (value) => setFilters((prev) => ({ ...prev, vendorId: value })),
                allLabel: "Todos",
                options: vendorOptions,
            });
        }

        return config;
    }, [filters, setFilters, role, vendorOptions]);

    return <FilterBar filters={filterConfig} onReset={onReset} />;
}
