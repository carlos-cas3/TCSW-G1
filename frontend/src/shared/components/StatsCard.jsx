import "../styles/stats.css";

export default function StatsCard({ icon: Icon, label, value, color, loading }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  const iconClass = colorClasses[color] || colorClasses.blue;

  const displayValue =
    value === null ? "undefined" : value === undefined ? "sin datos" : value;

  return (
    <div className="stats-card">
      <div className="stats-card-body">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {loading ? (
            <div className="mt-2 space-y-2">
              <div className="h-7 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
            </div>
          ) : (
            <p className="text-2xl font-bold text-gray-900 mt-1">{displayValue}</p>
          )}
        </div>
        {!loading && Icon && (
          <div className={`stats-card-icon ${iconClass}`}>
            <Icon />
          </div>
        )}
      </div>
    </div>
  );
}
