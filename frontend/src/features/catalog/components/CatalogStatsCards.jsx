import { Package, CircleCheckBig, CircleX } from "lucide-react";
import "../styles/stats.css";

const STATS_CONFIG = [
  { label: "Total Productos", key: "total", icon: Package, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { label: "Activos", key: "active", icon: CircleCheckBig, iconBg: "bg-green-100", iconColor: "text-green-600" },
  { label: "Inactivos", key: "inactive", icon: CircleX, iconBg: "bg-red-100", iconColor: "text-red-600" },
];

export default function CatalogStatsCards({ stats }) {
  return (
    <div className="catalog-stats-grid">
      {STATS_CONFIG.map(({ label, key, icon: Icon, iconBg, iconColor }) => (
        <div key={key} className="catalog-stats-card">
          <div className="catalog-stats-card-body">
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats[key]}</p>
            </div>
            <div className={`catalog-stats-card-icon ${iconBg}`}>
              <Icon className={iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
