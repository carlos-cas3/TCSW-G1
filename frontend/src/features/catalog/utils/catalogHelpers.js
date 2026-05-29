export function filterProducts(products, filters) {
  return products.filter((product) => {
    const info = product.products || product;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesSearch =
        info.product_name?.toLowerCase().includes(q) ||
        info.product_brand?.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (filters.status && filters.status !== "all") {
      const status = product.status || info.product_status;
      if (status !== filters.status) return false;
    }

    return true;
  });
}

export function sortProducts(products, sortKey, sortDir) {
  if (!sortKey || !sortDir) return products;

  return [...products].sort((a, b) => {
    const infoA = a.products || a;
    const infoB = b.products || b;

    let valA, valB;

    switch (sortKey) {
      case "productName":
        valA = (infoA.product_name || "").toLowerCase();
        valB = (infoB.product_name || "").toLowerCase();
        break;
      case "category":
        valA = (infoA.categories?.category_name || "").toLowerCase();
        valB = (infoB.categories?.category_name || "").toLowerCase();
        break;
      case "brand":
        valA = (infoA.product_brand || "").toLowerCase();
        valB = (infoB.product_brand || "").toLowerCase();
        break;
      case "price":
        valA = a.price != null ? Number(a.price) : 0;
        valB = b.price != null ? Number(b.price) : 0;
        break;
      case "stock":
        valA = a.stock != null ? Number(a.stock) : 0;
        valB = b.stock != null ? Number(b.stock) : 0;
        break;
      case "status":
        valA = a.status || infoA.product_status || "";
        valB = b.status || infoB.product_status || "";
        break;
      default:
        return 0;
    }

    if (typeof valA === "string") {
      const cmp = valA.localeCompare(valB, "es", { sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    }

    return sortDir === "asc" ? valA - valB : valB - valA;
  });
}

export function getStats(products) {
  return {
    total: products.length,
    active: products.filter((p) => {
      const status = p.status || p.product_status;
      return status === "ACTIVE";
    }).length,
    inactive: products.filter((p) => {
      const status = p.status || p.product_status;
      return status === "INACTIVE";
    }).length,
  };
}
