import { useState } from "react";
import "../styles/cards.css";

export default function CommissionCard({ commission, onSave }) {
    const [rate, setRate] = useState(() =>
        commission?.commission_rate != null
            ? Math.round(commission.commission_rate * 100)
            : 0
    );
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        const val = parseFloat(e.target.value);
        if (isNaN(val)) {
            setRate(0);
        } else if (val < 0) {
            setRate(0);
        } else if (val > 100) {
            setRate(100);
        } else {
            setRate(val);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        const result = await onSave(rate / 100);
        if (result.success) {
            setMessage({ type: "success", text: "Comisión actualizada correctamente" });
        } else {
            setMessage({ type: "error", text: result.error || "Error al guardar la comisión" });
        }
        setSaving(false);
    };

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">Comisión</h2>
            </div>
            <div className="seller-card-body">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">
                        Tasa de comisión
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={rate}
                            onChange={handleChange}
                            className="w-24 h-11 px-4 rounded-xl border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-center text-lg font-semibold"
                        />
                        <span className="text-lg font-semibold text-gray-700">%</span>
                    </div>
                    <p className="text-xs text-gray-500">0% mínimo — 100% máximo</p>

                    {message && (
                        <p className={`text-sm mt-1 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                            {message.text}
                        </p>
                    )}

                    <div className="mt-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
