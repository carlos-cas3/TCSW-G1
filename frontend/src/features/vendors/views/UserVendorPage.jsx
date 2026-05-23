import { useSellerProfile } from "../hooks/useSellerProfile";

import { extractEditableData } from "../helpers/sellerEditableData";

import SellerProfileCard from "../components/SellerProfileCard";
import AccountStatusCard from "../components/AccountStatusCard";
import BusinessConfigCard from "../components/BusinessConfigCard";
import ReturnPolicyCard from "../components/ReturnPolicyCard";
import VendorCategoriesCard from "../components/VendorCategoriesCard";

import "../styles/shared.css";

export default function UserVendorPage() {
    const {
        sellerData,
        setSellerData,

        initialEditableData,
        setInitialEditableData,

        loading,
        error,

        saveProfile,
        savePolicy,
        saveLogo,
        saveCategories,
        savePaymentMethods,

        commission,

        saving,

        categories,
        selectedCategoryIds,

        allPaymentMethods,
        vendorPaymentMethodIds,
        setVendorPaymentMethodIds,
        initialPaymentMethodIds,
        setInitialPaymentMethodIds,
    } = useSellerProfile();

    const handleChange = (updater) => {
        setSellerData((prev) =>
            typeof updater === "function" ? updater(prev) : updater,
        );
    };

    const currentEditableData = extractEditableData(sellerData);

    const hasUnsavedChanges =
        JSON.stringify(currentEditableData) !==
        JSON.stringify(initialEditableData) ||
        JSON.stringify(vendorPaymentMethodIds) !==
        JSON.stringify(initialPaymentMethodIds);

    const handleSaveAll = async () => {
        const selectedCats = sellerData.categories?.selectedIds ?? [];

        if (selectedCats.length === 0) {
            alert("Selecciona al menos una categoría antes de guardar");
            return;
        }

        const results = await Promise.allSettled([
            saveProfile(sellerData.profile),

            savePolicy(sellerData.returnPolicy?.description ?? ""),

            saveCategories(selectedCats),

            savePaymentMethods(vendorPaymentMethodIds),
        ]);

        const rejected = results.find((r) => r.status === "rejected");

        const failed = results.find(
            (r) => r.status === "fulfilled" && !r.value.success,
        );

        if (!rejected && !failed) {
            alert("Configuración guardada correctamente");

            setInitialEditableData(
                extractEditableData({
                    ...sellerData,
                    categories: {
                        selectedIds: selectedCats,
                    },
                }),
            );

            setInitialPaymentMethodIds(vendorPaymentMethodIds);
        } else {
            const errorMessage =
                rejected?.reason?.message ||
                failed?.value?.error ||
                "Error al guardar";

            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="seller-page p-6 lg:p-8">
                <p className="seller-subtitle">Cargando configuración...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="seller-page p-6 lg:p-8">
                <p className="seller-subtitle">Error: {error}</p>
            </div>
        );
    }

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
                    <AccountStatusCard
                        data={sellerData}
                        commission={commission}
                    />

                    <BusinessConfigCard
                        paymentMethods={allPaymentMethods}
                        selectedIds={vendorPaymentMethodIds}
                        onToggle={(id) => setVendorPaymentMethodIds(prev =>
                            prev.includes(id)
                                ? prev.filter(mid => mid !== id)
                                : [...prev, id]
                        )}
                    />

                    <VendorCategoriesCard
                        categories={categories}
                        selectedCategoryIds={selectedCategoryIds}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {hasUnsavedChanges && (
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
            )}
        </div>
    );
}
