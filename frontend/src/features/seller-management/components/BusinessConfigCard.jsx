import { useState } from "react";
import {
    CreditCard,
    Building2,
    Banknote,
    Smartphone,
    Check,
} from "lucide-react";
import "../styles/business.css";
import "../styles/cards.css";

const ICONS = {
    card: CreditCard,
    bank: Building2,
    cash: Banknote,
    mobile: Smartphone,
};

const DEFAULT_PAYMENT_METHODS = [
    { id: "1", name: "Boleta", icon: "card", selected: false },
    { id: "2", name: "Factura", icon: "bank", selected: false },
];

const DEFAULT_BUSINESS = {
    currencyName: "Sol Peruano (S/)",
    paymentMethods: DEFAULT_PAYMENT_METHODS,
};

const getInitialSelectedMethods = (paymentMethods) =>
    paymentMethods.filter((m) => m.selected).map((m) => m.id);

export default function BusinessConfigCard({ data, onChange }) {
    const business = data.business ?? DEFAULT_BUSINESS;

    const [selectedMethods, setSelectedMethods] = useState(() =>
        getInitialSelectedMethods(business.paymentMethods),
    );

    const handleToggleMethod = (methodId) => {
        const newSelected = selectedMethods.includes(methodId)
            ? selectedMethods.filter((id) => id !== methodId)
            : [...selectedMethods, methodId];

        setSelectedMethods(newSelected);

        const updatedMethods = business.paymentMethods.map((method) => ({
            ...method,
            selected: newSelected.includes(method.id),
        }));

        onChange((prevSeller) => ({
            ...prevSeller,
            business: {
                ...prevSeller.business,
                paymentMethods: updatedMethods,
            },
        }));
    };

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">Configuración Comercial</h2>
            </div>
            <div className="seller-card-body">
                <div className="business-section">
                    <label className="business-section-label">
                        Moneda Principal
                    </label>
                    <div className="business-currency-display">
                        <div className="business-currency-icon">S/</div>
                        <div className="business-currency-content">
                            <span className="business-currency-label">
                                Moneda
                            </span>
                            <span className="business-currency-value">
                                {business.currencyName}
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="business-section-label">
                        Métodos de Pago <span className="text-red-500">*</span>
                    </label>
                    <div className="business-payments">
                        {business.paymentMethods.map((method) => {
                            const IconComponent =
                                ICONS[method.icon] || CreditCard;
                            const isSelected = selectedMethods.includes(
                                method.id,
                            );
                            return (
                                <div
                                    key={method.id}
                                    className={`business-payment-toggle ${isSelected ? "selected" : ""}`}
                                    onClick={() =>
                                        handleToggleMethod(method.id)
                                    }
                                >
                                    <div className="business-payment-check">
                                        <Check
                                            className="w-3 h-3"
                                            strokeWidth={3}
                                        />
                                    </div>
                                    <IconComponent />
                                    <span>{method.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
