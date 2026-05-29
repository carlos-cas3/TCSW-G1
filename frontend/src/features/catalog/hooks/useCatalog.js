import { useEffect, useState } from "react";

import {
    getProducts,
} from "../services/catalog.service";

export function useCatalog() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadProducts = async () => {

        try {

            setLoading(true);

            const result =
                await getProducts();

            console.log("RESULT:", result);

            // 👇 IMPORTANTE
            if (Array.isArray(result)) {

                setProducts(result);

            } else if (Array.isArray(result.data)) {

                setProducts(result.data);

            } else {

                setProducts([]);

            }

        } catch (error) {

            console.error(error);

            setProducts([]);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadProducts();

    }, []);

    return {

        products,
        loading,
        reload: loadProducts,

    };

}