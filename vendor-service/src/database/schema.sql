-- =========================================
-- CREACIÓN DE TABLAS - VENDOR SERVICE
-- =========================================

-- =========================
-- TABLA: cities
-- =========================

CREATE TABLE cities (
    city_id SERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL
);

-- =========================
-- TABLA: vendors
-- =========================

CREATE TABLE vendors (
    vendor_id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(150) NOT NULL,
    vendor_legal_name VARCHAR(200),
    vendor_ruc VARCHAR(20) UNIQUE NOT NULL,
    vendor_email VARCHAR(150) UNIQUE NOT NULL,
    vendor_phone VARCHAR(20),
    vendor_address TEXT,
    vendor_status VARCHAR(20) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA: branches
-- =========================

CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,

    vendor_id INTEGER NOT NULL,
    city_id INTEGER NOT NULL,

    branch_name VARCHAR(150) NOT NULL,
    branch_address TEXT,
    branch_status VARCHAR(20) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_branch_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(vendor_id),

    CONSTRAINT fk_branch_city
        FOREIGN KEY (city_id)
        REFERENCES cities(city_id)
);

-- =========================
-- TABLA: payment_methods
-- =========================

CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    payment_method_name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA INTERMEDIA:
-- vendor_payment_methods
-- =========================

CREATE TABLE vendor_payment_methods (

    vendor_id INTEGER NOT NULL,
    payment_method_id INTEGER NOT NULL,

    PRIMARY KEY (vendor_id, payment_method_id),

    CONSTRAINT fk_vpm_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(vendor_id),

    CONSTRAINT fk_vpm_payment_method
        FOREIGN KEY (payment_method_id)
        REFERENCES payment_methods(payment_method_id)
);

-- =========================
-- TABLA: categories
-- =========================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- =========================
-- TABLA INTERMEDIA:
-- vendor_categories
-- =========================

CREATE TABLE vendor_categories (

    vendor_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (vendor_id, category_id),

    CONSTRAINT fk_vc_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(vendor_id),

    CONSTRAINT fk_vc_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
);

-- =========================
-- TABLA: vendor_policies
-- =========================

CREATE TABLE vendor_policies (

    vendor_policy_id SERIAL PRIMARY KEY,

    vendor_id INTEGER NOT NULL,

    return_policy_description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_policy_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(vendor_id)
);

-- =========================
-- TABLA: commission_config
-- =========================

CREATE TABLE commission_config (

    config_id SERIAL PRIMARY KEY,

    vendor_id INTEGER NOT NULL,

    commission_rate NUMERIC(5,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_commission_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendors(vendor_id)
);
