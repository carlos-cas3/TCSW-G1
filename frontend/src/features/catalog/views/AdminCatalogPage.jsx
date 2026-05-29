import { useMemo, useState } from "react";

import {
    Search,
    Package,
    CircleCheckBig,
    CircleX,
    Plus,
} from "lucide-react";

import { useCatalog } from "../hooks/useCatalog";
import CatalogTable from "../components/CatalogTable";
import ProductModal from "../components/AdminProductModal";

import {
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/catalog.service";

export default function AdminCatalogPage() {

    const { products, loading, reload } = useCatalog();

    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.product_name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            product.product_brand
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [products, search]);

    const stats = {
        total: products.length,
        active: products.filter(
            (p) => p.product_status === "ACTIVE"
        ).length,
        inactive: products.filter(
            (p) => p.product_status === "INACTIVE"
        ).length,
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setOpenModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setOpenModal(true);
    };

    const handleSave = async (form) => {
        try {
            if (editingProduct) {
                await updateProduct(
                    editingProduct.product_id,
                    form
                );
            } else {
                await createProduct(form);
            }

            await reload();
            setOpenModal(false);
            setEditingProduct(null);

        } catch (error) {
            console.log(error);
            alert("Error guardando producto");
        }
    };

    const handleDelete = async (id) => {
        const ok = confirm("¿Eliminar producto?");
        if (!ok) return;

        try {
            await deleteProduct(id);
            await reload();
        } catch (error) {
            console.log(error);
            alert("Error eliminando producto");
        }
    };

    const handleView = (product) => {
        alert(`
PRODUCTO

Nombre: ${product.product_name}
Marca: ${product.product_brand}
Categoría: ${product.categories?.category_name}
Estado: ${product.product_status}
Descripción: ${product.product_description}
        `);
    };

    return (
        <div className="p-6 bg-[#f7f8fc] min-h-screen">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Global Product Catalog
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage marketplace products
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                    <Plus size={18} />
                    Create Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                <div className="bg-white rounded-2xl p-5 shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Package className="text-blue-600" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold">
                                {stats.total}
                            </h2>
                            <p className="text-gray-500">
                                Total Products
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <CircleCheckBig className="text-green-600" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold">
                                {stats.active}
                            </h2>
                            <p className="text-gray-500">
                                Active Products
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-xl">
                            <CircleX className="text-red-600" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold">
                                {stats.inactive}
                            </h2>
                            <p className="text-gray-500">
                                Inactive Products
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-4 mb-5">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full pl-10 pr-4 py-3 border rounded-xl"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                {loading ? (
                    <div className="p-6">
                        Loading...
                    </div>
                ) : (
                    <CatalogTable
                        products={filteredProducts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                        mode="admin"
                    />
                )}
            </div>

            <ProductModal
                isOpen={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditingProduct(null);
                }}
                onSave={handleSave}
                editingProduct={editingProduct}
            />

        </div>
    );
}