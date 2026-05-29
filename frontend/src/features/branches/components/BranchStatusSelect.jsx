import { STATUS_OPTIONS, getStatusColors, getStatusLabel } from "../utils/statusColors";

export default function BranchStatusSelect({
    currentStatus,
    pendingStatus,
    onChange,
    disabled,
}) {
    const displayStatus = pendingStatus ?? currentStatus;
    const colors = getStatusColors(displayStatus);

    return (
        <select
            value={displayStatus}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border ${colors.selectBg} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-colors cursor-pointer ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {STATUS_OPTIONS.filter((s) => s !== "INACTIVE").map((status) => (
                <option key={status} value={status}>
                    {getStatusLabel(status)}
                </option>
            ))}
        </select>
    );
}
