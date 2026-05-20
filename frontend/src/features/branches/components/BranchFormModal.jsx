import { useState } from "react";
import { X } from "lucide-react";
import { useCities } from "../hooks/useCities";
import "../styles/modal.css";

export default function BranchFormModal({ isOpen, onClose, onSubmit, branch }) {
    const { cities, loading: loadingCities } = useCities();
    const isEditMode = !!branch;

    const getInitialFormData = () => ({
        branch_name: branch?.branch_name || "",
        city_id: branch?.city_id?.toString() || "",
        branch_address: branch?.branch_address || "",
    });

    const [formData, setFormData] = useState(getInitialFormData);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleOpen = () => {
        setFormData(getInitialFormData());
        setErrors({});
    };

    if (isOpen && formData.branch_name === "" && branch?.branch_name) {
        handleOpen();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.city_id) {
            newErrors.city_id = "La ciudad es requerida";
        }
        if (!formData.branch_address || !formData.branch_address.trim()) {
            newErrors.branch_address = "La dirección es requerida";
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
                branch_name: formData.branch_name || null,
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

    return (
        <div className="branches-modal-overlay">
            <div className="branches-modal-backdrop" onClick={onClose}></div>
            <div className="branches-modal-container">
                <div className="branches-modal-content">
                    <div className="branches-modal-header">
                        <h3 className="branches-modal-title">
                            {isEditMode ? "Editar Sucursal" : "Nueva Sucursal"}
                        </h3>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="branches-form-group">
                            <label className="branches-form-label">
                                Nombre de Sucursal
                                <span className="text-gray-400 text-xs ml-1">(opcional)</span>
                            </label>
                            <input
                                type="text"
                                name="branch_name"
                                value={formData.branch_name}
                                onChange={handleChange}
                                placeholder="Ej. Sucursal Principal"
                                className="branches-form-input"
                            />
                        </div>

                        <div className="branches-form-group">
                            <label className="branches-form-label">
                                Ciudad
                                <span className="branches-form-required">*</span>
                            </label>
                            <select
                                name="city_id"
                                value={formData.city_id}
                                onChange={handleChange}
                                className="branches-form-select"
                                disabled={loadingCities}
                            >
                                <option value="">Seleccionar ciudad</option>
                                {cities.map((city) => (
                                    <option key={city.city_id} value={city.city_id}>
                                        {city.city_name}
                                    </option>
                                ))}
                            </select>
                            {errors.city_id && (
                                <p className="branches-form-error">{errors.city_id}</p>
                            )}
                        </div>

                        <div className="branches-form-group">
                            <label className="branches-form-label">
                                Dirección
                                <span className="branches-form-required">*</span>
                            </label>
                            <input
                                type="text"
                                name="branch_address"
                                value={formData.branch_address}
                                onChange={handleChange}
                                placeholder="Ej. Av. Principal 123"
                                className="branches-form-input"
                            />
                            {errors.branch_address && (
                                <p className="branches-form-error">{errors.branch_address}</p>
                            )}
                        </div>

                        {errors.submit && (
                            <p className="branches-form-error mb-4">{errors.submit}</p>
                        )}

                        <div className="branches-modal-footer">
                            <button
                                type="button"
                                onClick={onClose}
                                className="branches-modal-btn branches-modal-btn-secondary"
                                disabled={submitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="branches-modal-btn branches-modal-btn-primary"
                                disabled={submitting}
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