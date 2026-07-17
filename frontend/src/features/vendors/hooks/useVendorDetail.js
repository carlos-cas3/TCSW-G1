import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    getVendorById,
    updateVendor,
    getVendorPolicy,
    getAllCategories,
    getVendorCategories,
    getVendorCommission,
    createVendorCommission,
    updateVendorCommission,
    getUserByVendorId,
    updateVendorUser,
    getPaymentMethods,
    getVendorPaymentMethods,
} from "../services/vendor.service";
import { getVendorProducts } from "../../catalog/services/vendorProducts.service";

const mapVendorToData = (vendor, totalProducts = 0) => ({
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

export default function useVendorDetail() {
    const { vendor_id } = useParams();
    const [vendorId] = useState(vendor_id);

    const [vendorData, setVendorData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState(null);
    const [policyData, setPolicyData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [vendorCategories, setVendorCategories] = useState([]);
    const [commission, setCommission] = useState(null);
    const [allPaymentMethods, setAllPaymentMethods] = useState([]);
    const [vendorPaymentMethodIds, setVendorPaymentMethodIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        if (!vendorId) return;
        setLoading(true);
        setError(null);
        try {
            const results = await Promise.allSettled([
                getVendorById(vendorId),
                getVendorPolicy(vendorId),
                getAllCategories(),
                getVendorCategories(vendorId),
                getVendorCommission(vendorId),
                getPaymentMethods(),
                getVendorPaymentMethods(vendorId),
                getVendorProducts(vendorId),
            ]);

            const getData = (result, defaultValue = null) =>
                result.status === "fulfilled"
                    ? (result.value.data ?? defaultValue)
                    : defaultValue;

            const vendor = getData(results[0]);
            const policy = getData(results[1]);
            const allCats = getData(results[2], []);
            const vendorCats = getData(results[3], []);
            const comm = getData(results[4]);
            const methods = getData(results[5], []);
            const vendorMethods = getData(results[6], []);
            const productsResult = results[7];
            const products = productsResult.status === "fulfilled" && Array.isArray(productsResult.value)
                ? productsResult.value
                : [];

            if (!vendor) {
                const reason = results[0].reason;
                throw new Error(reason?.message || "No se encontraron datos del vendor");
            }

            setVendorData(mapVendorToData(vendor, products.length));
            setPolicyData(
                policy?.return_policy_description ?? policy?.description ?? "",
            );
            setCategories(allCats);
            setVendorCategories(vendorCats);
            setCommission(comm);
            setAllPaymentMethods(methods);
            setVendorPaymentMethodIds(
                vendorMethods?.map(pm => pm.payment_method_id) ?? []
            );
        } catch (err) {
            setError(err.message || "Error al cargar datos del vendor");
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    const loadUser = useCallback(async () => {
        if (userData) return;
        setUserLoading(true);
        setUserError(null);
        try {
            const { data, error: err } = await getUserByVendorId(vendorId);
            if (err) throw new Error(err);
            setUserData(data);
        } catch (err) {
            setUserError(err.message || "Error al cargar datos del usuario");
        } finally {
            setUserLoading(false);
        }
    }, [vendorId, userData]);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            if (!cancelled) await load();
        };
        init();
        return () => {
            cancelled = true;
        };
    }, [load]);

    const saveVendor = async (profileData) => {
        setSaving(true);
        try {
            const { error: err } = await updateVendor(vendorId, {
                vendor_name: profileData.companyName,
                vendor_email: profileData.companyEmail,
                vendor_phone: profileData.personal_phone,
                vendor_address: profileData.address,
            });
            if (err) throw new Error(err);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setSaving(false);
        }
    };

    const saveUser = async (userId, data) => {
        setSaving(true);
        try {
            const { error: err } = await updateVendorUser(userId, data);
            if (err) throw new Error(err);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setSaving(false);
        }
    };

    const saveCommission = async (rate) => {
        setSaving(true);
        try {
            let result;
            if (commission?.config_id) {
                result = await updateVendorCommission(
                    commission.config_id,
                    rate,
                );
            } else {
                result = await createVendorCommission(vendorId, rate);
            }
            if (result.error) throw new Error(result.error);
            setCommission(result.data); // 👈 sin ?? result
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setSaving(false);
        }
    };

    const reload = load;

    return {
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
        saving,
        saveVendor,
        saveUser,
        saveCommission,
        loadUser,
        reload,
    };
}
