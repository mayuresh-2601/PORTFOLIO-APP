-- This script runs via Docker's /docker-entrypoint-initdb.d/ mechanism,
-- which already creates and switches into the database named by the
-- MYSQL_DATABASE environment variable before running any script here.
-- Previously this file hardcoded "portfolio_db" with its own CREATE
-- DATABASE + USE statements, which silently created tables in a
-- *different* database than the one the app actually connects to
-- (whatever DB_NAME is set to — e.g. "portfolio_ci" in CI, or the real
-- production database name). Removed those two lines so this always
-- targets the correct, already-selected database in every environment.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    github VARCHAR(512) DEFAULT '',
    demo VARCHAR(512) DEFAULT '',
    image VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_projects_created (created_at DESC)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INT DEFAULT 80 CHECK (level BETWEEN 0 AND 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_skills_name (name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    image VARCHAR(512) NOT NULL,
    link VARCHAR(512) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_certs_created (created_at DESC)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_messages_created (created_at DESC)
) ENGINE=InnoDB;