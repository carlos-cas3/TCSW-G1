import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable from "../../../shared/components/DataTable";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { sortProducts } from "../utils/catalogHelpers";

const STATUS_STYLE = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-red-100 text-red-700",
};

const COLUMNS_ADMIN = [
  { key: "productName", label: "Producto", sortable: true },
  { key: "category", label: "Categoría", sortable: true },
  { key: "brand", label: "Marca", sortable: true },
  { key: "status", label: "Estado", sortable: true },
  { key: "actions", label: "Acciones" },
];

const COLUMNS_VENDOR = [
  { key: "productName", label: "Producto", sortable: true },
  { key: "category", label: "Categoría", sortable: true },
  { key: "brand", label: "Marca", sortable: true },
  { key: "price", label: "Precio", sortable: true },
  { key: "stock", label: "Stock", sortable: true },
  { key: "status", label: "Estado", sortable: true },
  { key: "actions", label: "Acciones" },
];

export default function CatalogTable({
  products,
  onEdit,
  onDelete,
  onView,
  loading,
  mode = "admin",
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const isVendor = mode === "vendor";
  const columns = isVendor ? COLUMNS_VENDOR : COLUMNS_ADMIN;

  const handleDeleteClick = (product) => {
    const info = product.products || product;
    setProductToDelete({ product, name: info.product_name || "Sin nombre" });
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      const id = productToDelete.product.vendor_product_id || productToDelete.product.product_id;
      onDelete(id);
    }
    setModalOpen(false);
    setProductToDelete(null);
  };

  const getInfo = (product) => product.products || product;

  const dataColumns = columns.map((col) => {
    if (col.key === "productName") {
      return {
        ...col,
        render: (product) => {
          const info = getInfo(product);
          return (
            <div className="flex items-center gap-4">
              <img
                src={info.image_url || "https://placehold.co/60x60"}
                alt={info.product_name || "Sin nombre"}
                className="w-14 h-14 rounded-xl object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-900">{info.product_name || "Sin nombre"}</p>
                {info.product_description && (
                  <p className="text-sm text-gray-500 line-clamp-1">{info.product_description}</p>
                )}
              </div>
            </div>
          );
        },
      };
    }
    if (col.key === "category") {
      return {
        ...col,
        render: (product) => (
          <span className="text-gray-700">{getInfo(product).categories?.category_name || "—"}</span>
        ),
      };
    }
    if (col.key === "brand") {
      return {
        ...col,
        render: (product) => (
          <span className="text-gray-700">{getInfo(product).product_brand || "—"}</span>
        ),
      };
    }
    if (col.key === "price") {
      return {
        ...col,
        render: (product) => (
          <span className="text-gray-700">
            {product.price != null ? `S/ ${product.price}` : "—"}
          </span>
        ),
      };
    }
    if (col.key === "stock") {
      return {
        ...col,
        render: (product) => (
          <span className="text-gray-700">{product.stock != null ? product.stock : "—"}</span>
        ),
      };
    }
    if (col.key === "status") {
      return {
        ...col,
        render: (product) => {
          const info = getInfo(product);
          const status = product.status || info.product_status || "INACTIVE";
          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[status] || STATUS_STYLE.INACTIVE}`}>
              {status}
            </span>
          );
        },
      };
    }
    if (col.key === "actions") {
      return {
        ...col,
        render: (product) => (
          <div className="flex items-center justify-end gap-4">
            <button onClick={() => onView(product)} className="text-blue-600 hover:text-blue-800">
              <Eye size={18} />
            </button>
            <button onClick={() => onEdit(product)} className="text-yellow-600 hover:text-yellow-800">
              <Pencil size={18} />
            </button>
            <button onClick={() => handleDeleteClick(product)} className="text-red-600 hover:text-red-800">
              <Trash2 size={18} />
            </button>
          </div>
        ),
      };
    }
    return col;
  });

  return (
    <>
      <DataTable
        columns={dataColumns}
        data={products}
        loading={loading}
        sortFn={sortProducts}
        pageSizeKey="catalog_page_size"
        emptyMessage="No hay productos registrados"
        emptyFilterMessage="No se encontraron resultados con los filtros actuales"
      />
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        variant="danger"
        title="Confirmar eliminación"
        message={
          <>
            ¿Estás seguro de que deseas eliminar el producto{" "}
            <strong className="text-gray-900">{productToDelete?.name}</strong>?
            <br />
            <span className="text-sm text-gray-500">Esta acción no se puede deshacer.</span>
          </>
        }
        confirmLabel="Eliminar"
        loadingLabel="Eliminando..."
      />
    </>
  );
}
