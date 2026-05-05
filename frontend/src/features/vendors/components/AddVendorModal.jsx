import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, PAYMENT_METHODS } from '../data/vendorsMock';
import { CURRENCY_OPTIONS } from '../constants/vendorConstants';
import '../styles/modal.css';
import '../styles/shared.css';
import '../styles/buttons.css';

const INITIAL_FORM = {
    vendor_name: '',
    vendor_legal_name: '',
    vendor_ruc: '',
    vendor_email: '',
    vendor_phone: '',
    vendor_address: '',
    commission_rate: '',
    currency: 'PEN',
    categories: [],
    payment_methods: []
};

export default function AddVendorModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCheckboxChange = (field, value) => {
        setFormData(prev => {
            const current = prev[field];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.vendor_name.trim()) newErrors.vendor_name = 'Vendor name is required';
        if (!formData.vendor_legal_name.trim()) newErrors.vendor_legal_name = 'Legal name is required';
        if (!formData.vendor_ruc.trim()) newErrors.vendor_ruc = 'RUC is required';
        if (!formData.vendor_email.trim()) newErrors.vendor_email = 'Email is required';
        if (!formData.vendor_phone.trim()) newErrors.vendor_phone = 'Phone is required';
        if (!formData.vendor_address.trim()) newErrors.vendor_address = 'Address is required';
        if (!formData.commission_rate) newErrors.commission_rate = 'Commission rate is required';
        if (formData.categories.length === 0) newErrors.categories = 'Select at least one category';
        if (formData.payment_methods.length === 0) newErrors.payment_methods = 'Select at least one payment method';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...formData,
                commission_rate: parseFloat(formData.commission_rate)
            });
            setFormData(INITIAL_FORM);
            onClose();
        }
    };

    const getInputClass = (field) => {
        const base = 'block w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300';
        return errors[field] ? `${base} border-red-300 ring-1 ring-red-300` : base;
    };

    if (!isOpen) return null;

    return (
        <div className="vendors-modal">
            <div className="vendors-modal-wrapper">
                <div 
                    className="vendors-modal-backdrop"
                    onClick={onClose}
                />

                <div className="vendors-modal-panel">
                    <div className="vendors-modal-content">
                        <div className="vendors-modal-header">
                            <h3 className="vendors-modal-title">Add New Vendor</h3>
                            <button
                                onClick={onClose}
                                className="vendors-modal-close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="vendors-modal-form">
                            <div className="vendors-modal-form-grid">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vendor Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="vendor_name"
                                        value={formData.vendor_name}
                                        onChange={handleInputChange}
                                        className={getInputClass('vendor_name')}
                                        placeholder="Enter vendor name"
                                    />
                                    {errors.vendor_name && (
                                        <p className="mt-1 text-xs text-red-600">{errors.vendor_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Legal Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="vendor_legal_name"
                                        value={formData.vendor_legal_name}
                                        onChange={handleInputChange}
                                        className={getInputClass('vendor_legal_name')}
                                        placeholder="Enter legal name"
                                    />
                                    {errors.vendor_legal_name && (
                                        <p className="mt-1 text-xs text-red-600">{errors.vendor_legal_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        RUC *
                                    </label>
                                    <input
                                        type="text"
                                        name="vendor_ruc"
                                        value={formData.vendor_ruc}
                                        onChange={handleInputChange}
                                        className={getInputClass('vendor_ruc')}
                                        placeholder="Enter RUC"
                                    />
                                    {errors.vendor_ruc && (
                                        <p className="mt-1 text-xs text-red-600">{errors.vendor_ruc}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="vendor_email"
                                        value={formData.vendor_email}
                                        onChange={handleInputChange}
                                        className={getInputClass('vendor_email')}
                                        placeholder="Enter email"
                                    />
                                    {errors.vendor_email && (
                                        <p className="mt-1 text-xs text-red-600">{errors.vendor_email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="text"
                                        name="vendor_phone"
                                        value={formData.vendor_phone}
                                        onChange={handleInputChange}
                                        className={getInputClass('vendor_phone')}
                                        placeholder="Enter phone"
                                    />
                                    {errors.vendor_phone && (
                                        <p className="mt-1 text-xs text-red-600">{errors.vendor_phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Currency *
                                    </label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {CURRENCY_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Commission Rate (%) *
                                    </label>
                                    <input
                                        type="number"
                                        name="commission_rate"
                                        value={formData.commission_rate}
                                        onChange={handleInputChange}
                                        className={getInputClass('commission_rate')}
                                        placeholder="Enter commission rate"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                    />
                                    {errors.commission_rate && (
                                        <p className="mt-1 text-xs text-red-600">{errors.commission_rate}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    name="vendor_address"
                                    value={formData.vendor_address}
                                    onChange={handleInputChange}
                                    className={getInputClass('vendor_address')}
                                    placeholder="Enter address"
                                />
                                {errors.vendor_address && (
                                    <p className="mt-1 text-xs text-red-600">{errors.vendor_address}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categories *
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {CATEGORIES.map(cat => (
                                        <label
                                            key={cat.category_id}
                                            className={`flex items-center p-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                                                formData.categories.includes(cat.category_id)
                                                    ? 'border-blue-300 bg-blue-50'
                                                    : 'border-gray-200'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.categories.includes(cat.category_id)}
                                                onChange={() => handleCheckboxChange('categories', cat.category_id)}
                                                className="sr-only"
                                            />
                                            <span className="text-sm text-gray-700">{cat.category_name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.categories && (
                                    <p className="mt-1 text-xs text-red-600">{errors.categories}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Methods *
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {PAYMENT_METHODS.map(pm => (
                                        <label
                                            key={pm.payment_method_id}
                                            className={`flex items-center p-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                                                formData.payment_methods.includes(pm.payment_method_id)
                                                    ? 'border-blue-300 bg-blue-50'
                                                    : 'border-gray-200'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.payment_methods.includes(pm.payment_method_id)}
                                                onChange={() => handleCheckboxChange('payment_methods', pm.payment_method_id)}
                                                className="sr-only"
                                            />
                                            <span className="text-sm text-gray-700">{pm.payment_method_name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.payment_methods && (
                                    <p className="mt-1 text-xs text-red-600">{errors.payment_methods}</p>
                                )}
                            </div>

                            <div className="vendors-modal-form-actions">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="vendors-btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="vendors-btn-primary"
                                >
                                    Add Vendor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}