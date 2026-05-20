import { getStatusColors, getStatusLabel } from "../utils/statusColors";

export default function BranchStatusBadge({ status }) {
    const colors = getStatusColors(status);
    const label = getStatusLabel(status);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mr-1.5`}></span>
            {label}
        </span>
    );
}