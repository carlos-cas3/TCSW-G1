import { useState, useEffect, useCallback } from "react";
import {
    getVendorById,
    updateVendor,
    getVendorPolicy,
    updateVendorPolicy,
    uploadVendorLogo,
} from "../services/seller.service";
import { getUser } from "../../../app/auth";

const mapVendorToProfile = (vendor) => ({
    profile: {
        companyName: vendor.vendor_name,
        companyEmail: vendor.vendor_email,
        ruc: vendor.vendor_ruc,
        phone: vendor.vendor_phone,
        address: vendor.vendor_address,
        logo: vendor.vendor_logo_url,
    },
    account: {
        status: vendor.vendor_status,
        memberSince: vendor.created_at,
    },
});

const mapProfileToVendor = (profile) => ({
    vendor_name: profile.companyName,
    vendor_email: profile.companyEmail,
    vendor_phone: profile.phone,
    vendor_address: profile.address,
});

export const useSellerProfile = () => {
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const vendorId = getUser()?.vendorId;

    const loadProfile = useCallback(async () => {
        console.log("loadProfile llamado");
        if (!vendorId) {
            setError("No se encontró el vendor del usuario");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [
                { data: vendorData, error: vendorError },
                { data: policyData },
            ] = await Promise.all([
                getVendorById(vendorId),
                getVendorPolicy(vendorId),
            ]);

            if (vendorError) throw new Error(vendorError);

            setSellerData((prev) => {
                console.log(
                    "loadProfile setSellerData - prev.profile.logo:",
                    prev?.profile?.logo,
                );
                return {
                    ...mapVendorToProfile(vendorData),
                    returnPolicy: {
                        description:
                            policyData?.return_policy_description ?? "",
                    },
                    profile: {
                        ...mapVendorToProfile(vendorData).profile,
                        logo: prev?.profile?.logo ?? vendorData.vendor_logo_url,
                    },
                };
            });
        } catch (err) {
            setError(err.message || "Error al cargar el perfil");
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            if (!cancelled) await loadProfile();
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
                mapProfileToVendor(updatedProfile),
            );
            if (error) throw new Error(error);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setSaving(false);
        }
    };

    const savePolicy = async (description) => {
        setSaving(true);
        try {
            const { error } = await updateVendorPolicy(vendorId, description);
            if (error) throw new Error(error);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setSaving(false);
        }
    };

    const saveLogo = async (file) => {
        setSaving(true);
        try {
            const { data, error } = await uploadVendorLogo(vendorId, file);
            console.log("respuesta uploadVendorLogo:", { data, error }); // añadir
            console.log("logo_url recibida:", data?.logo_url);
            console.log("data completa:", JSON.stringify(data));
            if (error) throw new Error(error);

            setSellerData((prev) => ({
                ...prev,
                profile: { ...prev.profile, logo: data.logo_url },
            }));

            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setSaving(false);
        }
    };
    return {
        sellerData,
        setSellerData,
        loading,
        saving,
        error,
        saveProfile,
        savePolicy,
        saveLogo,
        reload: loadProfile,
    };
};
