import { useState, useEffect } from "react";
import { getCities } from "../api/cities.service";

export const useCities = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const loadCities = async () => {
            try {
                const { data, error: fetchError } = await getCities();

                if (cancelled) return;

                if (fetchError) throw new Error(fetchError);

                setCities(data ?? []);
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Error al cargar ciudades");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadCities();

        return () => {
            cancelled = true;
        };
    }, []);

    return { cities, loading, error };
};