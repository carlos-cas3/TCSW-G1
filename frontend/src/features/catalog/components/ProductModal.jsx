import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/catalog.service";

export default function VendorProductModal({
    isOpen,
    onClose,
    onSave,
    editingProduct
}) {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const [form, setForm] = useState({
        product_id: "",
        price: "",
        stock: "",
        status: "ACTIVE",
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (editingProduct) {
            setForm({
                product_id: editingProduct.product_id || "",
                price: editingProduct.price || "",
                stock: editingProduct.stock || "",
                status: editingProduct.status || "ACTIVE",
            });
        } else {
            setForm({
                product_id: "",
                price: "",
                stock: "",
                status: "ACTIVE",
            });
        }
    }, [editingProduct]);

    const categories = useMemo(() => {
        return [
            ...new Set(
                products
                    .map((p) => p.categories?.category_name)
                    .filter(Boolean)
            ),
        ];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.product_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                product.product_brand
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                categoryFilter === "ALL"
                    ? true
                    : product.categories?.category_name === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter]);

    const selectedProduct = products.find(
        (p) => Number(p.product_id) === Number(form.product_id)
    );

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            ...form,
            product_id: Number(form.product_id),
            price: Number(form.price),
            stock: Number(form.stock),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[480px] rounded-xl p-6">

                <h2 className="text-xl font-bold mb-4">
                    {editingProduct ? "Edit Product" : "Add Product"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                >
                    {!editingProduct && (
                        <>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search product by name or brand..."
                                className="border p-2 rounded"
                            />

                            <select
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                                className="border p-2 rounded"
                            >
                                <option value="ALL">
                                    All Categories
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="product_id"
                                value={form.product_id}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                required
                            >
                                <option value="">
                                    Select Product
                                </option>

                                {filteredProducts.map((product) => (
                                    <option
                                        key={product.product_id}
                                        value={product.product_id}
                                    >
                                        {product.product_name} - {product.product_brand}
                                    </option>
                                ))}
                            </select>

                            {selectedProduct && (
                                <div className="border rounded-xl p-3 bg-gray-50 flex gap-3 items-center">
                                    <img
                                        src={
                                            selectedProduct.image_url ||
                                            "https://placehold.co/60x60"
                                        }
                                        alt={selectedProduct.product_name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            {selectedProduct.product_name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {selectedProduct.product_brand} ·{" "}
                                            {selectedProduct.categories?.category_name}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        type="number"
                        placeholder="Price"
                        className="border p-2 rounded"
                        required
                    />

                    <input
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        type="number"
                        placeholder="Stock"
                        className="border p-2 rounded"
                        required
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>

                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}