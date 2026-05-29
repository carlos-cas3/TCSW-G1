import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { getCategories } from "../services/catalog.service";
import CategoryCombobox from "./CategoryCombobox";
import "../styles/modal.css";

export default function AdminProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const isEditMode = !!editingProduct;
  const nameInputRef = useRef(null);
  const prevOpen = useRef(false);

  const getInitialFormData = () => ({
    category_id: editingProduct?.category_id?.toString() || "",
    product_name: editingProduct?.product_name || "",
    product_brand: editingProduct?.product_brand || "",
    product_description: editingProduct?.product_description || "",
    image_url: editingProduct?.image_url || "",
    product_status: editingProduct?.product_status || "ACTIVE",
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && !prevOpen.current) {
      setFormData({
        category_id: editingProduct?.category_id?.toString() || "",
        product_name: editingProduct?.product_name || "",
        product_brand: editingProduct?.product_brand || "",
        product_description: editingProduct?.product_description || "",
        image_url: editingProduct?.image_url || "",
        product_status: editingProduct?.product_status || "ACTIVE",
      });
      setErrors({});
      setSubmitting(false);
    }
    prevOpen.current = isOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      loadCategories();
    }
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

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.product_name || !formData.product_name.trim()) {
      newErrors.product_name = "El nombre del producto es obligatorio";
    }
    if (!formData.product_brand || !formData.product_brand.trim()) {
      newErrors.product_brand = "La marca es obligatoria";
    }
    if (!formData.category_id) {
      newErrors.category_id = "Selecciona una categoría";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        category_id: Number(formData.category_id),
        product_name: formData.product_name.trim(),
        product_brand: formData.product_brand.trim(),
        product_description: formData.product_description.trim(),
        image_url: formData.image_url.trim(),
        product_status: formData.product_status,
      });
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || "Error al guardar el producto" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const sharedInput =
    "w-full px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg transition-all duration-150 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-stone-300";
  const labelClass = "block text-sm font-medium text-stone-700 mb-1.5";

  return (
    <div className="catalog-modal-overlay">
      <div className="catalog-modal-backdrop animate-fade-in" onClick={onClose} />
      <div className="catalog-modal-container">
        <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-stone-100 p-6 animate-modal-enter">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-stone-900">
                {isEditMode ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <p className="text-sm text-stone-400 mt-0.5">
                {isEditMode ? "Modifica los datos del producto" : "Agrega un nuevo producto al catálogo"}
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
                  Nombre <span className="text-red-400">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  placeholder="Ej. Laptop Pro X"
                  className={sharedInput}
                />
                {errors.product_name && (
                  <p className="catalog-form-error">{errors.product_name}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Marca <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="product_brand"
                  value={formData.product_brand}
                  onChange={handleChange}
                  placeholder="Ej. TechBrand"
                  className={sharedInput}
                />
                {errors.product_brand && (
                  <p className="catalog-form-error">{errors.product_brand}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Categoría <span className="text-red-400">*</span>
                </label>
                <CategoryCombobox
                  categories={categories}
                  value={formData.category_id}
                  onChange={handleChange}
                  disabled={loadingCategories}
                  error={errors.category_id}
                />
                {errors.category_id && (
                  <p className="catalog-form-error">{errors.category_id}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Estado</label>
                <select
                  name="product_status"
                  value={formData.product_status}
                  onChange={handleChange}
                  className={sharedInput}
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Descripción</label>
              <textarea
                name="product_description"
                value={formData.product_description}
                onChange={handleChange}
                placeholder="Describe el producto..."
                rows={3}
                className={`${sharedInput} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>URL de Imagen</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className={sharedInput}
              />
            </div>

            {formData.image_url && (
              <div className="border border-stone-200 rounded-lg p-3 bg-stone-50">
                <p className="text-xs text-stone-500 mb-2">Vista previa</p>
                <img
                  src={formData.image_url}
                  alt="preview"
                  className="w-20 h-20 rounded-lg object-cover border border-stone-200"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/100x100";
                  }}
                />
              </div>
            )}

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
