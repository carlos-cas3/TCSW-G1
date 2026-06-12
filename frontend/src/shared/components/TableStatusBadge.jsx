import { STATUS_COLORS, STATUS_LABELS } from "../utils/statusUtils";

const SIZE_STYLES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
};

export default function TableStatusBadge({ status, mapping, size = "md" }) {
  const colors = mapping?.colors || STATUS_COLORS;
  const labels = mapping?.labels || STATUS_LABELS;
  const palette = colors[status] || colors.INACTIVE;
  const label = labels[status] ?? status;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${SIZE_STYLES[size]} ${palette.bg} ${palette.text} ${palette.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${palette.dot} mr-1.5`} />
      {label}
    </span>
  );
}
