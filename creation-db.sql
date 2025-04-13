CREATE DATABASE inventory_db;
USE inventory_db;
CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 0,
  supplier_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
show databases;
select *from suppliers;
select *from inventory;
--foreign key in inventory table --
ALTER TABLE inventory DROP FOREIGN KEY inventory_ibfk_1;
ALTER TABLE inventory MODIFY supplier_id INT NULL;
ALTER TABLE inventory ADD CONSTRAINT fk_inventory_supplier
FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
ON DELETE SET NULL;
-- modifing inventory table contraints as per requirements--
ALTER TABLE inventory
ADD CONSTRAINT chk_quantity_non_negative CHECK (quantity >= 0);
-- to story the deleted inventory and reason--
CREATE TABLE deleted_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inventory_id INT NOT NULL,
  description TEXT NOT NULL,
  deleted_on DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- to store the departments list--
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  head_name VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
--to store the issued inventory--
CREATE TABLE issued_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inventory_id INT NOT NULL,
  department_id INT NOT NULL,
  quantity_issued INT NOT NULL,
  issued_on DATETIME DEFAULT CURRENT_TIMESTAMP
);