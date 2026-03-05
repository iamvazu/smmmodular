-- Core Aura AI Analytics & Database Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For gen_random_uuid

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL, -- India phone format support
    email VARCHAR(255),
    name VARCHAR(255),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE
);

-- Design sessions table
CREATE TABLE IF NOT EXISTS design_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_type VARCHAR(50), -- 'sketch', 'photo', 'floorplan'
    input_image_url VARCHAR(500),
    room_type VARCHAR(50),
    spatial_data JSONB,
    vastu_score INTEGER,
    vastu_analysis JSONB,
    generated_render_url VARCHAR(500),
    style VARCHAR(50),
    estimated_cost DECIMAL(12,2),
    status VARCHAR(50), -- 'uploaded', 'analyzing', 'completed', 'failed'
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Furniture catalog table
CREATE TABLE IF NOT EXISTS furniture_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    category VARCHAR(100), -- 'sofa', 'bed', 'wardrobe', etc.
    dimensions JSONB, -- {"length": 84, "width": 36, "height": 32, "unit": "inches"}
    materials JSONB,
    finishes JSONB,
    price_range JSONB, -- {"min": 45000, "max": 65000}
    image_urls JSONB,
    -- ai_embedding VECTOR(768), -- Commented until pgvector extension added
    is_active BOOLEAN DEFAULT TRUE
);

-- Vastu rules table
CREATE TABLE IF NOT EXISTS vastu_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(255),
    room_type VARCHAR(100),
    direction VARCHAR(50),
    priority INTEGER, -- 1 = critical, 2 = recommended, 3 = optional
    description TEXT,
    impact_score INTEGER -- Points deducted if violated
);

-- Consultation bookings table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    design_session_id UUID REFERENCES design_sessions(id),
    preferred_date DATE,
    preferred_time TIME,
    status VARCHAR(50), -- 'pending', 'confirmed', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
