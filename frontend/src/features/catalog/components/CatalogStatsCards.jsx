import { Package, CircleCheckBig, CircleX } from "lucide-react";
import StatsGrid from "../../../shared/components/StatsGrid";

const STATS_CONFIG = [
  { label: "Total Productos", valueKey: "total", icon: Package, color: "blue" },
  { label: "Activos", valueKey: "active", icon: CircleCheckBig, color: "green" },
  { label: "Inactivos", valueKey: "inactive", icon: CircleX, color: "red" },
];

export default function CatalogStatsCards({ stats }) {
  const items = STATS_CONFIG.map(({ valueKey, ...rest }) => ({
    ...rest,
    value: stats[valueKey],
  }));

  return <StatsGrid stats={items} />;
}
