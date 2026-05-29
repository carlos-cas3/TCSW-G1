import { useEffect, useMemo, useState, useRef } from "react";
import { X } from "lucide-react";
import { getProducts } from "../services/catalog.service";
import ProductCombobox from "./ProductCombobox";
import "../styles/modal.css";

export default function VendorProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const isEditMode = !!editingProduct;
  const priceInputRef = useRef(null);
  const prevOpen = useRef(false);

  const getInitialFormData = () => ({
    product_id: editingProduct?.product_id?.toString() || "",
    price: editingProduct?.price?.toString() || "",
    stock: editingProduct?.stock?.toString() || "",
    status: editingProduct?.status || "ACTIVE",
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && !prevOpen.current) {
      setFormData({
        product_id: editingProduct?.product_id?.toString() || "",
        price: editingProduct?.price?.toString() || "",
        stock: editingProduct?.stock?.toString() || "",
        status: editingProduct?.status || "ACTIVE",
      });
      setErrors({});
      setSubmitting(false);
      setCategoryFilter("ALL");
    }
    prevOpen.current = isOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && products.length === 0) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isEditMode) {
      const timer = setTimeout(() => priceInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isEditMode]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const selectedProduct = useMemo(
    () => products.find((p) => p.product_id?.toString() === formData.product_id),
    [products, formData.product_id]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const validate = () => {
    const newErrors = {};
    if (!isEditMode && !formData.product_id) {
      newErrors.product_id = "Selecciona un producto";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Ingresa un precio válido mayor a 0";
    }
    if (formData.stock === "" || Number(formData.stock) < 0) {
      newErrors.stock = "Ingresa un stock válido (0 o más)";
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
        product_id: Number(formData.product_id),
        price: Number(formData.price),
        stock: Number(formData.stock),
        status: formData.status,
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
                {isEditMode ? "Editar Producto" : "Agregar Producto"}
              </h2>
              <p className="text-sm text-stone-400 mt-0.5">
                {isEditMode
                  ? "Modifica el precio y stock del producto"
                  : "Selecciona un producto y asigna precio y stock"}
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
            {!isEditMode && (
              <>
                <div>
                  <label className={labelClass}>
                    Producto <span className="text-red-400">*</span>
                  </label>
                  <ProductCombobox
                    products={products}
                    categoryFilter={categoryFilter}
                    onCategoryChange={handleCategoryChange}
                    value={formData.product_id}
                    onChange={handleChange}
                    disabled={loadingProducts}
                    error={errors.product_id}
                  />
                  {errors.product_id && (
                    <p className="catalog-form-error">{errors.product_id}</p>
                  )}
                </div>

                {selectedProduct && (
                  <div className="border border-stone-200 rounded-lg p-3 bg-stone-50 flex gap-3 items-center">
                    <img
                      src={selectedProduct.image_url || "https://placehold.co/60x60"}
                      alt={selectedProduct.product_name}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/60x60";
                      }}
                    />
                    <div>
                      <p className="font-medium text-sm text-stone-900">
                        {selectedProduct.product_name}
                      </p>
                      <p className="text-xs text-stone-400">
                        {selectedProduct.product_brand}
                        {selectedProduct.categories?.category_name && (
                          <> · {selectedProduct.categories.category_name}</>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Precio (S/) <span className="text-red-400">*</span>
                </label>
                <input
                  ref={!isEditMode ? priceInputRef : undefined}
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={sharedInput}
                />
                {errors.price && (
                  <p className="catalog-form-error">{errors.price}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Stock <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={sharedInput}
                />
                {errors.stock && (
                  <p className="catalog-form-error">{errors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={sharedInput}
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
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
                    : "Agregando..."
                  : isEditMode
                  ? "Guardar"
                  : "Agregar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
