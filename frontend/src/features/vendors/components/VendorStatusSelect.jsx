import { VENDOR_STATUS, VENDOR_STATUS_LABELS, VENDOR_STATUS_COLORS } from '../constants/vendorConstants';
import '../styles/shared.css';

export default function VendorStatusSelect({ currentStatus, onChange }) {
    const statusColor = VENDOR_STATUS_COLORS[currentStatus] || 'bg-gray-100 text-gray-800';

    return (
        <select
            value={currentStatus}
            onChange={(e) => onChange(e.target.value)}
            className={`vendors-status-badge ${statusColor}`}
        >
            {Object.values(VENDOR_STATUS).map(status => (
                <option key={status} value={status}>
                    {VENDOR_STATUS_LABELS[status]}
                </option>
            ))}
        </select>
    );
}