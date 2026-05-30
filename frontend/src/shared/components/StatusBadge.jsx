import { STATUS_COLORS, STATUS_LABELS } from "../utils/statusUtils";

export default function StatusBadge({ status, options }) {
  const colors = options?.colors || STATUS_COLORS;
  const labels = options?.labels || STATUS_LABELS;
  const palette = colors[status] || colors.INACTIVE;
  const label = labels[status] || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${palette.bg} ${palette.text} ${palette.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${palette.dot} mr-1.5`} />
      {label}
    </span>
  );
}
