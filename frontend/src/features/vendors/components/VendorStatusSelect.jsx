import { useState } from "react";

const STATUS_OPTIONS = ["PENDING", "ACTIVE", "INACTIVE", "SUSPENDED"];

const STATUS_COLORS = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
    SUSPENDED: "bg-red-100 text-red-800 border-red-200",
};

export default function VendorStatusSelect({
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

    const colorClass = STATUS_COLORS[localStatus] || STATUS_COLORS.PENDING;

    return (
        <select
            value={localStatus}
            onChange={handleChange}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border ${colorClass} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 transition-colors cursor-pointer ${
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