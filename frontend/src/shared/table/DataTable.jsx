import { useMemo } from "react";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import useTableSort from "../hooks/useTableSort";
import useTablePagination from "../hooks/useTablePagination";
import DataTableSkeleton from "./components/DataTableSkeleton";
import "../styles/table.css";

function SortIcon({ columnKey, sortKey, sortDir }) {
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
}

export default function DataTable({
  columns,
  data = [],
  loading,
  sortFn,
  pageSizeKey,
  emptyMessage = "No hay registros",
  emptyFilterMessage = "No se encontraron resultados con los filtros actuales",
  skeletonRows = 5,
  fixedHeight = false,
  toolbar,
}) {
  const { sortKey, sortDir, handleSort } = useTableSort();

  const sortedData = useMemo(
    () => (sortFn ? sortFn(data, sortKey, sortDir) : data),
    [data, sortKey, sortDir, sortFn]
  );

  const {
    pageSize,
    currentPage,
    totalPages,
    paginatedData,
    pageStart,
    pageEnd,
    handlePageSizeChange,
    goToPage,
    getPageNumbers,
  } = useTablePagination({ data: sortedData, pageSizeKey });

  const scrollHeight = fixedHeight
    ? { height: typeof fixedHeight === "string" ? fixedHeight : "480px" }
    : undefined;

  const showPagination = sortedData.length > 0;

  const renderContent = () => {
    if (loading) {
      return (
        <>
          {showPagination && (
            <div className="data-pagination-top">
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
          )}
          <table className="data-table">
            <thead className="data-table-head">
              <tr>
                {columns.map(({ key, label }) => (
                  <th key={key} className="data-table-header">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="data-table-body">
              <DataTableSkeleton columns={columns} rows={skeletonRows} />
            </tbody>
          </table>
        </>
      );
    }

    if (data.length === 0) {
      return <div className="data-table-empty"><p>{emptyMessage}</p></div>;
    }

    if (sortedData.length === 0) {
      return <div className="data-table-empty"><p>{emptyFilterMessage}</p></div>;
    }

    return (
      <>
        <div className="data-pagination-top">
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
        <table className="data-table">
          <thead className="data-table-head">
            <tr>
              {columns.map(({ key, label, sortable }) => (
                <th
                  key={key}
                  className={`data-table-header ${sortable ? "data-table-header-sortable" : ""}`}
                  onClick={sortable ? () => handleSort(key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortable && <SortIcon columnKey={key} sortKey={sortKey} sortDir={sortDir} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="data-table-body">
            {paginatedData.map((item, i) => (
              <tr key={item.id ?? item.key ?? i} className="data-table-row">
                {columns.map((col) => (
                  <td key={col.key} className="data-table-cell">
                    {col.render ? col.render(item) : item[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="data-pagination-bottom">
          <span className="text-sm text-gray-600">
            Mostrando {pageStart}–{pageEnd} de {sortedData.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="data-pagination-btn"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`data-pagination-page ${page === currentPage ? "data-pagination-page-active" : ""}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="data-pagination-btn"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="data-table-container">
      {toolbar && <div className="data-table-toolbar">{toolbar}</div>}
      {fixedHeight ? (
        <div className="data-table-scroll-fixed" style={scrollHeight}>
          <div className="inline-flex flex-col" style={{ minWidth: "100%" }}>
            {renderContent()}
          </div>
        </div>
      ) : (
        <div className={toolbar ? "data-table-scroll-inner" : "data-table-scroll"}>
          <div className="inline-flex flex-col" style={{ minWidth: "100%" }}>
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}
