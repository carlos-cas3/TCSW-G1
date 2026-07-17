import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useVendorFilters } from '../hooks/useVendorFilters';
import { VENDORS_MOCK } from '../data/vendorsMock';
import createStatsCards from "../../../shared/components/createStatsCards";
import { Store, CircleCheck, Clock, Ban } from "lucide-react";

const VendorStatsCards = createStatsCards([
  { label: "Total Vendedores", valueKey: "total", icon: Store, color: "blue" },
  { label: "Activos", valueKey: "active", icon: CircleCheck, color: "green" },
  { label: "Pendientes", valueKey: "pending", icon: Clock, color: "yellow" },
  { label: "Suspendidos", valueKey: "suspended", icon: Ban, color: "red" },
]);
import VendorFilters from '../components/VendorFilters';
import VendorsTable from '../components/VendorsTable';


export default function VendorsList() {
    const [vendors, setVendors] = useState(VENDORS_MOCK);

    const {
        filteredVendors,
        stats,
        filters,
        updateFilter,
        resetFilters
    } = useVendorFilters(vendors);

    const handleStatusChange = (vendorId, newStatus) => {
        setVendors(prev => 
            prev.map(vendor => 
                vendor.vendor_id === vendorId
                    ? { ...vendor, vendor_status: newStatus, updated_at: new Date().toISOString() }
                    : vendor
            )
        );
    };

    return (
        <div className="vendors-page">
            <div className="vendors-page-container">
                <header className="vendors-page-header">
                    <div className="vendors-page-header-start">
                        {/* <h1 className="vendors-page-title">Vendor Management</h1>
                        <p className="vendors-page-subtitle">Gestión de Vendedores</p> */}
                    </div>
                    <button
                        className="vendors-btn-primary"
                    >
                        <Plus className="vendors-btn-icon mr-2" />
                        Añadir vendedor
                    </button>
                </header>

                <VendorStatsCards stats={stats} />

                <VendorFilters
                    filters={filters}
                    onFilterChange={updateFilter}
                    onReset={resetFilters}
                />

                {filteredVendors.length === 0 ? (
                    <div className="vendors-card-simple">
                        <p className="text-gray-500">No vendors match your filters.</p>
                        <button
                            onClick={resetFilters}
                            className="vendors-link-btn"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <VendorsTable
                        vendors={filteredVendors}
                        changeStatus={handleStatusChange}
                    />
                )}
            </div>
        </div>
    );
}