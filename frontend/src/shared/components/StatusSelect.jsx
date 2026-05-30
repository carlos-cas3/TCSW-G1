import { STATUS_COLORS, STATUS_LABELS } from "../utils/statusUtils";

export default function StatusSelect({
  currentStatus,
  pendingStatus,
  onChange,
  disabled,
  options: statusOptions,
  optionsConfig,
}) {
  const colors = optionsConfig?.colors || STATUS_COLORS;
  const labels = optionsConfig?.labels || STATUS_LABELS;
  const items = statusOptions || Object.keys(colors);
  const displayStatus = pendingStatus ?? currentStatus;
  const palette = colors[displayStatus] || colors.ACTIVE;

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
