import { Store, CircleCheck, Clock, Ban } from "lucide-react";
import StatsGrid from "../../../shared/components/StatsGrid";

const STATS_CONFIG = [
  { label: "Total Vendedores", valueKey: "total", icon: Store, color: "blue" },
  { label: "Activos", valueKey: "active", icon: CircleCheck, color: "green" },
  { label: "Pendientes", valueKey: "pending", icon: Clock, color: "yellow" },
  { label: "Suspendidos", valueKey: "suspended", icon: Ban, color: "red" },
];

export default function VendorStatsCards({ stats }) {
  const items = STATS_CONFIG.map(({ valueKey, ...rest }) => ({
    ...rest,
    value: stats[valueKey],
  }));

  return <StatsGrid stats={items} />;
}
