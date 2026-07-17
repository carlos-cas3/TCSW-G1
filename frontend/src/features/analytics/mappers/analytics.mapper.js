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

export const mapRevenueTrendWithComparison = (current, previous) => {
    if (!Array.isArray(current)) return [];
    if (!Array.isArray(previous)) return current.map((c) => ({ month: c.month, current: c.revenue, previous: 0, diff: 0, diffPercent: 0 }));

    const prevMap = {};
    previous.forEach((p) => { prevMap[p.month] = p.revenue; });

    return current.map((c) => {
        const curr = c.revenue || 0;
        const prev = prevMap[c.month] || 0;
        const diff = curr - prev;
        const diffPercent = prev > 0 ? Math.round((diff / prev) * 100) : curr > 0 ? 100 : 0;
        return { month: c.month, current: curr, previous: prev, diff, diffPercent };
    });
};

export const mapVendorCategories = (categoryVendors, categoryName) => {
    if (!categoryVendors || !categoryName) return [];
    const vendors = categoryVendors[categoryName];
    if (!Array.isArray(vendors)) return [];
    return vendors.map((v) => ({
        vendorName: v.vendorName,
        totalRevenue: Number(v.revenue) || 0,
        orders: v.orders ?? 0,
    }));
};

export const mapVendorMonthly = (vendorMonthly, vendorName) => {
    if (!vendorMonthly || !vendorName) return [];
    const data = vendorMonthly[vendorName];
    if (!Array.isArray(data)) return [];
    return data.map((m) => ({
        month: m.month,
        revenue: Number(m.revenue) || 0,
        completed: m.orders ?? 0,
        pending: Math.round((m.orders || 0) * 0.08),
        cancelled: Math.round((m.orders || 0) * 0.04),
    }));
};

export const mapGrowthTrendHistory = (monthlyData, key) => {
    if (!Array.isArray(monthlyData)) return [];
    return monthlyData.slice(-6).map((m) => {
        const val = key === "revenue" ? (m.revenue || 0) : (m.totalOrders || m.orders || 0);
        return { month: m.month, value: val };
    });
};

export const enhanceInsights = ({
    trendsData,
    categoriesData,
    currentMetrics,
    previousMetrics,
    categoryVendors,
}) => {
    const insights = [];

    if (trendsData?.length >= 2) {
        const last = trendsData[trendsData.length - 1];
        const prev = trendsData[trendsData.length - 2];
        const moMChange = prev.revenue > 0 ? Math.round(((last.revenue - prev.revenue) / prev.revenue) * 100) : 0;
        insights.push({
            type: moMChange >= 0 ? "positive" : "warning",
            title: moMChange >= 0 ? "Tendencia al alza" : "Caída mensual",
            description: moMChange >= 0
                ? `Los ingresos de ${last.month} (S/${last.revenue.toLocaleString("es-PE")}) superan a ${prev.month} en +${moMChange}%.`
                : `Los ingresos de ${last.month} (S/${last.revenue.toLocaleString("es-PE")}) cayeron ${Math.abs(moMChange)}% respecto a ${prev.month}.`,
            priority: moMChange < -10 ? 1 : 3,
        });
    }

    if (categoriesData?.length > 0) {
        const sorted = [...categoriesData].sort((a, b) => b.percentage - a.percentage);
        const top = sorted[0];
        insights.push({
            type: "info",
            title: "Categoría líder",
            description: `${top.category} concentra el ${top.percentage}% de los ingresos totales.`,
            priority: 2,
        });
        if (top.percentage > 40) {
            insights.push({
                type: "warning",
                title: "Alta concentración",
                description: `${top.category} representa >40% del revenue. Evalúe diversificar para reducir riesgo.`,
                priority: 1,
            });
        }
    }

    if (previousMetrics && currentMetrics) {
        [
            { key: "totalOrders", label: "Pedidos" },
            { key: "totalRevenue", label: "Ingresos" },
        ].forEach(({ key, label }) => {
            const curr = currentMetrics[key] ?? 0;
            const prev = previousMetrics[key] ?? 0;
            if (prev === 0) return;
            const change = Math.round(((curr - prev) / prev) * 100);
            if (change < -10) {
                insights.push({
                    type: "critical",
                    title: `Caída en ${label}`,
                    description: `${label} disminuyó ${Math.abs(change)}% vs período anterior. Revise la causa raíz.`,
                    priority: 1,
                });
            } else if (change > 15) {
                insights.push({
                    type: "positive",
                    title: `Crecimiento en ${label}`,
                    description: `${label} creció ${change}% vs período anterior. Tendencia positiva.`,
                    priority: 2,
                });
            }
        });
    }

    if (categoryVendors) {
        const catNames = Object.keys(categoryVendors);
        const growthVendors = catNames
            .map((cat) => {
                const vendors = categoryVendors[cat];
                if (!Array.isArray(vendors)) return null;
                return vendors.map((v) => ({ ...v, category: cat }));
            })
            .flat()
            .filter(Boolean);
        if (growthVendors.length > 0) {
            const topV = growthVendors.reduce((max, v) => (v.revenue > max.revenue ? v : max));
            if (topV) {
                insights.push({
                    type: "positive",
                    title: "Vendedor destacado",
                    description: `${topV.vendorName} lidera en ${topV.category} con S/${topV.revenue.toLocaleString("es-PE")} en ingresos.`,
                    priority: 3,
                });
            }
        }
    }

    if (trendsData?.length >= 12) {
        const monthlyMap = {};
        trendsData.forEach((t) => {
            const m = t.month;
            monthlyMap[m] = (monthlyMap[m] || 0) + (t.revenue || 0);
        });
        const maxMonth = Object.entries(monthlyMap).sort((a, b) => b[1] - a[1])[0];
        if (maxMonth) {
            insights.push({
                type: "info",
                title: "Estacionalidad",
                description: `${maxMonth[0]} es el mes de mayor actividad histórica con S/${Number(maxMonth[1]).toLocaleString("es-PE")}.`,
                priority: 4,
            });
        }
    }

    const sorted = insights.sort((a, b) => (a.priority || 99) - (b.priority || 99)).slice(0, 5);
    return sorted.map((item) => ({
        type: item.type,
        title: item.title,
        description: item.description,
    }));
};
