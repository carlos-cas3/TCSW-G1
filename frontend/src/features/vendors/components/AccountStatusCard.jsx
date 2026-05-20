import { Percent, Calendar, Package } from "lucide-react";
import { STATUS_LABELS } from "../constants/vendorConstants";
import "../styles/status.css";
import "../styles/cards.css";

export default function AccountStatusCard({ data }) {
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
    const statusClass =
        status === "ACTIVE" ? "status-active" : "status-inactive";

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
                            <span className="status-stat-value">
                                {data.account?.commissionRate != null
                                    ? `${data.account.commissionRate}%`
                                    : "—"}
                            </span>
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