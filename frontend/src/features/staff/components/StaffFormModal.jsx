import { useState, useCallback, useRef, useEffect } from "react";
import { X, AtSign, Loader2, Check } from "lucide-react";
import { ROLE_OPTIONS } from "../constants/staffConstants";

const getInitialForm = (staff) => ({
  first_name: staff?.first_name || "",
  last_name: staff?.last_name || "",
  email: staff?.email || "",
  personal_phone: staff?.personal_phone || "",
  role_id: staff?.role_id || 3,
});

const formatPhone = (value) => {
  const d = value.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
};

export default function StaffFormModal({ isOpen, onClose, onSubmit, onUpdate, staff }) {
  const isEditMode = !!staff;
  const modalRef = useRef(null);
  const [formData, setFormData] = useState(getInitialForm(staff));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(getInitialForm(staff));
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen, staff]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        modalRef.current?.querySelector("input")?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.first_name.trim()) errs.first_name = "El nombre es requerido";
    if (!formData.last_name.trim()) errs.last_name = "Los apellidos son requeridos";
    if (!formData.email.trim()) {
      errs.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Formato de email inválido";
    }
    if (!formData.personal_phone.trim()) errs.personal_phone = "El teléfono es requerido";
    if (!formData.role_id) errs.role_id = "Selecciona un rol";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...formData,
        personal_phone: formData.personal_phone.replace(/\s/g, ""),
      };
      if (isEditMode) {
        await onUpdate(staff.staff_id, payload);
      } else {
        await onSubmit(payload);
      }
      onClose();
    } catch (err) {
      setSubmitError(err.message || "Error al guardar miembro");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const renderField = (name, label, placeholder, opts = {}) => {
    const isError = !!errors[name];
    const { type = "text", inputMode, autoComplete } = opts;
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
            isError
              ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          }`}
          placeholder={placeholder}
        />
        {isError && <p className="text-sm text-red-600">{errors[name]}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleOverlayClick} />
        <div
          ref={modalRef}
          className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-modalSlideIn"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? "Editar Miembro" : "Agregar Miembro"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("first_name", "Nombres", "Juan", { autoComplete: "given-name" })}
              {renderField("last_name", "Apellidos", "Pérez", { autoComplete: "family-name" })}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                    errors.email
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  }`}
                  placeholder="juan@email.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Teléfono</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-semibold text-indigo-600 bg-indigo-50 border-r border-indigo-200 pr-3 rounded-l-lg pointer-events-none z-10">
                  +51
                </span>
                <input
                  type="tel"
                  name="personal_phone"
                  value={formatPhone(formData.personal_phone)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
                    handleChange({ target: { name: "personal_phone", value: raw } });
                  }}
                  className={`w-full pl-16 pr-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                    errors.personal_phone
                      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-gray-300 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  }`}
                  placeholder="999 888 777"
                  autoComplete="tel"
                  inputMode="numeric"
                />
              </div>
              {errors.personal_phone && <p className="text-sm text-red-600">{errors.personal_phone}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Rol</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                  errors.role_id
                    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                }`}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.role_id && <p className="text-sm text-red-600">{errors.role_id}</p>}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {submitting
                  ? isEditMode
                    ? "Guardando..."
                    : "Creando..."
                  : isEditMode
                  ? "Guardar"
                  : "Agregar"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modalSlideIn { animation: modalSlideIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
