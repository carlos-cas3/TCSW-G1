import { useState, useEffect, useCallback } from "react";
import { getUser } from "../../../app/auth";
import {
    getVendorBranches,
    fetchAllBranches,
    changeBranchStatus,
    deleteBranch,
    createBranch as apiCreateBranch,
    updateBranch as apiUpdateBranch,
} from "../api/branches.service";

export const useBranches = ({ vendorId, mode }) => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [changingId, setChangingId] = useState(null);

    const effectiveVendorId = vendorId || getUser()?.vendorId;

    const loadBranches = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let branchesData = [];

            if (mode === "admin") {
                branchesData = await fetchAllBranches();
            } else {
                if (!effectiveVendorId) {
                    throw new Error("No se ha proporcionado vendorId");
                }
                const { data, error: fetchError } = await getVendorBranches(effectiveVendorId);
                if (fetchError) throw new Error(fetchError);
                branchesData = data ?? [];
            }

            setBranches(branchesData);
        } catch (err) {
            setError(err.message || "Error al cargar sucursales");
        } finally {
            setLoading(false);
        }
    }, [mode, effectiveVendorId]);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            if (!cancelled) await loadBranches();
        };

        init();

        return () => {
            cancelled = true;
        };
    }, [loadBranches]);

    const changeStatus = useCallback(
        async (branchId, newStatus) => {
            setBranches((prev) =>
                prev.map((b) =>
                    b.branch_id === branchId
                        ? { ...b, branch_status: newStatus }
                        : b,
                )
            );

            setChangingId(branchId);

            try {
                const { error: updateError } = await changeBranchStatus(branchId, newStatus);

                if (updateError) throw new Error(updateError);

                return { success: true };
            } catch (err) {
                await loadBranches();
                return { success: false, error: err.message };
            } finally {
                setChangingId(null);
            }
        },
        [loadBranches]
    );

    const removeBranch = useCallback(
        async (branchId) => {
            setBranches((prev) =>
                prev.filter((b) => b.branch_id !== branchId)
            );

            setChangingId(branchId);

            try {
                const { error: deleteError } = await deleteBranch(branchId);

                if (deleteError) throw new Error(deleteError);

                return { success: true };
            } catch (err) {
                await loadBranches();
                return { success: false, error: err.message };
            } finally {
                setChangingId(null);
            }
        },
        [loadBranches]
    );

    const createBranch = useCallback(
        async (vendorId, branchData) => {
            setChangingId("creating");

            try {
                const { data, error: createError } = await apiCreateBranch(vendorId, branchData);

                if (createError) throw new Error(createError);

                await loadBranches();

                return { success: true, data };
            } catch (err) {
                return { success: false, error: err.message };
            } finally {
                setChangingId(null);
            }
        },
        [loadBranches]
    );

    const editBranch = useCallback(
        async (branchId, branchData) => {
            setChangingId(branchId);

            try {
                const { error: updateError } = await apiUpdateBranch(branchId, branchData);

                if (updateError) throw new Error(updateError);

                await loadBranches();

                return { success: true };
            } catch (err) {
                return { success: false, error: err.message };
            } finally {
                setChangingId(null);
            }
        },
        [loadBranches]
    );

    return {
        branches,
        loading,
        error,
        changingId,
        reload: loadBranches,
        changeStatus,
        createBranch,
        updateBranch: editBranch,
        deleteBranch: removeBranch,
    };
};