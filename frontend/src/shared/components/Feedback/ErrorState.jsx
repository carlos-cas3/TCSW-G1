import { AlertCircle, RefreshCw } from "lucide-react";
import { normalizeError } from "../../utils/normalizeError";

const typeStyles = {
    network: "border-red-200 bg-red-50",
    auth: "border-orange-200 bg-orange-50",
    server: "border-red-200 bg-red-50",
    unknown: "border-gray-200 bg-gray-50",
};

const typeIconStyles = {
    network: "text-red-500",
    auth: "text-orange-500",
    server: "text-red-500",
    unknown: "text-gray-400",
};

export default function ErrorState({ error, onRetry }) {
    const normalized = error?.title ? error : normalizeError(error);

    const containerClass = typeStyles[normalized.type] || typeStyles.unknown;
    const iconClass = typeIconStyles[normalized.type] || typeIconStyles.unknown;

    return (
        <div className={`rounded-lg border p-5 ${containerClass}`}>
            <div className="flex items-start gap-3">
                <AlertCircle size={20} className={`mt-0.5 flex-shrink-0 ${iconClass}`} />
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {normalized.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {normalized.description}
                    </p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
                    >
                        <RefreshCw size={14} />
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    );
}
