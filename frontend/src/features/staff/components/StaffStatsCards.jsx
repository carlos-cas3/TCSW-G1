import StatsGrid from "../../../shared/components/StatsGrid";
import { STATS_CONFIG } from "../constants/staffConstants";

export default function StaffStatsCards({ stats }) {
  const items = STATS_CONFIG.map(({ valueKey, ...rest }) => ({
    ...rest,
    value: stats[valueKey],
  }));

  return <StatsGrid stats={items} />;
}
