import { useSellerProfile } from "./hooks/useSellerProfile";
import SellerProfileCard from "./components/SellerProfileCard";
import AccountStatusCard from "./components/AccountStatusCard";
import BusinessConfigCard from "./components/BusinessConfigCard";
import ReturnPolicyCard from "./components/ReturnPolicyCard";
import "./styles/shared.css";

export default function SellerManagement() {
    const {
        sellerData,
        setSellerData,
        loading,
        error,
        saveProfile,
        savePolicy,
        saveLogo,
        saving,
    } = useSellerProfile();
    const handleChange = (updater) => {
        setSellerData((prev) =>
            typeof updater === "function" ? updater(prev) : updater,
        );
    };

    const handleSaveAll = async () => {
        const [profileResult, policyResult] = await Promise.all([
            saveProfile(sellerData.profile),
            savePolicy(sellerData.returnPolicy?.description ?? ""),
        ]);

        if (profileResult.success && policyResult.success) {
            alert("Configuración guardada correctamente");
        } else {
            alert(
                `Error al guardar: ${profileResult.error || policyResult.error}`,
            );
        }
    };

    if (loading)
        return (
            <div className="seller-page p-6 lg:p-8">
                <p className="seller-subtitle">Cargando configuración...</p>
            </div>
        );

    if (error)
        return (
            <div className="seller-page p-6 lg:p-8">
                <p className="seller-subtitle">Error: {error}</p>
            </div>
        );

    if (!sellerData) return null;

    return (
        <div className="seller-page p-6 lg:p-8">
            <div className="seller-header">
                <h1 className="seller-title">Configuración de Tienda</h1>
                <p className="seller-subtitle">
                    Administra la información de tu empresa y configuración
                    comercial
                </p>
            </div>
            <div className="seller-grid">
                <div className="seller-col-main">
                    <SellerProfileCard
                        data={sellerData}
                        onChange={handleChange}
                        onLogoChange={saveLogo}
                    />
                    <ReturnPolicyCard
                        data={sellerData}
                        onChange={handleChange}
                    />
                </div>
                <div className="seller-col-side">
                    <AccountStatusCard data={sellerData} />
                    <BusinessConfigCard
                        data={sellerData}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="seller-footer">
                <button
                    type="button"
                    className="seller-btn-primary"
                    onClick={handleSaveAll}
                    disabled={saving}
                >
                    {saving ? "Guardando..." : "Guardar Configuración"}
                </button>
            </div>
        </div>
    );
}
