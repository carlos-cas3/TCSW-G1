import ReactDOM from "react-dom";
import { useRef, useEffect } from "react";

export default function VendorConfirmModal({ isOpen, onClose, onConfirm, vendorName, currentStatus, newStatus, isLoading }) {
    const ref = useRef(document.createElement("div"));

    useEffect(() => {
        document.body.appendChild(ref.current);
        return () => {
            document.body.removeChild(ref.current);
        };
    }, []);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    ¿Confirmar cambio de estado?
                </h2>
                <p className="text-gray-600 mb-6">
                    Estás a punto de cambiar el estado de <strong>{vendorName}</strong> de <strong>{currentStatus}</strong> a <strong>{newStatus}</strong>. ¿Deseas continuar?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? "Procesando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>,
        ref.current
    );
}