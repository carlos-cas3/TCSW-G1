import { useState, useEffect, useCallback } from "react";

import {
    getVendorById,
    updateVendor,
    getVendorPolicy,
    updateVendorPolicy,
    uploadVendorLogo,
    
} from "../services/seller.service";

import { getUser } from "../../../app/auth";

import { extractEditableData } from "../helpers/sellerEditableData";

const mapVendorToProfile = (vendor) => ({
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
            ] = await Promise.all([
                getVendorById(vendorId),
                getVendorPolicy(vendorId),
            ]);

            if (vendorError) {
                throw new Error(vendorError);
            }

            const mappedData = {
                ...mapVendorToProfile(vendorData),

                returnPolicy: {
                    description:
                        policyData?.return_policy_description ??
                        "",
                },
            };

            setSellerData(mappedData);

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

        reload: loadProfile,
    };
};