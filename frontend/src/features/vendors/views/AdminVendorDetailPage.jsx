import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useVendorDetail from "../hooks/useVendorDetail";
import SellerProfileCard from "../components/SellerProfileCard";
import AccountStatusCard from "../components/AccountStatusCard";
import BusinessConfigCard from "../components/BusinessConfigCard";
import ReturnPolicyCard from "../components/ReturnPolicyCard";
import VendorCategoriesCard from "../components/VendorCategoriesCard";
import VendorUserCard from "../components/VendorUserCard";
import "../styles/shared.css";

export default function AdminVendorDetailPage() {
    const navigate = useNavigate();
    const {
        vendorData,
        userData,
        userLoading,
        userError,
        policyData,
        categories,
        vendorCategories,
        commission,
        allPaymentMethods,
        vendorPaymentMethodIds,
        loading,
        error,
        saveUser,
        saveCommission,
        loadUser,
        reload,
    } = useVendorDetail();

    if (loading) {
        return (
            <div className="seller-page p-6 lg:p-8">
                <p className="seller-subtitle">Cargando datos del vendor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="seller-page p-6 lg:p-8">
                <button
                    onClick={() => navigate("/admin/vendors")}
                    className="inline-flex items-center gap-2 mb-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Vendedores
                </button>
                <p className="seller-subtitle text-red-600">Error: {error}</p>
                <button
                    onClick={reload}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (!vendorData) return null;

    const mappedVendorData = {
        ...vendorData,
        returnPolicy: { description: policyData ?? "" },
        categories: {
            selectedIds:
                vendorCategories
                    ?.map((item) => item.categories?.category_id)
                    .filter(Boolean) ?? [],
        },
    };

    return (
        <div className="seller-page p-6 lg:p-8">
            <button
                onClick={() => navigate("/admin/vendors")}
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a Vendedores
            </button>

            <div className="seller-header">
                <h1 className="seller-title">
                    {vendorData.profile.companyName}
                </h1>
                <p className="seller-subtitle">
                    {vendorData.profile.companyEmail}
                </p>
            </div>

            <div className="seller-grid">
                <div className="seller-col-main">
                    <VendorUserCard
                        userData={userData}
                        userLoading={userLoading}
                        userError={userError}
                        onExpand={loadUser}
                        onSave={saveUser}
                    />
                    <SellerProfileCard
                        data={mappedVendorData}
                        readOnly
                        title="Perfil Comercial"
                    />
                    <ReturnPolicyCard data={mappedVendorData} readOnly />
                    <BusinessConfigCard
                        paymentMethods={allPaymentMethods}
                        selectedIds={vendorPaymentMethodIds}
                        readOnly
                    />
                </div>

                <div className="seller-col-side">
                    <AccountStatusCard
                        data={mappedVendorData}
                        commission={commission}
                        onSaveCommission={saveCommission}
                    />
                    <VendorCategoriesCard
                        categories={categories}
                        selectedCategoryIds={
                            mappedVendorData.categories.selectedIds
                        }
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}
