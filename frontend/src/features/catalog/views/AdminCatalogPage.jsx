import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import { useCatalog } from "../hooks/useCatalog";
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
import ProductModal from "../components/AdminProductModal";

import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/catalog.service";

export default function AdminCatalogPage() {
  const { products, loading, error, reload } = useCatalog();
  const { filters, filteredProducts, stats, updateFilter, resetFilters } =
    useCatalogFilters(products);

  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setOpenModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenModal(true);
  };

  const handleSave = async (form) => {
    if (editingProduct) {
      await updateProduct(editingProduct.product_id, form);
    } else {
      await createProduct(form);
    }
    await reload();
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await reload();
    } catch {
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo Global de Productos</h1>
          <p className="text-gray-500 mt-1">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} de {products.length} total
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
            Crear Producto
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
          mode="admin"
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
