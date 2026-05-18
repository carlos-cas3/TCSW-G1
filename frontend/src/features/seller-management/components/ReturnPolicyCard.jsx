import { useState } from "react";
import "../styles/policy.css";
import "../styles/cards.css";

export default function ReturnPolicyCard({ data, onChange }) {
    const [policyData, setPolicyData] = useState({
        title: data.returnPolicy?.title ?? "",
        description: data.returnPolicy?.description ?? "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPolicyData((prev) => {
            const newData = { ...prev, [name]: value };
            onChange((prevSeller) => ({
                ...prevSeller,
                returnPolicy: { ...prevSeller.returnPolicy, ...newData },
            }));
            return newData;
        });
    };

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">Política de Devoluciones</h2>
            </div>
            <div className="seller-card-body">
                <div className="policy-form">
                    <div className="policy-group">
                        <label className="policy-label">Título</label>
                        <input
                            type="text"
                            name="title"
                            className="policy-input"
                            value={policyData.title}
                            onChange={handleChange}
                            placeholder="Ej: Política de Devoluciones"
                        />
                    </div>
                    <div className="policy-group">
                        <label className="policy-label">Descripción</label>
                        <textarea
                            name="description"
                            className="policy-textarea"
                            value={policyData.description}
                            onChange={handleChange}
                            placeholder="Describe los términos y condiciones para devoluciones..."
                        />
                        <p className="policy-hint">
                            Esta información será visible para tus clientes en la página de checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}