import { useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import "../styles/profile.css";
import "../styles/cards.css";

export default function SellerProfileCard({ data, onChange, onLogoChange }) {
    console.log("logo actual:", data.profile.logo?.substring(0, 50));
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!initializedRef.current && data.profile.companyName) {
            initializedRef.current = true;
        }
    }, [data.profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange((prevSeller) => ({
            ...prevSeller,
            profile: { ...prevSeller.profile, [name]: value },
        }));
    };

    const handleLogoChange = async (e) => {
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

        // Sube directo — sin preview base64
        const { success, error } = await onLogoChange(file);
        if (!success) alert(`Error al subir logo: ${error}`);
    };

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <h2 className="seller-card-title">Información de Perfil</h2>
            </div>
            <div className="seller-card-body">
                <div className="profile-section">
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
                                onChange={handleLogoChange}
                            />
                        </div>
                        <p className="profile-upload-hint">
                            PNG o JPG. Máx 2MB
                        </p>
                    </div>
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
                                    onChange={handleChange}
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
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="profile-form-input"
                                    value={data.profile.phone ?? ""}
                                    onChange={handleChange}
                                />
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
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
