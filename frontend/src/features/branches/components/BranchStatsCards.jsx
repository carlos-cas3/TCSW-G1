import { Store, CircleCheck, CircleX, Settings } from "lucide-react";
import StatsGrid from "../../../shared/components/StatsGrid";

const STATS_CONFIG = [
  { label: "Total Sucursales", valueKey: "total", icon: Store, color: "blue" },
  { label: "Activas", valueKey: "active", icon: CircleCheck, color: "green" },
  { label: "Inactivas", valueKey: "inactive", icon: CircleX, color: "red" },
  { label: "En Mantenimiento", valueKey: "maintaining", icon: Settings, color: "yellow" },
];

export default function BranchStatsCards({ stats }) {
  const items = STATS_CONFIG.map(({ valueKey, ...rest }) => ({
    ...rest,
    value: stats[valueKey],
  }));

  return <StatsGrid stats={items} />;
}
