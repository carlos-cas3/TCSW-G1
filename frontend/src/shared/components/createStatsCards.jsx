import StatsGrid from "./StatsGrid";

export default function createStatsCards(config) {
  return function StatsCards({ stats }) {
    const items = config.map(({ valueKey, ...rest }) => ({
      ...rest,
      value: stats[valueKey],
    }));
    return <StatsGrid stats={items} />;
  };
};
