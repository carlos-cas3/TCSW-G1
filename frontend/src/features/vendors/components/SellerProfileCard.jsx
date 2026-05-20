import { Upload } from "lucide-react";
import "../styles/profile.css";
import "../styles/cards.css";

export default function SellerProfileCard({ data, onChange, onLogoChange, readOnly = false, title = "Información de Perfil" }) {
    const handleChange = (e) => {
        if (readOnly) return;
        const { name, value } = e.target;
        onChange((prevSeller) => ({
            ...prevSeller,
            profile: { ...prevSeller.profile, [name]: value },
        }));
    };

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">{title}</h2>
            </div>
            <div className="seller-card-body">
                <div className="profile-section">
                    {!readOnly && (
                        <div className="profile-logo-area">
                            <label className="profile-logo-label">
                                Logo de Empresa
                            </label>
                            <div
                                className={`profile-upload-btn ${data.profile.logo ? "has-image" : ""}`}
                            >
                                {data.profile.logo ? (
                                    <img src={data.profile.logo} alt="Logo" />
                                ) : (
                                    <Upload />
                                )}
                                <input
                                    type="file"
                                    className="profile-upload-input"
                                    accept="image/png,image/jpeg"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        if (file.size > 2 * 1024 * 1024) {
                                            alert("El archivo no puede superar 2MB");
                                            return;
                                        }
                                        if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
                                            alert("Solo se aceptan archivos PNG, JPG o JPEG");
                                            return;
                                        }
                                        const { success, error } = await onLogoChange(file);
                                        if (success) alert("Logo actualizado correctamente");
                                        if (!success) alert(`Error al subir logo: ${error}`);
                                    }}
                                />
                            </div>
                            <p className="profile-upload-hint">
                                PNG o JPG. Máx 2MB
                            </p>
                        </div>
                    )}
                    <div className="profile-form-section">
                        <div className="profile-form-grid">
                            <div className="profile-form-group">
                                <label className="profile-form-label">
                                    Nombre de Empresa
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    className="profile-form-input"
                                    value={data.profile.companyName ?? ""}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                />
                            </div>
                            <div className="profile-form-group">
                                <label className="profile-form-label">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    name="companyEmail"
                                    className="profile-form-input"
                                    value={data.profile.companyEmail ?? ""}
                                    disabled
                                />
                            </div>
                            <div className="profile-form-group">
                                <label className="profile-form-label">
                                    RUC
                                </label>
                                <input
                                    type="text"
                                    className="profile-form-input profile-form-input-readonly"
                                    value={data.profile.ruc ?? ""}
                                    disabled
                                />
                            </div>
                            <div className="profile-form-group">
                                <label className="profile-form-label">
                                    Teléfono Comercial
                                </label>
                                <input
                                    type="text"
                                    name="personal_phone"
                                    className="profile-form-input"
                                    value={data.profile.personal_phone ?? ""}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                />
                                <p className="profile-form-help">
                                    Este número será visible como contacto de la
                                    empresa
                                </p>
                            </div>
                            <div className="profile-form-group profile-form-input-full">
                                <label className="profile-form-label">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    className="profile-form-input"
                                    value={data.profile.address ?? ""}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                />
                            </div>
                        </div>
                        {!readOnly && (
                            <div className="profile-form-footer">
                                <p>
                                    Los campos deshabilitados contienen información
                                    sensible. Para solicitar cambios, contacte al
                                    administrador del supermercado
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}