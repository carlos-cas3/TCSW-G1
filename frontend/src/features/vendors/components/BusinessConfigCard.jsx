import { CreditCard, Building2, Banknote, Smartphone, Check } from "lucide-react";
import "../styles/business.css";
import "../styles/cards.css";

const METHOD_ICONS = {
    5: CreditCard,
    6: Building2,
    8: Smartphone,
};

const getMethodIcon = (methodId) => METHOD_ICONS[methodId] || Banknote;

const DEFAULT_PAYMENT_METHODS = [
    { payment_method_id: 5, payment_method_name: "Tarjeta de Crédito / Débito" },
    { payment_method_id: 6, payment_method_name: "Transferencia Bancaria" },
    { payment_method_id: 8, payment_method_name: "Yape / Plin" },
];

export default function BusinessConfigCard({ paymentMethods, selectedIds, onToggle, readOnly = false }) {
    const methods = paymentMethods?.length > 0 ? paymentMethods : DEFAULT_PAYMENT_METHODS;

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">Configuración Comercial</h2>
            </div>
            <div className="seller-card-body">
                <div>
                    <label className="business-section-label">
                        Métodos de Pago {!readOnly && <span className="text-red-500">*</span>}
                    </label>
                    <div className="business-payments">
                        {methods.map((method) => {
                            const IconComponent = getMethodIcon(method.payment_method_id);
                            const isSelected = selectedIds?.includes(method.payment_method_id);
                            return (
                                <div
                                    key={method.payment_method_id}
                                    className={`business-payment-toggle ${isSelected ? "selected" : ""} ${readOnly ? "cursor-default" : ""}`}
                                    onClick={readOnly ? undefined : () => onToggle?.(method.payment_method_id)}
                                >
                                    <div className="business-payment-check">
                                        <Check className="w-3 h-3" strokeWidth={3} />
                                    </div>
                                    <IconComponent />
                                    <span>{method.payment_method_name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
