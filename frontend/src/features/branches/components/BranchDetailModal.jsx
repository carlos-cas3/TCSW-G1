import { useEffect } from "react";
import { X, Building2, User, MapPin, Building, Calendar, Clock } from "lucide-react";
import StatusBadge from "../../../shared/table/components/StatusBadge";
import { STATUS_LABELS } from "../../../shared/utils/statusUtils";
import "../styles/modal.css";

export default function BranchDetailModal({ isOpen, branch, onClose }) {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    if (!isOpen || !branch) return null;

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
        <div className="branches-modal-overlay">
            <div className="branches-modal-backdrop animate-fade-in" onClick={onClose} />
            <div className="branches-modal-container">
                <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border border-stone-100 p-6 animate-modal-enter">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-stone-900">
                                    {branch.branch_name}
                                </h2>
                                <p className="text-sm text-stone-400 mt-0.5">
                                    Detalle de la sucursal
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className={labelClass}>Vendedor</p>
                                        <p className={valueClass}>{branch.vendor_name || "—"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Building className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className={labelClass}>Ciudad</p>
                                        <p className={valueClass}>{branch.cities?.city_name || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={sectionClass}>
                            <p className={sectionTitleClass}>Ubicación</p>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className={labelClass}>Dirección</p>
                                    <p className={valueClass}>{branch.branch_address || "—"}</p>
                                </div>
                            </div>
                        </div>

                        <div className={sectionClass}>
                            <p className={sectionTitleClass}>Estado y Registro</p>
                            <div className="flex items-start gap-3">
                                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-stone-400" />
                                </div>
                                <div>
                                    <p className={labelClass}>Estado</p>
                                    <StatusBadge status={branch.branch_status} options={{ labels: STATUS_LABELS }} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className={labelClass}>Fecha de Creación</p>
                                        <p className={valueClass}>{formatDate(branch.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className={labelClass}>Última Actualización</p>
                                        <p className={valueClass}>{formatDateTime(branch.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
