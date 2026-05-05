import { Eye, Pencil } from 'lucide-react';
import { formatDate, formatCurrency, getCategoryNamesString } from '../utils/vendorHelpers';
import VendorStatusSelect from './VendorStatusSelect';
import '../styles/table.css';
import '../styles/shared.css';

const TABLE_HEADERS = [
    { key: 'vendorName', label: 'Vendor Name' },
    { key: 'legalName', label: 'Legal Name' },
    { key: 'ruc', label: 'RUC' },
    { key: 'categories', label: 'Categories' },
    { key: 'status', label: 'Status' },
    { key: 'commission', label: 'Commission' },
    { key: 'currency', label: 'Currency' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'actions', label: 'Actions' }
];

export default function VendorsTable({ vendors, onStatusChange }) {
    const handleStatusChange = (vendorId, newStatus) => {
        const vendor = vendors.find(v => v.vendor_id === vendorId);
        if (vendor && vendor.vendor_status !== newStatus) {
            const confirmed = window.confirm(
                `Are you sure you want to change the status to "${newStatus}"?`
            );
            if (confirmed) {
                onStatusChange(vendorId, newStatus);
            }
        }
    };

    const renderCategoryChips = (categoryIds) => {
        const displayed = categoryIds.slice(0, 3).map(catId => {
            const names = getCategoryNamesString([catId]);
            return names.split(',')[0].trim();
        }).filter(Boolean);

        return (
            <div className="flex flex-wrap gap-1">
                {displayed.map((name, idx) => (
                    <span key={idx} className="vendors-category-chip bg-blue-50 text-blue-700">
                        {name}
                    </span>
                ))}
                {categoryIds.length > 3 && (
                    <span className="vendors-category-chip bg-gray-100 text-gray-600">
                        +{categoryIds.length - 3}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="vendors-table-container">
            <div className="vendors-table-scroll">
                <table className="vendors-table">
                    <thead className="vendors-table-head">
                        <tr>
                            {TABLE_HEADERS.map(({ key, label }) => (
                                <th key={key} className="vendors-table-header">
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="vendors-table-body">
                        {vendors.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="vendors-table-empty">
                                    No vendors found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            vendors.map(vendor => (
                                <tr key={vendor.vendor_id} className="vendors-table-row">
                                    <td className="vendors-table-cell">
                                        <div className="text-sm font-medium text-gray-900">
                                            {vendor.vendor_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {vendor.vendor_email}
                                        </div>
                                    </td>
                                    <td className="vendors-table-cell">
                                        <div className="text-sm text-gray-900">{vendor.vendor_legal_name}</div>
                                    </td>
                                    <td className="vendors-table-cell">
                                        <div className="text-sm text-gray-900 font-mono">{vendor.vendor_ruc}</div>
                                    </td>
                                    <td className="vendors-table-cell">
                                        {renderCategoryChips(vendor.categories)}
                                    </td>
                                    <td className="vendors-table-cell">
                                        <VendorStatusSelect
                                            currentStatus={vendor.vendor_status}
                                            onChange={(newStatus) => handleStatusChange(vendor.vendor_id, newStatus)}
                                        />
                                    </td>
                                    <td className="vendors-table-cell">
                                        <div className="text-sm text-gray-900">
                                            {formatCurrency(vendor.commission_rate, vendor.currency)}
                                        </div>
                                    </td>
                                    <td className="vendors-table-cell">
                                        <div className="text-sm text-gray-900">{vendor.currency}</div>
                                    </td>
                                    <td className="vendors-table-cell">
                                        <div className="text-sm text-gray-500">{formatDate(vendor.created_at)}</div>
                                    </td>
                                    <td className="vendors-table-cell">
                                        <div className="vendors-table-cell-actions">
                                            <button
                                                onClick={() => console.log('View:', vendor.vendor_id)}
                                                className="vendors-table-action-btn"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => console.log('Edit:', vendor.vendor_id)}
                                                className="vendors-table-action-btn"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}