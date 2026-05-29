import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Package } from "lucide-react";

const PLACEHOLDER = "https://placehold.co/60x60";

export default function ProductCombobox({
  products,
  categoryFilter,
  onCategoryChange,
  value,
  onChange,
  disabled,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const ignoreFocus = useRef(false);

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.categories?.category_name).filter(Boolean))];
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.product_name?.toLowerCase().includes(q) ||
          p.product_brand?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter && categoryFilter !== "ALL") {
      result = result.filter((p) => p.categories?.category_name === categoryFilter);
    }
    return result;
  }, [products, search, categoryFilter]);

  const selectedProduct = products.find((p) => p.product_id?.toString() === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = () => {
    if (!disabled) {
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (productId) => {
    onChange({ target: { name: "product_id", value: productId.toString() } });
    setIsOpen(false);
    setSearch("");
    ignoreFocus.current = true;
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex].product_id);
        } else if (filtered.length === 1) {
          handleSelect(filtered[0].product_id);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearch("");
        break;
    }
  };

  const displayValue = isOpen
    ? search
    : selectedProduct
    ? `${selectedProduct.product_name} — ${selectedProduct.product_brand}`
    : "";

  const inputClasses = [
    "w-full pl-9 pr-3 py-2.5 text-sm bg-white border rounded-lg transition-all duration-150",
    "focus:outline-none focus:ring-2",
    disabled ? "bg-stone-50 cursor-not-allowed" : "",
    error
      ? "border-red-300 focus:ring-red-500/30 focus:border-red-500"
      : "border-stone-200 hover:border-stone-300 focus:ring-blue-500/30 focus:border-blue-500",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls={isOpen ? "product-listbox" : undefined}
            aria-activedescendant={
              isOpen && highlightedIndex >= 0 && filtered[highlightedIndex]
                ? `product-${filtered[highlightedIndex].product_id}`
                : undefined
            }
            value={displayValue}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!isOpen) openDropdown();
            }}
            onFocus={() => {
              if (ignoreFocus.current) {
                ignoreFocus.current = false;
                return;
              }
              openDropdown();
            }}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Cargando productos..." : "Buscar producto por nombre o marca..."}
            disabled={disabled}
            className={inputClasses}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange({ target: { name: "categoryFilter", value: e.target.value } })}
          className="w-40 px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg transition-all duration-150 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        >
          <option value="ALL">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isOpen && (
        <ul
          id="product-listbox"
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border border-stone-200 rounded-lg shadow-lg max-h-72 overflow-y-auto animate-combobox-open"
        >
          {filtered.length > 0 ? (
            filtered.map((product, idx) => {
              const isSelected = product.product_id?.toString() === value;
              const isHighlighted = idx === highlightedIndex;
              return (
                <li
                  key={product.product_id}
                  id={`product-${product.product_id}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(product.product_id)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={[
                    "px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-colors duration-75",
                    isSelected
                      ? "bg-blue-50"
                      : isHighlighted
                      ? "bg-stone-100"
                      : "hover:bg-stone-50",
                  ].join(" ")}
                >
                  <img
                    src={product.image_url || PLACEHOLDER}
                    alt={product.product_name}
                    className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={[
                        "text-sm truncate",
                        isSelected ? "font-semibold text-blue-700" : "font-medium text-stone-900",
                      ].join(" ")}
                    >
                      {product.product_name}
                    </p>
                    <p className="text-xs text-stone-400 truncate">
                      {product.product_brand}
                      {product.categories?.category_name && (
                        <> · {product.categories.category_name}</>
                      )}
                    </p>
                  </div>
                  {!product.image_url && (
                    <Package className="w-4 h-4 text-stone-300 shrink-0" />
                  )}
                </li>
              );
            })
          ) : (
            <li className="px-3 py-4 text-sm text-stone-400 italic text-center">
              No se encontraron productos
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
