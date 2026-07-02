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

export const mapGrowthSummary = (current, previous) => {
    if (!current) return [];
    const calcGrowth = (curr, prev) => {
        if (!prev || prev === 0) return curr > 0 ? 100 : 0;
        return Math.round(((curr - prev) / prev) * 100);
    };
    return [
        {
            label: "Ingresos",
            value: current.totalRevenue ?? 0,
            growth: calcGrowth(current.totalRevenue, previous?.totalRevenue),
            prefix: "S/",
        },
        {
            label: "Pedidos",
            value: current.totalOrders ?? 0,
            growth: calcGrowth(current.totalOrders, previous?.totalOrders),
        },
        {
            label: "Ticket Promedio",
            value: current.avgOrderValue ?? 0,
            growth: calcGrowth(current.avgOrderValue, previous?.avgOrderValue),
            prefix: "S/",
        },
    ];
};

export const mapRevenueTrend = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
        month: item.month,
        revenue: Number(item.revenue) || 0,
    }));
};

export const mapOrdersTrend = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
        month: item.month,
        completed: item.completed ?? 0,
        pending: item.pending ?? 0,
        cancelled: item.cancelled ?? 0,
    }));
};

export const mapCategories = (data, totalRevenue) => {
    if (!Array.isArray(data)) return [];
    const total = totalRevenue || data.reduce((s, c) => s + (c.revenue || 0), 0);
    return data.map((item) => ({
        category: item.category,
        revenue: Number(item.revenue) || 0,
        percentage: item.percentage ?? (total > 0 ? Math.round((item.revenue / total) * 100) : 0),
    }));
};

export const generateInsights = (trendsData, categoriesData, currentMetrics, previousMetrics) => {
    const insights = [];

    if (trendsData?.length >= 2) {
        const last = trendsData[trendsData.length - 1];
        const prev = trendsData[trendsData.length - 2];
        if (last.revenue > prev.revenue) {
            insights.push({
                type: "positive",
                title: "Tendencia al alza",
                description: `Los ingresos de ${last.month} (S/${last.revenue.toLocaleString("es-PE")}) superan a ${prev.month} en +${Math.round(((last.revenue - prev.revenue) / prev.revenue) * 100)}%.`,
            });
        } else {
            insights.push({
                type: "warning",
                title: "Caída mensual",
                description: `Los ingresos de ${last.month} (S/${last.revenue.toLocaleString("es-PE")}) estuvieron por debajo de ${prev.month}. Revise la tendencia.`,
            });
        }
    }

    if (categoriesData?.length > 0) {
        const top = categoriesData.reduce((max, c) => (c.percentage > max.percentage ? c : max));
        insights.push({
            type: "info",
            title: "Categoría líder",
            description: `${top.category} representa el ${top.percentage}% de los ingresos totales.`,
        });
    }

    if (previousMetrics && currentMetrics) {
        const cmp = (key, label) => {
            const curr = currentMetrics[key] ?? 0;
            const prev = previousMetrics[key] ?? 0;
            if (curr >= prev) return;
            const drop = Math.round(((prev - curr) / prev) * 100);
            if (drop > 10) {
                insights.push({
                    type: "critical",
                    title: `Caída en ${label}`,
                    description: `${label} disminuyó un ${drop}% respecto al período anterior.`,
                });
            }
        };
        cmp("totalOrders", "pedidos");
        cmp("totalRevenue", "ingresos");
    }

    return insights.slice(0, 4);
};
