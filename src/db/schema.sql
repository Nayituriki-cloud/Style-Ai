-- =========================================================================
-- STYLE AI Relational Database Schema (PostgreSQL)
-- Implements all 11 core tables with indexes, foreign keys, and constraints
-- =========================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    is_pro BOOLEAN DEFAULT FALSE,
    pro_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. STYLE_PROFILES TABLE
CREATE TABLE IF NOT EXISTS style_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gender_preference VARCHAR(50) DEFAULT 'Versatile',
    age_range VARCHAR(50) DEFAULT '25-34',
    favorite_colors JSONB DEFAULT '["#1E3A8A", "#D8CEBE", "#2B1E1A"]'::jsonb,
    clothing_preferences JSONB DEFAULT '["Tailored", "Breathable natural fabrics", "Minimal hardware"]'::jsonb,
    budget_level VARCHAR(20) DEFAULT 'Medium',
    climate_location VARCHAR(100) DEFAULT 'Temperate / Four Seasons',
    primary_aesthetic VARCHAR(50) DEFAULT 'Minimalist',
    secondary_aesthetics JSONB DEFAULT '["Smart Casual", "Classic"]'::jsonb,
    archetype_title VARCHAR(100) DEFAULT 'Elevated Minimalist',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_style_profiles_user UNIQUE (user_id)
);

-- 3. WARDROBE_ITEMS TABLE
CREATE TABLE IF NOT EXISTS wardrobe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    color_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    brand VARCHAR(100),
    size VARCHAR(30),
    material VARCHAR(100),
    seasons JSONB DEFAULT '["All Season"]'::jsonb,
    occasions JSONB DEFAULT '["Smart Casual", "Casual day"]'::jsonb,
    image_url TEXT NOT NULL,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    budget_tier VARCHAR(20) DEFAULT 'Medium',
    purchase_price DECIMAL(10, 2),
    times_worn INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wardrobe_user ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_category ON wardrobe_items(category);
CREATE INDEX IF NOT EXISTS idx_wardrobe_color ON wardrobe_items(color_hex);

-- 4. OUTFITS TABLE
CREATE TABLE IF NOT EXISTS outfits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    occasion VARCHAR(100) NOT NULL,
    style_category VARCHAR(50) NOT NULL,
    color_palette JSONB NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    rating INT DEFAULT 5,
    budget_tier VARCHAR(20) DEFAULT 'Medium',
    styling_notes TEXT,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outfits_user ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_occasion ON outfits(occasion);

-- 5. OUTFIT_ITEMS TABLE (Junction between Outfits and Wardrobe Items)
CREATE TABLE IF NOT EXISTS outfit_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    wardrobe_item_id UUID REFERENCES wardrobe_items(id) ON DELETE SET NULL,
    custom_item_name VARCHAR(200),
    category VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20),
    slot_position INT NOT NULL,
    CONSTRAINT uq_outfit_slot UNIQUE(outfit_id, slot_position)
);

CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit ON outfit_items(outfit_id);

-- 6. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_favorite UNIQUE(user_id, target_type, target_id)
);

-- 7. STYLE_PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS style_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    color_preference VARCHAR(100),
    fit_preference VARCHAR(50) DEFAULT 'Regular',
    preferred_fabrics JSONB DEFAULT '["Linen", "Wool", "Cotton", "Cashmere"]'::jsonb,
    excluded_colors JSONB DEFAULT '[]'::jsonb,
    budget_monthly_max DECIMAL(10, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_style_preferences_user UNIQUE (user_id)
);

-- 8. OUTFIT_CALENDAR TABLE
CREATE TABLE IF NOT EXISTS outfit_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    date_string DATE NOT NULL,
    outfit_id UUID NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
    occasion VARCHAR(100) NOT NULL,
    notes TEXT,
    weather_forecast VARCHAR(100),
    is_worn BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_calendar_user_date ON outfit_calendar(user_id, date_string);

-- 9. RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    occasion VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    vibe TEXT NOT NULL,
    styling_rationale TEXT NOT NULL,
    color_palette JSONB NOT NULL,
    suggested_items JSONB NOT NULL,
    climate_adjustments TEXT,
    is_saved_as_outfit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SHOPPING_ITEMS TABLE
CREATE TABLE IF NOT EXISTS shopping_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    size_information VARCHAR(100),
    seller VARCHAR(100) NOT NULL,
    availability VARCHAR(50) DEFAULT 'In Stock',
    external_purchase_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    budget_tier VARCHAR(20) DEFAULT 'Medium',
    matched_styles JSONB DEFAULT '["Smart Casual"]'::jsonb,
    matched_occasions JSONB DEFAULT '["Work"]'::jsonb,
    color_hex VARCHAR(20) DEFAULT '#000000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shopping_category ON shopping_items(category);
CREATE INDEX IF NOT EXISTS idx_shopping_tier ON shopping_items(budget_tier);

-- 11. CHAT_HISTORY TABLE
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    suggested_prompts JSONB DEFAULT '[]'::jsonb,
    related_outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_history(user_id, created_at);
