import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useCities } from "../hooks/useCities";
import CityCombobox from "./CityCombobox";
import "../styles/modal.css";

export default function BranchFormModal({ isOpen, onClose, onSubmit, branch }) {
    const { cities, loading: loadingCities } = useCities();
    const isEditMode = !!branch;
    const nameInputRef = useRef(null);
    const prevOpen = useRef(false);

    const getInitialFormData = () => ({
        branch_name: branch?.branch_name || "",
        city_id: branch?.city_id?.toString() || "",
        branch_address: branch?.branch_address || "",
    });

    const [formData, setFormData] = useState(getInitialFormData);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && !prevOpen.current) {
            setFormData({
                branch_name: branch?.branch_name || "",
                city_id: branch?.city_id?.toString() || "",
                branch_address: branch?.branch_address || "",
            });
            setErrors({});
            setSubmitting(false);
        }
        prevOpen.current = isOpen;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => nameInputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.branch_name || !formData.branch_name.trim()) {
            newErrors.branch_name = "El nombre es obligatorio";
        }
        if (!formData.city_id) {
            newErrors.city_id = "Selecciona una ciudad";
        }
        if (!formData.branch_address || !formData.branch_address.trim()) {
            newErrors.branch_address = "La dirección es obligatoria";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const submitData = {
                branch_name: formData.branch_name.trim(),
                city_id: parseInt(formData.city_id),
                branch_address: formData.branch_address.trim(),
            };
            await onSubmit(submitData);
            onClose();
        } catch (err) {
            setErrors({ submit: err.message || "Error al guardar" });
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const sharedInput = "w-full px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg transition-all duration-150 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-stone-300";
    const labelClass = "block text-sm font-medium text-stone-700 mb-1.5";

    return (
        <div className="branches-modal-overlay">
            <div className="branches-modal-backdrop animate-fade-in" onClick={onClose} />
            <div className="branches-modal-container">
                <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-stone-100 p-6 animate-modal-enter">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-stone-900">
                                {isEditMode ? "Editar Sucursal" : "Nueva Sucursal"}
                            </h2>
                            <p className="text-sm text-stone-400 mt-0.5">
                                Completa los datos de la sucursal
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>
                                    Nombre
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    name="branch_name"
                                    value={formData.branch_name}
                                    onChange={handleChange}
                                    placeholder="Ej. Principal"
                                    className={sharedInput}
                                />
                                {errors.branch_name && (
                                    <p className="branches-form-error">{errors.branch_name}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Ciudad <span className="text-red-400">*</span>
                                </label>
                                <CityCombobox
                                    cities={cities}
                                    value={formData.city_id}
                                    onChange={handleChange}
                                    disabled={loadingCities}
                                    error={errors.city_id}
                                />
                                {errors.city_id && (
                                    <p className="branches-form-error">{errors.city_id}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>
                                Dirección <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="branch_address"
                                value={formData.branch_address}
                                onChange={handleChange}
                                placeholder="Ej. Av. Principal 123"
                                className={sharedInput}
                            />
                            {errors.branch_address && (
                                <p className="branches-form-error">{errors.branch_address}</p>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{errors.submit}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all duration-150 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20"
                            >
                                {submitting
                                    ? isEditMode
                                        ? "Guardando..."
                                        : "Creando..."
                                    : isEditMode
                                    ? "Guardar"
                                    : "Crear"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
