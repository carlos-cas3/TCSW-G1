import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import "../styles/profile.css";
import "../styles/cards.css";

export default function VendorUserCard({ userData, userLoading, userError, onExpand, onSave }) {
    const [expanded, setExpanded] = useState(false);
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (userData && !initializedRef.current) {
            setName(userData.firstName ?? "");
            setLastname(userData.lastName ?? "");
            setEmail(userData.email ?? "");
            setPhone(userData.personalPhone ?? "");
            initializedRef.current = true;
        }
    }, [userData]);

    const handleExpand = () => {
        setExpanded(true);
        onExpand?.();
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        const result = await onSave(userData.userId, {
            first_name: name,
            last_name: lastname,
            personal_phone: phone,
        });
        if (result.success) {
            setMessage({ type: "success", text: "Administrador actualizado correctamente" });
        } else {
            setMessage({ type: "error", text: result.error || "Error al guardar" });
        }
        setSaving(false);
    };

    return (
        <div className="seller-card">
            <div className="seller-card-header">
                <div className="flex items-center justify-between">
                    <h2 className="seller-card-title">Administrador de Tienda</h2>
                    {!expanded && (
                        <button
                            onClick={handleExpand}
                            className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            Editar
                        </button>
                    )}
                </div>
            </div>

            {!expanded && userData && (
                <div className="px-6 pb-4">
                    <p className="text-sm text-gray-500">
                        {userData.firstName} {userData.lastName} · {userData.email}
                    </p>
                </div>
            )}

            {expanded && (
                <div className="seller-card-body">
                    {userLoading && (
                        <div className="flex items-center gap-2 text-gray-500 py-4">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Cargando información del administrador...</span>
                        </div>
                    )}

                    {userError && (
                        <div className="py-4">
                            <p className="text-sm text-red-600">Error: {userError}</p>
                            <button
                                onClick={handleExpand}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {userData && !userLoading && (
                        <>
                            <div className="profile-form-grid">
                                <div className="profile-form-group">
                                    <label className="profile-form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="profile-form-input"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="profile-form-group">
                                    <label className="profile-form-label">Apellido</label>
                                    <input
                                        type="text"
                                        className="profile-form-input"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                    />
                                </div>
                                <div className="profile-form-group">
                                    <label className="profile-form-label">Email</label>
                                    <input
                                        type="email"
                                        className="profile-form-input"
                                        value={email}
                                        disabled
                                    />
                                </div>
                                <div className="profile-form-group">
                                    <label className="profile-form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className="profile-form-input"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            {message && (
                                <p className={`text-sm mt-3 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                                    {message.text}
                                </p>
                            )}

                            <div className="mt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {saving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
