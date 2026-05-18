import { useState, useEffect, useCallback } from "react";
import {
    getAllVendors,
    getVendorBranches,
    updateVendorStatus,
} from "../services/vendor.service";

const BRANCH_CONCURRENCY = 5;

async function fetchBranchesWithLimit(vendors, limit = BRANCH_CONCURRENCY) {
    const results = [];

    for (let i = 0; i < vendors.length; i += limit) {
        const chunk = vendors.slice(i, i + limit);

        const chunkResults = await Promise.all(
            chunk.map(async (vendor) => {
                try {
                    const { data: branches } = await getVendorBranches(
                        vendor.vendor_id,
                    );
                    return { ...vendor, branches: branches ?? [] };
                } catch {
                    return { ...vendor, branches: [] };
                }
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

            const vendorsWithBranches = await fetchBranchesWithLimit(data ?? []);

            setVendors(vendorsWithBranches);
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

    // Retorna { success, error } para que el componente pueda reaccionar
    const changeStatus = useCallback(async (vendorId, newStatus) => {
        // Optimistic update — si falla, loadVendors() hace el rollback desde el servidor
        setVendors((prev) =>
            prev.map((v) =>
                v.vendor_id === vendorId ? { ...v, status: newStatus } : v,
            ),
        );

        setChangingId(vendorId);

        try {
            const { error: updateError } = await updateVendorStatus(vendorId, newStatus);

            if (updateError) throw new Error(updateError);

            return { success: true };
        } catch (err) {
            await loadVendors();
            return { success: false, error: err.message };
        } finally {
            setChangingId(null);
        }
    }, [loadVendors]);

    return {
        vendors,
        loading,
        error,
        reload: loadVendors,
        changeStatus,
        changingId,
    };
};