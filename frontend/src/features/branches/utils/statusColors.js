export const STATUS_COLORS = {
    ACTIVE: {
        bg: "bg-green-50",
        text: "text-green-700",
        dot: "bg-green-500",
        border: "border-green-200",
        selectBg: "bg-green-100 text-green-800 border-green-200",
    },
    INACTIVE: {
        bg: "bg-gray-50",
        text: "text-gray-600",
        dot: "bg-gray-400",
        border: "border-gray-200",
        selectBg: "bg-gray-100 text-gray-800 border-gray-200",
    },
    MAINTENANCE: {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",
        border: "border-red-200",
        selectBg: "bg-red-100 text-red-800 border-red-200",
    },
};

export const STATUS_LABELS = {
    ACTIVE: "Activo",
    INACTIVE: "Inactiva",
    MAINTENANCE: "En mantenimiento",
};

export const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "MAINTENANCE"];

export const getStatusColors = (status) =>
    STATUS_COLORS[status] || STATUS_COLORS.INACTIVE;

export const getStatusLabel = (status) =>
    STATUS_LABELS[status] || status;