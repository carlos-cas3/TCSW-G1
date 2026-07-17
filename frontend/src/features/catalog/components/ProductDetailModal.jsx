import { useEffect } from "react";
import { X, Package, Building2, Tags, FileText, Calendar, Clock, DollarSign, Package2 } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS } from "../../../shared/utils/statusUtils";
import "../styles/modal.css";

export default function ProductDetailModal({ isOpen, product, onClose, showDates = true }) {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    const info = product.products || product;

    const status = product.status || info.product_status || "INACTIVE";
    const palette = STATUS_COLORS[status] || STATUS_COLORS.INACTIVE;
    const statusLabel = STATUS_LABELS[status] || status;

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString("es-PE", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const sectionClass = "bg-stone-50 rounded-lg p-4 space-y-3";
    const sectionTitleClass = "text-xs font-semibold text-stone-500 uppercase tracking-wider";
    const labelClass = "text-xs text-stone-400";
    const valueClass = "text-sm font-medium text-stone-800";

    return (
        <div className="catalog-modal-overlay">
            <div className="catalog-modal-backdrop animate-fade-in" onClick={onClose} />
            <div className="catalog-modal-container">
                <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-stone-100 p-6 animate-modal-enter">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-stone-900">
                                    {info.product_name}
                                </h2>
                                <p className="text-sm text-stone-400 mt-0.5">
                                    Detalle del producto
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className={sectionClass}>
                            <p className={sectionTitleClass}>Información General</p>
                            <div className="flex gap-4">
                                <img
                                    src={info.image_url || "https://placehold.co/80x80"}
                                    alt={info.product_name}
                                    className="w-20 h-20 rounded-lg object-cover border border-stone-200 shrink-0"
                                    onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80"; }}
                                />
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className={labelClass}>Marca</p>
                                            <p className={valueClass}>{info.product_brand || "—"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Tags className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className={labelClass}>Categoría</p>
                                            <p className={valueClass}>{info.categories?.category_name || "—"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(product.price != null || product.stock != null) && (
                            <div className={sectionClass}>
                                <p className={sectionTitleClass}>Precio y Stock</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.price != null && (
                                        <div className="flex items-start gap-3">
                                            <DollarSign className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className={labelClass}>Precio</p>
                                                <p className={valueClass}>S/ {product.price}</p>
                                            </div>
                                        </div>
                                    )}
                                    {product.stock != null && (
                                        <div className="flex items-start gap-3">
                                            <Package2 className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className={labelClass}>Stock</p>
                                                <p className={valueClass}>{product.stock} unidades</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={sectionClass}>
                            <p className={sectionTitleClass}>Estado</p>
                            <div className="flex items-start gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${palette.bg} ${palette.text} ${palette.border}`}>
                                    <span className={`w-2 h-2 rounded-full ${palette.dot}`} />
                                    {statusLabel}
                                </span>
                            </div>
                        </div>

                        {info.product_description && (
                            <div className={sectionClass}>
                                <p className={sectionTitleClass}>Descripción</p>
                                <div className="flex items-start gap-3">
                                    <FileText className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                    <p className={valueClass}>{info.product_description}</p>
                                </div>
                            </div>
                        )}

                        {showDates && (
                            <div className={sectionClass}>
                                <p className={sectionTitleClass}>Registro</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className={labelClass}>Fecha de Creación</p>
                                            <p className={valueClass}>{formatDate(info.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className={labelClass}>Última Actualización</p>
                                            <p className={valueClass}>{formatDateTime(info.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 shadow-sm shadow-blue-600/20"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
