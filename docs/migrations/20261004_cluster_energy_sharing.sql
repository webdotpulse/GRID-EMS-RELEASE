-- ==============================================================================
-- Migration: 20261004_cluster_energy_sharing.sql
-- Target: GRID-EMS-SERVER PostgreSQL Database
-- Purpose: Cloud Multi-Tenant Energy Clustering & Intra-Portfolio Sharing Engine
-- Brand Alignment: The Charge Grid / New Energy Grid (GRID-EMS)
-- ==============================================================================

-- Enable pgcrypto for gen_random_uuid() if not enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(64) UNIQUE NOT NULL,
    company_registration VARCHAR(64),
    contact_email VARCHAR(128) NOT NULL,
    country VARCHAR(2) NOT NULL DEFAULT 'BE', -- 'BE', 'NL', etc.
    bidding_zone VARCHAR(16) NOT NULL DEFAULT 'BE', -- 'BE', 'NL', 'DE'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_active ON tenants(is_active);

-- 2. Energy Clusters Table
CREATE TABLE IF NOT EXISTS energy_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    bidding_zone VARCHAR(16) NOT NULL, -- Strict Invariant: All nodes in cluster MUST share the same bidding zone
    sharing_strategy VARCHAR(32) NOT NULL DEFAULT 'merit_order', -- 'merit_order', 'proportional', 'equal_share', 'price_optimized'
    balancing_interval_sec INT NOT NULL DEFAULT 5, -- Control loop frequency (2s - 15s)
    min_transfer_threshold_w INT NOT NULL DEFAULT 500, -- Minimum surplus required before triggering remote transfer
    intra_cluster_transfer_fee_eur_kwh NUMERIC(8, 4) NOT NULL DEFAULT 0.0000, -- Internal wheeling / administration tariff
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_energy_clusters_tenant ON energy_clusters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_energy_clusters_bidding_zone ON energy_clusters(bidding_zone);
CREATE INDEX IF NOT EXISTS idx_energy_clusters_active ON energy_clusters(is_active);

-- 3. Cluster Nodes Table (Association between Edge Devices and Clusters)
CREATE TABLE IF NOT EXISTS cluster_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID NOT NULL REFERENCES energy_clusters(id) ON DELETE CASCADE,
    device_id INT NOT NULL, -- Edge GEMS device identifier from registration
    serial_number VARCHAR(64) NOT NULL, -- E.g. 'TCG-EMS-83daf13d05f1adad'
    node_role VARCHAR(32) NOT NULL DEFAULT 'prosumer', -- 'producer', 'consumer', 'prosumer', 'storage_hub'
    priority_tier INT NOT NULL DEFAULT 1, -- 1 = High, 2 = Medium, 3 = Low
    max_export_allocation_w INT NOT NULL DEFAULT 100000, -- Maximum export power this site will contribute to cluster
    max_import_absorption_w INT NOT NULL DEFAULT 100000, -- Maximum flexible power this site will draw from cluster
    local_reserve_soc_pct NUMERIC(5, 2) NOT NULL DEFAULT 20.00, -- Battery reserve floor preserved for local consumption
    allow_battery_export_to_cluster BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(cluster_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_cluster_nodes_cluster ON cluster_nodes(cluster_id);
CREATE INDEX IF NOT EXISTS idx_cluster_nodes_serial ON cluster_nodes(serial_number);
CREATE INDEX IF NOT EXISTS idx_cluster_nodes_priority ON cluster_nodes(cluster_id, priority_tier);

-- 4. Cluster Settlement Intervals Table (15-Minute Reconciled Ledger)
CREATE TABLE IF NOT EXISTS cluster_settlement_intervals (
    id BIGSERIAL PRIMARY KEY,
    cluster_id UUID NOT NULL REFERENCES energy_clusters(id) ON DELETE CASCADE,
    interval_start TIMESTAMPTZ NOT NULL,
    interval_end TIMESTAMPTZ NOT NULL,
    producer_node_id UUID NOT NULL REFERENCES cluster_nodes(id) ON DELETE RESTRICT,
    consumer_node_id UUID NOT NULL REFERENCES cluster_nodes(id) ON DELETE RESTRICT,
    transferred_energy_kwh NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    settlement_rate_eur_kwh NUMERIC(8, 4) NOT NULL DEFAULT 0.0000,
    total_credit_eur NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cluster_settlement_time ON cluster_settlement_intervals(cluster_id, interval_start);
CREATE INDEX IF NOT EXISTS idx_cluster_settlement_producer ON cluster_settlement_intervals(producer_node_id, interval_start);
CREATE INDEX IF NOT EXISTS idx_cluster_settlement_consumer ON cluster_settlement_intervals(consumer_node_id, interval_start);
