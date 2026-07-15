CREATE DATABASE IF NOT EXISTS gestion_courrier;
USE gestion_courrier;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist to recreate them with the new schema
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS archives;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS courrier_service;
DROP TABLE IF EXISTS courriers;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'bureau_ordre', 'directeur', 'chef_service', 'agent') DEFAULT 'agent',
  service_id INT UNSIGNED,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  chef_service_id INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (chef_service_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('person', 'company', 'organization') DEFAULT 'person',
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Courriers table
CREATE TABLE IF NOT EXISTS courriers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(50) UNIQUE,
  type ENUM('arrive', 'depart', 'interne') NOT NULL,
  subject VARCHAR(200) NOT NULL,
  sender_id INT UNSIGNED,
  recipient_id INT UNSIGNED,
  content TEXT,
  file_path VARCHAR(255),
  status ENUM('draft', 'registered', 'assigned', 'in_progress', 'treated', 'archived') DEFAULT 'draft',
  priority ENUM('normal', 'urgent', 'tres_urgent') DEFAULT 'normal',
  date_courrier DATE,
  date_reception DATE,
  service_id INT UNSIGNED, -- assigned service
  assigned_to INT UNSIGNED, -- assigned specific user
  created_by INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (sender_id) REFERENCES contacts(id) ON DELETE SET NULL,
  FOREIGN KEY (recipient_id) REFERENCES contacts(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Comments/Annotations table
CREATE TABLE IF NOT EXISTS comments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  courrier_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (courrier_id) REFERENCES courriers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  courrier_id INT UNSIGNED,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'done') DEFAULT 'todo',
  due_date DATE,
  user_id INT UNSIGNED,
  service_id INT UNSIGNED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (courrier_id) REFERENCES courriers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Archives table (Document archiving)
CREATE TABLE IF NOT EXISTS archives (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,
  action VARCHAR(50) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id INT UNSIGNED,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
