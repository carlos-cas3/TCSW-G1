import { useState, useMemo } from 'react';
import { filterVendors, getStats } from '../utils/vendorHelpers';
import { VENDOR_STATUS } from '../constants/vendorConstants';

export function useVendorFilters(vendors) {
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        category: 'all'
    });

    const filteredVendors = useMemo(() => {
        return filterVendors(vendors, filters);
    }, [vendors, filters]);

    const stats = useMemo(() => {
        return getStats(filteredVendors);
    }, [filteredVendors]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            category: 'all'
        });
    };

    const updateVendorStatus = (vendorId, newStatus) => {
        if (!Object.values(VENDOR_STATUS).includes(newStatus)) {
            return false;
        }
        return true;
    };

    return {
        filters,
        filteredVendors,
        stats,
        updateFilter,
        resetFilters,
        updateVendorStatus
    };
}