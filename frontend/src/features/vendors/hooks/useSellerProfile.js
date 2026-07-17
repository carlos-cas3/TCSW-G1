import { useState, useEffect, useCallback } from "react";

import {
    getVendorById,
    updateVendor,
    getVendorPolicy,
    updateVendorPolicy,
    uploadVendorLogo,
    getAllCategories,
    getVendorCategories,
    updateVendorCategories,
    getVendorCommission,
    getPaymentMethods,
    getVendorPaymentMethods,
    updateVendorPaymentMethods,
} from "../services/vendor.service";

import { getVendorProducts } from "../../catalog/services/vendorProducts.service";

import { getUser } from "../../../app/auth";

import { extractEditableData } from "../helpers/sellerEditableData";

const mapVendorToProfile = (vendor, totalProducts = 0) => ({
    profile: {
        companyName: vendor.vendor_name,
        companyEmail: vendor.vendor_email,
        ruc: vendor.vendor_ruc,
        personal_phone: vendor.vendor_phone,
        address: vendor.vendor_address,
        logo: vendor.vendor_logo_url,
    },

    account: {
        status: vendor.vendor_status,
        memberSince: vendor.created_at,
        totalProducts,
    },
});

const mapProfileToVendor = (profile) => ({
    vendor_name: profile.companyName,
    vendor_email: profile.companyEmail,
    vendor_phone: profile.personal_phone,
    vendor_address: profile.address,
});

export const useSellerProfile = () => {
    const [sellerData, setSellerData] = useState(null);

    const [initialEditableData, setInitialEditableData] =
        useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState(null);

    const [categories, setCategories] = useState([]);

    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    
    const [commission, setCommission] = useState(null);

    const [allPaymentMethods, setAllPaymentMethods] = useState([]);

    const [vendorPaymentMethodIds, setVendorPaymentMethodIds] = useState([]);

    const [initialPaymentMethodIds, setInitialPaymentMethodIds] = useState([]);

    const vendorId = getUser()?.vendorId;


    const loadProfile = useCallback(async () => {
        if (!vendorId) {
            setError(
                "No se encontró el vendor del usuario"
            );

            setLoading(false);

            return;
        }

        setLoading(true);

        setError(null);

        try {
            const [
                { data: vendorData, error: vendorError },
                { data: policyData },
                { data: allCategories },
                { data: vendorCategories },
                { data: commissionData },
                { data: methods },
                { data: vendorMethods },
            ] = await Promise.all([
                getVendorById(vendorId),
                getVendorPolicy(vendorId),
                getAllCategories(),
                getVendorCategories(vendorId),
                getVendorCommission(vendorId),
                getPaymentMethods(),
                getVendorPaymentMethods(vendorId),
            ]);

            const products = await getVendorProducts(vendorId);

            if (vendorError) {
                throw new Error(vendorError);
            }

            const mappedData = {
                ...mapVendorToProfile(vendorData, products?.length ?? 0),

                returnPolicy: {
                    description:
                        policyData?.return_policy_description ??
                        "",
                },

                categories: {
                    selectedIds:
                        vendorCategories?.map(
                            (item) => item.categories.category_id
                        ) ?? [],
                },
            };

            setSellerData(mappedData);

            setCategories(allCategories ?? []);
            setSelectedCategoryIds(mappedData.categories.selectedIds);
            setCommission(commissionData ?? null);
            const paymentMethodIds = vendorMethods?.map(pm => pm.payment_method_id) ?? [];
            setAllPaymentMethods(methods ?? []);
            setVendorPaymentMethodIds(paymentMethodIds);
            setInitialPaymentMethodIds(paymentMethodIds);

            setInitialEditableData(
                extractEditableData(mappedData)
            );
        } catch (err) {
            setError(
                err.message ||
                    "Error al cargar el perfil"
            );
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (!cancelled) {
                await loadProfile();
            }
        };

        init();

        return () => {
            cancelled = true;
        };
    }, [loadProfile]);

    

    

    const saveProfile = async (updatedProfile) => {
        setSaving(true);

        try {
            const { error } = await updateVendor(
                vendorId,
                mapProfileToVendor(updatedProfile)
            );

            if (error) {
                throw new Error(error);
            }

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.message,
            };
        } finally {
            setSaving(false);
        }
    };

    const savePolicy = async (description) => {
        setSaving(true);

        try {
            const { error } =
                await updateVendorPolicy(
                    vendorId,
                    description
                );

            if (error) {
                throw new Error(error);
            }

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.message,
            };
        } finally {
            setSaving(false);
        }
    };

    const saveLogo = async (file) => {
        setSaving(true);

        try {
            const { data, error } =
                await uploadVendorLogo(
                    vendorId,
                    file
                );

            if (error) {
                throw new Error(error);
            }

            setSellerData((prev) => ({
                ...prev,

                profile: {
                    ...prev.profile,
                    logo: data.logo_url,
                },
            }));

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.message,
            };
        } finally {
            setSaving(false);
        }
    };

    const saveCategories = async (categoryIds) => {
        setSaving(true);

        try {
            const { error } = await updateVendorCategories(
                vendorId,
                categoryIds,
            );

            if (error) {
                throw new Error(error);
            }

            setSelectedCategoryIds(categoryIds);

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.message,
            };
        } finally {
            setSaving(false);
        }
    };

    const savePaymentMethods = async (paymentMethodIds) => {
        setSaving(true);

        try {
            const { error } = await updateVendorPaymentMethods(
                vendorId,
                paymentMethodIds,
            );

            if (error) {
                throw new Error(error);
            }

            setVendorPaymentMethodIds(paymentMethodIds);

            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.message,
            };
        } finally {
            setSaving(false);
        }
    };

    return {
        sellerData,
        setSellerData,

        initialEditableData,
        setInitialEditableData,

        loading,
        saving,
        error,

        saveProfile,
        savePolicy,
        saveLogo,
        saveCategories,

        categories,
        selectedCategoryIds,

        allPaymentMethods,
        vendorPaymentMethodIds,
        setVendorPaymentMethodIds,
        initialPaymentMethodIds,
        setInitialPaymentMethodIds,
        savePaymentMethods,

        reload: loadProfile,
        commission
    };
};