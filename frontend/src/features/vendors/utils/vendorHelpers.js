import { VENDOR_STATUS, VENDOR_STATUS_COLORS } from '../constants/vendorConstants';
import { CATEGORIES, PAYMENT_METHODS } from '../data/vendorsMock';

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

export function getCategoryNames(categoryIds) {
    return CATEGORIES.filter(cat => categoryIds.includes(cat.category_id))
        .map(cat => cat.category_name);
}

export function getCategoryNamesString(categoryIds) {
    const names = getCategoryNames(categoryIds);
    return names.length > 0 ? names.join(', ') : '-';
}

export function getPaymentMethodNames(methodIds) {
    return PAYMENT_METHODS.filter(pm => methodIds.includes(pm.payment_method_id))
        .map(pm => pm.payment_method_name);
}

export function filterVendors(vendors, filters) {
    return vendors.filter(vendor => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch = 
                vendor.vendor_name.toLowerCase().includes(searchLower) ||
                vendor.vendor_ruc.includes(searchLower) ||
                vendor.vendor_email.toLowerCase().includes(searchLower) ||
                getCategoryNamesString(vendor.categories).toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
        }

        if (filters.status && filters.status !== 'all') {
            if (vendor.vendor_status !== filters.status) return false;
        }

        if (filters.category && filters.category !== 'all') {
            if (!vendor.categories.includes(parseInt(filters.category))) return false;
        }

        return true;
    });
}

export function getStats(vendors) {
    return {
        total: vendors.length,
        pending: vendors.filter(v => v.vendor_status === VENDOR_STATUS.PENDING).length,
        rejected: vendors.filter(v => v.vendor_status === VENDOR_STATUS.REJECTED).length,
        approved: vendors.filter(v => v.vendor_status === VENDOR_STATUS.APPROVED).length
    };
}