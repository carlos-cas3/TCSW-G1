import { useState, useEffect, useCallback } from "react";
import {
    getAllVendors,
    getVendorBranches,
    getVendorCategories,
    updateVendorStatus,
} from "../services/vendor.service";

const CONCURRENCY_LIMIT = 5;

// Enriquece cada vendor con branches + categories en paralelo, respetando el límite
async function enrichVendors(vendors, limit = CONCURRENCY_LIMIT) {
    const results = [];

    for (let i = 0; i < vendors.length; i += limit) {
        const chunk = vendors.slice(i, i + limit);

        const chunkResults = await Promise.all(
            chunk.map(async (vendor) => {
                const [branchesResult, categoriesResult] =
                    await Promise.allSettled([
                        getVendorBranches(vendor.vendor_id),
                        getVendorCategories(vendor.vendor_id),
                    ]);

                const branches =
                    branchesResult.status === "fulfilled"
                        ? (branchesResult.value.data ?? [])
                        : [];

                const vendor_categories =
                    categoriesResult.status === "fulfilled"
                        ? (categoriesResult.value.data ?? [])
                        : [];

                return { ...vendor, branches, vendor_categories };
            }),
        );

        results.push(...chunkResults);
    }

    return results;
}

export const useVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [changingId, setChangingId] = useState(null);

    const loadVendors = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await getAllVendors();

            if (fetchError) throw new Error(fetchError);

            const enrichedVendors = await enrichVendors(data ?? []);

            setVendors(enrichedVendors);
        } catch (err) {
            setError(err.message || "Error al cargar vendedores");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (!cancelled) await loadVendors();
        };

        init();

        return () => {
            cancelled = true;
        };
    }, [loadVendors]);

    const changeStatus = useCallback(
        async (vendorId, newStatus) => {
            // Optimistic update — si falla, loadVendors() hace el rollback
            setVendors((prev) =>
                prev.map((v) =>
                    v.vendor_id === vendorId
                        ? { ...v, vendor_status: newStatus }
                        : v,
                ),
            );

            setChangingId(vendorId);

            try {
                const { error: updateError } = await updateVendorStatus(
                    vendorId,
                    newStatus,
                );

                if (updateError) throw new Error(updateError);

                return { success: true };
            } catch (err) {
                await loadVendors();
                return { success: false, error: err.message };
            } finally {
                setChangingId(null);
            }
        },
        [loadVendors],
    );

    return {
        vendors,
        loading,
        error,
        reload: loadVendors,
        changeStatus,
        changingId,
    };
};
