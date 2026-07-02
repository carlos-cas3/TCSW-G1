import StatsCard from "./StatsCard";
import "../styles/stats.css";

export default function StatsGrid({ stats, loading }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <StatsCard key={i} {...stat} loading={loading} />
      ))}
    </div>
  );
}
