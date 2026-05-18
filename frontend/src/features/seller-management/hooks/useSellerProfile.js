import { useState, useEffect, useCallback } from "react";
import { getVendorById, updateVendor } from "../services/seller.service";
import { getUser } from "../../../app/auth";

// Mapea los campos del vendor-service → estructura que usan los componentes
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

// Mapea los campos del formulario → payload del vendor-service
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

    const user = getUser();
    const vendorId = user?.vendorId;

    const loadProfile = useCallback(async () => {
        if (!vendorId) {
            setError("No se encontró el vendor del usuario");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data: vendorData, error: fetchError } =
                await getVendorById(vendorId);
            if (fetchError) throw new Error(fetchError);
            setSellerData(mapVendorToProfile(vendorData));
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
        console.log("payload enviado:", mapProfileToVendor(updatedProfile));
        setSaving(true);
        try {
            const payload = mapProfileToVendor(updatedProfile);
            const { error: saveError } = await updateVendor(vendorId, payload);
            if (saveError) throw new Error(saveError);

            setSellerData((prev) => ({
                ...prev,
                profile: { ...prev.profile, ...updatedProfile },
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
        setSellerData, // añadir
        loading,
        saving,
        error,
        saveProfile,
        reload: loadProfile,
    };
};
