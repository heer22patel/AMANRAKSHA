-- Aman & Raksha wedding — run once:  mysql -u root -p < database.sql
CREATE DATABASE IF NOT EXISTS aman_raksha_wedding
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aman_raksha_wedding;

CREATE TABLE IF NOT EXISTS wedding_wishes (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  guest_name   VARCHAR(80)   NOT NULL,
  relationship VARCHAR(80)   NULL,
  message      TEXT          NOT NULL,
  ip_hash      CHAR(64)      NOT NULL,
  user_agent   VARCHAR(255)  NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_created (created_at),
  KEY idx_ip_time (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Read the letters:  SELECT guest_name, relationship, message, created_at FROM wedding_wishes ORDER BY id DESC;
