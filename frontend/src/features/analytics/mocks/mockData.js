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

export const MOCK_DASHBOARD_METRICS_BY_Q = {
    Q1: { totalRevenue: 142000, totalOrders: 623, totalVendors: 48, activeVendors: 36, avgOrderValue: 228 },
    Q2: { totalRevenue: 158000, totalOrders: 687, totalVendors: 48, activeVendors: 38, avgOrderValue: 230 },
    Q3: { totalRevenue: 135000, totalOrders: 587, totalVendors: 48, activeVendors: 34, avgOrderValue: 230 },
    Q4: { totalRevenue: 172000, totalOrders: 748, totalVendors: 48, activeVendors: 37, avgOrderValue: 230 },
    full: MOCK_DASHBOARD_METRICS_ADMIN,
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

export const MOCK_TOP_PRODUCTS_BY_Q = {
    Q1: [
        { name: "Laptop Gamer XPS 15", category: "Electr\u00f3nicos", sales: 92, total: 138000 },
        { name: "Smart TV 55\" 4K", category: "Electr\u00f3nicos", sales: 71, total: 106500 },
        { name: "Teclado Mec\u00e1nico RGB", category: "Electr\u00f3nicos", sales: 58, total: 11600 },
        { name: "Aud\u00edfonos Bluetooth Pro", category: "Electr\u00f3nicos", sales: 112, total: 16800 },
        { name: "Cafetera Autom\u00e1tica", category: "Hogar", sales: 38, total: 19000 },
    ],
    Q2: [
        { name: "Zapatillas Running Ultra", category: "Deportes", sales: 134, total: 40200 },
        { name: "Set de Sartenes Antiadherentes", category: "Hogar", sales: 87, total: 17400 },
        { name: "Crema Hidratante Facial", category: "Belleza", sales: 156, total: 7800 },
        { name: "Mochila Impermeable 40L", category: "Viajes", sales: 72, total: 14400 },
        { name: "Smart TV 55\" 4K", category: "Electr\u00f3nicos", sales: 63, total: 94500 },
    ],
    Q3: [
        { name: "Mochila Impermeable 40L", category: "Viajes", sales: 89, total: 17800 },
        { name: "Aud\u00edfonos Bluetooth Pro", category: "Electr\u00f3nicos", sales: 145, total: 21750 },
        { name: "Zapatillas Running Ultra", category: "Deportes", sales: 102, total: 30600 },
        { name: "Crema Hidratante Facial", category: "Belleza", sales: 198, total: 9900 },
        { name: "Laptop Gamer XPS 15", category: "Electr\u00f3nicos", sales: 48, total: 72000 },
    ],
    Q4: [
        { name: "Perfume Importado 100ml", category: "Belleza", sales: 167, total: 41750 },
        { name: "Laptop Gamer XPS 15", category: "Electr\u00f3nicos", sales: 112, total: 168000 },
        { name: "Smart TV 55\" 4K", category: "Electr\u00f3nicos", sales: 89, total: 133500 },
        { name: "Set de Sartenes Antiadherentes", category: "Hogar", sales: 76, total: 15200 },
        { name: "Teclado Mec\u00e1nico RGB", category: "Electr\u00f3nicos", sales: 98, total: 19600 },
    ],
    full: MOCK_TOP_PRODUCTS,
};

export const MOCK_TRENDS_MONTHLY = [
    { month: "Ene", date: "2026-01", revenue: 125000, completed: 280, pending: 12, cancelled: 18 },
    { month: "Feb", date: "2026-02", revenue: 142000, completed: 295, pending: 15, cancelled: 14 },
    { month: "Mar", date: "2026-03", revenue: 158000, completed: 310, pending: 10, cancelled: 22 },
    { month: "Abr", date: "2026-04", revenue: 162000, completed: 305, pending: 8, cancelled: 16 },
    { month: "May", date: "2026-05", revenue: 148000, completed: 290, pending: 14, cancelled: 20 },
    { month: "Jun", date: "2026-06", revenue: 171000, completed: 335, pending: 11, cancelled: 18 },
    { month: "Jul", date: "2026-07", revenue: 185000, completed: 310, pending: 16, cancelled: 12 },
    { month: "Ago", date: "2026-08", revenue: 179000, completed: 298, pending: 13, cancelled: 24 },
    { month: "Sep", date: "2026-09", revenue: 164000, completed: 275, pending: 9, cancelled: 16 },
    { month: "Oct", date: "2026-10", revenue: 192000, completed: 340, pending: 7, cancelled: 14 },
    { month: "Nov", date: "2026-11", revenue: 208000, completed: 365, pending: 10, cancelled: 10 },
    { month: "Dic", date: "2026-12", revenue: 235000, completed: 400, pending: 6, cancelled: 8 },
];

export const MOCK_TRENDS_PREVIOUS = [
    { month: "Ene", date: "2025-01", revenue: 96000, completed: 195, pending: 14, cancelled: 10 },
    { month: "Feb", date: "2025-02", revenue: 105000, completed: 210, pending: 16, cancelled: 12 },
    { month: "Mar", date: "2025-03", revenue: 118000, completed: 230, pending: 11, cancelled: 15 },
    { month: "Abr", date: "2025-04", revenue: 112000, completed: 225, pending: 9, cancelled: 13 },
    { month: "May", date: "2025-05", revenue: 108000, completed: 218, pending: 13, cancelled: 11 },
    { month: "Jun", date: "2025-06", revenue: 121000, completed: 245, pending: 10, cancelled: 14 },
    { month: "Jul", date: "2025-07", revenue: 132000, completed: 235, pending: 15, cancelled: 9 },
    { month: "Ago", date: "2025-08", revenue: 126000, completed: 228, pending: 12, cancelled: 17 },
    { month: "Sep", date: "2025-09", revenue: 115000, completed: 205, pending: 8, cancelled: 13 },
    { month: "Oct", date: "2025-10", revenue: 138000, completed: 250, pending: 7, cancelled: 11 },
    { month: "Nov", date: "2025-11", revenue: 152000, completed: 270, pending: 9, cancelled: 8 },
    { month: "Dic", date: "2025-12", revenue: 175000, completed: 310, pending: 5, cancelled: 6 },
];

export const MOCK_CATEGORY_VENDORS = {
    "Electrónicos": [
        { vendorName: "TechStore Perú", revenue: 65000, orders: 210 },
        { vendorName: "ElectroHogar", revenue: 28000, orders: 95 },
        { vendorName: "Gamer Zone", revenue: 22000, orders: 78 },
        { vendorName: "Hogar & Estilo", revenue: 16625, orders: 55 },
    ],
    Belleza: [
        { vendorName: "Belleza Total", revenue: 28000, orders: 112 },
        { vendorName: "Perfumería Chic", revenue: 14650, orders: 58 },
        { vendorName: "TechStore Perú", revenue: 10000, orders: 40 },
    ],
    Hogar: [
        { vendorName: "Hogar & Estilo", revenue: 20000, orders: 85 },
        { vendorName: "ElectroHogar", revenue: 13875, orders: 52 },
        { vendorName: "TechStore Perú", revenue: 10000, orders: 38 },
    ],
    Deportes: [
        { vendorName: "Deportes Extreme", revenue: 20000, orders: 78 },
        { vendorName: "Viajero Feliz", revenue: 8900, orders: 34 },
        { vendorName: "Gamer Zone", revenue: 6200, orders: 22 },
    ],
    Viajes: [
        { vendorName: "Viajero Feliz", revenue: 18000, orders: 65 },
        { vendorName: "Deportes Extreme", revenue: 7250, orders: 28 },
        { vendorName: "Mochila Impermeable 40L", revenue: 4000, orders: 15 },
    ],
};

export const MOCK_VENDOR_MONTHLY = {
    "TechStore Perú": [
        { month: "Ene", date: "2026-01", revenue: 6500, orders: 24 },
        { month: "Feb", date: "2026-02", revenue: 7200, orders: 28 },
        { month: "Mar", date: "2026-03", revenue: 8100, orders: 31 },
        { month: "Abr", date: "2026-04", revenue: 7800, orders: 29 },
        { month: "May", date: "2026-05", revenue: 6900, orders: 26 },
        { month: "Jun", date: "2026-06", revenue: 8500, orders: 32 },
        { month: "Jul", date: "2026-07", revenue: 9200, orders: 34 },
        { month: "Ago", date: "2026-08", revenue: 8800, orders: 30 },
        { month: "Sep", date: "2026-09", revenue: 7600, orders: 27 },
        { month: "Oct", date: "2026-10", revenue: 9500, orders: 36 },
        { month: "Nov", date: "2026-11", revenue: 10400, orders: 40 },
        { month: "Dic", date: "2026-12", revenue: 12000, orders: 45 },
    ],
    "Hogar & Estilo": [
        { month: "Ene", date: "2026-01", revenue: 4800, orders: 18 },
        { month: "Feb", date: "2026-02", revenue: 5200, orders: 20 },
        { month: "Mar", date: "2026-03", revenue: 5800, orders: 22 },
        { month: "Abr", date: "2026-04", revenue: 5400, orders: 21 },
        { month: "May", date: "2026-05", revenue: 4900, orders: 19 },
        { month: "Jun", date: "2026-06", revenue: 6100, orders: 24 },
        { month: "Jul", date: "2026-07", revenue: 6800, orders: 26 },
        { month: "Ago", date: "2026-08", revenue: 6300, orders: 23 },
        { month: "Sep", date: "2026-09", revenue: 5500, orders: 20 },
        { month: "Oct", date: "2026-10", revenue: 7100, orders: 28 },
        { month: "Nov", date: "2026-11", revenue: 7800, orders: 30 },
        { month: "Dic", date: "2026-12", revenue: 9000, orders: 34 },
    ],
    "Belleza Total": [
        { month: "Ene", date: "2026-01", revenue: 4200, orders: 15 },
        { month: "Feb", date: "2026-02", revenue: 4600, orders: 17 },
        { month: "Mar", date: "2026-03", revenue: 5100, orders: 19 },
        { month: "Abr", date: "2026-04", revenue: 4800, orders: 18 },
        { month: "May", date: "2026-05", revenue: 4300, orders: 16 },
        { month: "Jun", date: "2026-06", revenue: 5400, orders: 20 },
        { month: "Jul", date: "2026-07", revenue: 5900, orders: 22 },
        { month: "Ago", date: "2026-08", revenue: 5500, orders: 21 },
        { month: "Sep", date: "2026-09", revenue: 4700, orders: 17 },
        { month: "Oct", date: "2026-10", revenue: 6200, orders: 24 },
        { month: "Nov", date: "2026-11", revenue: 6800, orders: 26 },
        { month: "Dic", date: "2026-12", revenue: 7800, orders: 30 },
    ],
    "Deportes Extreme": [
        { month: "Ene", date: "2026-01", revenue: 3600, orders: 12 },
        { month: "Feb", date: "2026-02", revenue: 3900, orders: 14 },
        { month: "Mar", date: "2026-03", revenue: 4400, orders: 16 },
        { month: "Abr", date: "2026-04", revenue: 4100, orders: 15 },
        { month: "May", date: "2026-05", revenue: 3700, orders: 13 },
        { month: "Jun", date: "2026-06", revenue: 4600, orders: 17 },
        { month: "Jul", date: "2026-07", revenue: 5100, orders: 19 },
        { month: "Ago", date: "2026-08", revenue: 4700, orders: 18 },
        { month: "Sep", date: "2026-09", revenue: 4000, orders: 14 },
        { month: "Oct", date: "2026-10", revenue: 5300, orders: 20 },
        { month: "Nov", date: "2026-11", revenue: 5800, orders: 22 },
        { month: "Dic", date: "2026-12", revenue: 6800, orders: 26 },
    ],
    "Viajero Feliz": [
        { month: "Ene", date: "2026-01", revenue: 2800, orders: 10 },
        { month: "Feb", date: "2026-02", revenue: 3100, orders: 12 },
        { month: "Mar", date: "2026-03", revenue: 3400, orders: 13 },
        { month: "Abr", date: "2026-04", revenue: 3200, orders: 12 },
        { month: "May", date: "2026-05", revenue: 2900, orders: 11 },
        { month: "Jun", date: "2026-06", revenue: 3600, orders: 14 },
        { month: "Jul", date: "2026-07", revenue: 4000, orders: 16 },
        { month: "Ago", date: "2026-08", revenue: 3700, orders: 15 },
        { month: "Sep", date: "2026-09", revenue: 3100, orders: 11 },
        { month: "Oct", date: "2026-10", revenue: 4200, orders: 17 },
        { month: "Nov", date: "2026-11", revenue: 4600, orders: 19 },
        { month: "Dic", date: "2026-12", revenue: 5400, orders: 22 },
    ],
    ElectroHogar: [
        { month: "Ene", date: "2026-01", revenue: 2400, orders: 8 },
        { month: "Feb", date: "2026-02", revenue: 2600, orders: 10 },
        { month: "Mar", date: "2026-03", revenue: 2900, orders: 11 },
        { month: "Abr", date: "2026-04", revenue: 2700, orders: 10 },
        { month: "May", date: "2026-05", revenue: 2500, orders: 9 },
        { month: "Jun", date: "2026-06", revenue: 3100, orders: 12 },
        { month: "Jul", date: "2026-07", revenue: 3400, orders: 14 },
        { month: "Ago", date: "2026-08", revenue: 3200, orders: 13 },
        { month: "Sep", date: "2026-09", revenue: 2700, orders: 10 },
        { month: "Oct", date: "2026-10", revenue: 3600, orders: 15 },
        { month: "Nov", date: "2026-11", revenue: 3900, orders: 17 },
        { month: "Dic", date: "2026-12", revenue: 4500, orders: 20 },
    ],
    "Perfumería Chic": [
        { month: "Ene", date: "2026-01", revenue: 2100, orders: 7 },
        { month: "Feb", date: "2026-02", revenue: 2300, orders: 9 },
        { month: "Mar", date: "2026-03", revenue: 2500, orders: 10 },
        { month: "Abr", date: "2026-04", revenue: 2400, orders: 9 },
        { month: "May", date: "2026-05", revenue: 2200, orders: 8 },
        { month: "Jun", date: "2026-06", revenue: 2700, orders: 11 },
        { month: "Jul", date: "2026-07", revenue: 3000, orders: 13 },
        { month: "Ago", date: "2026-08", revenue: 2800, orders: 12 },
        { month: "Sep", date: "2026-09", revenue: 2400, orders: 9 },
        { month: "Oct", date: "2026-10", revenue: 3200, orders: 14 },
        { month: "Nov", date: "2026-11", revenue: 3500, orders: 16 },
        { month: "Dic", date: "2026-12", revenue: 4100, orders: 19 },
    ],
    "Gamer Zone": [
        { month: "Ene", date: "2026-01", revenue: 1800, orders: 6 },
        { month: "Feb", date: "2026-02", revenue: 2000, orders: 8 },
        { month: "Mar", date: "2026-03", revenue: 2200, orders: 9 },
        { month: "Abr", date: "2026-04", revenue: 2100, orders: 8 },
        { month: "May", date: "2026-05", revenue: 1900, orders: 7 },
        { month: "Jun", date: "2026-06", revenue: 2400, orders: 10 },
        { month: "Jul", date: "2026-07", revenue: 2700, orders: 12 },
        { month: "Ago", date: "2026-08", revenue: 2500, orders: 11 },
        { month: "Sep", date: "2026-09", revenue: 2100, orders: 8 },
        { month: "Oct", date: "2026-10", revenue: 2900, orders: 13 },
        { month: "Nov", date: "2026-11", revenue: 3200, orders: 15 },
        { month: "Dic", date: "2026-12", revenue: 3800, orders: 18 },
    ],
};

export const MOCK_CATEGORIES = [
    { category: "Electr\u00f3nicos", revenue: 131625, percentage: 45 },
    { category: "Belleza", revenue: 52650, percentage: 18 },
    { category: "Hogar", revenue: 43875, percentage: 15 },
    { category: "Deportes", revenue: 35100, percentage: 12 },
    { category: "Viajes", revenue: 29250, percentage: 10 },
];

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

export const MOCK_VENDOR_TRENDS = [
    { month: "Ene", current: 12500, previous: 10200 },
    { month: "Feb", current: 14200, previous: 11500 },
    { month: "Mar", current: 13800, previous: 12100 },
    { month: "Abr", current: 15100, previous: 12800 },
    { month: "May", current: 16400, previous: 13400 },
    { month: "Jun", current: 17200, previous: 14200 },
];

export const MOCK_VENDOR_CATEGORIES = [
    { category: "Electr\u00f3nicos", revenue: 32100, percentage: 35 },
    { category: "Hogar", revenue: 22100, percentage: 24 },
    { category: "Belleza", revenue: 15800, percentage: 17 },
    { category: "Deportes", revenue: 12400, percentage: 13 },
    { category: "Viajes", revenue: 10100, percentage: 11 },
];

export const MOCK_VENDOR_ORDERS_TREND = [
    { month: "Ene", date: "2026-01-15", completed: 18, pending: 3, cancelled: 2 },
    { month: "Feb", date: "2026-02-15", completed: 22, pending: 2, cancelled: 1 },
    { month: "Mar", date: "2026-03-15", completed: 24, pending: 4, cancelled: 3 },
    { month: "Abr", date: "2026-04-15", completed: 20, pending: 3, cancelled: 2 },
    { month: "May", date: "2026-05-15", completed: 26, pending: 2, cancelled: 1 },
    { month: "Jun", date: "2026-06-15", completed: 28, pending: 3, cancelled: 2 },
];

export const MOCK_VENDOR_ORDERS_PREV = [
    { month: "Ene", date: "2025-01-15", completed: 14, pending: 4, cancelled: 3 },
    { month: "Feb", date: "2025-02-15", completed: 17, pending: 3, cancelled: 2 },
    { month: "Mar", date: "2025-03-15", completed: 19, pending: 5, cancelled: 4 },
    { month: "Abr", date: "2025-04-15", completed: 15, pending: 4, cancelled: 3 },
    { month: "May", date: "2025-05-15", completed: 21, pending: 3, cancelled: 2 },
    { month: "Jun", date: "2025-06-15", completed: 23, pending: 4, cancelled: 3 },
];

export const MOCK_VENDOR_PRODUCTS = [
    { productName: "Laptop Gamer XPS 15", revenue: 35100, orders: 234, growth: 22 },
    { productName: "Smart TV 55\" 4K", revenue: 28350, orders: 189, growth: -5 },
    { productName: "Zapatillas Running Ultra", revenue: 9360, orders: 312, growth: 15 },
    { productName: "Set de Sartenes", revenue: 3960, orders: 198, growth: 8 },
    { productName: "Perfume Importado", revenue: 6675, orders: 267, growth: -12 },
    { productName: "Mochila Impermeable", revenue: 2900, orders: 145, growth: 3 },
    { productName: "Teclado Mec\u00e1nico RGB", revenue: 3560, orders: 178, growth: 18 },
    { productName: "Crema Hidratante", revenue: 2115, orders: 423, growth: 10 },
];

export const MOCK_DASHBOARD_METRICS_VENDOR_PREV = {
    totalRevenue: 38500,
    totalOrders: 155,
    activeProducts: 20,
    avgOrderValue: 225,
};
