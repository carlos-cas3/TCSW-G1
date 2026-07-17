import { VENDOR_STATUS_COLORS } from '../constants/vendorConstants';

export function getStatusColor(status) {
    return VENDOR_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
}

export function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function formatCurrency(amount, currency) {
    const symbols = {
        USD: '$',
        EUR: '€',
        PEN: 'S/'
    };
    return `${symbols[currency] || ''}${amount}`;
}

export function filterVendors(vendors, filters) {
    return vendors.filter(vendor => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                vendor.vendor_name?.toLowerCase().includes(searchLower) ||
                vendor.vendor_ruc?.includes(searchLower) ||
                vendor.vendor_email?.toLowerCase().includes(searchLower) ||
                vendor.vendor_categories?.some(c =>
                    c.categories?.category_name?.toLowerCase().includes(searchLower)
                );
            if (!matchesSearch) return false;
        }

        if (filters.status && filters.status !== 'all') {
            if (vendor.vendor_status !== filters.status) return false;
        }

        if (filters.rucType && filters.rucType !== 'all') {
            const prefix = vendor.vendor_ruc?.substring(0, 2);
            if (prefix !== filters.rucType) return false;
        }

        if (filters.categories?.length > 0) {
            const vendorCatIds = vendor.vendor_categories?.map(
                c => c.categories?.category_id
            ) ?? [];
            const hasAll = filters.categories.every(id => vendorCatIds.includes(id));
            if (!hasAll) return false;
        }

        return true;
    });
}

export function sortVendors(vendors, sortKey, sortDir) {
    if (!sortKey || !sortDir) return vendors;

    return [...vendors].sort((a, b) => {
        let valA, valB;

        switch (sortKey) {
            case 'vendorName':
                valA = a.vendor_name?.toLowerCase() ?? '';
                valB = b.vendor_name?.toLowerCase() ?? '';
                break;
            case 'products':
                valA = a.products?.length ?? 0;
                valB = b.products?.length ?? 0;
                break;
            case 'branches':
                valA = a.branches?.length ?? 0;
                valB = b.branches?.length ?? 0;
                break;
            case 'createdAt':
                valA = a.created_at ?? '';
                valB = b.created_at ?? '';
                break;
            default:
                return 0;
        }

        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });
}

export function getStats(vendors) {
    return {
        total: vendors.length,
        active: vendors.filter(v => v.vendor_status === "ACTIVE").length,
        pending: vendors.filter(v => v.vendor_status === "PENDING").length,
        suspended: vendors.filter(v => v.vendor_status === "SUSPENDED").length,
    };
}
