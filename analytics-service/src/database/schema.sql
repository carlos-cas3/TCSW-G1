-- ============================================
-- ENUM PARA PERIOD TYPE (mejor que VARCHAR)
-- ============================================
DO $$ BEGIN
    CREATE TYPE period_type_enum AS ENUM ('daily', 'weekly', 'monthly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- TABLE: analytics_kpis
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_kpis (
    kpi_id BIGSERIAL PRIMARY KEY,

    period_date DATE NOT NULL,
    period_type period_type_enum NOT NULL,
    calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    total_revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_orders INTEGER NOT NULL DEFAULT 0,
    avg_ticket NUMERIC(12,2),

    revenue_growth NUMERIC(8,4),
    orders_growth NUMERIC(8,4),

    -- evita duplicados por periodo
    CONSTRAINT uq_kpis_period UNIQUE (period_date, period_type)
);

-- ============================================
-- TABLE: revenue_trend
-- ============================================
CREATE TABLE IF NOT EXISTS revenue_trend (
    trend_id BIGSERIAL PRIMARY KEY,

    period_date DATE NOT NULL,
    period_type period_type_enum NOT NULL,
    calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    total_revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
    orders_count INTEGER NOT NULL DEFAULT 0,
    avg_ticket NUMERIC(12,2),

    CONSTRAINT uq_trend_period UNIQUE (period_date, period_type)
);

-- ============================================
-- TABLE: vendor_performance
-- ============================================
CREATE TABLE IF NOT EXISTS vendor_performance (
    performance_id BIGSERIAL PRIMARY KEY,

    vendor_id BIGINT NOT NULL,

    period_date DATE NOT NULL,
    period_type period_type_enum NOT NULL,
    calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    total_sales NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_orders INTEGER NOT NULL DEFAULT 0,
    avg_order_value NUMERIC(12,2),

    sales_growth NUMERIC(8,4),
    orders_growth NUMERIC(8,4),

    -- evita duplicados por vendor + periodo
    CONSTRAINT uq_vendor_period UNIQUE (vendor_id, period_date, period_type)
);

-- ============================================
-- TABLE: category_distribution
-- ============================================
CREATE TABLE IF NOT EXISTS category_distribution (
    distribution_id BIGSERIAL PRIMARY KEY,

    category_id BIGINT NOT NULL,

    period_date DATE NOT NULL,
    period_type period_type_enum NOT NULL,
    calculated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    total_sales NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_items_sold INTEGER NOT NULL DEFAULT 0,
    percentage NUMERIC(8,4),

    -- evita duplicados por categoría + periodo
    CONSTRAINT uq_category_period UNIQUE (category_id, period_date, period_type)
);

-- ============================================
-- ÍNDICES (OPTIMIZACIÓN)
-- ============================================

-- KPIs
CREATE INDEX IF NOT EXISTS idx_kpis_period
ON analytics_kpis (period_type, period_date DESC);

-- Revenue trend
CREATE INDEX IF NOT EXISTS idx_trend_period
ON revenue_trend (period_type, period_date DESC);

-- Vendor performance
CREATE INDEX IF NOT EXISTS idx_vendor_period
ON vendor_performance (vendor_id, period_type, period_date DESC);

-- Category distribution
CREATE INDEX IF NOT EXISTS idx_category_period
ON category_distribution (category_id, period_type, period_date DESC);

-- ============================================
-- (OPCIONAL) ÍNDICES PARA QUERIES DE DASHBOARD
-- ============================================

CREATE INDEX IF NOT EXISTS idx_kpis_date_desc
ON analytics_kpis (period_date DESC);

CREATE INDEX IF NOT EXISTS idx_trend_date_desc
ON revenue_trend (period_date DESC);
