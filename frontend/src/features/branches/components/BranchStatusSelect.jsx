import { useState } from "react";
import { STATUS_OPTIONS, getStatusColors } from "../utils/statusColors";

export default function BranchStatusSelect({
    currentStatus,
    onChange,
    disabled,
}) {
    const [localStatus, setLocalStatus] = useState(currentStatus);

    const handleChange = (e) => {
        const newStatus = e.target.value;
        setLocalStatus(newStatus);
        onChange(newStatus);
    };

    const colors = getStatusColors(localStatus);

    return (
        <select
            value={localStatus}
            onChange={handleChange}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border ${colors.selectBg} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-colors cursor-pointer ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                    {status}
                </option>
            ))}
        </select>
    );
}