import { useState } from "react";
import DataTable from "../../../shared/table/DataTable";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import { STATUS_COLORS, STATUS_LABELS } from "../../../shared/utils/statusUtils";
import TableActions from "../../../shared/components/TableActions";
import { sortProducts } from "../utils/catalogHelpers";

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
          const palette = STATUS_COLORS[status] || STATUS_COLORS.INACTIVE;
          const label = STATUS_LABELS[status] || status;
          return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${palette.bg} ${palette.text} ${palette.border}`}>
              <span className={`w-2 h-2 rounded-full ${palette.dot}`} />
              {label}
            </span>
          );
        },
      };
    }
    if (col.key === "actions") {
      return {
        ...col,
        render: (product) => (
          <TableActions
            show={["view", "edit", "delete"]}
            onView={() => onView(product)}
            onEdit={() => onEdit(product)}
            onDelete={() => handleDeleteClick(product)}
            size="md"
          />
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
