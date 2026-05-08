-- =========================================
-- CREACIÓN DE TABLAS - CATALOG SERVICE
-- =========================================

-- =========================
-- TABLA: categories
-- =========================

CREATE TABLE categories (

    category_id SERIAL PRIMARY KEY,

    category_name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLA: products
-- =========================

CREATE TABLE products (

    product_id SERIAL PRIMARY KEY,

    category_id INTEGER NOT NULL,

    product_name VARCHAR(150) NOT NULL,
    product_brand VARCHAR(100),
    product_description TEXT,

    product_status VARCHAR(20) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
);

-- =========================
-- TABLA: vendor_products
-- =========================

CREATE TABLE vendor_products (

    vendor_product_id SERIAL PRIMARY KEY,

    -- REFERENCIA EXTERNA
    -- PROVIENE DE VENDOR SERVICE
    vendor_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    stock INTEGER DEFAULT 0,

    status VARCHAR(20) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_product_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id),

    CONSTRAINT uq_vendor_product
        UNIQUE (vendor_id, product_id)
);