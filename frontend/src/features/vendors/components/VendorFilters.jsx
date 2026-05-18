import { Search, X } from 'lucide-react';
import { CATEGORIES } from '../data/vendorsMock';
import { VENDOR_STATUS_LABELS } from '../constants/vendorConstants';
import '../styles/filters.css';
import '../styles/buttons.css';

const STATUS_OPTIONS = ['all', ...Object.keys(VENDOR_STATUS_LABELS)];

export default function VendorFilters({ filters, onFilterChange, onReset }) {
    const hasFilters = filters.search || filters.status !== 'all' || filters.category !== 'all';

    return (
        <div className="vendors-filters-bar">
            <div className="vendors-filters-grid">
                <div className="vendors-filters-search">
                    <div className="vendors-filters-search-icon">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search vendor, RUC, email, category..."
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                        className="vendors-filters-search-input"
                    />
                    {filters.search && (
                        <button
                            onClick={() => onFilterChange('search', '')}
                            className="vendors-filters-search-clear"
                        >
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>

                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange('status', e.target.value)}
                    className="vendors-filters-select"
                >
                    {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>
                            {status === 'all' ? 'All Status' : VENDOR_STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.category}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                    className="vendors-filters-select"
                >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.category_name}
                        </option>
                    ))}
                </select>

                <div className="flex items-center">
                    {hasFilters && (
                        <button
                            onClick={onReset}
                            className="vendors-btn-secondary w-full"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}