export const VENDOR_STATUS = {
    APPROVED: 'approved',
    PENDING: 'pending',
    REJECTED: 'rejected'
};

export const VENDOR_STATUS_LABELS = {
    [VENDOR_STATUS.APPROVED]: 'Aprobado',
    [VENDOR_STATUS.PENDING]: 'Pendiente',
    [VENDOR_STATUS.REJECTED]: 'Rechazado'
};

export const VENDOR_STATUS_COLORS = {
    [VENDOR_STATUS.APPROVED]: 'bg-green-100 text-green-800',
    [VENDOR_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [VENDOR_STATUS.REJECTED]: 'bg-red-100 text-red-800'
};

export const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'PEN', label: 'PEN - Peruvian Sol' }
];

export const DEFAULT_PAGE_SIZE = 10;