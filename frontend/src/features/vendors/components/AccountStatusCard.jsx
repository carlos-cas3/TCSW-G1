import { useState } from "react";
import { Percent, Calendar, Package } from "lucide-react";
import { STATUS_LABELS } from "../constants/vendorConstants";
import "../styles/status.css";
import "../styles/cards.css";

export default function AccountStatusCard({ data, commission, onSaveCommission }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const date = new Date(dateStr);
        return date.toLocaleDateString("es-PE", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const status = data.account?.status;
    const statusLabel = STATUS_LABELS[status] || "Desconocido";
    const statusClassMap = {
        ACTIVE: "status-active",
        PENDING: "status-pending",
        INACTIVE: "status-inactive",
        SUSPENDED: "status-suspended",
    };
    const statusClass = statusClassMap[status] || "status-inactive";

    const isEditable = typeof onSaveCommission === "function";

    const [commRate, setCommRate] = useState(() =>
        commission?.commission_rate != null
            ? Math.round(commission.commission_rate * 100)
            : 0
    );
    const [commSaving, setCommSaving] = useState(false);
    const [commMessage, setCommMessage] = useState(null);

    const handleSaveCommission = async () => {
        setCommSaving(true);
        setCommMessage(null);
        const result = await onSaveCommission(commRate / 100);
        setCommMessage(
            result.success
                ? { type: "success", text: "Comisión actualizada" }
                : { type: "error", text: result.error || "Error al guardar" }
        );
        setCommSaving(false);
    };

    const commissionDisplay =
        commission?.commission_rate != null
            ? `${(commission.commission_rate * 100).toFixed(0)}%`
            : data.account?.commissionRate != null
              ? `${data.account.commissionRate}%`
              : "—";

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">Estado de Cuenta</h2>
            </div>
            <div className="seller-card-body">
                <div className="flex items-center gap-3 mb-5">
                    <span className={`status-badge ${statusClass}`}>
                        {statusLabel}
                    </span>
                </div>
                <div className="status-stats">
                    <div className="status-stat-item">
                        <div className="status-stat-icon">
                            <Percent className="w-5 h-5" />
                        </div>
                        <div className="status-stat-content">
                            <span className="status-stat-label">Comisión</span>
                            {isEditable ? (
                                <div className="flex flex-col gap-1 mt-1">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={commRate}
                                            onChange={(e) => setCommRate(parseFloat(e.target.value) || 0)}
                                            className="w-20 h-8 px-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center font-semibold"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">%</span>
                                        <button
                                            onClick={handleSaveCommission}
                                            disabled={commSaving}
                                            className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {commSaving ? "..." : "Guardar"}
                                        </button>
                                    </div>
                                    {commMessage && (
                                        <span className={`text-xs ${commMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                                            {commMessage.text}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="status-stat-value">
                                    {commissionDisplay}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="status-stat-item">
                        <div className="status-stat-icon">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="status-stat-content">
                            <span className="status-stat-label">
                                Miembro desde
                            </span>
                            <span className="status-stat-value">
                                {formatDate(data.account?.memberSince)}
                            </span>
                        </div>
                    </div>
                    <div className="status-stat-item">
                        <div className="status-stat-icon">
                            <Package className="w-5 h-5" />
                        </div>
                        <div className="status-stat-content">
                            <span className="status-stat-label">Productos</span>
                            <span className="status-stat-value">
                                {data.account?.totalProducts ?? "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
