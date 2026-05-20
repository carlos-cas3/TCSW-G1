import "../styles/policy.css";
import "../styles/cards.css";

export default function ReturnPolicyCard({ data, onChange, readOnly = false }) {
    const handleChange = (e) => {
        if (readOnly) return;
        const { value } = e.target;
        onChange((prevSeller) => ({
            ...prevSeller,
            returnPolicy: { description: value },
        }));
    };

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">Política de Devoluciones</h2>
            </div>
            <div className="seller-card-body">
                <div className="policy-form">
                    <div className="policy-group">
                        <label className="policy-label">Descripción</label>
                        <textarea
                            name="description"
                            className="policy-textarea"
                            value={data.returnPolicy?.description ?? ""}
                            onChange={handleChange}
                            disabled={readOnly}
                            placeholder="Describe los términos y condiciones para devoluciones..."
                        />
                        <p className="policy-hint">
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}