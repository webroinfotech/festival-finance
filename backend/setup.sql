-- Festival Amount Maintenance — MySQL setup
-- Run this once against your MySQL server to create the database and tables:
--   mysql -u root -p < setup.sql

CREATE DATABASE IF NOT EXISTS festival_finance
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE festival_finance;

CREATE TABLE IF NOT EXISTS collections (
  id           VARCHAR(36) PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  amount       DECIMAL(12,2) NOT NULL,
  payment_type ENUM('gpay', 'cash') NOT NULL,
  description  TEXT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NULL,
  INDEX idx_collections_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS expenses (
  id           VARCHAR(36) PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  amount       DECIMAL(12,2) NOT NULL,
  payment_type ENUM('gpay', 'cash') NOT NULL,
  description  TEXT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NULL,
  INDEX idx_expenses_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_log (
  id            VARCHAR(36) PRIMARY KEY,
  action        ENUM('create', 'update', 'delete') NOT NULL,
  entity_type   ENUM('collection', 'expense') NOT NULL,
  entity_id     VARCHAR(36) NOT NULL,
  performed_by  VARCHAR(255) NOT NULL,
  before_data   JSON NULL,
  after_data    JSON NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_log_created_at (created_at),
  INDEX idx_audit_log_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
