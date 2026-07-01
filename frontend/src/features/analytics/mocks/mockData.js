export const MOCK_DASHBOARD_METRICS_ADMIN = {
    totalRevenue: 284750.50,
    totalOrders: 1243,
    totalVendors: 48,
    activeVendors: 36,
    avgOrderValue: 229.05,
};

export const MOCK_DASHBOARD_METRICS_VENDOR = {
    totalRevenue: 45230.00,
    totalOrders: 187,
    activeProducts: 23,
    avgOrderValue: 241.87,
};

export const MOCK_REVENUE_SERIES = [
    { date: "2026-01-01", total: 12500 },
    { date: "2026-01-02", total: 18200 },
    { date: "2026-01-03", total: 15800 },
    { date: "2026-01-04", total: 0 },
    { date: "2026-01-05", total: 22100 },
    { date: "2026-01-06", total: 19800 },
    { date: "2026-01-07", total: 17400 },
    { date: "2026-01-08", total: 21000 },
    { date: "2026-01-09", total: 19500 },
    { date: "2026-01-10", total: 16700 },
    { date: "2026-01-11", total: 14300 },
    { date: "2026-01-12", total: 25600 },
    { date: "2026-01-13", total: 18900 },
    { date: "2026-01-14", total: 0 },
    { date: "2026-01-15", total: 23200 },
    { date: "2026-01-16", total: 17800 },
    { date: "2026-01-17", total: 20100 },
    { date: "2026-01-18", total: 22400 },
    { date: "2026-01-19", total: 15600 },
    { date: "2026-01-20", total: 19200 },
    { date: "2026-01-21", total: 16800 },
    { date: "2026-01-22", total: 13900 },
    { date: "2026-01-23", total: 24500 },
    { date: "2026-01-24", total: 18300 },
    { date: "2026-01-25", total: 0 },
    { date: "2026-01-26", total: 27100 },
    { date: "2026-01-27", total: 21400 },
    { date: "2026-01-28", total: 19700 },
    { date: "2026-01-29", total: 23800 },
    { date: "2026-01-30", total: 26300 },
];

export const MOCK_REVENUE_MONTHLY = [
    { month: "Ene", revenue: 125000, quarter: "Q1", date: "2026-01-15" },
    { month: "Feb", revenue: 142000, quarter: "Q1", date: "2026-02-15" },
    { month: "Mar", revenue: 158000, quarter: "Q1", date: "2026-03-15" },
    { month: "Abr", revenue: 162000, quarter: "Q2", date: "2026-04-15" },
    { month: "May", revenue: 148000, quarter: "Q2", date: "2026-05-15" },
    { month: "Jun", revenue: 171000, quarter: "Q2", date: "2026-06-15" },
    { month: "Jul", revenue: 185000, quarter: "Q3", date: "2026-07-15" },
    { month: "Ago", revenue: 179000, quarter: "Q3", date: "2026-08-15" },
    { month: "Sep", revenue: 164000, quarter: "Q3", date: "2026-09-15" },
    { month: "Oct", revenue: 192000, quarter: "Q4", date: "2026-10-15" },
    { month: "Nov", revenue: 208000, quarter: "Q4", date: "2026-11-15" },
    { month: "Dic", revenue: 235000, quarter: "Q4", date: "2026-12-15" },
];

export const MOCK_ORDERS_DISTRIBUTION = {
    pending: 45,
    completed: 1120,
    cancelled: 78,
};

export const MOCK_ORDERS_DISTRIBUTION_BY_Q = {
    Q1: { pending: 12, completed: 280, cancelled: 18 },
    Q2: { pending: 8, completed: 310, cancelled: 22 },
    Q3: { pending: 15, completed: 295, cancelled: 14 },
    Q4: { pending: 10, completed: 235, cancelled: 24 },
    full: { pending: 45, completed: 1120, cancelled: 78 },
};

export const MOCK_TOP_PRODUCTS = [
    { name: "Laptop Gamer XPS 15", category: "Electrónicos", sales: 234, total: 351000.00 },
    { name: "Smart TV 55\" 4K", category: "Electrónicos", sales: 189, total: 283500.00 },
    { name: "Zapatillas Running Ultra", category: "Deportes", sales: 312, total: 93600.00 },
    { name: "Set de Sartenes Antiadherentes", category: "Hogar", sales: 198, total: 39600.00 },
    { name: "Perfume Importado 100ml", category: "Belleza", sales: 267, total: 66750.00 },
    { name: "Mochila Impermeable 40L", category: "Viajes", sales: 145, total: 29000.00 },
    { name: "Teclado Mecánico RGB", category: "Electrónicos", sales: 178, total: 35600.00 },
    { name: "Crema Hidratante Facial", category: "Belleza", sales: 423, total: 21150.00 },
    { name: "Cafetera Automática", category: "Hogar", sales: 92, total: 46000.00 },
    { name: "Audífonos Bluetooth Pro", category: "Electrónicos", sales: 345, total: 51750.00 },
];

export const MOCK_REVENUE_QUARTERLY = {
    2025: [
        { quarter: "Q1", revenue: 185000 },
        { quarter: "Q2", revenue: 212000 },
        { quarter: "Q3", revenue: 198000 },
        { quarter: "Q4", revenue: 241000 },
    ],
    2026: [
        { quarter: "Q1", revenue: 125000 },
        { quarter: "Q2", revenue: 142000 },
        { quarter: "Q3", revenue: 0 },
        { quarter: "Q4", revenue: 0 },
    ],
};

export const MOCK_OPERATIONAL_ALERTS = [
    {
        id: 1,
        type: "password",
        severity: "high",
        vendorName: "TechStore Perú",
        description: "90 días sin cambiar contraseña",
    },
    {
        id: 2,
        type: "password",
        severity: "high",
        vendorName: "Hogar & Estilo",
        description: "120 días sin cambiar contraseña",
    },
    {
        id: 3,
        type: "stock",
        severity: "medium",
        productName: "Laptop Gamer XPS 15",
        description: "Stock en 0 unidades",
    },
    {
        id: 4,
        type: "stock",
        severity: "low",
        productName: "Cafetera Automática",
        description: "Stock crítico: 2 unidades",
    },
];

export const MOCK_TOP_VENDORS = [
    { vendorName: "TechStore Perú", total: 84500.00, orders: 312, status: "active" },
    { vendorName: "Hogar & Estilo", total: 62300.00, orders: 245, status: "active" },
    { vendorName: "Belleza Total", total: 55400.00, orders: 198, status: "active" },
    { vendorName: "Deportes Extreme", total: 47800.00, orders: 167, status: "active" },
    { vendorName: "Viajero Feliz", total: 38900.00, orders: 134, status: "inactive" },
    { vendorName: "ElectroHogar", total: 32500.00, orders: 112, status: "active" },
    { vendorName: "Perfumería Chic", total: 28100.00, orders: 98, status: "active" },
    { vendorName: "Gamer Zone", total: 23400.00, orders: 87, status: "suspended" },
];
