import StatsGrid from "./StatsGrid";

export default function createStatsCards(config) {
  return function StatsCards({ stats, loading }) {
    const items = config.map(({ valueKey, ...rest }) => ({
      ...rest,
      value: stats === undefined ? null : stats[valueKey],
    }));
    return <StatsGrid stats={items} loading={loading} />;
  };
};
