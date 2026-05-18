import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useVendorFilters } from '../hooks/useVendorFilters';
import { VENDOR_STATUS } from '../constants/vendorConstants';
import { VENDORS_MOCK } from '../data/vendorsMock';
import VendorStatsCards from '../components/VendorStatsCards';
import VendorFilters from '../components/VendorFilters';
import VendorsTable from '../components/VendorsTable';
import AddVendorModal from '../components/AddVendorModal';
import '../styles/layout.css';
import '../styles/buttons.css';

export default function VendorsList() {
    const [vendors, setVendors] = useState(VENDORS_MOCK);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleAddVendor = (vendorData) => {
        const newVendor = {
            vendor_id: Math.max(...vendors.map(v => v.vendor_id)) + 1,
            ...vendorData,
            vendor_status: VENDOR_STATUS.PENDING,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        setVendors(prev => [...prev, newVendor]);
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
                        onClick={() => setIsModalOpen(true)}
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
                        onStatusChange={handleStatusChange}
                    />
                )}

                <AddVendorModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddVendor}
                />
            </div>
        </div>
    );
}