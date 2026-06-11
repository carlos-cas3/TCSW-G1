import { useCallback, useRef, useEffect } from "react";
import {
    X,
    ChevronLeft,
    ChevronRight,
    Check,
    AtSign,
    Loader2,
} from "lucide-react";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { STEPS, SPORTS_CATEGORIES } from "../constants/register.constants";

const formatPhone = (value) => {
    const d = value.replace(/\D/g, "");
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
    return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
};

const formatRuc = (value) => {
    const d = value.replace(/\D/g, "");
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)} ${d.slice(2, 11)}`;
};

export default function CreateVendorModal({ isOpen, onClose, onSuccess }) {
    const modalRef = useRef(null);

    const handleSuccess = useCallback(
        (response) => {
            onSuccess?.(response);
        },
        [onSuccess],
    );

    const {
        currentStep,
        formData,
        selectedCategories,
        errors,
        touched,
        submitError,
        submitting,
        handleInputChange,
        handleFieldBlur,
        handleCategoryToggle,
        handleNext,
        handlePrev,
        handleSubmit,
        resetForm,
    } = useRegisterForm({ onSuccess: handleSuccess });

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                modalRef.current?.querySelector("input")?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, currentStep]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                const activeTag = document.activeElement?.tagName;
                if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
                    e.preventDefault();
                    if (currentStep < STEPS.length) {
                        handleNext();
                    } else {
                        handleSubmit();
                    }
                }
            }
            if (e.key === "Escape") {
                onClose();
            }
        },
        [currentStep, handleNext, handleSubmit, onClose],
    );

    if (!isOpen) return null;

    const showError = (field) => errors[field] && touched[field];

    const renderPhoneField = () => {
        const isError = showError("personal_phone");
        return (
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
                        onBlur={() => handleFieldBlur("personal_phone")}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
                            handleInputChange({ target: { name: "personal_phone", value: raw } });
                        }}
                        className={`w-full pl-16 pr-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                            isError
                                ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-gray-300 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        }`}
                        placeholder="999 888 777"
                        autoComplete="tel"
                        inputMode="numeric"
                    />
                </div>
                {isError && <p className="text-sm text-red-600">{errors.personal_phone}</p>}
            </div>
        );
    };

    const renderEmailField = () => {
        const isError = showError("email");
        return (
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onBlur={() => handleFieldBlur("email")}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                            isError
                                ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-gray-300 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        }`}
                        placeholder="juan@email.com"
                        autoComplete="email"
                    />
                </div>
                {isError && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>
        );
    };

    const renderTextField = (name, label, placeholder, opts = {}) => {
        const isError = showError(name);
        const { fullWidth, autoComplete } = opts;
        return (
            <div className={`space-y-1.5 ${fullWidth ? "col-span-2" : ""}`} key={name}>
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onBlur={() => handleFieldBlur(name)}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                        isError
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-gray-300 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    }`}
                    placeholder={placeholder}
                    autoComplete={autoComplete || "off"}
                />
                {isError && <p className="text-sm text-red-600">{errors[name]}</p>}
            </div>
        );
    };

    const renderRucField = () => {
        const isError = showError("ruc");
        return (
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">RUC</label>
                <input
                    type="text"
                    name="ruc"
                    value={formatRuc(formData.ruc)}
                    onBlur={() => handleFieldBlur("ruc")}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
                        if (raw.length >= 2 && raw.slice(0, 2) !== "10" && raw.slice(0, 2) !== "20") return;
                        handleInputChange({ target: { name: "ruc", value: raw } });
                    }}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
                        isError
                            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-gray-300 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    }`}
                    placeholder="20 123456789"
                    autoComplete="off"
                    inputMode="numeric"
                />
                <p className="text-xs text-gray-400">Debe empezar con 10 o 20</p>
                {isError && <p className="text-sm text-red-600">{errors.ruc}</p>}
            </div>
        );
    };

    const renderCategories = () => {
        const isError = showError("categories");
        return (
            <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-gray-700">Categoría(s) deportiva(s)</label>
                <div className="flex flex-wrap gap-2">
                    {SPORTS_CATEGORIES.map((category) => {
                        const isSelected = selectedCategories.includes(category.id);
                        return (
                            <label
                                key={category.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all select-none ${
                                    isSelected
                                        ? "bg-indigo-50 border-indigo-300 shadow-sm"
                                        : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded accent-indigo-600"
                                    checked={isSelected}
                                    onChange={() => handleCategoryToggle(category.id)}
                                />
                                <span className="text-lg leading-none">{category.icon}</span>
                                <span className={`text-sm font-medium ${isSelected ? "text-indigo-700" : "text-gray-600"}`}>
                                    {category.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
                {isError && <p className="text-sm text-red-600">{errors.categories}</p>}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" onKeyDown={handleKeyDown}>
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleOverlayClick} />

                <div
                    ref={modalRef}
                    className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modalSlideIn"
                >
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Crear Vendedor</h2>
                            <p className="text-sm text-gray-500">
                                Paso {currentStep} de {STEPS.length}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-center gap-0">
                            {STEPS.map((step, index) => {
                                const isCompleted = currentStep > step.id;
                                const isActive = currentStep === step.id;
                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                                    isCompleted
                                                        ? "bg-green-500 text-white"
                                                        : isActive
                                                        ? "bg-indigo-600 text-white ring-2 ring-indigo-200"
                                                        : "bg-gray-200 text-gray-500"
                                                }`}
                                            >
                                                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                                            </div>
                                            <span
                                                className={`text-sm font-medium hidden sm:inline ${
                                                    isCompleted
                                                        ? "text-green-600"
                                                        : isActive
                                                        ? "text-indigo-700"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {step.title}
                                            </span>
                                        </div>
                                        {index < STEPS.length - 1 && (
                                            <div
                                                className={`w-12 sm:w-20 h-0.5 mx-2 rounded ${
                                                    isCompleted ? "bg-green-400" : "bg-gray-200"
                                                }`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        {submitError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{submitError}</p>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {renderTextField("firstName", "Nombres", "Juan", { autoComplete: "given-name" })}
                                {renderTextField("lastName", "Apellidos", "Pérez", { autoComplete: "family-name" })}
                                {renderEmailField()}
                                {renderPhoneField()}
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {renderTextField("company", "Nombre de la Empresa", "Deportes Perú S.A.C.", {
                                    fullWidth: false,
                                    autoComplete: "organization",
                                })}
                                {renderRucField()}
                                {renderTextField("address", "Dirección", "Av. Principal 123, Lima", {
                                    fullWidth: true,
                                    autoComplete: "street-address",
                                })}
                                {renderCategories()}
                            </div>
                        )}
                    </div>

                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3">
                        <div>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Anterior
                                </button>
                            )}
                        </div>
                        <div>
                            {currentStep < STEPS.length ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
                                >
                                    Siguiente
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    {submitting ? "Creando..." : "Crear Vendedor"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-modalSlideIn {
                    animation: modalSlideIn 0.25s ease-out;
                }
            `}</style>
        </div>
    );
}
