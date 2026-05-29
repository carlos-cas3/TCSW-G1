import { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import CatalogSkeletonRow from "./CatalogSkeletonRow";
import CatalogConfirmModal from "./CatalogConfirmModal";
import { sortProducts } from "../utils/catalogHelpers";
import "../styles/table.css";

const TABLE_HEADERS_ADMIN = [
  { key: "productName", label: "Producto", sortable: true },
  { key: "category", label: "Categoría", sortable: true },
  { key: "brand", label: "Marca", sortable: true },
  { key: "status", label: "Estado", sortable: true },
  { key: "actions", label: "Acciones" },
];

const TABLE_HEADERS_VENDOR = [
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
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(null);

  const PAGE_SIZE_KEY = "catalog_page_size";
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem(PAGE_SIZE_KEY);
    return saved ? parseInt(saved, 10) : 10;
  });
  const [currentPage, setCurrentPage] = useState(1);

  const isVendor = mode === "vendor";
  const headers = isVendor ? TABLE_HEADERS_VENDOR : TABLE_HEADERS_ADMIN;

  const sortedProducts = useMemo(() =>
    sortProducts(products, sortKey, sortDir),
    [products, sortKey, sortDir]
  );

  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  const paginatedProducts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, safeCurrentPage, pageSize]);

  const handleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const SortIcon = ({ columnKey }) => {
    const isAsc = sortKey === columnKey && sortDir === "asc";
    const isDesc = sortKey === columnKey && sortDir === "desc";
    const mute = "text-gray-400";
    const active = "text-blue-600";

    return (
      <div className="flex flex-col items-center leading-none">
        <ArrowUp className={`w-3 h-3 ${isAsc ? active : mute}`} />
        <ArrowDown className={`w-3 h-3 ${isDesc ? active : mute} -mt-1`} />
      </div>
    );
  };

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

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    localStorage.setItem(PAGE_SIZE_KEY, newSize);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="catalog-table-scroll">
        <table className="catalog-table">
          <thead className="catalog-table-head">
            <tr>
              {headers.map(({ key, label }) => (
                <th key={key} className="catalog-table-header">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="catalog-table-body">
            {[...Array(5)].map((_, i) => (
              <CatalogSkeletonRow key={i} mode={mode} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="catalog-table-empty">
        <p>No hay productos registrados</p>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="catalog-table-empty">
        <p>No se encontraron resultados con los filtros actuales</p>
      </div>
    );
  }

  const pageStart = sortedProducts.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(safeCurrentPage * pageSize, sortedProducts.length);

  return (
    <>
      <div className="catalog-table-scroll">
        <div className="catalog-pagination-top">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>por página</span>
          </div>
        </div>
        <table className="catalog-table">
          <thead className="catalog-table-head">
            <tr>
              {headers.map(({ key, label, sortable }) => (
                <th
                  key={key}
                  className={`catalog-table-header ${sortable ? "catalog-table-header-sortable" : ""}`}
                  onClick={sortable ? () => handleSort(key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortable && <SortIcon columnKey={key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="catalog-table-body">
            {paginatedProducts.map((product) => {
              const info = product.products || product;
              const productName = info.product_name || "Sin nombre";
              const productBrand = info.product_brand || "—";
              const productDescription = info.product_description || "";
              const imageUrl = info.image_url || "https://placehold.co/60x60";
              const categoryName = info.categories?.category_name || "—";
              const status = product.status || info.product_status || "INACTIVE";

              return (
                <tr key={product.vendor_product_id || product.product_id} className="catalog-table-row">
                  <td className="catalog-table-cell">
                    <div className="flex items-center gap-4">
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="w-14 h-14 rounded-xl object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{productName}</p>
                        {productDescription && (
                          <p className="text-sm text-gray-500 line-clamp-1">{productDescription}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="catalog-table-cell text-gray-700">{categoryName}</td>
                  <td className="catalog-table-cell text-gray-700">{productBrand}</td>
                  {isVendor && (
                    <>
                      <td className="catalog-table-cell text-gray-700">
                        {product.price != null ? `S/ ${product.price}` : "—"}
                      </td>
                      <td className="catalog-table-cell text-gray-700">
                        {product.stock != null ? product.stock : "—"}
                      </td>
                    </>
                  )}
                  <td className="catalog-table-cell">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="catalog-table-cell">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => onView(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sortedProducts.length > 0 && (
          <div className="catalog-pagination-bottom">
            <span className="text-sm text-gray-600">
              Mostrando {pageStart}–{pageEnd} de {sortedProducts.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="catalog-pagination-btn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`catalog-pagination-page ${
                    page === safeCurrentPage ? "catalog-pagination-page-active" : ""
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="catalog-pagination-btn"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      <CatalogConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name}
      />
    </>
  );
}
