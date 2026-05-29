import { useEffect, useState } from "react";

import {
    getCategories,
} from "../services/catalog.service";

export default function AdminProductModal({
    isOpen,
    onClose,
    onSave,
    editingProduct,
}) {

    const [categories, setCategories] =
        useState([]);

    const [form, setForm] = useState({
        category_id: "",
        product_name: "",
        product_brand: "",
        product_description: "",
        image_url: "",
        product_status: "ACTIVE",
    });

    useEffect(() => {

        loadCategories();

    }, []);

    const loadCategories = async () => {

        try {

            const data =
                await getCategories();

            setCategories(data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        if (editingProduct) {

            setForm({

                category_id:
                    editingProduct.category_id || "",

                product_name:
                    editingProduct.product_name || "",

                product_brand:
                    editingProduct.product_brand || "",

                product_description:
                    editingProduct.product_description || "",

                image_url:
                    editingProduct.image_url || "",

                product_status:
                    editingProduct.product_status || "ACTIVE",

            });

        } else {

            setForm({

                category_id: "",
                product_name: "",
                product_brand: "",
                product_description: "",
                image_url: "",
                product_status: "ACTIVE",

            });

        }

    }, [editingProduct, isOpen]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value,

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({

            ...form,

            category_id:
                Number(form.category_id),

        });

    };

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white w-[560px] rounded-2xl p-6 shadow-xl">

                <h2 className="text-2xl font-bold mb-5">

                    {editingProduct
                        ? "Edit Product"
                        : "Create Product"}

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                >

                    <input
                        name="product_name"
                        value={form.product_name}
                        onChange={handleChange}
                        placeholder="Product name"
                        className="border p-3 rounded-xl"
                        required
                    />

                    <input
                        name="product_brand"
                        value={form.product_brand}
                        onChange={handleChange}
                        placeholder="Brand"
                        className="border p-3 rounded-xl"
                        required
                    />

                    <textarea
                        name="product_description"
                        value={form.product_description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows={4}
                        className="border p-3 rounded-xl resize-none"
                    />

                    <input
                        name="image_url"
                        value={form.image_url}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="border p-3 rounded-xl"
                    />

                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        required
                    >

                        <option value="">
                            Select Category
                        </option>

                        {categories.map(category => (

                            <option
                                key={category.category_id}
                                value={category.category_id}
                            >

                                {category.category_name}

                            </option>

                        ))}

                    </select>

                    <select
                        name="product_status"
                        value={form.product_status}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                    >

                        <option value="ACTIVE">
                            ACTIVE
                        </option>

                        <option value="INACTIVE">
                            INACTIVE
                        </option>

                    </select>

                    {form.image_url && (

                        <div className="border rounded-xl p-4 bg-gray-50">

                            <p className="text-sm text-gray-500 mb-2">
                                Image Preview
                            </p>

                            <img
                                src={form.image_url}
                                alt="preview"
                                className="w-24 h-24 rounded-xl object-cover border"
                                onError={(e) => {

                                    e.currentTarget.src =
                                        "https://placehold.co/100x100";

                                }}
                            />

                        </div>

                    )}

                    <div className="flex justify-end gap-3 mt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-xl"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-600 text-white rounded-xl"
                        >
                            Save
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}