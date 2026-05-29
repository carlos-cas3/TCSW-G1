import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    RefreshCw,
} from "lucide-react";

import { API } from "../../../config/api";

import CatalogTable from "../components/CatalogTable";
import ProductModal from "../components/ProductModal";

import {
    createVendorProduct,
    updateVendorProduct,
    deleteVendorProduct,
} from "../services/vendorProducts.service";

export default function VendorCatalogPage() {

    const user = JSON.parse(
        localStorage.getItem("tcsw_user") ||
        sessionStorage.getItem("tcsw_user") ||
        "{}"
    );

    const vendorId =
        user?.vendor_id ||
        user?.vendorId ||
        user?.vendor?.vendor_id ||
        user?.vendor?.vendorId;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [openModal, setOpenModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const reload = async () => {

        try {

            setLoading(true);

            if (!vendorId) {
                console.error(
                    "No se encontró vendorId en tcsw_user:",
                    user
                );

                setProducts([]);
                return;
            }

            const url =
                `${API.CATALOG}/api/vendor-products/${vendorId}`;

            console.log("GET vendor products:", url);

            const response =
                await fetch(url);

            const data =
                await response.json();

            console.log("Vendor products response:", data);

            setProducts(data.data || []);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        reload();

    }, [vendorId]);

    const filteredProducts = useMemo(() => {

        return products.filter((product) => {

            const productName =
                product.products?.product_name || "";

            const productBrand =
                product.products?.product_brand || "";

            const matchesSearch =
                search.trim() === "" ||
                productName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                productBrand
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL"
                    ? true
                    : product.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [products, search, statusFilter]);

    const stats = {
        total: products.length,

        active: products.filter(
            p => p.status === "ACTIVE"
        ).length,

        inactive: products.filter(
            p => p.status === "INACTIVE"
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

            if (!vendorId) {
                alert("No se encontró el ID del vendedor");
                return;
            }

            if (editingProduct) {

                await updateVendorProduct(
                    editingProduct.vendor_product_id,
                    {
                        price: Number(form.price),
                        stock: Number(form.stock),
                        status: form.status,
                    }
                );

            } else {

                await createVendorProduct({
                    vendor_id: Number(vendorId),
                    product_id: Number(form.product_id),
                    price: Number(form.price),
                    stock: Number(form.stock),
                    status: form.status,
                });

            }

            await reload();

            setOpenModal(false);
            setEditingProduct(null);

        } catch (error) {

            console.log(error);
            alert("Error guardando");

        }

    };

    const handleDelete = async (id) => {

        const ok =
            confirm("¿Eliminar producto?");

        if (!ok) return;

        try {

            await deleteVendorProduct(id);
            await reload();

        } catch (error) {

            console.log(error);
            alert("Error eliminando");

        }

    };

    const handleView = (product) => {

        alert(`
PRODUCTO

Nombre: ${product.products?.product_name}
Marca: ${product.products?.product_brand}
Precio: ${product.price}
Stock: ${product.stock}
Estado: ${product.status}
        `);

    };

    return (

        <div className="p-6 bg-[#f7f8fc] min-h-screen">

            <div className="flex items-center justify-between mb-8">

                <div>
                    <h1 className="text-3xl font-bold">
                        My Products
                    </h1>

                    <p className="text-gray-500">
                        Manage your vendor catalog
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>

            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">

                <div className="bg-white p-4 rounded-xl border">
                    Total: {stats.total}
                </div>

                <div className="bg-white p-4 rounded-xl border">
                    Active: {stats.active}
                </div>

                <div className="bg-white p-4 rounded-xl border">
                    Inactive: {stats.inactive}
                </div>

            </div>

            <div className="flex gap-3 mb-6">

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search..."
                    className="border p-2 rounded"
                />

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    className="border p-2 rounded"
                >
                    <option value="ALL">
                        All
                    </option>

                    <option value="ACTIVE">
                        Active
                    </option>

                    <option value="INACTIVE">
                        Inactive
                    </option>
                </select>

                <button
                    onClick={reload}
                    className="border px-3 rounded"
                >
                    <RefreshCw size={16} />
                </button>

            </div>

            {loading ? (

                <p>Cargando...</p>

            ) : (

                <CatalogTable
                    products={filteredProducts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                />

            )}

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