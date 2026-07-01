export const mapRevenueSeries = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
        date: item.date,
        revenue: Number(item.total) || 0,
    }));
};

export const mapOrdersDistribution = (data) => {
    if (!data) return { pending: 0, completed: 0, cancelled: 0 };
    return {
        pending: data.pending || 0,
        completed: data.completed || 0,
        cancelled: data.cancelled || 0,
    };
};

export const mapTopProducts = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
        name: item.name || "—",
        category: item.category || "—",
        sales: item.sales ?? 0,
        revenue: Number(item.total) || 0,
    }));
};

export const mapTopVendors = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
        vendorName: item.vendorName || item.name || "—",
        totalRevenue: Number(item.total) || 0,
        orders: item.orders ?? 0,
        status: item.status || "active",
    }));
};

export const mapDashboardMetrics = (role, raw) => {
    if (!raw) return {};

    const base = {
        totalRevenue: Number(raw.totalRevenue) || 0,
        totalOrders: raw.totalOrders ?? 0,
        avgOrderValue: Number(raw.avgOrderValue) || 0,
    };

    if (role === 1) {
        return {
            ...base,
            totalVendors: raw.totalVendors ?? 0,
            activeVendors: raw.activeVendors ?? 0,
        };
    }

    return {
        ...base,
        activeProducts: raw.activeProducts ?? 0,
        avgTicket: Number(raw.avgTicket || raw.avgOrderValue) || 0,
    };
};
