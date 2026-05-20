import { AlertTriangle } from "lucide-react";

export default function BranchConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    branchName,
    currentStatus,
    newStatus,
    isLoading,
    mode = "status",
}) {
    if (!isOpen) return null;

    const isDeleteMode = mode === "delete";

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={onClose}
                ></div>

                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-full ${isDeleteMode ? "bg-red-100" : "bg-yellow-100"}`}>
                            <AlertTriangle className={`w-6 h-6 ${isDeleteMode ? "text-red-600" : "text-yellow-600"}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {isDeleteMode ? "Confirmar eliminación" : "Confirmar cambio de estado"}
                            </h3>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">
                        {isDeleteMode ? (
                            <>
                                ¿Estás seguro de que deseas eliminar la sucursal{" "}
                                <strong className="text-gray-900">{branchName}</strong>?
                                <br />
                                <span className="text-sm text-gray-500">
                                    La sucursal será marcada como inactiva.
                                </span>
                            </>
                        ) : (
                            <>
                                ¿Cambiar el estado de{" "}
                                <strong className="text-gray-900">{branchName}</strong> de{" "}
                                <strong>{currentStatus}</strong> a <strong>{newStatus}</strong>?
                            </>
                        )}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 ${
                                isDeleteMode
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isLoading ? "Procesando..." : isDeleteMode ? "Eliminar" : "Confirmar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}