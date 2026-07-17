import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import { useVendorCatalog } from "../hooks/useVendorCatalog";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import CatalogTable from "../components/CatalogTable";
import createStatsCards from "../../../shared/components/createStatsCards";
import { Package, CircleCheckBig, CircleX } from "lucide-react";

const CatalogStatsCards = createStatsCards([
  { label: "Total Productos", valueKey: "total", icon: Package, color: "blue" },
  { label: "Activos", valueKey: "active", icon: CircleCheckBig, color: "green" },
  { label: "Inactivos", valueKey: "inactive", icon: CircleX, color: "red" },
]);
import CatalogFilters from "../components/CatalogFilters";
import ProductModal from "../components/ProductModal";

import {
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
} from "../services/vendorProducts.service";

export default function VendorCatalogPage() {
  const { products, loading, error, reload } = useVendorCatalog();
  const { filters, filteredProducts, stats, updateFilter, resetFilters } =
    useCatalogFilters(products);

  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const handleCreate = () => {
    setEditingProduct(null);
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleSave = async (form) => {
    if (!vendorId) {
      throw new Error("No se encontró el ID del vendedor");
    }

    if (editingProduct) {
      await updateVendorProduct(editingProduct.vendor_product_id, {
        price: Number(form.price),
        stock: Number(form.stock),
        status: form.status,
      });
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
  };

  const handleDelete = async (id) => {
    try {
      await deleteVendorProduct(id);
      await reload();
    } catch {
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Productos</h1>
          <p className="text-gray-500 mt-1">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} en tu catálogo
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Agregar Producto
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={reload}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      <CatalogStatsCards stats={stats} />

      <CatalogFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <CatalogTable
          products={filteredProducts}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          mode="vendor"
        />
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
