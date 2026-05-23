import { useState, useMemo } from 'react';
import { filterVendors } from '../utils/vendorHelpers';

export function useVendorFilters(vendors) {
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        rucType: 'all',
        categories: [],
    });

    const filteredVendors = useMemo(() => {
        return filterVendors(vendors, filters);
    }, [vendors, filters]);

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
            rucType: 'all',
            categories: [],
        });
    };

    return {
        filters,
        filteredVendors,
        updateFilter,
        resetFilters,
    };
}
