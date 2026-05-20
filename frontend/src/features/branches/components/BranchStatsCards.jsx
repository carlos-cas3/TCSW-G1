import { Store, CircleCheck, CircleX, Settings } from "lucide-react";
import "../styles/stats.css";

const STATS_CONFIG = [
    { label: "Total Sucursales", key: "total", icon: Store, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Activas", key: "active", icon: CircleCheck, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { label: "Inactivas", key: "inactive", icon: CircleX, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
    { label: "En Mantenimiento", key: "maintaining", icon: Settings, iconBg: "bg-red-100", iconColor: "text-red-600" },
];

export default function BranchStatsCards({ stats }) {
    return (
        <div className="branches-stats-grid">
            {STATS_CONFIG.map(({ label, key, icon: Icon, iconBg, iconColor }) => (
                <div key={key} className="branches-stats-card">
                    <div className="branches-stats-card-body">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats[key]}</p>
                        </div>
                        <div className={`branches-stats-card-icon ${iconBg}`}>
                            <Icon className={iconColor} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}