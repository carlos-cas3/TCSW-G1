import StatusBadge from "./StatusBadge";
import { STATUS_COLORS, STATUS_LABELS } from "../../utils/statusUtils";

export default function StatusDropdown({
  value,
  pendingValue,
  onChange,
  disabled,
  options: statusOptions,
  labels: customLabels,
  variant = "dropdown",
}) {
  const colors = STATUS_COLORS;
  const labels = customLabels || STATUS_LABELS;
  const items = statusOptions || Object.keys(colors);
  const displayStatus = pendingValue ?? value;
  const palette = colors[displayStatus] || colors.ACTIVE;

  if (variant === "badge") {
    return <StatusBadge status={value} options={{ labels }} />;
  }

  return (
    <select
      value={displayStatus}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-md text-sm font-medium border ${palette.selectBg} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-colors cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {items.map((status) => (
        <option key={status} value={status}>
          {labels[status] || status}
        </option>
      ))}
    </select>
  );
}
