import { useState, useEffect, useCallback } from "react";
import { getStaff, createStaff } from "../services/staff.service";

export const useStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStaff();
      setStaff(Array.isArray(res) ? res : (res.data ?? []));
    } catch (err) {
      setError(err.message || "Error al cargar staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStaff();
  }, [loadStaff]);

  const addStaff = async (data) => {
    const res = await createStaff(data);
    await loadStaff();
    return res;
  };

  return { staff, loading, error, reload: loadStaff, addStaff };
};
