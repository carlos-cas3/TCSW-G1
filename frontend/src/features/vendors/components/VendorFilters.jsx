import { Search, X } from 'lucide-react';
import { STATUS_LABELS } from '../constants/vendorConstants';
import CategoryMultiSelect from './CategoryMultiSelect';
import '../styles/filters.css';
import '../styles/buttons.css';

const STATUS_OPTIONS = ['all', 'PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED'];

const RUC_OPTIONS = [
    { value: 'all', label: 'Todos los RUC' },
    { value: '10', label: 'RUC 10 (Persona Natural)' },
    { value: '20', label: 'RUC 20 (Persona Jurídica)' },
];

export default function VendorFilters({ filters, onFilterChange, onReset, allCategories }) {
    const hasFilters = filters.search || filters.status !== 'all' || filters.rucType !== 'all' || filters.categories.length > 0;

    return (
        <div className="vendors-filters-bar">
            <div className="vendors-filters-grid">
                <div className="vendors-filters-search">
                    <div className="vendors-filters-search-icon">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por empresa, RUC, email..."
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
                            {status === 'all' ? 'Todos los estados' : STATUS_LABELS[status]}
                        </option>
                    ))}
                </select>

                <CategoryMultiSelect
                    categories={allCategories ?? []}
                    selectedIds={filters.categories}
                    onChange={(ids) => onFilterChange('categories', ids)}
                />

                <div className="flex gap-2">
                    <select
                        value={filters.rucType}
                        onChange={(e) => onFilterChange('rucType', e.target.value)}
                        className="vendors-filters-select"
                    >
                        {RUC_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {hasFilters && (
                        <button
                            onClick={onReset}
                            className="vendors-btn-secondary whitespace-nowrap"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
